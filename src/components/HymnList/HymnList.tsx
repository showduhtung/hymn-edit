import { DragEvent, useState } from "react";
import { Box, Divider, Paper, PaperProps } from "@mui/material";
import { Typography, List, ListItemButton } from "@mui/joy";
import { Check } from "@mui/icons-material";
import { useToggle, useLocalStorage } from "@uidotdev/usehooks";

import { ListConfirmationDialog } from "./ListConfirmationDialog";
import { readFileAsync, withPreventDefaults } from "./utilities";
import { HymnType, LocalHymnsState } from "../../types";

const defaultState = {
  hymns: [] as HymnType[],
  selectedHymn: undefined,
};

export const HymnList = (props: PaperProps) => {
  const [localState = defaultState, saveToLocalStorage] =
    useLocalStorage<LocalHymnsState>("editing-hymns");
  const { hymns = [], selectedHymn } = localState;

  const [isDraggedOver, toggleDraggedOver] = useToggle(false);
  const [filesToBeConfirmed, setFilesToBeConfirmed] = useState<HymnType[]>([]);
  const [files, setFiles] = useState<HymnType[]>(hymns);

  async function handleFiles(files: FileList) {
    const possibleFiles: HymnType[] = await Promise.all(
      Array.from(files)
        .filter((file) => file.type === "application/json")
        .map(readFileAsync)
    );

    if (possibleFiles.length > 0) {
      setFilesToBeConfirmed(possibleFiles);
      saveToLocalStorage({ ...localState, hymns: possibleFiles });
    }
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
    setFiles(selectedHymns);
    saveToLocalStorage({ ...localState, selectedHymn: selectedHymns[0] });
  }

  function handleSelectHymn(hymn: HymnType) {
    return () => saveToLocalStorage({ ...localState, selectedHymn: hymn });
  }

  const combinedFiles = filesToBeConfirmed.reduce((acc: HymnType[], curr) => {
    if (acc.find((item) => item.num === curr.num)) return acc;
    return [...acc, curr];
  }, files);

  return (
    <Paper elevation={2} {...props}>
      <Box px="12px">
        <Typography fontSize={24} sx={{ textDecoration: "underline" }}>
          Hymns to be editted
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
        {files.map((item) => (
          <ListItemButton
            key={item.title}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              borderRadius: 3,
              mb: "4px",
            }}
            color="primary"
            onClick={handleSelectHymn(item)}
            selected={item.title === selectedHymn?.title}
          >
            <Typography>{`${item.num}. ${item.title}`}</Typography>
            <Check sx={{ opacity: 0.8 }} color="disabled" />
          </ListItemButton>
        ))}
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
    </Paper>
  );
};

const draggedStyle = {
  opacity: 0.5,
  backgroundColor: "rgba(0,0,0,0.1)",
  borderStyle: "dashed",
};
