import { DragEvent, useState } from "react";
import { Box, Typography, List, Stack, Button } from "@mui/joy";
import { useToggle, useLocalStorage } from "@uidotdev/usehooks";
import { FiDownload } from "react-icons/fi";

import { ListConfirmationDialog } from "./ListConfirmationDialog";
import { readFileAsync, withPreventDefaults } from "./utilities";
import type { HymnType, LocalHymnsState } from "../../types";
import { HymnListButton } from "./HymnListButton";

const defaultState = {
  hymns: [] as HymnType[],
  selectedHymnIdx: -1,
};

export const HymnList = () => {
  const [isDraggedOver, toggleDraggedOver] = useToggle(false);
  const [filesToBeConfirmed, setFilesToBeConfirmed] = useState<HymnType[]>([]);
  const [localState = defaultState, saveToLocalStorage] =
    useLocalStorage<LocalHymnsState>("editing-hymns");

  const { selectedHymnIdx, hymns } = localState;
  const selectedHymn = hymns.find((_, idx) => idx === selectedHymnIdx);

  async function handleFiles(files: FileList) {
    const possibleFiles: HymnType[] = await Promise.all(
      Array.from(files)
        .filter((file) => file.type === "application/json")
        .map(readFileAsync)
    );

    if (possibleFiles.length === 0) return;

    const possibleHymns = possibleFiles.map((item) => {
      const verses = item.verses.map((verse) => ({
        ...verse,
        updatedHtml: verse.html,
      }));
      return { ...item, verses, status: "not-started" as const };
    });

    setFilesToBeConfirmed(possibleHymns);
    saveToLocalStorage({ ...localState, hymns: possibleHymns });
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

  function handleSelectHymn(hymnIdx: number) {
    return () => {
      console.log("is this also running?");
      saveToLocalStorage({ ...localState, selectedHymnIdx: hymnIdx });
    };
  }

  function handleDeleteHymn(hymnIdx: number) {
    return () => {
      const updatedHymns = hymns.filter((_, currIdx) => currIdx !== hymnIdx);
      saveToLocalStorage({ hymns: updatedHymns, selectedHymnIdx: 0 });
    };
  }

  function handleDownloadHymn(_hymnIdxs?: number[]) {
    return () => {
      // const idxs =
      //   hymnIdxs ||
      //   hymns.reduce((acc: number[], hymn, idx) => {
      //     if (hymn.status === "completed") return [...acc, idx];
      //     return acc;
      //   }, []);
    };
  }

  const combinedFiles = filesToBeConfirmed.reduce((acc: HymnType[], curr) => {
    if (acc.find((item) => item.num === curr.num)) return acc;
    return [...acc, curr];
  }, hymns);

  return (
    <>
      <Stack padding="24px" spacing="24px">
        <Box px="12px" display="flex" justifyContent="space-between">
          <Typography fontSize={24} sx={{ textDecoration: "underline" }}>
            Review Hymns
          </Typography>
          <Button
            variant="soft"
            startDecorator={<FiDownload size="12" />}
            disabled={!hymns.find((hymn) => hymn.status === "completed")}
            onClick={handleDownloadHymn()}
          >
            Download
          </Button>
        </Box>

        <Box>
          <Box px="12px">
            <Typography fontSize={12}>
              Please drag JSON file(s) into this list
            </Typography>
          </Box>

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
            {hymns.map((item, idx) => {
              const { title, status } = item;
              return (
                <HymnListButton
                  key={title + status}
                  onClick={handleSelectHymn(idx)}
                  selected={title === selectedHymn?.title}
                  data={item}
                  onDelete={handleDeleteHymn(idx)}
                  onDownload={handleDownloadHymn([idx])}
                />
              );
            })}
          </List>
        </Box>
      </Stack>

      {/* need to use the ternary to force mount/unmount */}
      {filesToBeConfirmed.length > 0 && (
        <ListConfirmationDialog
          open
          data={combinedFiles}
          onClose={handleCloseDialog}
          onConfirm={handleConfirmFiles}
        />
      )}
    </>
  );
};

const draggedStyle = {
  opacity: 0.5,
  backgroundColor: "rgba(0,0,0,0.1)",
  borderStyle: "dashed",
};
