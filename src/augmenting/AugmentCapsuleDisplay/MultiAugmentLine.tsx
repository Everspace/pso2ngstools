import { Button, ButtonGroup, Grid } from "@mui/material"
import { AugmentLine, AugmentLineHeader } from "./AugmentLine"
import { augmentImageFromType } from "../images/augment"
import { useState, useEffect } from "react"
import { Augment } from "augmenting/types"
import { augmentTierToRoman } from "augmenting/tools"
import Image from "next/image"

interface MultiAugmentDisplayProps {
  augments: [Augment, ...Augment[]]
}

interface AugmentCapsuleImageProps {
  augment: Augment
}

export function AugmentCapsuleImage({ augment }: AugmentCapsuleImageProps) {
  const icon = augmentImageFromType[augment.icon]

  return (
    <Image
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

function SelectTiers({ tiers, onClick, selected }: SelectTiersProps) {
  return (
    <ButtonGroup size="small">
      {tiers.map((tier, index) => (
        <Button
          key={tier}
          variant={selected === index ? "contained" : "outlined"}
          onClick={() => onClick(index)}
        >
          {augmentTierToRoman[tier - 1]}
        </Button>
      ))}
    </ButtonGroup>
  )
}

export function MultiAugmentDisplay({ augments }: MultiAugmentDisplayProps) {
  const [selectedAugment, setSelected] = useState(augments.length - 1)
  useEffect(() => {
    setSelected(augments.length - 1)
  }, [setSelected, augments.length])

  const group = augments[0].baseName
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
              selected={selectedAugment}
              onClick={setSelected}
              tiers={augments.map((v) => v.tier ?? NaN)}
            />
          </Grid>
          <Grid item>{augment.stat.bp?.toNumber() ?? "??"} BP</Grid>
        </Grid>
      </AugmentLineHeader>
    </AugmentLine>
  )
}
