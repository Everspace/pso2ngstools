import { allClassData } from "augmenting/data/class"
import { ClassAbbreviation } from "augmenting/types"
import { atom } from "jotai"
import { atomWithHash } from "jotai/utils"

export const classNameAtom = atomWithHash<ClassAbbreviation>("cls", "Hu", {
  replaceState: true,
})

export const MAX_LEVEL = 40

export const levelAtom = atomWithHash("lv", MAX_LEVEL, {
  replaceState: true,
})

export const classInfoAtom = atom((get) => {
  const className = get(classNameAtom)
  const classLevel = get(levelAtom)
  return allClassData[className][classLevel]
})

export const MAX_SKILLPOINTS = 30
export const skillpointAtom = atomWithHash("sp", MAX_SKILLPOINTS, {
  replaceState: true,
})
