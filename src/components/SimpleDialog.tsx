import {
  Button,
  Modal,
  ModalDialog,
  DialogActions,
  type ModalProps,
} from "@mui/joy";

type SimpleDialogProps = {
  onConfirm: () => void;
  onClose: () => void;
  open: boolean;
  text?: string;
  type: "warning" | "confirm";
  children: string;
} & Omit<ModalProps, "children">;

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
