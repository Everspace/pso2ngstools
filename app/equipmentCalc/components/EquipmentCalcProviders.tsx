"use client"

import { Provider } from "jotai/react"
import { equipmentCalcStore } from "../state/store"

export default function EquipmentCalcProviders({
  children,
}: React.PropsWithChildren) {
  return <Provider store={equipmentCalcStore}>{children}</Provider>
}
