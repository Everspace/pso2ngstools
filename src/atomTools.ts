import { Router } from "next/router"

type SubscriptionFunc = (callback: () => void) => () => void

export const subscribeToRouter: SubscriptionFunc = (callback) => {
  Router.events.on("routeChangeComplete", callback)
  window?.addEventListener("hashchange", callback)
  return () => {
    Router.events.off("routeChangeComplete", callback)
    window?.removeEventListener("hashchange", callback)
  }
}
