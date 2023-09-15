import { Box } from "@mui/material";
import { Button, ButtonGroup, Typography, Stack } from "@mui/joy";

import { type VerseType } from "../../App";

type ControlBarProps = {
  verses: VerseType[];
  value: number;
  onChange: (idx: number) => void;
  titles: [string, string];
};

export const ControlBar = ({
  verses,
  titles,
  onChange,
  value,
}: ControlBarProps) => {
  const secondRow = verses.length > 10 ? verses.slice(10) : [];
  return (
    <Box display="flex" justifyContent="space-between">
      <Stack>
        <Typography fontSize="24px">{titles[0]}</Typography>
        <Typography fontSize="20px">{titles[1]}</Typography>
      </Stack>
      <Stack alignItems="flex-end" spacing="12px">
        <ButtonGroup variant="outlined">
          {verses
            .filter((_, idx) => idx < 11)
            .map((item, idx) => (
              <Button
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
