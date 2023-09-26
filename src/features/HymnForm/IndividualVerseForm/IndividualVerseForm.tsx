import { type ChangeEvent, useState, type KeyboardEvent } from "react";
import { Paper } from "@mui/material";
import {
  Box,
  IconButton,
  Textarea,
  Typography,
  Stack,
  Button,
  useTheme,
} from "@mui/joy";
import { FiRefreshCw, FiRotateCcw, FiSave } from "react-icons/fi";
import { autofocusLastCharacter, joinByBreakLine } from "../utilities";
import { IconLegend } from "./IconLegend";
import { Div } from "./Div";
import { initial, saved, unsaved } from "../../../constants/colors";

type IndividualVerseFormProps = {
  savedVerse: string[];
  originalVerse: string[];
  onSave: (val: string[]) => void;
};

export const IndividualVerseForm = ({
  savedVerse,
  originalVerse,
  onSave,
}: IndividualVerseFormProps) => {
  const theme = useTheme();
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
      const value = e.target.value;
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

  function handleSave(idx?: number) {
    return () => {
      if (idx === undefined) return handleSaveWithValidation(verse);
      const updatedVerse = [...savedVerse];
      updatedVerse.splice(idx, 1, verse[idx]);
      handleSaveWithValidation(updatedVerse);
    };
  }

  function handleEnter(idx?: number) {
    const isMac = navigator.userAgentData?.platform === "macOS";
    return (event: KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key !== "Enter") return;
      if (!canSave) return;
      if (!(isMac && event.metaKey) && !(!isMac && event.ctrlKey)) return;
      return event.shiftKey ? handleSave()() : handleSave(idx)();
    };
  }

  const textBackgroundColor = (line: string, idx: number) => {
    if (line !== originalVerse[idx] && line === savedVerse[idx]) return saved;
    if (line !== savedVerse[idx]) return unsaved;
    return initial;
  };

  const canSave = verse.some((line, idx) => line !== savedVerse[idx]);
  const areAllOriginal = verse.every(
    (line, idx) => line === originalVerse[idx]
  );

  const { danger } = theme.palette;
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
                <Textarea
                  key={idx}
                  variant="soft"
                  value={line}
                  onChange={handleUpdateInput(idx)}
                  onKeyDown={handleEnter(idx)}
                  autoFocus={idx === 0}
                  sx={{
                    backgroundColor: isError
                      ? `${theme.palette.danger[100]}`
                      : textBackgroundColor(line, idx),
                    border: isError ? `1px solid ${danger[500]}` : "none",
                  }}
                  onFocus={autofocusLastCharacter}
                  endDecorator={
                    <>
                      <IconButton
                        onClick={handleSave(idx)}
                        sx={{ borderRadius: 3 }}
                        color="primary"
                        disabled={line === savedVerse[idx]}
                      >
                        <FiSave size="14" />
                      </IconButton>
                      <IconButton
                        onClick={handleResetLineText(idx)}
                        sx={{ borderRadius: 3 }}
                        color="primary"
                        disabled={line === originalVerse[idx]}
                      >
                        <FiRefreshCw size="14" />
                      </IconButton>
                      <IconButton
                        onClick={handleUndoRecentChanges(idx)}
                        sx={{ borderRadius: 3 }}
                        color="primary"
                        disabled={line === savedVerse[idx]}
                      >
                        <FiRotateCcw size="14" />
                      </IconButton>
                    </>
                  }
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

      <Box>
        <Box display="flex" gap="8px">
          <Button
            variant="soft"
            onClick={handleSave()}
            disabled={!canSave}
            endDecorator={<FiSave size="14" />}
          >
            Save all changes
          </Button>
          <Button
            variant="soft"
            disabled={areAllOriginal}
            onClick={handleResetLineText(-1)}
            endDecorator={<FiRotateCcw size="14" />}
          >
            Undo line changes
          </Button>
        </Box>
        <Box pl="12px" pt="24px">
          <Typography
            sx={({ palette }) => ({
              color: palette.neutral[400],
              fontSize: "12px",
            })}
          >
            Ctrl/Cmd + Enter to Save
          </Typography>
          <Typography
            sx={({ palette }) => ({
              color: palette.neutral[400],
              fontSize: "12px",
            })}
          >
            Ctrl/Cmd + Shift + Enter to Save All
          </Typography>
        </Box>
      </Box>
    </>
  );
};
