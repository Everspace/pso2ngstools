import { useAtom } from "jotai"
import { Button, ButtonGroup, Item } from "semantic-ui-react"
import { Augment } from "./data/augment"
import { augmentImageFromType } from "./images/augment"
import {
  addUnit1AugmentAtom,
  addUnit2AugmentAtom,
  addUnit3AugmentAtom,
  addWeaponAugmentAtom,
} from "./state"

interface AugmentDisplay {
  augment: Augment
}
export const AugmentDisplay = ({ augment }: AugmentDisplay) => {
  const [, addToWeapon] = useAtom(addWeaponAugmentAtom)
  const [, addToUnit1] = useAtom(addUnit1AugmentAtom)
  const [, addToUnit2] = useAtom(addUnit2AugmentAtom)
  const [, addToUnit3] = useAtom(addUnit3AugmentAtom)

  const icon = augmentImageFromType[augment.icon]

  return (
    <Item>
      <Item.Image size="tiny" src={icon} />
      <Item.Content>
        <Item.Header>{augment.name}</Item.Header>
        <Item.Description>
          <pre>{JSON.stringify(augment.stat)}</pre>
        </Item.Description>
        <Item.Extra>
          <ButtonGroup>
            <Button onClick={() => addToWeapon(augment)}>Weapon</Button>
            <Button onClick={() => addToUnit1(augment)}>Unit1</Button>
            <Button onClick={() => addToUnit2(augment)}>Unit2</Button>
            <Button onClick={() => addToUnit3(augment)}>Unit3</Button>
            <Button
              color="blue"
              onClick={() => {
                addToWeapon(augment)
                addToUnit1(augment)
                addToUnit2(augment)
                addToUnit3(augment)
              }}
            >
              All
            </Button>
          </ButtonGroup>
        </Item.Extra>
      </Item.Content>
    </Item>
  )
}
