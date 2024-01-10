import { Box, Typography, Button } from "@mui/joy";
import { useToggle } from "@uidotdev/usehooks";
import { FiDownload, FiPlus } from "react-icons/fi";

import type { EditingHymnType } from "~/types";
import { HymnsImports } from ".";

type HymnListActionsProps = {
  hymns: EditingHymnType[];
  onImport: (hymns: EditingHymnType[]) => void;
  onDownload: (hymns: EditingHymnType[]) => void;
};

export function HymnListActions({
  hymns,
  onImport,
  onDownload,
}: HymnListActionsProps) {
  const [isHymnListModalOpen, toggleModal] = useToggle(false);

  return (
    <>
      <Box
        px="12px"
        display="flex"
        justifyContent="space-between"
        gap="4px"
        alignItems="center"
      >
        <Typography fontSize={16} sx={{ textDecoration: "underline" }}>
          Hymn List
        </Typography>
        <Box display="flex" gap="8px">
          <Button
            variant="soft"
            startDecorator={<FiPlus size="12" />}
            onClick={() => toggleModal()}
            sx={{ fontSize: 10, p: 1 }}
          >
            Import
          </Button>
          <Button
            variant="soft"
            startDecorator={<FiDownload size="12" />}
            disabled={!hymns.find((hymn) => hymn.status === "completed")}
            onClick={() => onDownload(hymns)}
            sx={{ fontSize: 10, p: 1 }}
          >
            Download
          </Button>
        </Box>
      </Box>
      <HymnsImports
        onClose={toggleModal}
        open={isHymnListModalOpen}
        onSubmit={(importedHymns: EditingHymnType[]) => {
          toggleModal();
          onImport(importedHymns);
        }}
        initialHymns={hymns}
      />
    </>
  );
}
