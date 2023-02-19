import { allClassData } from "augmenting/data/classes"
import { ClassAbbreviation } from "augmenting/types"
import { atom } from "jotai"
import { atomWithHash } from "jotai-location"
import { MAX_LEVEL, MAX_SKILLPOINTS } from "../data/consts"

export const classNameAtom = atomWithHash<ClassAbbreviation>("cls", "Hu", {
  setHash: "replaceState",
})

const levelAtomRaw = atomWithHash("lv", MAX_LEVEL, {
  setHash: "replaceState",
})

export const levelAtom = atom(
  (get) => get(levelAtomRaw),
  (get, set, update: number) => {
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

export const skillpointAtom = atomWithHash("sp", MAX_SKILLPOINTS, {
  setHash: "replaceState",
})
