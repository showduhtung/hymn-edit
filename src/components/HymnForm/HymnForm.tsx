import { useState } from "react";
import { Box, Stack, StackProps } from "@mui/joy";
import { useLocalStorage } from "@uidotdev/usehooks";

import { HymnType, LocalHymnsState } from "../../types";
import { IndividualVerseForm, ControlBar } from ".";
import { joinByBreakLine, splitByBreakLine } from "./utilities";

const defaultState = {
  hymns: [] as HymnType[],
  selectedHymnIdx: -1,
};

export const HymnForm = (props: StackProps) => {
  const [selectedVerseIdx, setSelectedVerseIdx] = useState<number>(0);
  const [localState = defaultState, saveToLocalStorage] =
    useLocalStorage<LocalHymnsState>("editing-hymns");

  const { selectedHymnIdx, hymns } = localState;
  const selectedHymn = hymns.find((_, idx) => idx === selectedHymnIdx);

  function handleMarkComplete() {
    if (!selectedHymn) return;

    const hymns = localState.hymns.map((hymn) => {
      if (hymn.title !== selectedHymn.title) return hymn;
      return { ...hymn, status: "completed" as const };
    });

    saveToLocalStorage({ ...localState, hymns });
  }

  function handleSave(verseIdx: number) {
    return (updatedContent: string[]) => {
      if (!selectedHymn) return;

      const verses = selectedHymn.verses.map((verse, currIdx) => {
        if (currIdx !== verseIdx) return verse;
        const updatedHtml =
          `<b>${String(currIdx + 1)}</b><br>` + joinByBreakLine(updatedContent);

        return { ...verse, updatedHtml };
      });

      const updatedHymns = hymns.map((hymn) => {
        if (hymn.title !== selectedHymn.title) return hymn;

        const isSameAsOriginal = hymn.verses.every((verse, idx) => {
          const splitOriginal = splitByBreakLine(verse.html);
          const splitUpdated = splitByBreakLine(verses[idx].updatedHtml);
          return splitOriginal.every((line, idx) => line === splitUpdated[idx]);
        });

        return {
          ...hymn,
          verses,
          status: isSameAsOriginal
            ? ("not-started" as const)
            : ("in-progress" as const),
        };
      });

      saveToLocalStorage({ ...localState, hymns: updatedHymns });
    };
  }

  return (
    <Stack spacing="24px" {...props}>
      <ControlBar
        value={selectedVerseIdx}
        onChange={setSelectedVerseIdx}
        verses={selectedHymn?.verses || []}
        title={selectedHymn?.title || ""}
      />

      {selectedHymn?.verses.map(({ updatedHtml, html }, idx) => {
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
              onCompleted={handleMarkComplete}
              status={selectedHymn.status}
            />
          </Box>
        );
      })}
    </Stack>
  );
};
