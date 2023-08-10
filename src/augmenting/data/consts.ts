import { allUnits } from "augmenting/data/armours"
import { allCombatActivities } from "augmenting/data/bprequirements"
import { allWeapons } from "augmenting/data/weapons"
import { GrindLevel } from "augmenting/types"
import { groupBy, mapValues } from "lodash"

import consts from "./Consts.json"

const {
  MAX_SKILLPOINTS,
  MAX_LEVEL,
  DEFAULT_AUGMENTS_PER_SLOT,
  MAX_AUGMENTS_PER_SLOT,
  MAX_POTENTIAL,
  MAX_GRIND: grind,
  MAX_GRIND_LIMIT: limit,
} = consts

export {
  MAX_SKILLPOINTS,
  MAX_LEVEL,
  MAX_POTENTIAL,
  DEFAULT_AUGMENTS_PER_SLOT,
  MAX_AUGMENTS_PER_SLOT,
}

export const MAX_GRIND = grind as GrindLevel
export const MAX_GRIND_LIMIT = limit as GrindLevel
const weaponByLevel = Object.entries(allWeapons)
  .sort(([_, a], [__, b]) => a.level - b.level)
  .reverse()
export const DEFAULT_WEAPON = weaponByLevel[0][1]

const unitByLevel = Object.entries(allUnits)
  .sort(([_, a], [__, b]) => a.level - b.level)
  .reverse()
export const DEFAULT_UNIT = unitByLevel[0][1]

const bpActivity = groupBy(allCombatActivities, (a) => a.type)

const highestForType = mapValues(
  bpActivity,
  (activities) => activities.sort((a, b) => a.bp - b.bp).reverse()[0],
)

export const DEFAULT_ACTIVITIES = Object.keys(highestForType)
  .sort()
  .map((k) => highestForType[k])
