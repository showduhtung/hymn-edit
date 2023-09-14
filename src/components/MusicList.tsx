import { DragEvent, useState } from "react";
import { Checkbox, List, ListItemButton, Typography } from "@mui/material";
import { useToggle } from "@uidotdev/usehooks";
import { ListConfirmationDialog } from "./ListConfirmationDialog";

export type HymnFile = {
  lang: "en";
  num: string;
  title: string;
  verses: VerseType[];
};

type VerseType = {
  label: string;
  num: number;
  html: string;
};

function withPreventDefaults(fn?: (e: DragEvent<HTMLUListElement>) => void) {
  // stops the UI from opening files into the browser window
  return (e: DragEvent<HTMLUListElement>) => {
    e.preventDefault();
    e.stopPropagation();
    fn?.(e);
  };
}

function readFileAsync(file: File): Promise<HymnFile> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        resolve(data);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => reject(new Error("Error reading the file"));

    reader.readAsText(file);
  });
}

export const MusicList = () => {
  const [selected, setSelected] = useState(-1);
  const [isDraggedOver, toggleDraggedOver] = useToggle(false);
  const [isConfirming, toggleConfirmation] = useToggle(false);
  const [files, setFiles] = useState<HymnFile[]>([]);

  function handleDrop(e: DragEvent<HTMLUListElement>) {
    toggleDraggedOver(false);
    const { files } = e.dataTransfer ?? { files: [] };
    handleFiles(files);
  }

  async function handleFiles(files: FileList) {
    const possibleFiles: HymnFile[] = await Promise.all(
      Array.from(files)
        .filter((file) => file.type === "application/json")
        .map((file) => readFileAsync(file))
    );

    if (possibleFiles.length > 0) {
      setFiles(possibleFiles);
      toggleConfirmation(true);
    }
  }

  function handleDragState(state: boolean) {
    return () => toggleDraggedOver(state);
  }

  function handleCloseDialog(state: boolean) {
    return () => toggleConfirmation(state);
  }

  function handleConfirm(selectedHymns: HymnFile[]) {
    setFiles(selectedHymns);
    toggleConfirmation(false);
  }

  const displayFiles = isConfirming ? [] : files;

  return (
    <>
      {/* need to use the ternary to force mount/unmount */}
      {isConfirming && (
        <ListConfirmationDialog
          open={isConfirming}
          data={files}
          onClose={handleCloseDialog}
          onConfirm={handleConfirm}
        />
      )}
      <List
        sx={{
          opacity: isDraggedOver ? 0.5 : 1,
          backgroundColor: isDraggedOver ? "rgba(0,0,0,0.1)" : "transparent",
          borderStyle: isDraggedOver ? "dashed" : "none",
          borderRadius: 3,
          minHeight: 300,
        }}
        onDragEnter={withPreventDefaults()}
        onDragOver={withPreventDefaults(handleDragState(true))}
        onDragLeave={withPreventDefaults(handleDragState(false))}
        onDrop={withPreventDefaults(handleDrop)}
      >
        {displayFiles.map((item, idx) => (
          <ListItemButton
            key={item.title}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              borderRadius: 2,
              ":hover": { backgroundColor: "transparent" },
            }}
            onClick={() => setSelected(idx)}
            selected={selected === idx}
            disableRipple
          >
            <Typography>{`${item.num}. ${item.title}`}</Typography>
            <Checkbox disabled />
          </ListItemButton>
        ))}
      </List>
    </>
  );
};
