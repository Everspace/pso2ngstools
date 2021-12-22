export const fromId = (val: string): any => {
  return JSON.parse(window.atob(val))
}

export const toId = (object: any) => {
  return window.btoa(JSON.stringify(object))
}

type ValidKeyType = string | number | symbol

export const translateKeys = <T extends Record<string, any>>(
  table: Record<keyof T, string>,
  obj: T,
): any => {
  return Object.fromEntries(Object.entries(obj).map(([k, v]) => [table[k], v]))
}

export const flipTable = <T extends Record<string, ValidKeyType>>(table: T) => {
  return Object.fromEntries(Object.entries(table).map(([k, v]) => [v, k]))
}
