import { useState } from "react";
import { Stack } from "@mui/joy";

import { HymnType } from "../../App";
import { IndividualVerseForm, ControlBar } from ".";

export const HymnForm = ({ selectedHymn }: { selectedHymn: HymnType }) => {
  const [selectedVerse, setSelectedVerse] = useState<number>(0);
  const [verseNo, ...content] = splitByBreakLine(
    selectedHymn.verses[selectedVerse].html
  );

  return (
    <Stack spacing="24px">
      <ControlBar
        verses={selectedHymn.verses}
        value={selectedVerse}
        onChange={setSelectedVerse}
        titles={[selectedHymn.title, verseNo]}
      />
      <IndividualVerseForm initialContent={content} />
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
