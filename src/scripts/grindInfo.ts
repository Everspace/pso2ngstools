import { GrindLevel, GRIND_KEYS } from "augmenting/types"
import { GrindLevelHeader, HasGrindLevels, toNumberOrNull } from "./common"
import { getSheetRows } from "./google"

function doRow(row: HasGrindLevels): Record<GrindLevelHeader, number> {
  return GRIND_KEYS.reduce((memory, key) => {
    const value = toNumberOrNull(row[key]) ?? 0
    memory[key] = value
    return memory
  }, {} as Record<GrindLevelHeader, number>)
}

const zeroGrind = GRIND_KEYS.reduce((memory, key) => {
  memory[key] = 0
  return memory
}, {} as Record<GrindLevelHeader, number>)

// Star: GrindEntry
const WeaponGrind: Record<string, Record<GrindLevelHeader, number>> = {
  "0": zeroGrind,
}

const ArmourGrind: Record<string, Record<GrindLevelHeader, number>> = {
  "0": zeroGrind,
}

const GrindLimit: Record<string, GrindLevel> = {
  "0": 0,
}
const GrindBase: Record<string, GrindLevel> = {
  "0": 0,
}

let MaxGrind: GrindLevel = 0

for (const entry of await getSheetRows("LimitBreak")) {
  const { Stars, Limit } = entry
  const star = toNumberOrNull(Stars) ?? 0
  const limit = (toNumberOrNull(Limit) ?? 0) as GrindLevel
  let currentMax = GrindLimit[star]
  if (!currentMax) currentMax = limit
  if (currentMax < limit) currentMax = limit
  if (MaxGrind < limit) MaxGrind = limit

  let currentLow = ((GrindBase[star] ?? currentMax) - 10) as GrindLevel

  if (currentLow < limit - 10) {
    currentLow = (limit - 10) as GrindLevel
  }

  GrindLimit[star] = currentMax
  GrindBase[star] = currentLow
}

for (const entry of await getSheetRows("ArmourGrindGrowth")) {
  ArmourGrind[entry["Stars"]] = doRow(entry as any)
}

for (const entry of await getSheetRows("WeaponGrindGrowth")) {
  WeaponGrind[entry["Stars"]] = doRow(entry as any)
}

export { WeaponGrind, ArmourGrind, GrindLimit, GrindBase, MaxGrind }
