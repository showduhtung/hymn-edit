import { ChangeEvent, useState } from "react";
import { Box, IconButton, Paper } from "@mui/material";
import {
  Textarea,
  Typography,
  Stack,
  Button,
  styled,
  useTheme,
} from "@mui/joy";
import { FiCheck, FiRefreshCw, FiRotateCcw, FiSave } from "react-icons/fi";
import { joinByBreakLine } from "./utilities";
import { HymnStatus } from "../../types";

type IndividualVerseFormProps = {
  savedVerse: string[];
  originalVerse: string[];
  onSave: (val: string[]) => void;
  onCompleted: () => void;
  status: HymnStatus;
};

const initial = "#F7FDFF";
const unsaved = "#FFFBEA";
const saved = "#E8FFEA";

const Div = styled("div")(({ theme }) => theme.typography["h4"]);

export const IndividualVerseForm = ({
  savedVerse,
  originalVerse,
  onCompleted,
  onSave,
  status,
}: IndividualVerseFormProps) => {
  const theme = useTheme();
  const [verse, setVerse] = useState<string[]>(savedVerse); // current state of the content
  const [errors, setErrors] = useState<number[]>([]);

  function handleSaveWithValidation(payload: string[]) {
    const mistakes = payload.reduce((acc, line, idx) => {
      return line === "" ? [...acc, idx] : acc;
    }, [] as number[]);

    if (mistakes.length === 0) onSave(payload);
    else setErrors(mistakes);
  }

  function handleUpdateInput(idx: number) {
    return (e: ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;
      setVerse(verse.map((line, currIdx) => (currIdx === idx ? value : line)));
    };
  }

  function handleResetLineText(idx: number) {
    return () => {
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
      if (!idx) return handleSaveWithValidation(verse);
      const updatedVerse = [...savedVerse];
      updatedVerse.splice(idx, 1, verse[idx]);
      handleSaveWithValidation(updatedVerse);
    };
  }

  const textBackgroundColor = (line: string, idx: number) => {
    if (line !== originalVerse[idx] && line === savedVerse[idx]) return saved;
    if (line !== savedVerse[idx]) return unsaved;
    return initial;
  };

  const canSave = verse.some((line, idx) => line !== savedVerse[idx]);
  const canComplete = savedVerse.some(
    (line, idx) => line !== originalVerse[idx]
  );
  const { danger } = theme.palette;
  return (
    <>
      <Stack spacing="12px">
        <Box width="100%" display="flex" justifyContent="space-between">
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
      <Box display="flex" gap="8px">
        <Button
          variant="solid"
          onClick={handleSave()}
          disabled={!canSave}
          endDecorator={<FiSave size="14" />}
        >
          Save all changes
        </Button>

        <Button
          variant="solid"
          onClick={onCompleted}
          disabled={status === "completed" || !(canSave || canComplete)}
          endDecorator={<FiCheck size="14" />}
        >
          Mark complete
        </Button>
      </Box>
    </>
  );
};

const IconLegend = () => (
  <Box display="flex" gap="12px">
    <Box display="flex" alignItems="center" gap="4px">
      <FiSave size="14" />
      <Typography fontSize="14px">Save</Typography>
    </Box>
    <Box display="flex" alignItems="center" gap="4px">
      <FiRefreshCw size="14" />
      <Typography fontSize="14px">Reset</Typography>
    </Box>
    <Box display="flex" alignItems="center" gap="4px">
      <FiRotateCcw size="14" />
      <Typography fontSize="14px">Undo</Typography>
    </Box>
  </Box>
);

function autofocusLastCharacter(e: ChangeEvent<HTMLTextAreaElement>) {
  const val = e.target.value;
  e.target.value = "";
  e.target.value = val;
}
