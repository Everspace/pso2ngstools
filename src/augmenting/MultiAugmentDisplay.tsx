import { Box, Button, ButtonGroup, Grid, Stack } from "@mui/material"
import { atom, useAtom } from "jotai"
import { atomFamily } from "jotai/utils"
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

interface WithAugment {
  augment: Augment
}

export const AugmentCapsuleImage = ({ augment }: WithAugment) => {
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

export const MultiAugmentDisplay = ({
  group,
  augments,
}: MultiAugmentDisplayProps) => {
  const [selectedAugment, setSelected] = useAtom(groupAugmentFamilyAtom(group))
  const augment = augments[selectedAugment]

  return (
    <Box sx={{ borderColor: "divider" }} borderBottom={1} py={2} px={1}>
      <Grid container spacing={1}>
        <Grid xs={1} maxWidth={256} item>
          <AugmentCapsuleImage augment={augment} />
        </Grid>
        <Grid xs item>
          <Stack>
            <Box>
              {group}{" "}
              <SelectTiers
                selected={selectedAugment}
                onClick={setSelected}
                tiers={augments.map((v) => v.tier!)}
              />
            </Box>
            <Box>
              <AugmentStatDisplay stat={augment.stat} />
            </Box>
            <Box>
              <UnitAddBar augment={augment} />
            </Box>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  )
}
