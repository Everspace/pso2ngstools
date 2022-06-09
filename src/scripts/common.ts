import { GrindLevel, MAX_GRIND } from "augmenting/types"

export type GrindLevelHeader = `Grind${GrindLevel}`
export type HasGrindLevels = Record<GrindLevelHeader, string>
export type Replace<T, Target, Substitute> = {
  [K in keyof T]: T[K] extends Target ? Substitute : T[K]
}

export type RecordSheet<T extends string> = { [P in T]: string }

export const MAX_GRIND_INDEX = Math.floor(MAX_GRIND / 10)
export const MAX_GRIND_KEY: GrindLevelHeader = `Grind${MAX_GRIND}`

export function limitToIndex(limit: string): number {
  return Math.floor(Number(limit) / 10)
}

export const toNumberOrNull = <T extends any>(what: T): number | null =>
  what === "" || what === undefined || what === null ? null : Number(what)
