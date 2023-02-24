import { atomWithQuery } from "atomTools"
import { allClassData } from "augmenting/data/classes"
import { ClassAbbreviation } from "augmenting/types"
import { atom } from "jotai"
import { MAX_LEVEL, MAX_SKILLPOINTS } from "../data/consts"

export const classNameAtom = atomWithQuery<ClassAbbreviation>("cls", "Hu")

const levelAtomRaw = atomWithQuery("lv", MAX_LEVEL)

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

export const skillpointAtom = atomWithQuery("sp", MAX_SKILLPOINTS)
