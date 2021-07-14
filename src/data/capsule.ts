import { CapsuleImageType } from "images/capsule"
import basic from "./augments/basic.json"
import dread from "./augments/dread.json"
import note from "./augments/note.json"
import secreta from "./augments/secreta.json"
import soul from "./augments/soul.json"

export interface Stat {
  hp?: number
  pp?: number
  /** "Potency +#%" */
  potency?: number
  /** "Potency Floor Increase +#%" */
  floorPotency?: number
  meleePotency?: number
  rangePotency?: number
  techPotency?: number
  /** "Damage Resistance +/-#%" */
  damageResist?: number
}

export type CapsuleCategory =
  | "soul"
  | "ward"
  | "basic"
  | "note"
  | "secreta"
  | "dread"
  | "gigas"
  | "element"

export interface Capsule {
  name: string
  category: CapsuleCategory
  icon: CapsuleImageType
  tier?: number
  baseName?: string
  location?: string

  stat: Stat

  exchange?: Record<string, number>
}

export const resourceNames = [
  "Photon Quartz",
  "Photon Chunk",
  "Monotite",
  "Dualomite",
  "Trinite",
]

export const allCapsules = [
  ...basic,
  ...dread,
  ...note,
  ...secreta,
  ...soul,
] as Array<Capsule>
