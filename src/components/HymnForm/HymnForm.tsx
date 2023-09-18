import { useState } from "react";
import { Stack, StackProps, Typography } from "@mui/joy";
import { Box } from "@mui/material";
import { useLocalStorage } from "@uidotdev/usehooks";

import { HymnType, LocalHymnsState } from "../../types";
import { IndividualVerseForm, ControlBar } from ".";
import { joinByBreakLine, splitByBreakLine } from "./utilities";

const defaultState = {
  hymns: [] as HymnType[],
  selectedHymn: undefined,
};

export const HymnForm = (props: StackProps) => {
  const [selectedVerseIdx, setSelectedVerseIdx] = useState<number>(0);
  const [localState = defaultState, saveToLocalStorage] =
    useLocalStorage<LocalHymnsState>("editing-hymns");
  const { selectedHymn } = localState;

  function handleMarkComplete(verseIdx: number) {
    return () => {
      if (!selectedHymn) return;
      saveToLocalStorage({
        hymns: localState.hymns.map((hymn, idx) =>
          idx !== verseIdx ? hymn : { ...hymn, status: "completed" }
        ),
        selectedHymn: { ...selectedHymn, status: "completed" },
      });
    };
  }

  function handleSave(verseIdx: number) {
    return (updatedContent: string[]) => {
      if (!selectedHymn) return;

      const verses = selectedHymn.verses.map((verse, currIdx) => {
        if (currIdx !== verseIdx) return verse;
        const updatedHtml =
          `${String(currIdx + 1)}<br>` + joinByBreakLine(updatedContent);

        return { ...verse, updatedHtml };
      });

      saveToLocalStorage({
        ...localState,
        selectedHymn: { ...selectedHymn, verses },
      });
    };
  }

  if (!selectedHymn) {
    return <Typography>Select a Hymn to start editting</Typography>;
  }

  return (
    <Stack spacing="24px" {...props}>
      <ControlBar
        value={selectedVerseIdx}
        onChange={setSelectedVerseIdx}
        verses={selectedHymn.verses}
        title={selectedHymn.title}
      />

      {selectedHymn.verses.map(({ updatedHtml, html }, idx) => {
        const [_, ...content] = splitByBreakLine(updatedHtml);
        const [__, ...originalContent] = splitByBreakLine(html);

        return (
          <Box
            key={String(idx) + content[0]}
            display={idx === selectedVerseIdx ? "block" : "none"}
          >
            <IndividualVerseForm
              savedVerse={content}
              originalVerse={originalContent}
              onSave={handleSave(idx)}
              onCompleted={handleMarkComplete(idx)}
            />
          </Box>
        );
      })}
    </Stack>
  );
};
