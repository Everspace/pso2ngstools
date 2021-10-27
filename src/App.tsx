import PanelRouter from "PanelRouter"
import { useHistory } from "react-router"
import {
  AppBar,
  Button,
  Toolbar,
  Container,
  Typography,
  Box,
} from "@mui/material"

function App() {
  const history = useHistory()
  return (
    <>
      <AppBar position="absolute">
        <Toolbar>
          <Typography variant="h6" component="div">
            PSO2:NGS Tools
          </Typography>
          <Button
            color="inherit"
            href="/augment"
            onClick={() => history.push("/")}
          >
            Augment
          </Button>
        </Toolbar>
      </AppBar>
      <main>
        <Box
          sx={{
            bgcolor: "background.paper",
            pt: 10,
            pb: 6,
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
