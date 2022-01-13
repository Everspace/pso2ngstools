import { ClassAbbreviation } from "augmenting/types"
import { atomWithHash } from "jotai/utils"

export const classNameAtom = atomWithHash<ClassAbbreviation>("cls", "Hu", {
  replaceState: true,
})

export const MAX_LEVEL = 35

export const levelAtom = atomWithHash("lv", MAX_LEVEL, {
  replaceState: true,
})

export const MAX_SKILLPOINTS = 30
export const skillpointAtom = atomWithHash("sp", MAX_SKILLPOINTS, {
  replaceState: true,
})
