import { useState } from "react"
import { Button, Icon, Input, Item, Tab } from "semantic-ui-react"
import { AugmentDisplay } from "./AugmentDisplay"
import { allAugmentCategories, allAugments } from "./data/augment"

type Pane = {
  menuItem?: any
  render?: (() => React.ReactNode) | undefined
}

const CategoryPane = ({ category }: { category: string }) => {
  const [search, setSearch] = useState<null | string>(null)
  return (
    <Tab.Pane>
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
      <Item.Group>
        {allAugments
          .filter((a) => a.category === category)
          .filter((a) => {
            if (!search) return true
            return a.name.indexOf(search) > -1
          })
          .map((a) => (
            <AugmentDisplay key={a.name} augment={a} />
          ))}
      </Item.Group>
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
