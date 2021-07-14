import HPCapsuleImage from "./NGSUIItemHPCapsule.png"
import PPCapsuleImage from "./NGSUIItemPPCapsule.png"
import MightCapsuleImage from "./NGSUIItemMightCapsule.png"
import PrecisionCapsuleImage from "./NGSUIItemPrecisionCapsule.png"
import TechniqueCapsuleImage from "./NGSUIItemTechniqueCapsule.png"
import WardCapsuleImage from "./NGSUIItemWardCapsule.png"
import SpecialCapsuleImage from "./NGSUIItemSpecialCapsule.png"

export type CapsuleImageType =
  | "hp"
  | "pp"
  | "might"
  | "precision"
  | "technique"
  | "ward"
  | "special"

export const CapsuleImageFromType: Record<CapsuleImageType, string> = {
  hp: HPCapsuleImage,
  pp: PPCapsuleImage,
  might: MightCapsuleImage,
  precision: PrecisionCapsuleImage,
  technique: TechniqueCapsuleImage,
  ward: WardCapsuleImage,
  special: SpecialCapsuleImage,
}
