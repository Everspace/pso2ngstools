import PanelRouter from "PanelRouter"
import { useNavigate } from "react-router"
import {
  AppBar,
  Button,
  Toolbar,
  Container,
  Typography,
  Box,
} from "@mui/material"

function App() {
  const navigate = useNavigate()
  return (
    <>
      <AppBar position="static" sx={{ mb: 2 }}>
        <Toolbar>
          <Typography variant="h6" component="div">
            <Button
              size="large"
              color="inherit"
              href="/"
              onClick={() => navigate("/")}
            >
              PSO2:NGS Tools
            </Button>
          </Typography>
        </Toolbar>
      </AppBar>
      <main>
        <Box
          sx={{
            bgcolor: "background.paper",
          }}
        >
          <Container maxWidth="xl">
            <PanelRouter />
          </Container>
        </Box>
      </main>
    </>
  )
}

export default App
