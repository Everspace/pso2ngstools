import { useAtomValue } from "jotai"
import { zero } from "MathConstants"
import Head from "next/head"
import { rangeToLine } from "../../pages/augment"
import { useTotalBp } from "./hooks"
import { augmentValueToString } from "./info"
import { allAugmentableSlotStatSum } from "./state/augmentableState"
import { classNameAtom } from "./state/characterState"
import {
  grindStateFamily,
  unitStateFamily,
  weaponPotentialAtom,
  weaponStateAtom,
} from "./state/equipmentState"
import { rangeFromWeaponAugments, simplifyAugmentStat } from "./tools"
import { UnitSlot } from "./types"

const Title = () => {
  const cl = useAtomValue(classNameAtom)
  const bp = useTotalBp()
  const title = `Augment Calculator: ${cl} - ${bp}bp`
  return (
    <Head>
      <title>{title}</title>
      <meta key="og:title" property="og:title" content={title} />
    </Head>
  )
}

const useWeaponInfo = () => {
  const weapon = useAtomValue(weaponStateAtom)
  const weaponPotential = useAtomValue(weaponPotentialAtom)
  const weaponGrind = useAtomValue(grindStateFamily("weapon"))
  return {
    name: `${weapon.name}+${weaponGrind}`,
    stats: weapon,
    range: { max: weapon.varianceHigh, min: weapon.varianceLow },
    potential: weaponPotential,
  }
}

const useUnitInfo = (slot: UnitSlot) => {
  const unit = useAtomValue(unitStateFamily(slot))
  const grind = useAtomValue(grindStateFamily(slot))
  return `${unit.name}+${grind}`
}

const Description = () => {
  const rawStats = useAtomValue(allAugmentableSlotStatSum)
  const stats = simplifyAugmentStat(rawStats)
  const lines: string[] = []

  const weapon = useWeaponInfo()
  const units = (["unit1", "unit2", "unit3"] as UnitSlot[]).map(useUnitInfo)
  lines.push(weapon.name)
  lines.push(units.join("/"))
  lines.push("")

  const hpppline: string[] = []
  if (stats?.hp) hpppline.push(`HP: ${stats.hp}`)
  if (stats.pp) hpppline.push(`PP: ${stats.pp}`)
  if (hpppline.length > 0) lines.push(hpppline.join(", "))

  const statLine: string[] = []
  statLine.push(
    `MATK ${augmentValueToString("meleePotency", stats.meleePotency ?? zero)}`,
  )
  statLine.push(
    `RATK ${augmentValueToString(
      "rangedPotency",
      stats.rangedPotency ?? zero,
    )}`,
  )
  statLine.push(
    `TATK ${augmentValueToString("techPotency", stats.techPotency ?? zero)}`,
  )
  lines.push(statLine.join("/"))

  if (stats.floorPotency) {
    // TODO: or ceilPotency
    const range = rangeFromWeaponAugments(weapon.stats, stats)
    lines.push(`Weapon Range: ${rangeToLine(range)}`)
  }

  if (stats.damageResist) {
    lines.push(
      `Damage Resist: ${augmentValueToString(
        "damageResist",
        stats.damageResist,
      )}`,
    )
  }
  if (stats.statusResist) {
    lines.push(
      `Status Resist: ${augmentValueToString(
        "statusResist",
        stats.statusResist,
      )}`,
    )
  }

  const desc = lines.join("\n")
  return (
    <Head>
      <meta key="description" name="description" content={desc} />
      <meta key="og:description" property="og:description" content={desc} />
    </Head>
  )
}

export const AugmentDiscordPreview = () => {
  return (
    <>
      <Head>
        <meta property="og:type" content="website" />
        {/* <meta property="og:url" content={r.asPath} /> doesn't work with hash links */}
      </Head>
      <Title />
      <Description />
    </>
  )
}
