import { Box, Typography, useTheme } from "@mui/joy";
import { FiRefreshCw, FiRotateCcw, FiSave } from "react-icons/fi";

export const IconLegend = () => {
  const theme = useTheme();
  const { neutral } = theme.palette;
  return (
    <Box display="flex" gap="12px">
      <Box display="flex" alignItems="center" gap="4px">
        <FiSave size="14" color={neutral[400]} />
        <Typography textColor={neutral[400]} fontSize="14px">
          Save
        </Typography>
      </Box>
      <Box display="flex" alignItems="center" gap="4px">
        <FiRefreshCw size="14" color={neutral[400]} />
        <Typography fontSize="14px" textColor={neutral[400]}>
          Reset
        </Typography>
      </Box>
      <Box display="flex" alignItems="center" gap="4px">
        <FiRotateCcw size="14" color={neutral[400]} />
        <Typography fontSize="14px" textColor={neutral[400]}>
          Undo
        </Typography>
      </Box>
    </Box>
  );
};
