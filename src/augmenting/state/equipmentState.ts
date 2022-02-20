import { atom, PrimitiveAtom } from "jotai"
import { atomFamily, atomWithHash } from "jotai/utils"
import { toId, fromId, flipTable, translateKeys } from "utils"
import { allUnits } from "../data/armours"
import { allWeapons } from "../data/weapons"
import {
  AugmentableSlot,
  augmentSlots,
  Unit,
  UnitSlot,
  Weapon,
  MAX_GRIND,
} from "../types"
import { augmentableFamily } from "./augmentableState"

const DEFAULT_WEAPON = allWeapons["Cinquem"]
const DEFAULT_UNIT = allUnits["Schwarzest Armor"]

interface Versionable {
  version?: number
}

type SerializedEquippableStateV1 = {
  version?: 1
  name?: string
  potential?: number
  fullyGround?: boolean
}

type SerializedEquippableStateV2 = Versionable & {
  version: 2
  name?: string
  potential?: number
  grind?: number
}

type AnyVersion = SerializedEquippableStateV1 | SerializedEquippableStateV2

function migrate(state: AnyVersion): SerializedEquippableStateV2 {
  switch (state.version) {
    case 1:
      const { fullyGround, ...properites } = state
      const unit = allUnits[state.name ?? "None"]
      const grind = fullyGround ? unit.limit : 0
      return migrate({ ...properites, version: 2, grind })
    case 2:
      return state
    default:
      return migrate({ ...state, version: 1 })
  }
}

type AllKeysForTable =
  | keyof SerializedEquippableStateV1
  | keyof SerializedEquippableStateV2

const shrinkTable: Record<AllKeysForTable, string> = {
  fullyGround: "fg",
  grind: "g",
  name: "n",
  potential: "p",
  version: "v",
}
const expandTable = flipTable(shrinkTable)

const slotToHash: Record<AugmentableSlot, string> = {
  unit1: "u1",
  unit2: "u2",
  unit3: "u3",
  weapon: "w",
}

export const MAX_AUGMENTS_PER_SLOT = 8
const augmentsPerSlotRawAtom = atomWithHash("slots", 4, {
  replaceState: true,
})

export const augmentsPerSlotAtom = atom<number, number>(
  (get) => get(augmentsPerSlotRawAtom),
  (get, set, update) => {
    augmentSlots.map(augmentableFamily).forEach((a) => {
      const val = get(a)
      set(a, val.slice(0, update))
    })
    set(augmentsPerSlotRawAtom, update)
  },
)

export type UnitEquipState = {
  unit: Unit
  grind: number
}

export const unitStateFamily = atomFamily((slot: UnitSlot) => {
  const id = slotToHash[slot]
  return atomWithHash<UnitEquipState>(
    id,
    { unit: DEFAULT_UNIT, grind: MAX_GRIND },
    {
      replaceState: true,
      serialize({ unit, grind }) {
        return toId(
          translateKeys(shrinkTable, {
            name: unit.name,
            grind,
          }),
        )
      },
      deserialize(id) {
        const state = migrate(translateKeys(expandTable, fromId(id)))
        const unit = allUnits[state?.name ?? "None"]
        return {
          unit,
          grind: state?.grind ?? unit?.level,
        }
      },
    },
  )
})

export type WeaponEquipState = {
  weapon: Weapon
  potential: number
  grind: number
}

export const weaponStateAtom = atomWithHash<WeaponEquipState>(
  slotToHash["weapon"],
  { weapon: DEFAULT_WEAPON, potential: 3, grind: MAX_GRIND },
  {
    replaceState: true,
    serialize({ weapon, potential, grind }) {
      return toId(
        translateKeys(shrinkTable, {
          name: weapon.name,
          potential,
          grind,
        }),
      )
    },
    deserialize(id) {
      const state = migrate(translateKeys(expandTable, fromId(id)))

      return {
        weapon: allWeapons[state?.name ?? "None"],
        potential: state.potential ?? 3,
        grind: state.grind ?? MAX_GRIND,
      }
    },
  },
)

export const equipStateFamily = atomFamily<
  AugmentableSlot,
  PrimitiveAtom<WeaponEquipState> | PrimitiveAtom<UnitEquipState>
>((slot: AugmentableSlot) => {
  if (slot === "weapon") return weaponStateAtom
  return unitStateFamily(slot)
})
