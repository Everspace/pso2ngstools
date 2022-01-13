export const fromId = (val: string): any => {
  return JSON.parse(window.atob(val))
}

export const toId = (object: any) => {
  return window.btoa(JSON.stringify(object))
}

type ValidKeyType = string | number | symbol

/**
 * Using a table, map the keys of object to the results in the table.
 *
 * Used for shortening keys like "weapon" to "w" and back again.
 */
export const translateKeys = <T extends Record<string, any>>(
  table: Record<keyof T, string>,
  obj: T,
): any => {
  return Object.fromEntries(Object.entries(obj).map(([k, v]) => [table[k], v]))
}

/**
 * Use `transform` to change every value in an object
 */
export function transformValues<T>(
  obj: Record<ValidKeyType, T>,
  transform: (entry: T) => T,
): Record<ValidKeyType, T> {
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [k, transform(v)]),
  )
}

/**
 * Turns a table of k,v to a table of v,k
 */
export function flipTable<T extends Record<string, ValidKeyType>>(table: T) {
  return Object.fromEntries(
    Object.entries(table).map(([k, v]) => [v, k]),
  ) as Record<ValidKeyType, keyof T>
}
