import { useState } from "react";
import { Box, Typography, Stack, Button } from "@mui/joy";
import { useLocalStorage, useToggle } from "@uidotdev/usehooks";
import { FiDownload, FiPlus } from "react-icons/fi";

import { ListConfirmationDialog } from "./ListConfirmationDialog";
import { downloadAsZip, readFileAsync } from "./utilities";
import type { HymnType, LocalHymnsState } from "../../types";
import { HymnListButton } from "./HymnListButton";
import { DroppableList } from "./DroppableList";
import { HymnListModal } from "./HymnListModal";

const defaultState = {
  hymns: [] as HymnType[],
  selectedHymnIdx: -1,
};

export const HymnList = () => {
  const [filesToBeConfirmed, setFilesToBeConfirmed] = useState<HymnType[]>([]);
  const [localState = defaultState, saveToLocalStorage] =
    useLocalStorage<LocalHymnsState>("editing-hymns");
  const [isHymnListModalOpen, toggleHymnListModal] = useToggle(false);

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
  }

  function handleCloseDialog() {
    return () => setFilesToBeConfirmed([]);
  }

  function handleConfirmDraggedFiles(selectedHymns: HymnType[]) {
    setFilesToBeConfirmed([]);
    saveToLocalStorage({ hymns: selectedHymns, selectedHymnIdx: 0 });
  }

  function handleImportedHymns(importedHymns: HymnType[]) {
    toggleHymnListModal();
    saveToLocalStorage({ hymns: importedHymns, selectedHymnIdx: 0 });
  }

  function handleSelectHymn(hymnIdx: number) {
    return () => {
      saveToLocalStorage({ ...localState, selectedHymnIdx: hymnIdx });
    };
  }

  function handleDeleteHymn(hymnIdx: number) {
    return () => {
      const updatedHymns = hymns.filter((_, currIdx) => currIdx !== hymnIdx);
      saveToLocalStorage({ hymns: updatedHymns, selectedHymnIdx: 0 });
    };
  }

  function handleDownloadHymn(hymnIdxs?: number[]) {
    return () => {
      const files = hymnIdxs
        ? hymnIdxs.map((idx) => hymns[idx])
        : hymns.filter((hymn) => hymn.status === "completed");

      const parsedFiles = files.map(({ verses, status: _, ...hymn }) => {
        const parsedVerses = verses.map(
          ({ updatedHtml: _, ...verse }) => verse
        );
        return { ...hymn, verses: parsedVerses };
      });
      downloadAsZip(parsedFiles);

      const leftoverHymns = hymns.filter(
        (hymn) => !files.find((file) => file.num === hymn.num)
      );
      saveToLocalStorage({ hymns: leftoverHymns, selectedHymnIdx: 0 });
    };
  }

  const combinedFiles = filesToBeConfirmed.reduce((acc: HymnType[], curr) => {
    const doesHymnExist = hymns.find((hymn) => hymn.num === curr.num);
    return doesHymnExist ? acc : [...acc, curr];
  }, hymns);

  return (
    <>
      <Stack padding="24px" spacing="24px">
        <Box px="12px" display="flex" justifyContent="space-between">
          <Typography fontSize={24} sx={{ textDecoration: "underline" }}>
            Review Hymns
          </Typography>
          <Box display="flex" gap="8px">
            <Button
              variant="soft"
              startDecorator={<FiPlus size="12" />}
              onClick={() => toggleHymnListModal()}
            >
              Import
            </Button>
            <Button
              variant="soft"
              startDecorator={<FiDownload size="12" />}
              disabled={!hymns.find((hymn) => hymn.status === "completed")}
              onClick={handleDownloadHymn()}
            >
              Download
            </Button>
          </Box>
        </Box>

        <Box>
          <Box px="12px">
            <Typography fontSize={12}>
              Please drag or import JSON file(s) into this list
            </Typography>
          </Box>

          <DroppableList
            onDroppedFiles={handleFiles}
            sx={{ borderRadius: 3, minHeight: 300 }}
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
          </DroppableList>
        </Box>
      </Stack>

      {/* need to use ternary to force mount/unmount */}
      {filesToBeConfirmed.length > 0 && (
        <ListConfirmationDialog
          open
          data={combinedFiles}
          onClose={handleCloseDialog}
          onConfirm={handleConfirmDraggedFiles}
        />
      )}

      <HymnListModal
        onClose={() => toggleHymnListModal()}
        open={isHymnListModalOpen}
        onSubmit={handleImportedHymns}
        initialHymns={hymns}
      />
    </>
  );
};
