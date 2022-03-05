import { CombatActivity, GameRegion } from "augmenting/types"
import { groupBy, uniqBy } from "lodash"
import { transformValues } from "utils"
import raw from "./BPRequirements.json"

const combatActivites = raw as CombatActivity[]

export const activityNameByRegion: Record<GameRegion, string[]> =
  transformValues(
    groupBy(
      uniqBy(combatActivites, (a) => a.name),
      (a) => a.region,
    ) as Record<GameRegion, CombatActivity[]>,
    (arr) => arr.map((a) => a.name),
  )

export const activityByName: Record<string, CombatActivity[]> = transformValues(
  groupBy(combatActivites, (a) => a.name) as Record<string, CombatActivity[]>,
  (arr) => arr.sort((a, b) => a.rank - b.rank),
)
