import allTheBeans from "./Weapons.json"
import { Weapon } from "augmenting/types"
import { toWeaponReal } from "augmenting/tools"
import { transformValues } from "utils"

export const allWeapons: Record<string, Weapon> = transformValues(
  allTheBeans as unknown as Record<string, Weapon>,
  toWeaponReal,
)
