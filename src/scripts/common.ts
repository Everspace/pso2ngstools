import { GrindLevel, MAX_GRIND } from "augmenting/types"
import fs from "fs/promises"

export const MAX_GRIND_KEY: GrindLevelHeader = `Grind${MAX_GRIND}`

export type GrindLevelHeader = `Grind${GrindLevel}`
export type HasGrindLevels = Record<GrindLevelHeader, string>
export type Replace<T, Target, Substitute> = {
  [K in keyof T]: T[K] extends Target ? Substitute : T[K]
}

export type RecordSheet<T extends string> = { [P in T]: string }

export function limitToIndex(limit: string): number {
  return Math.floor(Number(limit) / 10)
}

export const toNumberOrNull = <T>(what: T): number | null =>
  what === "" || what === undefined || what === null ? null : Number(what)

export function grindRowToArray(row: HasGrindLevels): (number | null)[] {
  return Object.entries(row)
    .filter((entry) => entry[0].startsWith("Grind"))
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map((entry) => toNumberOrNull(entry[1]))
}

export async function writeFileJson(data: unknown, dest: string) {
  const destFile = await fs.open(dest, "w")
  destFile.writeFile(JSON.stringify(data, null, 2))
  destFile.close()
}
