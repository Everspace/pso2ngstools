import { Button, Grid } from "@mui/material"
import { AugmentLine, AugmentLineHeader } from "./AugmentLine"
import { augmentImageFromType } from "../images/augment"
import { chunk } from "lodash"
import { useState } from "react"
import { Augment } from "augmenting/types"
import { augmentTierToRoman } from "augmenting/tools"

interface MultiAugmentDisplayProps {
  augments: [Augment, ...Augment[]]
}

interface AugmentCapsuleImageProps {
  augment: Augment
}

export function AugmentCapsuleImage({ augment }: AugmentCapsuleImageProps) {
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
  augments: Augment[]
  selected: Augment
  onClick: (a: Augment) => void
}

interface TierButtonProps {
  augment: Augment
  isSelected: boolean
  onClick: () => void
}

const Blank = () => <span>"&nbsp;&nbsp;&nbsp;"</span>

function TierButton({ augment, isSelected, onClick }: TierButtonProps) {
  let buttonText: string | undefined

  switch (typeof augment.tier) {
    case "number": {
      buttonText = augmentTierToRoman[augment.tier - 1]
      break
    }
    case "string": {
      buttonText = augment.tier
      break
    }
  }
  return (
    <Button
      key={augment.name}
      size="small"
      sx={{ minWidth: 32 }}
      variant={isSelected ? "contained" : "outlined"}
      onClick={onClick}
    >
      {buttonText ?? <Blank />}
    </Button>
  )
}

const extractTier = (a: Augment) => a.tier?.toString() ?? ""
const compareTier = (a: Augment, b: Augment) => {
  if (typeof a.tier === "number" && typeof b.tier === "number")
    return a.tier - b.tier
  if (typeof a.tier === "number") return -1
  if (typeof b.tier === "number") return 1
  return extractTier(a).localeCompare(extractTier(b))
}

function SelectTiers({ augments, onClick, selected }: SelectTiersProps) {
  const augmentSorted = augments.sort(compareTier)

  const TierRow = (row: Augment[]) => {
    return (
      <Grid item container spacing={0.5}>
        {row.map((agument) => (
          <Grid item key={agument.name} xs="auto">
            <TierButton
              augment={agument}
              isSelected={selected.name === agument.name}
              onClick={() => onClick(agument)}
            />
          </Grid>
        ))}
      </Grid>
    )
  }
  return (
    <Grid
      container
      direction="row"
      justifyItems="flex-start"
      alignItems="center"
      spacing={0.5}
    >
      {chunk(augmentSorted, 7).map(TierRow)}
    </Grid>
  )
}

export function MultiAugmentDisplay({ augments }: MultiAugmentDisplayProps) {
  const [selectedAugment, setSelected] = useState(augments.length - 1)

  const setSelectedNew = (incoming: Augment) => {
    setSelected(augments.findIndex((aug) => aug.name === incoming.name))
  }
  // useEffect(() => {
  //   setSelected(augments.length - 1)
  // }, [setSelected, augments.length])

  const group = augments[0].baseName!
  let augment = augments[selectedAugment]

  // When augments changes length
  // react fails to catch the change and invalidate
  // so will end up with a bad time
  if (!augment) {
    augment = augments[augments.length - 1]
  }

  return (
    <AugmentLine augment={augment}>
      <AugmentLineHeader>
        <Grid
          container
          direction="row"
          justifyItems="flex-start"
          alignItems="center"
          spacing={1}
        >
          <Grid item>{group}</Grid>
          <Grid item>
            <SelectTiers
              selected={augment}
              onClick={setSelectedNew}
              augments={augments}
            />
          </Grid>
          <Grid item>{augment.stat.bp?.toNumber() ?? "??"} BP</Grid>
        </Grid>
      </AugmentLineHeader>
    </AugmentLine>
  )
}
