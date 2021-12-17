import aelio from "./aelio"
import common from "./common"
// import retem from "./retem"

import { flattenDeep, groupBy } from "lodash"
import { toAugmentReal } from "augmenting/tools"

const allTheBeans = flattenDeep([aelio, common])

export const allAugments = allTheBeans.flatMap(toAugmentReal)

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
