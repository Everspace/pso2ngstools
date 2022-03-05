import { allUnits } from "augmenting/data/armours"
import { activityByName } from "augmenting/data/bprequirements"
import { allWeapons } from "augmenting/data/weapons"

export const MAX_LEVEL = 40
export const MAX_SKILLPOINTS = 30

export const DEFAULT_WEAPON = allWeapons["Cinquem"]
export const DEFAULT_UNIT = allUnits["Schwarzest Armor"]

export const DEFAULT_AUGMENT_SLOTS = 5
export const MAX_AUGMENTS_PER_SLOT = 8

export const DEFAULT_ACTIVITIES = [
  activityByName["Dark Falz"][1 - 1],
  activityByName["Mt. Magnus"][3 - 1],
]
