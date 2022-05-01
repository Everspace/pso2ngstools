import { GrindLevel, GRIND_KEYS, GRIND_LEVELS, Weapon } from "augmenting/types"
import { BigNumber } from "mathjs"
import { HasGrindLevels, RecordSheet, Replace } from "./common"

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
  const { Series, Lv, Stars, Limit, Element, VLow, VHigh, ...otherKeys } = row

  const stars = Number(Stars)
  const attackBase = Number(otherKeys["Grind0"])

  const data: Partial<WeaponData> = {
    name: Series,
    level: Number(Lv),
    stars,
    limit: Number(Limit) as GrindLevel,
  }

  const grinds = GRIND_KEYS.reduce((memory,key) => {
    memory[key] = otherKeys[key]
    return memory
  }, {} as Record<typeof GRIND_KEYS[number], string>)

  const grindLevelTuples = GRIND_LEVELS.map((level) => {
    const rawGrind = grinds[`Grind${level}`]
    let grind: number = Number(rawGrind)
    if (rawGrind === null || rawGrind === undefined || rawGrind === "")
      grind = attackBase + rarityBackfill[stars][Math.floor(level / 10)]
    return [level, grind]
  })
  data.grindValues = Object.fromEntries(grindLevelTuples)

  if (VLow !== "") data.varianceLow = Number(VLow)
  if (VHigh !== "") data.varianceHigh = Number(VHigh)
  if (Element !== "") data.element = Element

  return data as WeaponData
}
