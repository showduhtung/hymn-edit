import type { ElementRef, MouseEvent, ReactNode } from "react";
import {
  Typography,
  ListItemButton,
  type ListItemButtonProps,
  IconButton,
  Box,
} from "@mui/joy";
import { FiCheck, FiDownload, FiTrash } from "react-icons/fi";
import { useHover, useToggle } from "@uidotdev/usehooks";

import type { EditingHymnType, HymnStatus } from "~/types";
import { SimpleDialog } from "~/ui";

type ListItemProps = {
  data: EditingHymnType;
  onDelete: () => void;
  onDownload: () => void;
} & ListItemButtonProps;

export const ListItem = ({
  onDownload,
  onDelete,
  data,
  sx,
  ...props
}: ListItemProps) => {
  const { title, status, num } = data;
  const [ref, hovering] = useHover<ElementRef<"div">>();

  const [isDeleting, toggleDeleting] = useToggle();

  function handleDeleteClicked(e: MouseEvent<HTMLAnchorElement>) {
    e.stopPropagation();
    toggleDeleting();
  }

  return (
    <>
      <SimpleDialog
        open={isDeleting}
        onClose={() => toggleDeleting()}
        onConfirm={onDelete}
        type="warning"
      >
        Are you sure you want to delete this hymn?
      </SimpleDialog>
      <ListItemButton
        ref={ref}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          borderRadius: 3,
          alignItems: "center",
          mb: "4px",
          minHeight: "48px",
          ...sx,
        }}
        color="primary"
        {...props}
      >
        <Typography maxWidth="80%">{`${num}. ${title}`}</Typography>
        {props.selected && hovering ? (
          <Box display="flex" gap="4px">
            <IconButton
              sx={{ borderRadius: 3 }}
              color="primary"
              onClick={onDownload}
              disabled={status !== "completed"}
            >
              <FiDownload size="14" />
            </IconButton>
            <IconButton
              sx={{ borderRadius: 3 }}
              color="danger"
              onClick={handleDeleteClicked}
            >
              <FiTrash size="14" />
            </IconButton>
          </Box>
        ) : (
          <Typography color="primary">{statusIcon[status]}</Typography>
        )}
      </ListItemButton>
    </>
  );
};

const statusIcon: Record<HymnStatus, string | ReactNode> = {
  "not-started": "",
  "in-progress": "\u{1F6A7}",
  completed: <FiCheck />,
};
