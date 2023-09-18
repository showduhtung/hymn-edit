import { Box } from "@mui/material";
import { Button, ButtonGroup, Typography, Stack } from "@mui/joy";

import { type VerseType } from "../../types";

type ControlBarProps = {
  verses: VerseType[];
  value: number;
  onChange: (idx: number) => void;
  title: string;
};

export const ControlBar = ({
  verses,
  title,
  onChange,
  value,
}: ControlBarProps) => {
  const secondRow = verses.length > 10 ? verses.slice(10) : [];
  return (
    <Box display="flex" justifyContent="space-between">
      <Typography fontSize="24px">{title}</Typography>
      <Stack alignItems="flex-end" spacing="12px">
        <ButtonGroup variant="outlined">
          {verses
            .filter((_, idx) => idx < 11)
            .map((item, idx) => (
              <Button
                key={idx}
                variant={idx === value ? "solid" : "outlined"}
                onClick={() => onChange(idx)}
                color="primary"
              >
                {item.label}
              </Button>
            ))}
        </ButtonGroup>
        {secondRow.length ? (
          <ButtonGroup variant="outlined">
            {secondRow.map((item, idx) => (
              <Button
                variant={idx + 10 === value ? "solid" : "outlined"}
                onClick={() => onChange(idx + 10)}
                color="primary"
              >
                {item.label}
              </Button>
            ))}
          </ButtonGroup>
        ) : (
          <></>
        )}
      </Stack>
    </Box>
  );
};
