import { Box, Button, ButtonGroup, Typography, Stack, Sheet } from "@mui/joy";
import type { EditingVerseType } from "../../types";
import { saved } from "../../constants/colors";
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

  function renderButton(add: number) {
    return (item: EditingVerseType, idx: number) => {
      const [_, ...content] = splitByBreakLine(item.updatedHtml);
      const [__, ...originalContent] = splitByBreakLine(item.html);

      const numberOfChanges = content.reduce((acc, curr, idx) => {
        if (curr !== originalContent[idx]) return acc + 1;
        return acc;
      }, 0);

      return (
        <Button
          key={item.label + idx}
          variant={idx + add === value ? "solid" : "soft"}
          onClick={handleChange(idx + add)}
          color="primary"
          sx={(theme) => {
            const isWhite = value === idx && numberOfChanges === 0;
            return {
              backgroundColor: numberOfChanges > 0 ? saved : "",
              color: isWhite ? "white" : theme.palette.primary[500],
            };
          }}
        >
          {item.label}
        </Button>
      );
    };
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
            {verses.filter((_, idx) => idx < 11).map(renderButton(0))}
          </ButtonGroup>
        </Sheet>
        {Boolean(secondRow.length) && (
          <Sheet
            variant="outlined"
            sx={{ borderRadius: "md", display: "flex", gap: 2, p: 0.5 }}
          >
            <ButtonGroup variant="plain" spacing={0.5}>
              {secondRow.map(renderButton(10))}
            </ButtonGroup>
          </Sheet>
        )}
      </Stack>
    </Box>
  );
};
