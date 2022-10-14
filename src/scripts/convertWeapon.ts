import { GRIND_LEVELS, Weapon } from "augmenting/types"
import { BigNumber } from "mathjs"
import { HasGrindLevels, RecordSheet, Replace, writeFileJson } from "./common"
import { getSheetRows } from "./google"
import { GrindBase, GrindLimit, WeaponGrind } from "./grindInfo"
import { MiscData } from "./miscSheet"

type DataSheetKeys =
  | "Series"
  | "Lv"
  | "Stars"
  | "Element"
  | "VLow"
  | "VHigh"
  | "Attack"

interface DataSheetRow extends RecordSheet<DataSheetKeys>, HasGrindLevels {}

export type WeaponData = Replace<Weapon, BigNumber, number>
function handleWeaponRow(row: DataSheetRow): WeaponData {
  const { Series, Lv, Stars, Attack, Element, VLow, VHigh } = row

  const stars = Number(Stars)
  const attackBase = Number(Attack)

  const data: Partial<WeaponData> = {
    name: Series,
    level: Number(Lv),
    stars,
    limit: GrindBase[stars] ?? MiscData.MAX_GRIND,
    limit_max: GrindLimit[stars] ?? MiscData.MAX_GRIND,
  }

  const grinds: Partial<Record<string, number>> = {}

  for (const level of GRIND_LEVELS) {
    grinds[level.toString()] = attackBase + WeaponGrind[stars][`Grind${level}`]
  }

  //@ts-ignore TODO: Figure out how to do this safely?
  data.grindValues = grinds as Record<GrindLevel, number>

  if (VLow !== "") data.varianceLow = Number(VLow)
  if (VHigh !== "") data.varianceHigh = Number(VHigh)
  if (Element !== "") data.element = Element

  return data as WeaponData
}

export async function doWeapons() {
  const allWeapons: Record<string, WeaponData> = {}
  for await (const entry of await getSheetRows("Weapons")) {
    const weapon = handleWeaponRow(entry as any)
    allWeapons[weapon.name] = weapon
  }

  writeFileJson(allWeapons, "./src/augmenting/data/Weapons.json")
}
