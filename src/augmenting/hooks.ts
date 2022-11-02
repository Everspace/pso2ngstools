import { useAtomValue } from "jotai"
import { bpTotal } from "./bpCalc"
import { allAugmentsAtom } from "./state/augmentableState"
import {
  classNameAtom,
  levelAtom,
  skillpointAtom,
} from "./state/characterState"
import {
  equipStateFamily,
  grindStateFamily,
  weaponPotentialAtom,
} from "./state/equipmentState"
import { Unit, Weapon } from "./types"

export function useTotalBp() {
  const weapon = useAtomValue(equipStateFamily("weapon")) as Weapon
  const weaponGrind = useAtomValue(grindStateFamily("weapon"))
  const potential = useAtomValue(weaponPotentialAtom)

  const unit1 = useAtomValue(equipStateFamily("unit1")) as Unit
  const unit2 = useAtomValue(equipStateFamily("unit2")) as Unit
  const unit3 = useAtomValue(equipStateFamily("unit3")) as Unit
  const unit1Grind = useAtomValue(grindStateFamily("unit1"))
  const unit2Grind = useAtomValue(grindStateFamily("unit2"))
  const unit3Grind = useAtomValue(grindStateFamily("unit3"))

  const name = useAtomValue(classNameAtom)
  const level = useAtomValue(levelAtom)
  const skillPoints = useAtomValue(skillpointAtom)
  const augments = useAtomValue(allAugmentsAtom)

  const bp = bpTotal({
    character: {
      name,
      level,
    },
    skillPoints,
    weapon: {
      weapon,
      grind: weaponGrind,
      potential,
    },
    units: [
      { unit: unit1, grind: unit1Grind },
      { unit: unit2, grind: unit2Grind },
      { unit: unit3, grind: unit3Grind },
    ],
    augments,
  })

  return bp.toNumber()
}
