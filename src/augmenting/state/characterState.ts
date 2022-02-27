import { allClassData } from "augmenting/data/class"
import { ClassAbbreviation } from "augmenting/types"
import { atom } from "jotai"
import { atomWithHash } from "jotai/utils"

export const classNameAtom = atomWithHash<ClassAbbreviation>("cls", "Hu", {
  replaceState: true,
})

export const MAX_LEVEL = 40

const levelAtomRaw = atomWithHash("lv", MAX_LEVEL, {
  replaceState: true,
})

export const levelAtom = atom<number, number>(
  (get) => get(levelAtomRaw),
  (get, set, update) => {
    const currentValue = get(levelAtomRaw)
    if (currentValue !== update && update > MAX_LEVEL)
      return set(levelAtomRaw, MAX_LEVEL)
    if (update < 1) return set(levelAtomRaw, 1)
    set(levelAtomRaw, update)
  },
)

export const classInfoAtom = atom((get) => {
  const className = get(classNameAtom)
  const classLevel = get(levelAtom)
  return allClassData[className][classLevel]
})

export const MAX_SKILLPOINTS = 30
export const skillpointAtom = atomWithHash("sp", MAX_SKILLPOINTS, {
  replaceState: true,
})
