import {
  Button,
  Modal,
  ModalDialog,
  DialogActions,
  type ModalProps,
} from "@mui/joy";
import type { ReactNode } from "react";

type SimpleDialogProps = {
  onConfirm: () => void;
  onClose: () => void;
  text?: string;
  type: "warning" | "confirm";
  children: ReactNode;
} & Omit<ModalProps, "children" | "onClose">;

export const SimpleDialog = ({
  type,
  onConfirm,
  onClose,
  children,
  ...props
}: SimpleDialogProps) => {
  const isWarning = type === "warning";
  return (
    <Modal onClose={onClose} role={isWarning ? "alertdialog" : ""} {...props}>
      <ModalDialog>
        {children}
        <DialogActions>
          <Button
            onClick={onConfirm}
            autoFocus
            variant="solid"
            color={isWarning ? "danger" : "primary"}
          >
            Confirm
          </Button>
          <Button onClick={onClose} variant="plain">
            Close
          </Button>
        </DialogActions>
      </ModalDialog>
    </Modal>
  );
};
