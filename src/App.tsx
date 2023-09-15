import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "@fontsource/inter";

import { ChangeEvent, useState } from "react";
import { Box, Container, Paper, styled } from "@mui/material";
import { Input, Button, ButtonGroup, Typography, Stack } from "@mui/joy";
import { HymnList } from "./components";
import { RestartAlt } from "@mui/icons-material";

const StyledContainer = styled(Container)(({ theme }) => ({
  padding: "24px",
  [theme.breakpoints.up("lg")]: {
    maxWidth: "95vw",
  },
}));

export type HymnType = {
  lang: string;
  num: string;
  title: string;
  verses: VerseType[];
};
type VerseType = { label: string; num: number; html: string };

function App() {
  const [selectedHymn, setSelectedHymn] = useState<HymnType>(ex);
  return (
    <StyledContainer>
      <Box display="flex" gap="24px" height="100%" maxWidth="100%">
        <HymnList
          selectedHymn={selectedHymn}
          onSelectHymn={setSelectedHymn}
          sx={{
            flexBasis: "30%",
            flexGrow: 0,
            flexShrink: 0,
            maxWidth: "450px",
            p: "24px",
          }}
        />
        <Paper
          elevation={2}
          sx={{
            flexGrow: 1,
            padding: "24px",
          }}
        >
          {selectedHymn ? (
            <HymnForm selectedHymn={selectedHymn} />
          ) : (
            <Typography>Select a hymn to start editing</Typography>
          )}
        </Paper>
      </Box>
    </StyledContainer>
  );
}
const HymnForm = ({ selectedHymn }: { selectedHymn: HymnType }) => {
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

export default App;

const ex = {
  lang: "en",
  num: "3",
  title: "The God of Abraham Praise",
  verses: [
    {
      label: "1",
      num: 1,
      html: "1<br><b>T</b>he God of Abraham praise, <br><b>A</b>ll praised be His name, <br><b>W</b>ho was, and is, and is to be, <br><b>F</b>or aye the same! <br><b>T</b>he one eternal God, <br><b>E</b>re aught that now appears; <br><b>T</b>he First, the Last: beyond all thought <br><b>H</b>is timeless years! ",
    },
    {
      label: "2",
      num: 2,
      html: "2<br><b>H</b>is spirit floweth free, <br><b>H</b>igh surging where it will; <br><b>I</b>n prophet’s word He spoke of old, <br><b>H</b>e speaketh still. <br><b>E</b>stablished is His law, <br><b>A</b>nd changeless it shall stand, <br><b>D</b>eep writ upon the human heart, <br><b>O</b>n sea or land. ",
    },
    {
      label: "3",
      num: 3,
      html: "3<br><b>H</b>e hath eternal life, <br><b>I</b>mplanted in the soul; <br><b>H</b>is love shall be our strength and stay <br><b>W</b>hile ages roll. <br><b>P</b>raise to the living God! <br><b>A</b>ll praised be His name, <br><b>W</b>ho was, and is, and is to be, <br><b>F</b>or aye the same! ",
    },
  ],
};

function splitByBreakLine(inputStr: string) {
  return inputStr
    .split("<br>")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line) => line.replace("<b>", "").replace("</b>", ""));
}
