import { atom, useAtom } from "jotai"
import { atomFamily } from "jotai/utils"
import { Button, ButtonGroup, Item } from "semantic-ui-react"
import { UnitAddBar } from "./AugmentDisplay/UnitAddBar"
import { AugmentStatDisplay } from "./AugmentStatDisplay"
import { Augment, augmentByBasename } from "./data/augment"
import { augmentImageFromType } from "./images/augment"

interface MultiAugmentDisplayProps {
  group: string
  augments: Augment[]
}

const groupAugmentFamilyAtom = atomFamily((baseName: string) =>
  atom(augmentByBasename[baseName].length - 1),
)

const tierToRoman = [
  "I",
  "II",
  "III",
  "IV",
  "V",
  "VI",
  "VII",
  "VIII",
  "IX",
  "X",
]

export const MultiAugmentDisplay = ({
  group,
  augments,
}: MultiAugmentDisplayProps) => {
  const [selectedAugment, setSelected] = useAtom(groupAugmentFamilyAtom(group))
  const augment = augments[selectedAugment]

  const icon = augmentImageFromType[augment.icon]

  return (
    <Item>
      <Item.Image wrapped size="tiny" src={icon} />
      <Item.Content>
        <Item.Header>
          {group}{" "}
          <ButtonGroup compact>
            {augments.map((augment, index) => (
              <Button
                size="mini"
                compact
                key={augment.tier!}
                color={selectedAugment === index ? "blue" : undefined}
                onClick={() => setSelected(index)}
              >
                {tierToRoman[augment.tier! - 1]}
              </Button>
            ))}
          </ButtonGroup>
        </Item.Header>
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
