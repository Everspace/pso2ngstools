import basic from "./basic.json"
import note from "./secreta.json"
import soul from "./soul.json"
import dread from "./dread.json"
import dualble from "./dualble.json"
import { Augment } from "augmenting/types"
import { flatten } from "lodash"

export default flatten([
  basic,
  note,
  soul,
  dread,
  dualble,
] as unknown as Augment[][])
