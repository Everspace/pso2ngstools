import { allClassData } from "augmenting/data/classes"
import { ClassAbbreviation } from "augmenting/types"
import { atom } from "jotai"
import { atomWithHash } from "jotai/utils"
import { MAX_LEVEL, MAX_SKILLPOINTS } from "../data/consts"

export const classNameAtom = atomWithHash<ClassAbbreviation>("cls", "Hu", {
  replaceState: true,
})

const levelAtomRaw = atomWithHash("lv", MAX_LEVEL, {
  replaceState: true,
})

export const levelAtom = atom<number, number>(
  (get) => get(levelAtomRaw),
  async (get, set, update) => {
    const currentValue = get(levelAtomRaw)
    if (currentValue !== update && update > MAX_LEVEL)
      return set(levelAtomRaw, MAX_LEVEL)
    if (update < 1) return set(levelAtomRaw, 1)
    set(levelAtomRaw, update)
  },
)

export const classInfoAtom = atom(async (get) => {
  const className = get(classNameAtom)
  const classLevel = get(levelAtom)
  return allClassData[className][classLevel]
})

export const skillpointAtom = atomWithHash("sp", MAX_SKILLPOINTS, {
  replaceState: true,
})
