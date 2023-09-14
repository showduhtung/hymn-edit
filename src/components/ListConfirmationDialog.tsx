import { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemSecondaryAction,
  Typography,
} from "@mui/material";

import { HymnFile } from ".";

type HymnList = HymnFile & { checked: boolean };

export const ListConfirmationDialog = ({
  open,
  data,
  onClose,
  onConfirm,
}: {
  open: boolean;
  data: HymnFile[];
  onClose: (arg: boolean) => () => void;
  onConfirm: (arg: HymnFile[]) => void;
}) => {
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
    <Dialog open={open} sx={{ p: 24 }} onClose={onClose(false)}>
      <DialogTitle>
        Are you sure that you want to accept these files?
      </DialogTitle>
      <DialogContent>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          px="16px"
        >
          <Typography>Select All</Typography>
          <Checkbox checked={isEveryChecked} onChange={handleCheckAll} />
        </Box>
        <List>
          {list.map((item, idx) => (
            <ListItem>
              <Typography fontSize="14px">{`${item.num}. ${item.title}`}</Typography>
              <ListItemSecondaryAction>
                <Checkbox checked={item.checked} onChange={handleCheck(idx)} />
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose(false)}>Close</Button>
        <Button onClick={handleSubmit} autoFocus>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};
