import { List } from "semantic-ui-react"
import { AugmentStat } from "./data/augment"
import {
  AllAttackIcons,
  ATKOutlineIcon,
  DEFOutlineIcon,
  MeleeIcon,
  RangeIcon,
  TechIcon,
} from "./images/icon"

export interface AugmentStatDisplayProps {
  stat: AugmentStat
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
  value: number
}

const StatItem = ({ statName, value }: StatItemProps) => {
  const symbol = value > 0 ? "+" : ""
  switch (statName) {
    case "hp":
      return (
        <List.Item>
          HP: {symbol}
          {value}
        </List.Item>
      )
    case "pp":
      return (
        <List.Item>
          PP: {symbol}
          {value}
        </List.Item>
      )
    case "potency":
      return (
        <List.Item>
          <AllAttackIcons /> Potency: {symbol}
          {value}%
        </List.Item>
      )
    case "floorPotency":
      return (
        <List.Item>
          <ATKOutlineIcon /> Floor Potency Increase: {symbol}
          {value}%
        </List.Item>
      )
    case "damageResist":
      return (
        <List.Item>
          <DEFOutlineIcon /> Damage Resist Increase: {symbol}
          {value}%
        </List.Item>
      )
    case "meleePotency":
      return (
        <List.Item>
          <MeleeIcon /> Melee Potency: {symbol}
          {value}%
        </List.Item>
      )
    case "rangedPotency":
      return (
        <List.Item>
          <RangeIcon /> Ranged Potency: {symbol}
          {value}%
        </List.Item>
      )
    case "techPotency":
      return (
        <List.Item>
          <TechIcon /> Technique Potency: {symbol}
          {value}%
        </List.Item>
      )

    default:
      return <></>
  }
}

export const AugmentStatDisplay = ({ stat }: AugmentStatDisplayProps) => {
  return (
    <List>
      {(Object.keys(stat) as (keyof AugmentStat)[])
        .sort((a, b) => {
          // Push keys I haven't decided the order of "down"
          const indexA = statOrder.indexOf(a)
          const indexB = statOrder.indexOf(b)
          return (indexA > -1 ? indexA : 999) - (indexB > -1 ? indexB : 999)
        })
        .map((k) => {
          const value = stat[k]
          if (!value) return false
          return <StatItem key={k} statName={k} value={value} />
        })
        .filter((x) => x)}
    </List>
  )
}
