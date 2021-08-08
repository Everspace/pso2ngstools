import { Item } from "semantic-ui-react"
import { UnitAddBar } from "./AugmentDisplay/UnitAddBar"
import { AugmentStatDisplay } from "./AugmentStatDisplay"
import { Augment } from "./data/augment"
import { augmentImageFromType } from "./images/augment"

interface SingleAugmentDisplayProps {
  augment: Augment
}

export const SingleAugmentDisplay = ({
  augment,
}: SingleAugmentDisplayProps) => {
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
          <UnitAddBar augment={augment} />
        </Item.Extra>
      </Item.Content>
    </Item>
  )
}
