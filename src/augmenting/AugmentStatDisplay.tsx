import { BigNumber } from "mathjs"
import { List } from "semantic-ui-react"
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
      return <List.Item>HP: {valueString}</List.Item>
    case "pp":
      return <List.Item>PP: {valueString}</List.Item>
    case "potency":
      return (
        <List.Item>
          <AllAttackIcons /> Potency: {valueString}%
        </List.Item>
      )
    case "floorPotency":
      return (
        <List.Item>
          <ATKOutlineIcon /> Potency Floor Increase: {valueString}%
        </List.Item>
      )
    case "damageResist":
      return (
        <List.Item>
          <DEFOutlineIcon /> Damage Resistance: {valueString}%
        </List.Item>
      )
    case "meleePotency":
      return (
        <List.Item>
          <MeleeIcon /> Melee Potency: {valueString}%
        </List.Item>
      )
    case "rangedPotency":
      return (
        <List.Item>
          <RangeIcon /> Ranged Potency: {valueString}%
        </List.Item>
      )
    case "techPotency":
      return (
        <List.Item>
          <TechIcon /> Technique Potency: {valueString}%
        </List.Item>
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
    <List>
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
