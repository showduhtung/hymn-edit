import { useEffect, useState } from "react";
import { Box, Stack, type StackProps } from "@mui/joy";
import { useLocalStorage } from "@uidotdev/usehooks";

import type { EditingHymnType, LocalHymnsState } from "../../types";
import { IndividualVerseForm, VerseSelector, FormControlBar } from ".";
import { joinByBreakLine, splitByBreakLine } from "./utilities";

const defaultState = { hymns: [] as EditingHymnType[], selectedHymnIdx: -1 };

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
      const status =
        hymn.status === "completed"
          ? ("in-progress" as const)
          : ("completed" as const);
      return { ...hymn, status };
    });

    saveToLocalStorage({ ...localState, hymns });
  }

  function handleSave(verseIdx: number) {
    return (updatedContent: string[]) => {
      if (!selectedHymn) return;

      const verses = selectedHymn.verses.map((verse, currIdx) => {
        if (currIdx !== verseIdx) return verse;
        const [idx] = splitByBreakLine(verse.html);
        const updatedHtml =
          `<b>${String(idx)}</b><br>` + joinByBreakLine(updatedContent);

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

  function handleReset() {
    const hymns = localState.hymns.map((hymn, idx) => {
      if (idx !== selectedHymnIdx) return hymn;
      const verses = hymn.verses.map((verse) => {
        return { ...verse, updatedHtml: verse.html };
      });
      return { ...hymn, verses, status: "not-started" as const };
    });
    saveToLocalStorage({ ...localState, hymns });
  }

  useEffect(() => {
    setSelectedVerseIdx(0);
  }, [selectedHymnIdx]);

  const { status } = selectedHymn || { status: "not-started" };

  return (
    <Stack
      spacing="24px"
      maxHeight="100dvh"
      sx={{ overflow: "scroll" }}
      {...props}
    >
      <VerseSelector
        value={selectedVerseIdx}
        onChange={setSelectedVerseIdx}
        verses={selectedHymn?.verses || []}
        title={selectedHymn?.title || ""}
      />

      <FormControlBar
        status={status}
        onMark={handleMarkComplete}
        onReset={handleReset}
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
            />
          </Box>
        );
      })}
    </Stack>
  );
};
