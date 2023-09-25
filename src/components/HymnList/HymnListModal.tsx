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
  Checkbox,
} from "@mui/joy";
import { Fragment, useEffect, useState } from "react";
import { hymnFileNames } from "../../constants";
import { HymnFileType, HymnType } from "../../types";

type HymnListModalProps = Omit<ModalProps, "children" | "onSubmit"> & {
  onSubmit: (hymnFiles: HymnType[]) => void;
  initialHymns: HymnType[];
};

export const HymnListModal = ({
  initialHymns,
  onSubmit,
  ...props
}: HymnListModalProps) => {
  const [selectedIdxs, setSelectedIdxs] = useState<number[]>([]);
  const [hymnFiles, setHymnFiles] = useState<HymnFileType[]>([]);
  const [input, setInput] = useState<string>("");

  useEffect(() => {
    async function getHymns() {
      const responses = await Promise.all(
        hymnFileNames.map((fileName) => fetch(`data/hymns/en/${fileName}`))
      );
      const data = (await Promise.all(
        responses.map((response) => response.json())
      )) as HymnFileType[];
      setHymnFiles(data);
      setSelectedIdxs(
        initialHymns.map((hymn) =>
          data.findIndex((item) => item.num === hymn.num)
        )
      );
    }
    getHymns();
  }, [initialHymns]);

  function handleClick(idx: number) {
    return () => {
      const newState = selectedIdxs.includes(idx)
        ? selectedIdxs.filter((i) => i !== idx)
        : [...selectedIdxs, idx];
      setSelectedIdxs(newState.sort((a, b) => a - b));
    };
  }

  function handleSubmit() {
    const selectedHymns = selectedIdxs.map((idx) => {
      const selectedHymn = hymnFiles[idx];
      const initialHymn = initialHymns.find(
        (hymn) => hymn.num === selectedHymn.num
      );

      const moldedSelectedHymn = {
        ...selectedHymn,
        verses: selectedHymn.verses.map((verse) => ({
          ...verse,
          updatedHtml: verse.html,
        })),
        status: "not-started" as const,
      };

      return initialHymn || moldedSelectedHymn;
    });

    onSubmit(selectedHymns);
  }

  const filteredHymns = hymnFiles.filter(({ num, title }) => {
    if (!input) return true;
    const fullTitle = `${num}. ${title}`.toLowerCase();
    return fullTitle.includes(input.toLowerCase());
  });

  return (
    <Modal {...props}>
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
              disabled={!selectedIdxs.length}
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </Box>
          <Box height="8px" />
          <List>
            {selectedIdxs.map((idx) => {
              const hymn = hymnFiles[idx];
              return (
                <ListItemButton
                  key={hymn.title}
                  sx={{
                    borderRadius: 3,
                    mb: "4px",
                    display: "flex",
                    gap: "12px",
                  }}
                  onClick={handleClick(idx)}
                >
                  <Checkbox checked />
                  {hymn.num + ". " + hymn.title}
                </ListItemButton>
              );
            })}
          </List>
          <Divider />
          <List>
            {filteredHymns.map((hymn, idx) => {
              if (selectedIdxs.includes(idx))
                return <Fragment key={hymn.title + idx}></Fragment>;
              return (
                <ListItemButton
                  key={hymn.title + idx}
                  sx={{
                    borderRadius: 3,
                    mb: "4px",
                    display: "flex",
                    gap: "12px",
                  }}
                  onClick={handleClick(idx)}
                >
                  <Checkbox />
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
