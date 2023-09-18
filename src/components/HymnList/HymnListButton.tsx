import type { ElementRef, MouseEvent } from "react";
import {
  Typography,
  ListItemButton,
  type ListItemButtonProps,
  IconButton,
  Box,
} from "@mui/joy";
import { FiCheck, FiDownload, FiTrash } from "react-icons/fi";
import { useHover, useToggle } from "@uidotdev/usehooks";

import { HymnType } from "../../types";
import { DeleteWarningDialog } from "./DeleteWarningDialog";

type HymnListButtonProps = {
  data: HymnType;
  onDelete: () => void;
  onDownload: () => void;
} & ListItemButtonProps;

export const HymnListButton = ({
  onDownload,
  onDelete,
  selected,
  data,
  sx,
  ...props
}: HymnListButtonProps) => {
  const { title, status, num } = data;
  const [ref, hovering] = useHover<ElementRef<"div">>();

  const [isDeleting, toggleDeleting] = useToggle();

  function handleDeleteClicked(e: MouseEvent<HTMLAnchorElement>) {
    e.stopPropagation();
    toggleDeleting();
  }

  return (
    <>
      <DeleteWarningDialog
        open={isDeleting}
        onClose={() => toggleDeleting()}
        onConfirm={onDelete}
      />
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
        selected={selected}
        color="primary"
        {...props}
      >
        <Typography maxWidth="80%">{`${num}. ${title}`}</Typography>
        {selected && hovering ? (
          <Box display="flex" gap="4px">
            <IconButton
              sx={{ borderRadius: 3 }}
              color="primary"
              onClick={onDownload}
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

const statusIcon = {
  "not-started": "",
  "in-progress": "\u{1F6A7}",
  completed: <FiCheck />,
};
