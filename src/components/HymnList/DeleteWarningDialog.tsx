import {
  Button,
  Modal,
  ModalDialog,
  DialogActions,
  type ModalProps,
} from "@mui/joy";

type DeleteWarningDialogProps = {
  onConfirm: () => void;
  onClose: () => void;
  open: boolean;
} & Omit<ModalProps, "children">;

export const DeleteWarningDialog = ({
  onConfirm,
  onClose,
  ...props
}: DeleteWarningDialogProps) => {
  return (
    <Modal onClose={onClose} role="alertdialog" {...props}>
      <ModalDialog>
        Are you sure you want to delete this hymn?
        <DialogActions>
          <Button onClick={onConfirm} autoFocus variant="solid" color="danger">
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
