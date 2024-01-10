import { type LocalHymnsState, type EditingHymnType } from "~/types";
import { type ReactNode, useState } from "react";
import { DroppableList } from "~/ui";
import { readFileAsync } from "../utilities";
import { useLocalStorage } from "@uidotdev/usehooks";
import { DragConfirmationDialog } from ".";

const defaultState = {
  hymns: [] as EditingHymnType[],
  selectedHymnIdx: -1,
};

type DraggableContainerProps = {
  children: ReactNode;
  onImport: (hymns: EditingHymnType[]) => void;
};

export function DraggableContainer({
  children,
  onImport,
}: DraggableContainerProps) {
  const [filesToBeConfirmed, setFilesToBeConfirmed] = useState<
    EditingHymnType[]
  >([]);
  const [localState = defaultState] =
    useLocalStorage<LocalHymnsState>("editing-hymns");
  const { hymns } = localState;

  async function handleDroppedFiles(files: FileList) {
    const possibleFiles: EditingHymnType[] = await Promise.all(
      Array.from(files)
        .filter((file) => file.type === "application/json")
        .map(readFileAsync)
    );

    if (possibleFiles.length === 0) return;

    const possibleHymns = possibleFiles.map((item) => {
      const verses = item.verses.map((verse) => ({
        ...verse,
        updatedHtml: verse.html,
      }));
      return { ...item, verses, status: "not-started" as const };
    });

    setFilesToBeConfirmed(possibleHymns);
  }

  function handleCloseDialog() {
    return () => setFilesToBeConfirmed([]);
  }

  function handleConfirm(selectedHymns: EditingHymnType[]) {
    setFilesToBeConfirmed([]);
    onImport(selectedHymns);
  }

  const combinedFiles = filesToBeConfirmed.reduce(
    (acc: EditingHymnType[], curr) => {
      const doesHymnExist = hymns.find((hymn) => hymn.num === curr.num);
      return doesHymnExist ? acc : [...acc, curr];
    },
    hymns
  );
  return (
    <>
      <DroppableList
        onDroppedFiles={handleDroppedFiles}
        sx={{ borderRadius: 3, minHeight: 300 }}
      >
        {children}
      </DroppableList>
      {filesToBeConfirmed.length > 0 && (
        <DragConfirmationDialog
          open
          data={combinedFiles}
          onClose={handleCloseDialog}
          onConfirm={handleConfirm}
        />
      )}
    </>
  );
}
