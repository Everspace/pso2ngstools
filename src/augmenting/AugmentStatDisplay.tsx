import { List, ListItem } from "@mui/material"
import { BigNumber } from "mathjs"
import { augmentStatToDisplayInfo, augmentValueToString } from "./info"
import { sumAugmentStats, simplifyAugmentStat } from "./tools"
import { AugmentStat, Augment } from "./types"

export interface AugmentStatDisplayProps {
  stat: AugmentStat | Augment[]
  simple?: boolean
}

const statOrder: (keyof AugmentStat)[] = [
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

  const { hp, pp, bp, ...listableStats } = finalStat
  let hpppLine: string[] = []
  if (hp) {
    hpppLine.push(`HP: ${hp}`)
  }
  if (pp) {
    hpppLine.push(`PP: ${pp}`)
  }

  return (
    <List dense>
      <ListItem>BP: {bp ? bp.toString() : "?"}</ListItem>
      {hpppLine.length > 0 ? <ListItem>{hpppLine.join(", ")}</ListItem> : null}
      {(Object.keys(listableStats) as (keyof AugmentStat)[])
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
