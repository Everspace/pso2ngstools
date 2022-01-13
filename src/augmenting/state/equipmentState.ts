import { atom, PrimitiveAtom } from "jotai"
import { atomFamily, atomWithHash } from "jotai/utils"
import { toId, fromId, flipTable, translateKeys } from "utils"
import { allUnits } from "../data/armours"
import { allWeapons } from "../data/weapons"
import { AugmentableSlot, augmentSlots, Unit, UnitSlot, Weapon } from "../types"
import { augmentableFamily } from "./augmentableState"

type SerializedEquippableState = {
  name?: string
  potential?: number
  fullyGround?: boolean
}

const shrinkTable: Record<keyof SerializedEquippableState, string> = {
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
  fullyGround: boolean
}

export const unitStateFamily = atomFamily((slot: UnitSlot) => {
  const id = slotToHash[slot]
  return atomWithHash<UnitEquipState>(
    id,
    { unit: allUnits["None"], fullyGround: true },
    {
      replaceState: true,
      serialize({ unit, fullyGround }) {
        return toId(
          translateKeys(shrinkTable, {
            name: unit.name,
            fullyGround,
          }),
        )
      },
      deserialize(id) {
        const state = translateKeys(
          expandTable,
          fromId(id),
        ) as SerializedEquippableState

        return {
          unit: allUnits[state?.name ?? "None"],
          fullyGround: state.fullyGround ?? true,
        }
      },
    },
  )
})

export type WeaponEquipState = {
  weapon: Weapon
  potential: number
  fullyGround: boolean
}

export const weaponStateAtom = atomWithHash<WeaponEquipState>(
  slotToHash["weapon"],
  { weapon: allWeapons["Fivla"], potential: 0, fullyGround: true },
  {
    replaceState: true,
    serialize({ weapon, potential, fullyGround }) {
      return toId(
        translateKeys(shrinkTable, {
          name: weapon.name,
          potential,
          fullyGround,
        }),
      )
    },
    deserialize(id) {
      const state = translateKeys(
        expandTable,
        fromId(id),
      ) as SerializedEquippableState

      return {
        weapon: allWeapons[state?.name ?? "None"],
        potential: state.potential ?? 0,
        fullyGround: state.fullyGround ?? true,
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
