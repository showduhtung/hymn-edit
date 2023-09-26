import { Box, Button } from "@mui/joy";
import { useToggle } from "@uidotdev/usehooks";

import { FiCheck, FiRefreshCw } from "react-icons/fi";
import { unsaved } from "../../constants/colors";
import { SimpleDialog } from "../../components";

type FormControlBarProps = {
  status: "not-started" | "in-progress" | "completed";
  onMark: () => void;
  onReset: () => void;
};

export const FormControlBar = ({
  status,
  onMark,
  onReset,
}: FormControlBarProps) => {
  const [opened, toggle] = useToggle(false);
  return (
    <>
      <Box display="flex" gap="8px">
        <Button
          variant="soft"
          endDecorator={<FiRefreshCw size="14" />}
          onClick={() => toggle(true)}
          disabled={status === "not-started"}
        >
          Reset all verses
        </Button>
        <Button
          variant="soft"
          onClick={onMark}
          disabled={status === "not-started"}
          endDecorator={
            status === "completed" ? "\u{1F6A7}" : <FiCheck size="14" />
          }
          sx={() => {
            if (status === "in-progress") return {};
            return {
              backgroundColor: unsaved,
              color: "black",
              ":hover": { backgroundColor: "#EFEADA" },
            };
          }}
        >
          Mark as "{status === "completed" ? "in progress" : "complete"}"
        </Button>
      </Box>
      <SimpleDialog
        open={opened}
        onClose={() => toggle(false)}
        type="warning"
        onConfirm={() => {
          onReset();
          toggle(false);
        }}
      >
        Are you sure you want to reset this hymn? All saved changes will be
        deleted.
      </SimpleDialog>
    </>
  );
};
