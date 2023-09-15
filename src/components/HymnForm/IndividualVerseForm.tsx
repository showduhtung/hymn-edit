import { ChangeEvent, useState } from "react";
import { Box, IconButton } from "@mui/material";
import { Input, Typography, Stack } from "@mui/joy";
import { FiRotateCcw } from "react-icons/fi";

type IndividualVerseFormProps = { initialContent: string[] };

export const IndividualVerseForm = ({
  initialContent,
}: IndividualVerseFormProps) => {
  const [formContent, setFormContent] = useState<string[]>(initialContent);

  function handleUpdateInput(idx: number) {
    return (e: ChangeEvent<HTMLInputElement>) => {
      const newContent = [...formContent];
      newContent.splice(idx, 1, e.target.value);
      setFormContent(newContent);
    };
  }

  function handleResetLineText(idx: number) {
    return () => {
      const newContent = [...initialContent];
      newContent.splice(idx, 1, initialContent[idx]);
      setFormContent(newContent);
    };
  }

  return (
    <Box display="flex" gap="24px" justifyContent="space-between">
      <Stack spacing="12px" width="70%">
        {formContent.map((line, idx) => (
          <Box display="flex" width="100%" justifyContent="space-between">
            <Input
              key={idx}
              variant="plain"
              value={line}
              onChange={handleUpdateInput(idx)}
              autoFocus={idx === 0}
              style={{ width: "70%", backgroundColor: "#F7FDFF" }}
            />
            <IconButton
              onClick={handleResetLineText(idx)}
              sx={{ borderRadius: 2 }}
              color="primary"
            >
              <FiRotateCcw size="14" style={{ transform: "rotate(20deg)" }} />
            </IconButton>
          </Box>
        ))}
      </Stack>
      <Stack
        spacing="8px"
        border="1px solid black"
        borderRadius="5px"
        padding="24px"
      >
        {formContent.map((line) => (
          <Box display="flex" key={line}>
            <Typography fontWeight={700}>{line[0]}</Typography>
            <Typography>{line.slice(1)}</Typography>
          </Box>
        ))}
      </Stack>
    </Box>
  );
};
