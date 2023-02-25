import { ValueOf } from "next/dist/shared/lib/constants"

export const fromId = <T>(val: string): T => {
  return JSON.parse(window.atob(val))
}

export const toId = <T>(object: T) => {
  return window.btoa(JSON.stringify(object))
}

type ValidKey = string | number | symbol
type FlippableRecord = Record<ValidKey, ValidKey>

/**
 * Using a table, map the keys of object to the results in the table.
 *
 * Used for shortening keys like "weapon" to "w" and back again.
 */
export const translateKeys = <Source extends FlippableRecord>(
  table: Record<keyof Source, ValidKey>,
  obj: Source,
) => {
  return Object.fromEntries(Object.entries(obj).map(([k, v]) => [table[k], v]))
}

/**
 * Use `transform` to change every value in an object
 */
export function transformValues<
  K extends string | number | symbol,
  Source extends Record<K, unknown>,
  Target,
>(
  obj: Source,
  transform: (entry: ValueOf<Source>) => Target,
): Record<K, ReturnType<typeof transform>> {
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [k, transform(v as ValueOf<Source>)]),
  ) as Record<K, Target>
}

/**
 * Turns a table of k,v to a table of v,k
 */
export function flipTable(table: Record<ValidKey, ValidKey>) {
  return Object.fromEntries(
    Object.entries(table).map(([k, v]) => [v, k]),
  ) as Record<ValidKey, ValidKey>
}
