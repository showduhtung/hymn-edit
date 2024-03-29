import { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Checkbox,
  List,
  ListItem,
  Modal,
  ModalDialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  type ModalProps,
} from "@mui/joy";
import type { EditingHymnType } from "~/types";

type HymnList = EditingHymnType & { checked: boolean };
type DragConfirmationDialogProps = {
  open: boolean;
  data: EditingHymnType[];
  onClose: (arg: boolean) => () => void;
  onConfirm: (arg: EditingHymnType[]) => void;
} & Omit<ModalProps, "children">;

export const DragConfirmationDialog = ({
  open,
  data,
  onClose,
  onConfirm,
  ...props
}: DragConfirmationDialogProps) => {
  const [list, setList] = useState<HymnList[]>(
    data.map((item) => ({ ...item, checked: true }))
  );

  const isEveryChecked = list.every(({ checked }) => checked);

  function handleCheck(currIdx: number) {
    return () => {
      const newList = list.map((item, idx) => {
        if (currIdx !== idx) return item;
        return { ...item, checked: !item.checked };
      });
      setList(newList);
    };
  }

  function handleCheckAll() {
    setList(list.map((item) => ({ ...item, checked: !isEveryChecked })));
  }

  function handleSubmit() {
    onConfirm(
      list
        .filter(({ checked }) => checked)
        .map(({ checked: _checked, ...rest }) => rest)
    );
  }

  return (
    <Modal open={open} onClose={onClose(false)} {...props}>
      <ModalDialog>
        <DialogTitle>Please select all files intended for review.</DialogTitle>

        <Box height="8px" />
        <DialogContent>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            pl="16px"
            pr="6px"
          >
            <Typography>Select All</Typography>
            <Checkbox checked={isEveryChecked} onChange={handleCheckAll} />
          </Box>
          <List>
            {list.map((item, idx) => (
              <ListItem
                key={item.title}
                endAction={
                  <Checkbox
                    checked={item.checked}
                    onChange={handleCheck(idx)}
                  />
                }
              >
                <Typography fontSize="14px">{`${item.num}. ${item.title}`}</Typography>
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSubmit} autoFocus variant="soft">
            Confirm
          </Button>
          <Button onClick={onClose(false)} variant="plain">
            Close
          </Button>
        </DialogActions>
      </ModalDialog>
    </Modal>
  );
};
