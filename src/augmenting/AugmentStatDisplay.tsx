import { List, ListItem } from "@mui/material"
import { zero } from "MathConstants"
import { BigNumber } from "mathjs"
import { augmentStatToGlyphInfo } from "./images/icon"
import { augmentStatToDisplayInfo, augmentValueToString } from "./info"
import { simplifyAugmentStat, sumAugmentStats } from "./tools"
import { Augment, AugmentStat } from "./types"

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
  const { name } = augmentStatToDisplayInfo[statName]
  const valueString = augmentValueToString(statName, value)
  const Glyph = augmentStatToGlyphInfo[statName]
  return (
    <ListItem disableGutters>
      {Glyph ? <Glyph /> : null}
      {name} {valueString}
    </ListItem>
  )
}

export function AugmentStatDisplay({
  stat,
  simple = false,
}: AugmentStatDisplayProps) {
  let finalStat: AugmentStat

  if (stat instanceof Array) {
    finalStat = sumAugmentStats(stat)
  } else {
    finalStat = stat
  }

  if (simple) finalStat = simplifyAugmentStat(finalStat)
  delete finalStat.bp
  const { hp, pp, ...listableStats } = finalStat
  const hpppLine: string[] = []
  if (hp && !hp.equals(zero)) {
    hpppLine.push(`HP: ${hp}`)
  }
  if (pp && !pp.equals(zero)) {
    hpppLine.push(`PP: ${pp}`)
  }

  return (
    <List dense>
      {hpppLine.length > 0 ? (
        <ListItem disableGutters>{hpppLine.join(", ")}</ListItem>
      ) : null}
      {(Object.keys(listableStats) as (keyof AugmentStat)[])
        .sort((a, b) => {
          // Push keys I haven't decided the order of "down"
          const indexA = statOrder.indexOf(a)
          const indexB = statOrder.indexOf(b)
          return (indexA > -1 ? indexA : 999) - (indexB > -1 ? indexB : 999)
        })
        .map((k) => {
          const value = finalStat[k]
          if (!value) return false
          return <StatItem key={k} statName={k} value={value} />
        })
        .filter((x) => x)}
    </List>
  )
}
