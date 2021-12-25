import { atomFamily, atomWithHash } from "jotai/utils"
import { toId, fromId, flipTable, translateKeys } from "utils"
import { AugmentableSlot, UnitSlot } from "./augmentableState"
import { allUnits } from "../data/armours"
import { allWeapons } from "../data/weapons"
import { Unit, Weapon } from "../types"

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
