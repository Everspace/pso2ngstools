import { allUnits } from "augmenting/data/armours"
import { allCombatActivities } from "augmenting/data/bprequirements"
import { allClassData } from "augmenting/data/classes"
import { allWeapons } from "augmenting/data/weapons"
import { groupBy, uniqBy } from "lodash"

export const MAX_SKILLPOINTS = 40

// TODO: Move these derived stats to other places
export const MAX_LEVEL = allClassData.Hu.length - 1

export const DEFAULT_WEAPON = Object.entries(allWeapons)
  .sort(([_, a], [__, b]) => a.level - b.level)
  .reverse()[0][1]

export const DEFAULT_UNIT = Object.entries(allUnits)
  .sort(([_, a], [__, b]) => a.level - b.level)
  .reverse()[0][1]

export const DEFAULT_AUGMENT_SLOTS = DEFAULT_UNIT.stars
export const MAX_AUGMENTS_PER_SLOT = 8

const top2Bp = uniqBy(allCombatActivities, (a) => a.bp)
  .sort((a, b) => a.bp - b.bp)
  .reverse()
  .map((a) => a.bp)
  .slice(0, 3)
const bpActivity = groupBy(allCombatActivities, (a) => a.bp)

export const DEFAULT_ACTIVITIES = top2Bp.flatMap((bp) => bpActivity[bp][0])
