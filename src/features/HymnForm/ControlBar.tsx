import {
  Box,
  Button,
  ButtonGroup,
  Typography,
  Stack,
  Badge,
  Sheet,
} from "@mui/joy";
import type { EditingVerseType } from "../../types";
import { initial, saved, unsaved } from "../../constants/colors";
import { splitByBreakLine } from "./utilities";

type ControlBarProps = {
  verses: EditingVerseType[];
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

  function handleChange(idx: number) {
    return () => onChange(idx);
  }

  return (
    <Box display="flex" justifyContent="space-between">
      <Typography fontSize="24px">{title}</Typography>
      <Stack alignItems="flex-end" spacing="12px">
        <Sheet
          variant="outlined"
          sx={{ borderRadius: "md", display: "flex", gap: 2, p: 0.5 }}
        >
          <ButtonGroup variant="plain" spacing={0.5}>
            {verses
              .filter((_, idx) => idx < 11)
              .map((item, idx) => {
                const [_, ...content] = splitByBreakLine(item.updatedHtml);
                const [__, ...originalContent] = splitByBreakLine(item.html);

                const numberOfChanges = content.reduce((acc, curr, idx) => {
                  if (curr !== originalContent[idx]) return acc + 1;
                  return acc;
                }, 0);

                return (
                  <Badge
                    variant="soft"
                    invisible={numberOfChanges === 0}
                    color="success"
                  >
                    <Button
                      key={idx}
                      variant={idx === value ? "solid" : "soft"}
                      onClick={handleChange(idx)}
                      color="primary"
                    >
                      {item.label}
                    </Button>
                  </Badge>
                );
              })}
          </ButtonGroup>
        </Sheet>
        {secondRow.length ? (
          <ButtonGroup variant="outlined">
            {secondRow.map((item, idx) => (
              <Button
                key={idx}
                variant={idx + 10 === value ? "solid" : "outlined"}
                onClick={handleChange(idx + 10)}
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
