import { Box, Typography, Stack } from "@mui/joy";
import { useLocalStorage } from "@uidotdev/usehooks";

import { downloadAsZip } from "./utilities";
import type { EditingHymnType, LocalHymnsState } from "~/types";
import { DraggableContainer, HymnListActions, ListItem } from "./_components";

const defaultState = {
  hymns: [] as EditingHymnType[],
  selectedHymnIdx: -1,
};

// TODO when importing new hymns, selceted index are not all correct and can display an empty screen

export const HymnList = () => {
  const [localState = defaultState, saveToLocalStorage] =
    useLocalStorage<LocalHymnsState>("editing-hymns");

  const { selectedHymnIdx, hymns } = localState;
  const selectedHymn = hymns.find((_, idx) => idx === selectedHymnIdx);

  function handleImportedHymns(importedHymns: EditingHymnType[]) {
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
        const parsedVerses = verses.map(({ updatedHtml, ...verse }) => ({
          ...verse,
          html: updatedHtml,
        }));
        return { ...hymn, verses: parsedVerses };
      });
      downloadAsZip(parsedFiles);

      const leftoverHymns = hymns.filter(
        (hymn) => !files.find((file) => file.num === hymn.num)
      );
      saveToLocalStorage({ hymns: leftoverHymns, selectedHymnIdx: 0 });
    };
  }

  return (
    <>
      <Stack
        padding="24px"
        spacing="24px"
        maxHeight="100dvh"
        sx={{ overflow: "scroll" }}
      >
        <HymnListActions
          hymns={hymns}
          onImport={handleImportedHymns}
          onDownload={handleDownloadHymn()}
        />

        <Box>
          <Box px="12px">
            <Typography fontSize={12}>
              Please drag or import JSON file(s) into this list
            </Typography>
          </Box>

          <DraggableContainer onImport={handleImportedHymns}>
            {hymns.map((item, idx) => {
              const { title, status } = item;
              return (
                <ListItem
                  key={title + status}
                  onClick={handleSelectHymn(idx)}
                  selected={title === selectedHymn?.title}
                  data={item}
                  onDelete={handleDeleteHymn(idx)}
                  onDownload={handleDownloadHymn([idx])}
                />
              );
            })}
          </DraggableContainer>
        </Box>
      </Stack>
    </>
  );
};
