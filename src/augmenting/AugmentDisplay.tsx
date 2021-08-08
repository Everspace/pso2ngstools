import { Button, ButtonGroup, Item } from "semantic-ui-react"
import { AugmentStatDisplay } from "./AugmentStatDisplay"
import { Augment } from "./data/augment"
import { augmentImageFromType } from "./images/augment"
import { useAugmentable } from "./state"

interface AugmentDisplayProps {
  augment: Augment
}

export const AugmentDisplay = ({ augment }: AugmentDisplayProps) => {
  const { addAugment: addToWeapon } = useAugmentable("weapon")
  const { addAugment: addToUnit1 } = useAugmentable("unit1")
  const { addAugment: addToUnit2 } = useAugmentable("unit2")
  const { addAugment: addToUnit3 } = useAugmentable("unit3")

  const icon = augmentImageFromType[augment.icon]

  return (
    <Item>
      <Item.Image wrapped size="tiny" src={icon} />
      <Item.Content>
        <Item.Header>{augment.name}</Item.Header>
        <Item.Description>
          <AugmentStatDisplay stat={augment.stat} />
        </Item.Description>
        <Item.Extra>
          <ButtonGroup compact>
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
