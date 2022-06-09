import { CombatActivity } from "augmenting/types"
import { groupBy, uniqBy } from "lodash"
import { transformValues } from "utils"
import raw from "./BPRequirements.json"

export const allCombatActivities = raw as CombatActivity[]

export const activityNameByRegion: Record<string, string[]> = transformValues(
  groupBy(
    uniqBy(allCombatActivities, (a) => a.name),
    (a) => a.region,
  ) as Record<string, CombatActivity[]>,
  (arr) => arr.map((a) => a.name),
)

export const activityByName: Record<string, CombatActivity[]> = transformValues(
  groupBy(allCombatActivities, (a) => a.name) as Record<
    string,
    CombatActivity[]
  >,
  (arr) => arr.sort((a, b) => a.rank - b.rank),
)

export const allRegions = Object.keys(activityNameByRegion).sort()
