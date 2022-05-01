import allTheBeans from "./Augments.json"
import { groupBy, uniq } from "lodash"
import { toAugmentReal } from "augmenting/tools"
import { Augment } from "augmenting/types"

export const allAugments = (allTheBeans as unknown as Augment[]).flatMap(
  toAugmentReal,
)

export const allAugmentCategories = uniq(allAugments.map((a) => a.category))

export const augmentByCategory = groupBy(
  allAugments,
  (augment) => augment.category,
)
//  as Record<AugmentCategory, Augment[]>

export const augmentByBasename = groupBy(
  allAugments,
  (augment) => augment.baseName,
)

// yarn browserslist --update-db
