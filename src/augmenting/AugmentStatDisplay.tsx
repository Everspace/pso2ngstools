import { List, ListItem } from "@mui/material"
import { BigNumber } from "mathjs"
import {
  Augment,
  AugmentStat,
  augmentStatToDisplayInfo,
  augmentValueToString,
  simplifyAugmentStat,
  sumAugmentStats,
} from "./data/augment"

export interface AugmentStatDisplayProps {
  stat: AugmentStat | Augment[]
  simple?: boolean
}

const statOrder: (keyof AugmentStat)[] = [
  "hp",
  "pp",
  "potency",
  "floorPotency",
  "meleePotency",
  "rangedPotency",
  "techPotency",
]

interface StatItemProps {
  statName: keyof AugmentStat
  value: BigNumber
}

function StatItem({ statName, value }: StatItemProps) {
  if (value.eq(0)) {
    return null
  }
  const { Glyph, name } = augmentStatToDisplayInfo[statName]
  const valueString = augmentValueToString(statName, value)
  return (
    <ListItem>
      {Glyph ? <Glyph /> : null}
      {name} {valueString}
    </ListItem>
  )
}

export function AugmentStatDisplay({
  stat,
  simple = false,
}: AugmentStatDisplayProps) {
  let finalStat: AugmentStat | null = null

  if (stat instanceof Array) {
    finalStat = sumAugmentStats(stat)
  } else {
    finalStat = stat
  }

  if (simple) finalStat = simplifyAugmentStat(finalStat)

  return (
    <List dense>
      {(Object.keys(finalStat) as (keyof AugmentStat)[])
        .sort((a, b) => {
          // Push keys I haven't decided the order of "down"
          const indexA = statOrder.indexOf(a)
          const indexB = statOrder.indexOf(b)
          return (indexA > -1 ? indexA : 999) - (indexB > -1 ? indexB : 999)
        })
        .map((k) => {
          const value = finalStat![k]
          if (!value) return false
          return <StatItem key={k} statName={k} value={value} />
        })
        .filter((x) => x)}
    </List>
  )
}
