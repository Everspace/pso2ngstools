import { GrindLevel } from "augmenting/types"
import { toNumberOrNull } from "./common"
import { getSheetRows } from "./google"

export type MiscSheet = {
  MAX_POTENTIAL: number
  MAX_GRIND: GrindLevel
  MAX_GRIND_LIMIT: GrindLevel
  MAX_SKILLPOINTS: number
  DEFAULT_AUGMENTS_PER_SLOT: number
  MAX_AUGMENTS_PER_SLOT: number
}

async function getMisc(): Promise<MiscSheet> {
  const result: Partial<MiscSheet> = {}
  for (const entry of await getSheetRows("Misc")) {
    const Key: keyof MiscSheet = entry["Key"]
    const Value: string = entry["Value"]
    switch (Key) {
      case "MAX_GRIND":
      case "MAX_GRIND_LIMIT":
        result[Key] = (toNumberOrNull(Value) ?? 0) as GrindLevel
        break
      default:
        result[Key] = toNumberOrNull(Value) ?? 0
    }
  }
  return result as MiscSheet
}

export const MiscData: MiscSheet = await getMisc()
