"use client"

import { Provider as JotaiProvider } from "jotai/react"
import { equipmentCalcStore } from "../state/store"

export default function EquipmentCalcProviders({
  children,
}: React.PropsWithChildren) {
  return <JotaiProvider store={equipmentCalcStore}>{children}</JotaiProvider>
}
