import { type ChangeEvent, useState, type KeyboardEvent } from "react";
import { Paper } from "@mui/material";
import { Box, Typography, Stack, Button } from "@mui/joy";
import { FiRotateCcw, FiSave } from "react-icons/fi";
import { initial, saved, unsaved } from "~/constants/colors";

import { IconLegend } from "./IconLegend";
import { Div } from "./Div";
import { LineTextarea } from "./LineTextarea";
import { joinByBreakLine } from "../../utilities";

type IndividualVerseFormProps = {
  savedVerse: string[];
  originalVerse: string[];
  onSave: (val: string[]) => void;
};

// savedVerse: localStorage state of the verse
// originalVerse: unedited version of the verse
// the above two states provide flexibility to save progress in editing a verse

export const IndividualVerseForm = ({
  savedVerse,
  originalVerse,
  onSave,
}: IndividualVerseFormProps) => {
  const [verse, setVerse] = useState<string[]>(savedVerse); // current state of the content
  const [errors, setErrors] = useState<number[]>([]);

  function handleSaveWithValidation(payload: string[]) {
    setErrors(() => []);
    const mistakes = payload.reduce((acc, line, idx) => {
      return line === "" ? [...acc, idx] : acc;
    }, [] as number[]);

    if (mistakes.length === 0) onSave(payload);
    else setErrors(() => mistakes);
  }

  function handleUpdateInput(idx: number) {
    return (e: ChangeEvent<HTMLTextAreaElement>) => {
      const { value } = e.target;
      setVerse(verse.map((line, currIdx) => (currIdx === idx ? value : line)));
      setErrors([]);
    };
  }

  function handleResetLineText(idx: number) {
    return () => {
      if (idx === -1) return setVerse(originalVerse);
      const updatedVerse = [...verse];
      updatedVerse.splice(idx, 1, originalVerse[idx]);
      setVerse(updatedVerse);
    };
  }

  function handleUndoRecentChanges(idx: number) {
    return () => {
      const updatedVerse = [...verse];
      updatedVerse.splice(idx, 1, savedVerse[idx]);
      setVerse(updatedVerse);
    };
  }

  function handleSave(idx: number = -1) {
    return () => {
      if (idx === -1) return handleSaveWithValidation(verse);
      const updatedVerse = [...savedVerse];
      updatedVerse.splice(idx, 1, verse[idx]);
      handleSaveWithValidation(updatedVerse);
    };
  }

  function handleKeydown(idx?: number) {
    const saveOptions = ["Enter", "s"];
    const directions = ["ArrowRight", "ArrowLeft"];
    // for future right and left movement

    function handleKeySave(
      event: KeyboardEvent<HTMLTextAreaElement>,
      idx?: number
    ) {
      const withModifierKey = event.metaKey || event.ctrlKey;
      if (!withModifierKey) return;
      if (!canSave) return;

      event.stopPropagation();
      event.preventDefault();

      const isMac = navigator.userAgentData?.platform === "macOS";
      if (!(isMac && event.metaKey) && !(!isMac && event.ctrlKey)) return;
      return event.shiftKey ? handleSave()() : handleSave(idx)();
    }

    return (event: KeyboardEvent<HTMLTextAreaElement>) => {
      if (![...saveOptions, ...directions].includes(event.key)) return;
      if (saveOptions.includes(event.key)) handleKeySave(event, idx);
    };
  }

  const canSave = verse.some((line, idx) => line !== savedVerse[idx]);
  const areAllOriginal = verse.every(
    (line, idx) => line === originalVerse[idx]
  );

  const textBackgroundColor = (line: string, idx: number) => {
    if (line !== originalVerse[idx] && line === savedVerse[idx]) return saved;
    if (line !== savedVerse[idx]) return unsaved;
    return initial;
  };

  return (
    <>
      <Stack spacing="12px">
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          pl="12px"
          pr="12px"
        >
          {errors.length > 0 ? (
            <Typography color="danger">
              Please fill in all empty textboxes
            </Typography>
          ) : (
            <Box />
          )}
          <IconLegend />
        </Box>
        <Box display="flex" gap="24px" justifyContent="space-between">
          <Stack spacing="12px" width="50%">
            {verse.map((line, idx) => {
              const isError = errors.includes(idx);
              return (
                <LineTextarea
                  key={idx}
                  value={line}
                  onChange={handleUpdateInput(idx)}
                  onKeyDown={handleKeydown(idx)}
                  autoFocus={idx === 0}
                  isError={isError}
                  bgColor={textBackgroundColor(line, idx)}
                  onSave={handleSave(idx)}
                  onReset={handleResetLineText(idx)}
                  onUndo={handleUndoRecentChanges(idx)}
                  isSavedDisabled={line === savedVerse[idx]}
                  isResetDisabled={line === originalVerse[idx]}
                />
              );
            })}
          </Stack>
          <Paper
            sx={{ backgroundColor: initial, p: "24px", flex: 1 }}
            elevation={0}
          >
            <Div
              dangerouslySetInnerHTML={{
                __html: joinByBreakLine(verse)
                  .replaceAll("<br>", "<br><br>") // to visually give more space between lines
                  .replaceAll("\n", "<br>"),
              }}
            />
          </Paper>
        </Box>
      </Stack>

      <Box height="24px" />

      <Box display="flex" flexDirection="column" gap="24px">
        <Box display="flex" gap="8px">
          <Button
            variant="soft"
            onClick={handleSave()}
            disabled={!canSave}
            endDecorator={<FiSave size="14" />}
          >
            SAVE all changes
          </Button>
          <Button
            variant="soft"
            disabled={areAllOriginal}
            onClick={handleResetLineText(-1)}
            endDecorator={<FiRotateCcw size="14" />}
          >
            UNDO line changes
          </Button>
        </Box>
        <Box pl="12px">
          <Typography
            sx={({ palette }) => ({
              color: palette.neutral[400],
              fontSize: "12px",
            })}
          >
            Ctrl/Cmd + Enter/S to Save
          </Typography>
          <Typography
            sx={({ palette }) => ({
              color: palette.neutral[400],
              fontSize: "12px",
            })}
          >
            Ctrl/Cmd + Shift + Enter/S to Save All
          </Typography>
        </Box>
        <Typography
          pl="12px"
          sx={({ palette }) => ({
            color: palette.neutral[400],
            fontSize: "12px",
          })}
        >
          Note- character "", is not supported. Please use: “”
        </Typography>
      </Box>
    </>
  );
};
