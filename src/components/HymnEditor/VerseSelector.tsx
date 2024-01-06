import { Box, Button, ButtonGroup, Typography, Stack, Sheet } from "@mui/joy";
import type { EditingVerseType } from "~/types";
import { saved } from "~/constants/colors";
import { splitByBreakLine } from "./utilities";

type VerseSelectorProps = {
  verses: EditingVerseType[];
  value: number;
  onChange: (idx: number) => void;
  title: string;
};

// for better ux experience, control bar could also have a "unsaved" state to show that unsaved changes have been made in this verse

export const VerseSelector = ({
  verses,
  title,
  onChange,
  value,
}: VerseSelectorProps) => {
  const secondRow = verses.length > 10 ? verses.slice(10) : [];

  function handleChange(idx: number) {
    return () => onChange(idx);
  }

  function renderButton(add: number) {
    return (item: EditingVerseType, idx: number) => {
      const [_, ...content] = splitByBreakLine(item.updatedHtml);
      const [__, ...originalContent] = splitByBreakLine(item.html);
      const currIdx = idx + add;

      const numberOfChanges = content.reduce((acc, curr, idx) => {
        return acc + Number(curr !== originalContent[idx]);
      }, 0);

      return (
        <Button
          key={item.label + idx}
          variant={currIdx === value ? "solid" : "soft"}
          onClick={handleChange(currIdx)}
          color="primary"
          sx={(theme) => {
            const isSelected = currIdx === value;
            const hasChanges = numberOfChanges > 0;
            if (isSelected) return {};

            return {
              backgroundColor: hasChanges ? saved : "",
              color:
                isSelected && !hasChanges
                  ? "white"
                  : theme.palette.primary[500],
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
