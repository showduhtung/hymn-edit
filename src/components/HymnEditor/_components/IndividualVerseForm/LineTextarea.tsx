import { IconButton, Textarea, type TextareaProps } from "@mui/joy";
import { FiRefreshCw, FiRotateCcw, FiSave } from "react-icons/fi";
import type { Theme } from "@mui/joy/styles/types";

import { autofocusLastCharacter } from "../../utilities";

type LineTextareaProps = {
  isError: boolean;
  bgColor: string;
  onSave: () => void;
  onReset: () => void;
  onUndo: () => void;
  isSavedDisabled: boolean;
  isResetDisabled: boolean;
} & TextareaProps;

// can offset more of the parent form business logic into textarea component

export const LineTextarea = ({
  isError,
  bgColor,
  onSave,
  onReset,
  onUndo,
  isSavedDisabled,
  isResetDisabled,
  ...props
}: LineTextareaProps) => {
  const style = ({ palette }: Theme) => {
    const { danger } = palette;
    if (isError)
      return {
        backgroundColor: `${danger[100]}`,
        border: `1px solid ${danger[500]}`,
      };
    return { backgroundColor: bgColor };
  };
  return (
    <Textarea
      variant="soft"
      sx={style}
      onFocus={autofocusLastCharacter}
      endDecorator={
        <>
          <IconButton
            onClick={onSave}
            sx={{ borderRadius: 3 }}
            color="primary"
            disabled={isSavedDisabled}
          >
            <FiSave size="14" />
          </IconButton>
          <IconButton
            onClick={onReset}
            sx={{ borderRadius: 3 }}
            color="primary"
            disabled={isResetDisabled}
          >
            <FiRefreshCw size="14" />
          </IconButton>
          <IconButton
            onClick={onUndo}
            sx={{ borderRadius: 3 }}
            color="primary"
            disabled={isSavedDisabled}
          >
            <FiRotateCcw size="14" />
          </IconButton>
        </>
      }
      {...props}
    />
  );
};
