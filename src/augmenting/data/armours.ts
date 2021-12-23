import allTheBeans from "./Armours.json"
import { toUnitReal } from "augmenting/tools"
import { Unit } from "augmenting/types"
import { transformValues } from "utils"

export const allUnits: Record<string, Unit> = transformValues(
  allTheBeans as unknown as Record<string, Unit>,
  toUnitReal,
)
