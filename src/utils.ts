export const fromId = (val: string): any => {
  return JSON.parse(window.atob(val))
}

export const toId = (object: any) => {
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
export function transformValues<T>(
  obj: Record<ValidKey, T>,
  transform: (entry: T) => T,
): Record<ValidKey, T> {
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [k, transform(v)]),
  )
}

/**
 * Turns a table of k,v to a table of v,k
 */
export function flipTable(table: Record<ValidKey, ValidKey>) {
  return Object.fromEntries(
    Object.entries(table).map(([k, v]) => [v, k]),
  ) as Record<ValidKey, ValidKey>
}
