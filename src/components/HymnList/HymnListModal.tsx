import {
  Box,
  DialogContent,
  DialogTitle,
  Modal,
  ModalDialog,
  ModalClose,
  type ModalProps,
  List,
  Input,
  ListItemButton,
  Divider,
  Button,
} from "@mui/joy";
import { Fragment, useEffect, useState } from "react";
import { hymnFileNames } from "../../constants";
import { HymnFileType } from "../../types";
import { FiCheck } from "react-icons/fi";

export const HymnListModal = (props: Omit<ModalProps, "children">) => {
  const [selectedFiles, setSelectedFiles] = useState<number[]>([]);
  const [hymns, setHymns] = useState<HymnFileType[]>([]);
  const [input, setInput] = useState<string>("");

  useEffect(() => {
    async function getHymns() {
      const responses = await Promise.all(
        hymnFileNames.map((fileName) => fetch(`data/hymns/en/${fileName}`))
      );
      const data = (await Promise.all(
        responses.map((response) => response.json())
      )) as HymnFileType[];
      setHymns(data);
    }
    getHymns();
  }, []);

  function handleClick(idx: number) {
    return () => {
      const newState = selectedFiles.includes(idx)
        ? selectedFiles.filter((i) => i !== idx)
        : [...selectedFiles, idx];
      setSelectedFiles(newState.sort((a, b) => a - b));
    };
  }

  function handleSubmit() {}
  const filteredHymns = hymns.filter(({ num, title }) => {
    if (!input) return true;
    const filter = input.toLowerCase().replaceAll(".", "");

    // Check if the filter matches a pattern like "1A", "2B", ..., "525A", "525B"
    const numPattern = /^[1-9][0-9]*[ABab]$/;
    if (numPattern.test(filter)) {
      // Extract the number and letter from the filter
      const number = parseInt(filter);
      const letter = filter.slice(-1).toUpperCase();

      // Check if the hymn's num matches the number and letter
      return num === `${number}${letter}`;
    }

    // If it doesn't match the number-letter pattern, filter by input
    return title.toLowerCase().includes(filter);
  });

  return (
    <Modal
      {...props}
      hideBackdrop
      style={{ pointerEvents: "none" }} // Enable pointer events for the modal content
    >
      <ModalDialog style={{ pointerEvents: "auto" }}>
        <ModalClose />
        <DialogTitle>Very Long List of Hymns</DialogTitle>
        <DialogContent sx={{ paddingRight: "24px" }}>
          <Box display="flex" justifyContent="space-between">
            <Input
              sx={{ width: "60%" }}
              onChange={(e) => setInput(e.target.value)}
            />
            <Button
              variant="soft"
              disabled={!selectedFiles.length}
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </Box>
          <Box height="8px" />
          <List>
            {selectedFiles.map((idx) => {
              const hymn = hymns[idx];
              return (
                <ListItemButton
                  key={hymn.title}
                  sx={{
                    borderRadius: 3,
                    mb: "4px",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                  onClick={handleClick(idx)}
                >
                  {hymn.num + ". " + hymn.title}
                  <FiCheck />
                </ListItemButton>
              );
            })}
          </List>
          <Divider />
          <List>
            {filteredHymns.map((hymn, idx) => {
              if (selectedFiles.includes(idx))
                return <Fragment key={hymn.title + idx}></Fragment>;
              return (
                <ListItemButton
                  key={hymn.title + idx}
                  sx={{ borderRadius: 3, mb: "4px" }}
                  onClick={handleClick(idx)}
                >
                  {hymn.num + ". " + hymn.title}
                </ListItemButton>
              );
            })}
          </List>
        </DialogContent>
      </ModalDialog>
    </Modal>
  );
};
