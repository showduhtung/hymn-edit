import { useEffect, useState } from "react";
import {
  Box,
  Button,
  DialogActions,
  Modal,
  ModalDialog,
  Stack,
  type StackProps,
} from "@mui/joy";
import { useLocalStorage, useToggle } from "@uidotdev/usehooks";

import type { EditingHymnType, LocalHymnsState } from "../../types";
import { IndividualVerseForm, ControlBar } from ".";
import { joinByBreakLine, splitByBreakLine } from "./utilities";
import { FiCheck, FiRefreshCw } from "react-icons/fi";
import { unsaved } from "../../constants/colors";

const defaultState = { hymns: [] as EditingHymnType[], selectedHymnIdx: -1 };

export const HymnForm = (props: StackProps) => {
  const [selectedVerseIdx, setSelectedVerseIdx] = useState<number>(0);
  const [localState = defaultState, saveToLocalStorage] =
    useLocalStorage<LocalHymnsState>("editing-hymns");

  const { selectedHymnIdx, hymns } = localState;
  const selectedHymn = hymns.find((_, idx) => idx === selectedHymnIdx);

  function handleMarkComplete() {
    if (!selectedHymn) return;

    const hymns = localState.hymns.map((hymn) => {
      if (hymn.title !== selectedHymn.title) return hymn;
      const status =
        hymn.status === "completed"
          ? ("in-progress" as const)
          : ("completed" as const);
      return { ...hymn, status };
    });

    saveToLocalStorage({ ...localState, hymns });
  }

  function handleSave(verseIdx: number) {
    return (updatedContent: string[]) => {
      if (!selectedHymn) return;

      const verses = selectedHymn.verses.map((verse, currIdx) => {
        if (currIdx !== verseIdx) return verse;
        const updatedHtml =
          `<b>${String(currIdx + 1)}</b><br>` + joinByBreakLine(updatedContent);

        return { ...verse, updatedHtml };
      });

      const updatedHymns = hymns.map((hymn) => {
        if (hymn.title !== selectedHymn.title) return hymn;

        const isSameAsOriginal = hymn.verses.every((verse, idx) => {
          const splitOriginal = splitByBreakLine(verse.html);
          const splitUpdated = splitByBreakLine(verses[idx].updatedHtml);
          return splitOriginal.every((line, idx) => line === splitUpdated[idx]);
        });

        return {
          ...hymn,
          verses,
          status: isSameAsOriginal
            ? ("not-started" as const)
            : ("in-progress" as const),
        };
      });

      saveToLocalStorage({ ...localState, hymns: updatedHymns });
    };
  }

  function handleReset() {
    const hymns = localState.hymns.map((hymn, idx) => {
      if (idx !== selectedHymnIdx) return hymn;
      const verses = hymn.verses.map((verse) => {
        return { ...verse, updatedHtml: verse.html };
      });
      return { ...hymn, verses, status: "not-started" as const };
    });
    saveToLocalStorage({ ...localState, hymns });
  }

  useEffect(() => {
    setSelectedVerseIdx(0);
  }, [selectedHymnIdx]);

  const { status } = selectedHymn || { status: "not-started" };

  return (
    <Stack
      spacing="24px"
      maxHeight="100dvh"
      sx={{ overflow: "scroll" }}
      {...props}
    >
      <ControlBar
        value={selectedVerseIdx}
        onChange={setSelectedVerseIdx}
        verses={selectedHymn?.verses || []}
        title={selectedHymn?.title || ""}
      />

      <FormControlBar
        status={status}
        onMark={handleMarkComplete}
        onReset={handleReset}
      />
      {selectedHymn?.verses.map(({ updatedHtml, html }, idx) => {
        const [_, ...content] = splitByBreakLine(updatedHtml);
        const [__, ...originalContent] = splitByBreakLine(html);

        return (
          <Box
            key={String(idx) + content[0]}
            display={idx === selectedVerseIdx ? "block" : "none"}
          >
            <IndividualVerseForm
              savedVerse={content}
              originalVerse={originalContent}
              onSave={handleSave(idx)}
            />
          </Box>
        );
      })}
    </Stack>
  );
};

type HeaderFormActionsProps = {
  status: "not-started" | "in-progress" | "completed";
  onMark: () => void;
  onReset: () => void;
};

const FormControlBar = ({
  status,
  onMark,
  onReset,
}: HeaderFormActionsProps) => {
  const [opened, toggle] = useToggle(false);
  return (
    <>
      <Box display="flex" gap="8px">
        <Button
          variant="soft"
          endDecorator={<FiRefreshCw size="14" />}
          onClick={() => toggle(true)}
          disabled={status === "not-started"}
        >
          Reset all verses
        </Button>
        <Button
          variant="soft"
          onClick={onMark}
          disabled={status === "not-started"}
          endDecorator={
            status === "completed" ? "\u{1F6A7}" : <FiCheck size="14" />
          }
          sx={() => {
            if (status === "in-progress") return {};
            return {
              backgroundColor: unsaved,
              color: "black",
              ":hover": { backgroundColor: "#EFEADA" },
            };
          }}
        >
          Mark as "{status === "completed" ? "in progress" : "complete"}"
        </Button>
      </Box>
      <Modal open={opened} role="alertdialog" onClick={() => toggle(false)}>
        <ModalDialog>
          Are you sure you want to reset this hymn? All saved changes will be
          deleted.
          <DialogActions>
            <Button
              onClick={() => {
                onReset();
                toggle(false);
              }}
              autoFocus
              variant="solid"
              color="danger"
            >
              Confirm
            </Button>
            <Button onClick={() => toggle(false)} variant="plain">
              Close
            </Button>
          </DialogActions>
        </ModalDialog>
      </Modal>
    </>
  );
};
