import { List, ListItem } from "@mui/material"
import { BigNumber } from "mathjs"
import {
  Augment,
  AugmentStat,
  augmentValueToString,
  simplifyAugmentStat,
  sumAugmentStats,
} from "./data/augment"
import {
  AllAttackIcons,
  ATKOutlineIcon,
  DEFOutlineIcon,
  MeleeIcon,
  RangeIcon,
  TechIcon,
} from "./images/icon"

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

const StatItem = ({ statName, value }: StatItemProps) => {
  if (value.eq(0)) {
    return null
  }
  const valueString = augmentValueToString(statName, value)
  switch (statName) {
    case "hp":
      return <ListItem>HP: {valueString}</ListItem>
    case "pp":
      return <ListItem>PP: {valueString}</ListItem>
    case "potency":
      return (
        <ListItem>
          <AllAttackIcons /> Potency: {valueString}%
        </ListItem>
      )
    case "floorPotency":
      return (
        <ListItem>
          <ATKOutlineIcon /> Potency Floor Increase: {valueString}%
        </ListItem>
      )
    case "damageResist":
      return (
        <ListItem>
          <DEFOutlineIcon /> Damage Resistance: {valueString}%
        </ListItem>
      )
    case "meleePotency":
      return (
        <ListItem>
          <MeleeIcon /> Melee Potency: {valueString}%
        </ListItem>
      )
    case "rangedPotency":
      return (
        <ListItem>
          <RangeIcon /> Ranged Potency: {valueString}%
        </ListItem>
      )
    case "techPotency":
      return (
        <ListItem>
          <TechIcon /> Technique Potency: {valueString}%
        </ListItem>
      )

    default:
      return <></>
  }
}

export const AugmentStatDisplay = ({
  stat,
  simple = false,
}: AugmentStatDisplayProps) => {
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
