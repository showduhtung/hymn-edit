import { DragEvent, useState } from "react";
import { Box, Divider, Typography, List, ListItemButton } from "@mui/joy";
import { useToggle, useLocalStorage } from "@uidotdev/usehooks";
import { FiCheck } from "react-icons/fi";

import { ListConfirmationDialog } from "./ListConfirmationDialog";
import { readFileAsync, withPreventDefaults } from "./utilities";
import { HymnType, LocalHymnsState } from "../../types";

const defaultState = {
  hymns: [] as HymnType[],
  selectedHymnIdx: -1,
};

const statusIcon = {
  "not-started": "",
  "in-progress": "\u{1F6A7}",
  completed: <FiCheck />,
};

export const HymnList = () => {
  const [isDraggedOver, toggleDraggedOver] = useToggle(false);
  const [filesToBeConfirmed, setFilesToBeConfirmed] = useState<HymnType[]>([]);
  const [localState = defaultState, saveToLocalStorage] =
    useLocalStorage<LocalHymnsState>("editing-hymns");

  const { selectedHymnIdx } = localState;
  const selectedHymn = localState.hymns.find(
    (_, idx) => idx === selectedHymnIdx
  );

  async function handleFiles(files: FileList) {
    const possibleFiles: HymnType[] = await Promise.all(
      Array.from(files)
        .filter((file) => file.type === "application/json")
        .map(readFileAsync)
    );

    if (possibleFiles.length === 0) return;

    const hymns = possibleFiles.map((item) => {
      const verses = item.verses.map((verse) => ({
        ...verse,
        updatedHtml: verse.html,
      }));
      return { ...item, verses, status: "not-started" as const };
    });

    setFilesToBeConfirmed(hymns);
    saveToLocalStorage({ ...localState, hymns });
  }

  function handleDrop(e: DragEvent<HTMLUListElement>) {
    toggleDraggedOver(false);
    const { files } = e.dataTransfer ?? { files: [] };
    handleFiles(files);
  }

  function handleDragState(state: boolean) {
    return () => toggleDraggedOver(state);
  }

  function handleCloseDialog() {
    return () => setFilesToBeConfirmed([]);
  }

  function handleConfirmFiles(selectedHymns: HymnType[]) {
    setFilesToBeConfirmed([]);
    saveToLocalStorage({ hymns: selectedHymns, selectedHymnIdx: 0 });
  }

  function handleSelectHymn(idx: number) {
    return () => saveToLocalStorage({ ...localState, selectedHymnIdx: idx });
  }

  const combinedFiles = filesToBeConfirmed.reduce((acc: HymnType[], curr) => {
    if (acc.find((item) => item.num === curr.num)) return acc;
    return [...acc, curr];
  }, localState.hymns);

  return (
    <Box padding="24px">
      <Box px="12px">
        <Typography fontSize={24} sx={{ textDecoration: "underline" }}>
          Hymns to be Reviewed
        </Typography>
        <Box height="2px" />
        <Typography fontSize={12}>
          Please drag JSON file(s) into this box
        </Typography>
      </Box>
      <Divider sx={{ mt: "24px", mb: "8px" }} />

      <List
        sx={{
          ...(isDraggedOver ? draggedStyle : {}),
          borderRadius: 3,
          minHeight: 300,
        }}
        onDragEnter={withPreventDefaults()}
        onDragOver={withPreventDefaults(handleDragState(true))}
        onDragLeave={withPreventDefaults(handleDragState(false))}
        onDrop={withPreventDefaults(handleDrop)}
      >
        {localState.hymns.map((item, idx) => {
          const { title, status, num } = item;
          return (
            <ListItemButton
              key={title + status}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                borderRadius: 3,
                mb: "4px",
              }}
              color="primary"
              onClick={handleSelectHymn(idx)}
              selected={title === selectedHymn?.title}
            >
              <Typography>{`${num}. ${title}`}</Typography>
              {statusIcon[status]}
            </ListItemButton>
          );
        })}
      </List>

      {/* need to use the ternary to force mount/unmount */}
      {filesToBeConfirmed.length > 0 && (
        <ListConfirmationDialog
          open
          data={combinedFiles}
          onClose={handleCloseDialog}
          onConfirm={handleConfirmFiles}
        />
      )}
    </Box>
  );
};

const draggedStyle = {
  opacity: 0.5,
  backgroundColor: "rgba(0,0,0,0.1)",
  borderStyle: "dashed",
};
