import { atom } from "jotai/vanilla"
import { RESET } from "jotai/vanilla/utils"
// import { Router } from "next/router"

type QuerySetAction = {
  type: "set"
  key: string
  value: string
}

type QueryDeleteAction = {
  type: "delete"
  key: string
}
type QueryAction = QuerySetAction | QueryDeleteAction

new URLSearchParams()

export const queryParamString = atom("")
export const queryParams = atom(
  (get) => {
    return new URLSearchParams(get(queryParamString))
  },
  (_, set, action: QueryAction) => {
    const here = new URL(window.location.href)
    switch (action.type) {
      case "set": {
        here.searchParams.set(action.key, action.value)
        break
      }
      case "delete": {
        here.searchParams.delete(action.key)
        break
      }
    }
    window.history.replaceState(null, "", here)
    set(queryParamString, here.searchParams.toString())
  },
)

// A copy of jotai-locations atomWithHash but with queryParams
export function atomWithQuery<Value>(
  key: string,
  initialValue: Value,
  options?: {
    serialize?: (val: Value) => string
    deserialize?: (str: string | null) => Value
  },
) {
  const serialize = options?.serialize || JSON.stringify

  const deserialize =
    options?.deserialize ||
    ((str) => {
      return str ? (JSON.parse(str) as Value) : initialValue
    })

  return atom(
    (get) => {
      const val = get(queryParams).get(key)
      return deserialize(val)
    },
    (get, set, val: Value | typeof RESET) => {
      if (val === RESET) {
        set(queryParams, { type: "delete", key })
        return
      }
      set(queryParams, { type: "set", key, value: serialize(val) })
    },
  )
}
