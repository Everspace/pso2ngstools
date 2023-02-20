import { useAtomValue } from "jotai"
import { zero } from "MathConstants"
import Head from "next/head"
import { useRouter } from "next/router"
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
  return (
    <Head>
      <meta
        property="og:title"
        content={`Augment Calculator: ${cl} - ${bp}bp`}
      />
    </Head>
  )
}

const weaponInfo = () => {
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
const unitInfo = (slot: UnitSlot) => {
  const unit = useAtomValue(unitStateFamily(slot))
  const grind = useAtomValue(grindStateFamily(slot))
  return `${unit.name}+${grind}`
}

const Description = () => {
  const rawStats = useAtomValue(allAugmentableSlotStatSum)
  const stats = simplifyAugmentStat(rawStats)
  const lines: string[] = []

  const weapon = weaponInfo()
  const units = (["unit1", "unit2", "unit3"] as UnitSlot[]).map(unitInfo)
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
    const range = rangeFromWeaponAugments(weapon.stats, stats)
    lines.push(`Weapon Range: ${rangeToLine(range)}`)
  }

  if (stats.damageResist)
    lines.push(
      `Damage Resist: ${augmentValueToString(
        "damageResist",
        stats.damageResist,
      )}`,
    )

  // Weapon Range: 50.0% - 100.0%
  return (
    <Head>
      <meta property="og:description" content={lines.join("\n")} />
    </Head>
  )
}

export const AugmentDiscordPreview = () => {
  const r = useRouter()
  return (
    <>
      <Head>
        <meta property="og:type" content="website" />
        <meta property="og:url" content={r.asPath} />
      </Head>
      <Title />
      <Description />
    </>
  )
}
