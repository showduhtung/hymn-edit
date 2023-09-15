import { ChangeEvent, useState } from "react";
import { Box } from "@mui/material";
import { Input, Button, ButtonGroup, Typography, Stack } from "@mui/joy";
import { RestartAlt } from "@mui/icons-material";
import { HymnType } from "../../App";

export const HymnForm = ({ selectedHymn }: { selectedHymn: HymnType }) => {
  const [selectedVerse, setSelectedVerse] = useState<number>(0);

  const [_verseNo, ...content] = splitByBreakLine(
    selectedHymn.verses[selectedVerse].html
  );
  const [formContent, setFormContent] = useState<string[]>(content);

  function handleUpdateInput(idx: number) {
    return (e: ChangeEvent<HTMLInputElement>) => {
      const newContent = [...formContent];
      newContent.splice(idx, 1, e.target.value);
      setFormContent(newContent);
    };
  }

  function handleResetLineText(idx: number) {
    return () => {
      console.log({ content });
      const newContent = [...content];
      newContent.splice(idx, 1, content[idx]);
      setFormContent(newContent);
    };
  }

  return (
    <Stack spacing="24px">
      <Typography fontSize="24px">Verse {_verseNo}</Typography>
      <Box display="flex" gap="24px" justifyContent="space-between">
        <Stack width="40%" spacing="8px">
          {formContent.map((line, idx) => (
            <Input
              key={idx}
              variant="plain"
              value={line}
              onChange={handleUpdateInput(idx)}
              endDecorator={<RestartAlt onClick={handleResetLineText(idx)} />}
            />
          ))}
        </Stack>
        <Stack spacing="8px" border="1px solid black" padding="24px">
          {formContent.map((line) => (
            <Box display="flex" key={line}>
              <Typography fontWeight={700}>{line[0]}</Typography>
              <Typography>{line.slice(1)}</Typography>
            </Box>
          ))}
        </Stack>
      </Box>
      <Box height="24px">
        <ButtonGroup variant="outlined">
          {selectedHymn.verses.map((_item, idx) => (
            <Button
              variant={idx === selectedVerse ? "solid" : "outlined"}
              onClick={() => setSelectedVerse(idx)}
              color="primary"
            >
              {idx + 1}
            </Button>
          ))}
        </ButtonGroup>
      </Box>
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
