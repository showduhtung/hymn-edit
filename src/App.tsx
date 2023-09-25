import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "@fontsource/inter";

import { Paper } from "@mui/material";
import { Box, styled, Container } from "@mui/joy";
import { HymnForm, HymnList } from "./features";

const StyledContainer = styled(Container)(({ theme }) => ({
  padding: "24px",
  [theme.breakpoints.up("lg")]: {
    maxWidth: "95vw",
  },
}));

function App() {
  return (
    <StyledContainer>
      <Box display="flex" gap="24px" maxWidth="100%">
        <Paper sx={{ flexBasis: "30%", flexGrow: 0, flexShrink: 0 }}>
          <HymnList />
        </Paper>
        <Paper elevation={2} sx={{ flexGrow: 1, padding: "24px", h: "100%" }}>
          <HymnForm />
        </Paper>
      </Box>
    </StyledContainer>
  );
}

export default App;
