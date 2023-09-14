import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import {
  Box,
  Container,
  Divider,
  Paper,
  Typography,
  styled,
} from "@mui/material";
import { MusicList } from "./components";

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
          <Divider sx={{ mt: "24px", mb: "8px" }} />
          <MusicList />
        </Paper>
        <Paper elevation={2} sx={{ flex: 1, padding: "24px" }}></Paper>
      </Box>
    </StyledContainer>
  );
}

export default App;
