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
import type { HymnFileType, EditingHymnType } from "../../types";

type HymnListModalProps = Omit<ModalProps, "children" | "onSubmit"> & {
  onSubmit: (hymnFiles: EditingHymnType[]) => void;
  initialHymns: EditingHymnType[];
};

export const HymnListModal = ({
  initialHymns,
  onSubmit,
  onClose,
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
    resetState();
  }

  function handleClose(
    event = {},
    reason: "backdropClick" | "escapeKeyDown" | "closeClick"
  ) {
    if (reason !== "closeClick") return;
    onClose?.(event, reason);
    resetState();
  }

  function resetState() {
    setSelectedIdxs([]);
    setInput("");
  }

  const isSubmitDisabled = (() => {
    if (!selectedIdxs.length) return true;

    const isSameAsInitial = selectedIdxs.every((idx) =>
      Boolean(initialHymns.find((hymn) => hymn.num === hymnFiles[idx].num))
    );
    return isSameAsInitial && selectedIdxs.length === initialHymns.length;
  })();

  const shouldHide = (
    { num, title }: { num: string; title: string },
    idx: number
  ) => {
    const fullTitle = `${num}. ${title}`.toLowerCase();

    const isAlreadySelected = selectedIdxs.includes(idx);
    const isNotPartOfFilter = input && !fullTitle.includes(input.toLowerCase());
    return isAlreadySelected || isNotPartOfFilter;
  };

  return (
    <Modal {...props} onClose={handleClose}>
      <ModalDialog minWidth="500px">
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
              disabled={isSubmitDisabled}
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </Box>
          <Box height="8px" />
          <List>
            {selectedIdxs.map((idx) => {
              const { title, num } = hymnFiles[idx];
              return (
                <ListItemButton
                  key={title}
                  sx={{
                    borderRadius: 3,
                    mb: "4px",
                    display: "flex",
                    gap: "12px",
                  }}
                  onClick={handleClick(idx)}
                >
                  <Checkbox checked />
                  {num + ". " + title}
                </ListItemButton>
              );
            })}
          </List>
          <Divider />
          <List>
            {hymnFiles.map(({ num, title }: HymnFileType, idx: number) => {
              return shouldHide({ num, title }, idx) ? (
                <Fragment key={title + idx}></Fragment>
              ) : (
                <ListItemButton
                  key={title + idx}
                  sx={{
                    borderRadius: 3,
                    mb: "4px",
                    display: "flex",
                    gap: "12px",
                  }}
                  onClick={handleClick(idx)}
                >
                  <Checkbox />
                  {num + ". " + title}
                </ListItemButton>
              );
            })}
          </List>
        </DialogContent>
      </ModalDialog>
    </Modal>
  );
};
