import { useState } from "react";
import { Stack, StackProps, Typography } from "@mui/joy";
import { Box } from "@mui/material";

import { HymnType, LocalHymnsState } from "../../types";
import { IndividualVerseForm, ControlBar } from ".";
import { useLocalStorage } from "@uidotdev/usehooks";

const defaultState = {
  hymns: [] as HymnType[],
  selectedHymn: undefined,
};

export const HymnForm = (props: StackProps) => {
  const [selectedVerseIdx, setSelectedVerseIdx] = useState<number>(0);
  const [{ selectedHymn } = defaultState, _saveToLocalStorage] =
    useLocalStorage<LocalHymnsState>("editing-hymns");

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
      <Box height="12px" />
      {selectedHymn.verses.map((verse, idx) => {
        const [_, ...content] = splitByBreakLine(verse.html);
        return (
          <Box
            key={String(idx) + content[0]}
            display={idx === selectedVerseIdx ? "block" : "none"}
          >
            <IndividualVerseForm initialContent={content} />
          </Box>
        );
      })}
    </Stack>
  );
};

function splitByBreakLine(inputStr: string) {
  return inputStr
    .split("<br>")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line) => line.replace("<b>", "").replace("</b>", ""));
}
