import { atomFamily, atomWithHash } from "jotai/utils"
import { toId, fromId, flipTable, translateKeys } from "utils"
import { AugmentableSlot } from "./augmentableState"

export type EquippableState = {
  name?: string
  potential?: number
  fullyGround?: boolean
}

const shrinkTable: Record<keyof EquippableState, string> = {
  name: "n",
  potential: "p",
  fullyGround: "fg",
}
const expandTable = flipTable(shrinkTable)

const slotToHash: Record<AugmentableSlot, string> = {
  unit1: "u1",
  unit2: "u2",
  unit3: "u3",
  weapon: "w",
}

export const equipableStateFamily = atomFamily((slot: AugmentableSlot) => {
  const id = slotToHash[slot]
  return atomWithHash<EquippableState>(
    id,
    { name: "None" },
    {
      replaceState: true,
      serialize(val) {
        return toId(translateKeys(shrinkTable, val))
      },
      deserialize(id) {
        return translateKeys(expandTable, fromId(id)) as EquippableState
      },
    },
  )
})
