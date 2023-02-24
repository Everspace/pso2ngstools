import { atomWithStorage } from "jotai/utils"
import { unstable_NO_STORAGE_VALUE as NO_STORAGE_VALUE } from "jotai/vanilla/utils"
import { Router } from "next/router"

// A copy of jotai-locations atomWithHash but with queryParams
export function atomWithQuery<Value>(
  key: string,
  initialValue: Value,
  options?: {
    serialize?: (val: Value) => string
    deserialize?: (str: string | null) => Value | typeof NO_STORAGE_VALUE
  },
) {
  const serialize = options?.serialize || JSON.stringify
  let cachedStr: string | undefined = serialize(initialValue)
  let cachedValue: Value = initialValue

  const deserialize =
    options?.deserialize ||
    ((str) => {
      str = str || ""
      if (cachedStr !== str) {
        try {
          cachedValue = JSON.parse(str) as Value
        } catch {
          return NO_STORAGE_VALUE
        }
        cachedStr = str
      }
      return cachedValue
    })

  const setLocation = (uri: URL) => {
    window.history.replaceState(null, "", uri)
  }

  return atomWithStorage(key, initialValue, {
    getItem: (k: string) => {
      if (typeof window === "undefined" || !window.location) {
        return NO_STORAGE_VALUE
      }
      const uri = new URL(window.location.href)
      const storedValue = uri.searchParams.get(k)
      return deserialize(storedValue)
    },
    setItem(k, newValue) {
      const uri = new URL(window.location.href)
      const serializedParamValue = serialize(newValue)
      uri.searchParams.set(k, serializedParamValue)
      setLocation(uri)
      // Update local cache when setItem is called directly
      cachedStr = serializedParamValue
      cachedValue = newValue
    },
    removeItem(k) {
      const uri = new URL(window.location.href)
      uri.searchParams.delete(k)
      setLocation(uri)
    },
    subscribe(key, setValue) {
      const handleUrlChange = (url: string) => {
        const uri = new URL(url)
        const val = uri.searchParams.get(key)
        if (val) {
          setValue(JSON.parse(val))
        } else {
          setValue(initialValue)
        }
      }
      return () => {
        Router.events.on("routeChangeComplete", handleUrlChange)
        return () => {
          Router.events.off("routeChangeComplete", handleUrlChange)
        }
      }
    },
  })
}
