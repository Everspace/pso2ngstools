import { Image, List } from "semantic-ui-react"
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

const allStat: (keyof AugmentStat)[] = [
  "hp",
  "pp",
  "potency",
  "floorPotency",
  "meleePotency",
  "rangePotency",
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
          <AllAttackIcons /> Floor Potency Increase: {symbol}
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
    case "rangePotency":
      return (
        <List.Item>
          <RangeIcon /> Precision Potency: {symbol}
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
      {Object.keys(stat).map((k) => {
        const key = k as keyof AugmentStat
        return <StatItem key={key} statName={key} value={stat[key]!} />
      })}
    </List>
  )
}
