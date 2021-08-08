import { groupBy } from "lodash"
import { useState } from "react"
import { Button, Container, Icon, Input, Item, Tab } from "semantic-ui-react"
import { SingleAugmentDisplay } from "./SingleAugmentDisplay"
import {
  allAugmentCategories,
  Augment,
  augmentByCategory,
  AugmentCategory,
} from "./data/augment"

type Pane = {
  menuItem?: any
  render?: (() => React.ReactNode) | undefined
}

const CategoryPane = ({ category }: { category: AugmentCategory }) => {
  const [search, setSearch] = useState<null | string>(null)
  const groups = groupBy(augmentByCategory[category], (a) =>
    a.baseName ? "base" : "noBase",
  )

  const base = groups["base"]
  const noBase: Augment[] | undefined = groups["noBase"]

  const baseGroups = groupBy(base, (a) => a.baseName)

  const filterate = (a: Augment) => {
    if (!search) return true
    return a.name.indexOf(search) > -1
  }

  return (
    <Tab.Pane>
      <Container>
        <Input
          action
          value={search ?? ""}
          icon="search"
          iconPosition="left"
          placeholder="Search..."
          onChange={(e) => setSearch(e.target.value)}
        >
          <Icon name="search" />
          <input />
          <Button
            icon="cancel"
            onClick={() => {
              setSearch(null)
            }}
          />
        </Input>
      </Container>
      <Container>
        <Item.Group relaxed="very" unstackable>
          {noBase
            ? noBase
                .filter(filterate)
                .map((a) => <SingleAugmentDisplay key={a.name} augment={a} />)
            : null}
        </Item.Group>
      </Container>
    </Tab.Pane>
  )
}

const panes: Pane[] = allAugmentCategories.map((category) => ({
  menuItem: category,
  render: () => <CategoryPane category={category} />,
}))

export const AugmentCategoryDisplay = () => {
  return <Tab panes={panes} />
}
