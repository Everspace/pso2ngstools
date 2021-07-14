import "semantic-ui-css/semantic.min.css"
import { Container, Menu } from "semantic-ui-react"
import PanelRouter from "PanelRouter"
import { useHistory } from "react-router"

function App() {
  const history = useHistory()
  return (
    <>
      <Menu fixed="top" inverted>
        <Container>
          <Menu.Item header>PSO2:NGS Tools</Menu.Item>
          <Menu.Item as="a" link onClick={() => history.push("/augment")}>
            Augments
          </Menu.Item>
        </Container>
      </Menu>
      <Container style={{ marginTop: "4em" }}>
        <PanelRouter />
      </Container>
    </>
  )
}

export default App
