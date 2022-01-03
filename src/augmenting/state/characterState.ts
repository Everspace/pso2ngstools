import { allClassData } from "augmenting/data/class"
import { ClassAbbreviation } from "augmenting/types"
import { atom, WritableAtom } from "jotai"
import { atomWithHash, RESET } from "jotai/utils"

function minMaxResetAtom(
  min: number,
  max: number,
  reset: number,
  storingAtom?: WritableAtom<number, number>,
): WritableAtom<number, number | typeof RESET, void> {
  const targetAtom = storingAtom ?? atom(reset)

  return atom(
    (get) => get(targetAtom),
    (_, set, update) => {
      if (update === RESET) return set(targetAtom, reset)
      if (update > max) return set(targetAtom, max)
      if (update < min) return set(targetAtom, min)
      return set(targetAtom, update)
    },
  )
}

export const classNameAtom = atomWithHash<ClassAbbreviation>("cls", "Gu")

export const MAX_LEVEL = 35

export const levelAtom = minMaxResetAtom(
  1,
  MAX_LEVEL,
  MAX_LEVEL,
  atomWithHash("lv", MAX_LEVEL),
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
