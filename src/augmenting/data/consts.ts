import { allUnits } from "augmenting/data/armours"
import { allCombatActivities } from "augmenting/data/bprequirements"
import { allWeapons } from "augmenting/data/weapons"
import { GrindLevel } from "augmenting/types"
import { groupBy, uniqBy } from "lodash"

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

export const DEFAULT_WEAPON = Object.entries(allWeapons)
  .sort(([_, a], [__, b]) => a.level - b.level)
  .reverse()[0][1]

export const DEFAULT_UNIT = Object.entries(allUnits)
  .sort(([_, a], [__, b]) => a.level - b.level)
  .reverse()[0][1]

const top2Bp = uniqBy(allCombatActivities, (a) => a.bp)
  .sort((a, b) => a.bp - b.bp)
  .reverse()
  .map((a) => a.bp)
  .slice(0, 3)
const bpActivity = groupBy(allCombatActivities, (a) => a.bp)

export const DEFAULT_ACTIVITIES = top2Bp.flatMap((bp) => bpActivity[bp][0])
