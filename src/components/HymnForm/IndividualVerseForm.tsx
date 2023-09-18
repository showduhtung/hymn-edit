import { ChangeEvent, useState } from "react";
import { Box, IconButton } from "@mui/material";
import { Card, Textarea, Typography, Stack, Button } from "@mui/joy";
import { FiRotateCcw } from "react-icons/fi";

type IndividualVerseFormProps = { initialContent: string[] };

export const IndividualVerseForm = ({
  initialContent,
}: IndividualVerseFormProps) => {
  const [verses, setVerses] = useState<string[]>(initialContent);

  function handleUpdateInput(idx: number) {
    return (e: ChangeEvent<HTMLTextAreaElement>) => {
      const updatedVerses = [...verses];
      updatedVerses.splice(idx, 1, e.target.value);
      setVerses(updatedVerses);
    };
  }

  function handleResetLineText(idx: number) {
    return () => {
      const updatedVerses = [...initialContent];
      updatedVerses.splice(idx, 1, initialContent[idx]);
      setVerses(updatedVerses);
    };
  }

  return (
    <>
      <Box display="flex" gap="24px" justifyContent="space-between">
        <Stack spacing="12px" width="70%">
          {verses.map((line, idx) => (
            <Box
              display="flex"
              width="100%"
              justifyContent="space-between"
              key={idx}
            >
              <Textarea
                key={idx}
                variant="soft"
                value={line}
                onChange={handleUpdateInput(idx)}
                autoFocus={idx === 0}
                sx={{ width: "70%", backgroundColor: "#F7FDFF" }}
                // onFocus="this.value = this.value;"
                onFocus={(e) => {
                  const val = e.target.value;
                  e.target.value = "";
                  e.target.value = val;
                }}
              />
              {line !== initialContent[idx] && (
                <IconButton
                  onClick={handleResetLineText(idx)}
                  sx={{ borderRadius: 3 }}
                  color="primary"
                >
                  <FiRotateCcw size="14" sx={{ transform: "rotate(20deg)" }} />
                </IconButton>
              )}
            </Box>
          ))}
        </Stack>
        <Card>
          <Stack spacing="8px" padding="8px">
            {verses.map((line) => (
              <Box display="flex" key={line}>
                <Typography fontWeight={700}>{line[0]}</Typography>
                <Typography>{line.slice(1)}</Typography>
              </Box>
            ))}
          </Stack>
        </Card>
      </Box>
      <Box height="24px" />
      <Box display="flex" gap="4px">
        <Button variant="solid" disabled>
          Save
        </Button>
      </Box>
    </>
  );
};
