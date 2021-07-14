import "semantic-ui-css/semantic.min.css"
import { AugmentPanel } from "augmenting/AugmentApp"
import { Container, Header, Menu } from "semantic-ui-react"

function App() {
  return (
    <>
      <Menu fixed="top" inverted>
        <Container>
          <Menu.Item header>PSO2:NGS Tools</Menu.Item>
          <Menu.Item as="a">Augments</Menu.Item>
        </Container>
      </Menu>
      <Container style={{ marginTop: "4em" }}>
        <Header as="h1">Augmenting</Header>
        <AugmentPanel />
      </Container>
    </>
  )
}

export default App
