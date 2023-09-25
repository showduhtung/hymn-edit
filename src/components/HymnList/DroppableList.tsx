import type { DragEvent } from "react";
import { List, type ListProps } from "@mui/joy";
import { useToggle } from "@uidotdev/usehooks";
import { withPreventDefaults } from "./utilities";

type DroppableListProps = {
  onDroppedFiles: (files: FileList) => Promise<void>;
} & ListProps;

export const DroppableList = ({
  children,
  onDroppedFiles,
  sx,
  ...props
}: DroppableListProps) => {
  const [isDraggedOver, toggleDraggedOver] = useToggle(false);

  function handleDragState(state: boolean) {
    return () => toggleDraggedOver(state);
  }

  function handleDrop(e: DragEvent<HTMLUListElement>) {
    toggleDraggedOver(false);
    const { files } = e.dataTransfer ?? { files: [] };
    onDroppedFiles(files);
  }

  return (
    <List
      sx={{
        ...sx,
        ...(isDraggedOver ? draggedStyle : {}),
      }}
      onDragEnter={withPreventDefaults()}
      onDragOver={withPreventDefaults(handleDragState(true))}
      onDragLeave={withPreventDefaults(handleDragState(false))}
      onDrop={withPreventDefaults(handleDrop)}
      {...props}
    >
      {children}
    </List>
  );
};

const draggedStyle = {
  opacity: 0.5,
  backgroundColor: "rgba(0,0,0,0.1)",
  borderStyle: "dashed",
};
