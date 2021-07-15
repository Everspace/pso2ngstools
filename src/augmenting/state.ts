import { WritableAtom, Getter, Setter, atom } from "jotai"
import { Augment, AugmentStat, sumAugmentStats } from "./data/augment"

export const maxAugmentAtom = atom(4)

const addAugment =
  (target: WritableAtom<Augment[], Augment[]>) =>
  (get: Getter, set: Setter, augment: Augment) => {
    const max = get(maxAugmentAtom)
    const oldState = get(target)
    const newState = [
      ...oldState.filter((a) => a.category !== augment.category),
      augment,
    ].sort((a, b) => a.name.localeCompare(b.name))
    if (newState.length > max) return
    set(target, newState)
  }

const removeAugment =
  (target: WritableAtom<Augment[], Augment[]>) =>
  (get: Getter, set: Setter, augment: Augment) => {
    set(
      target,
      get(target).filter((c) => c.name !== augment.name),
    )
  }

export const weaponAugmentsAtom = atom([] as Augment[])
export const addWeaponAugmentAtom = atom<unknown, Augment>(
  null,
  addAugment(weaponAugmentsAtom),
)
export const removeWeaponAugmentAtom = atom<unknown, Augment>(
  null,
  removeAugment(weaponAugmentsAtom),
)

export const unit1AugmentsAtom = atom([] as Augment[])
export const addUnit1AugmentAtom = atom<unknown, Augment>(
  null,
  addAugment(unit1AugmentsAtom),
)
export const removeUnit1AugmentAtom = atom<unknown, Augment>(
  null,
  removeAugment(unit1AugmentsAtom),
)

export const unit2AugmentsAtom = atom([] as Augment[])
export const addUnit2AugmentAtom = atom<unknown, Augment>(
  null,
  addAugment(unit2AugmentsAtom),
)
export const removeUnit2AugmentAtom = atom<unknown, Augment>(
  null,
  removeAugment(unit2AugmentsAtom),
)

export const unit3AugmentsAtom = atom([] as Augment[])
export const addUnit3AugmentAtom = atom<unknown, Augment>(
  null,
  addAugment(unit3AugmentsAtom),
)
export const removeUnit3AugmentAtom = atom<unknown, Augment>(
  null,
  removeAugment(unit3AugmentsAtom),
)

const allAugmentibles = [
  weaponAugmentsAtom,
  unit1AugmentsAtom,
  unit2AugmentsAtom,
  unit3AugmentsAtom,
]

export const statTotalAtom = atom<AugmentStat>((get) =>
  sumAugmentStats(allAugmentibles.flatMap((a) => get(a))),
)
