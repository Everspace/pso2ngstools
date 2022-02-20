import { Weapon } from "augmenting/types"
import { BigNumber } from "mathjs"
import {
  GrindLevel,
  HasGrindLevels,
  MAX_GRIND_INDEX,
  MAX_GRIND_KEY,
  RecordSheet,
  Replace,
} from "./common"

// Guessed offsets for
// [rarity][Grind of 10]
const rarityBackfill = [
  //null, Grind0, Grind10, Grind20...
  [0, 0, 0, 0, 0, 0, 0], // "None"
  [0, 22, 46, 63, 82, 161], // 1 star
  [0, 16, 33, 50, 69, 143],
  [0, 10, 21, 32, 47, 115],
  [0, 10, 20, 30, 40, 108],
  [0, 10, 20, 30, 40, 92], // 5 star
]

type DataSheetKeys = "Series" | "Lv" | "Stars" | "Element" | "VLow" | "VHigh"

interface DataSheetRow extends RecordSheet<DataSheetKeys>, HasGrindLevels {
  Limit: GrindLevel
}

export type WeaponData = Replace<Weapon, BigNumber, number>
export function handleWeaponRow(row: DataSheetRow): WeaponData {
  const { Series, Lv, Stars, Limit, Element, VLow, VHigh, ...grinds } = row
  const stars = Number(Stars)
  const attackBase = Number(grinds["Grind0"])

  const data: Partial<WeaponData> = {
    name: Series,
    level: Number(Lv),
    stars,
    limit: Number(Limit),
    attackBase,
  }

  const attackLimit = grinds[`Grind${Limit}`]
  if (attackLimit === "")
    data.attackLimit =
      attackBase + rarityBackfill[stars][Math.floor(Number(Limit) / 10)]
  else data.attackLimit = Number(attackLimit)

  const attackMax = grinds[MAX_GRIND_KEY]
  if (attackMax === "")
    data.attackMax = attackBase + rarityBackfill[stars][MAX_GRIND_INDEX]
  else data.attackMax = Number(attackMax)

  if (VLow !== "") data.varianceLow = Number(VLow)
  if (VHigh !== "") data.varianceHigh = Number(VHigh)
  if (Element !== "") data.element = Element

  return data as WeaponData
}
