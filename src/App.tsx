import PanelRouter from "PanelRouter"
import { useHistory } from "react-router"
import {
  AppBar,
  Button,
  Container,
  CssBaseline,
  Typography,
} from "@mui/material"

function App() {
  const history = useHistory()
  return (
    <>
      <CssBaseline />
      <AppBar>
        <Typography>PSO2:NGS Tools</Typography>
        <Button href="/augment" onClick={() => history.push("/")}>
          Augment
        </Button>
      </AppBar>
      <Container>
        <PanelRouter />
      </Container>
    </>
  )
}

export default App
