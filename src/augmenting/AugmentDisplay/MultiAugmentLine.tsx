import { Button, ButtonGroup } from "@mui/material"
import { atom, useAtom } from "jotai"
import { atomFamily } from "jotai/utils"
import { AugmentLine, AugmentLineHeader } from "./AugmentLine"
import { Augment, augmentByBasename } from "../data/augment"
import { augmentImageFromType } from "../images/augment"

interface MultiAugmentDisplayProps {
  augments: [Augment, ...Augment[]]
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

interface AugmentCapsuleImageProps {
  augment: Augment
}

export const AugmentCapsuleImage = ({ augment }: AugmentCapsuleImageProps) => {
  const icon = augmentImageFromType[augment.icon]

  return (
    <img
      alt={`${augment.icon} icon`}
      style={{ display: "block", width: "100%", height: "auto" }}
      src={icon}
    />
  )
}

interface SelectTiersProps {
  tiers: number[]
  selected: number
  onClick: (n: number) => void
}

const SelectTiers = ({ tiers, onClick, selected }: SelectTiersProps) => {
  return (
    <ButtonGroup size="small">
      {tiers.map((tier, index) => (
        <Button
          key={tier}
          variant={selected === index ? "contained" : "outlined"}
          onClick={() => onClick(index)}
        >
          {tierToRoman[tier - 1]}
        </Button>
      ))}
    </ButtonGroup>
  )
}

export const MultiAugmentDisplay = ({ augments }: MultiAugmentDisplayProps) => {
  const group = augments[0].baseName!

  const [selectedAugment, setSelected] = useAtom(groupAugmentFamilyAtom(group))
  const augment = augments[selectedAugment]

  return (
    <AugmentLine augment={augment}>
      <AugmentLineHeader>
        {group}{" "}
        <SelectTiers
          selected={selectedAugment}
          onClick={setSelected}
          tiers={augments.map((v) => v.tier!)}
        />
      </AugmentLineHeader>
    </AugmentLine>
  )
}
