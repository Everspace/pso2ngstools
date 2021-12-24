import allTheBeans from "./Weapons.json"
import { Weapon } from "augmenting/types"

export const allWeapons: Record<string, Weapon> =
  allTheBeans as unknown as Record<string, Weapon>
