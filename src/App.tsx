import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import {
  Box,
  Checkbox,
  Container,
  Divider,
  List,
  ListItemButton,
  Paper,
  Typography,
  styled,
} from "@mui/material";
import { useToggle } from "@uidotdev/usehooks";
import { DragEventHandler, useState } from "react";

const StyledContainer = styled(Container)(({ theme }) => ({
  padding: "24px",
  [theme.breakpoints.up("lg")]: { maxWidth: "95vw" },
}));

function App() {
  return (
    <StyledContainer>
      <Box display="flex" gap="24px" height="100dvh">
        <Paper
          elevation={2}
          sx={{ width: "30%", maxWidth: "450px", p: "24px" }}
        >
          <Box px="12px">
            <Typography fontSize={24} sx={{ textDecoration: "underline" }}>
              Hymn List
            </Typography>
            <Box height="2px" />
            <Typography fontSize={12}>
              Please drag JSON file(s) into this box
            </Typography>
          </Box>
          <Divider sx={{ mt: "24px" }} />
          <MusicList />
        </Paper>
        <Paper elevation={2} sx={{ flex: 1, padding: "24px" }}></Paper>
      </Box>
    </StyledContainer>
  );
}

export default App;

const MusicList = () => {
  const [data] = useState(["144. Wait on God and Trust Him", 2, 3]);
  const [selected, setSelected] = useState(-1);
  const [on, toggle] = useToggle(false);

  function preventDefaults(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
  }

  function handleDrop(e: DragEvent) {
    preventDefaults(e);
    toggle(false);
    const { files } = e.dataTransfer ?? { files: [] as FileList };
    console.log("hanlding drop", files);
    handleFiles(files);
  }

  function handleFiles(files: FileList) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type === "application/json") {
        console.log("File is a JSON file:", file.name);
      } else {
        console.log("File is NOT a JSON file:", file.name);
      }
    }
  }

  return (
    <List
      style={{
        opacity: on ? 0.5 : 1,
        backgroundColor: on ? "rgba(0,0,0,0.1)" : "transparent",
        borderStyle: on ? "dashed" : "none",
        borderRadius: 5,
      }}
      onDragEnter={preventDefaults}
      onDragOver={(e) => {
        preventDefaults(e);
        toggle(true);
      }}
      onDragLeave={(e) => {
        preventDefaults(e);
        toggle(false);
      }}
      onDrop={handleDrop}
    >
      {data.map((item, idx) => (
        <ListItemButton
          key={item}
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
          <Typography>{item}</Typography>
          <Checkbox disabled />
        </ListItemButton>
      ))}
    </List>
  );
};

const useDnd = () => {};
