import domina from "./domina.json"
import note from "./note.json"
import soul from "./soul.json"
import gigas from "./gigas.json"
import { flatten } from "lodash"
import { Augment } from "augmenting/types"

export default flatten([
  domina,
  note,
  soul,
  gigas,
] as unknown as Augment[][]) as Augment[]
