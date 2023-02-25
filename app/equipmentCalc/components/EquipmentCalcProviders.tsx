"use client"

import { Provider as JotaiProvider } from "jotai/react"
import { SSRProvider } from "react-aria"
import { equipmentCalcStore } from "../state/store"

export default function EquipmentCalcProviders({
  children,
}: React.PropsWithChildren) {
  return (
    <JotaiProvider store={equipmentCalcStore}>
      <SSRProvider>{children}</SSRProvider>
    </JotaiProvider>
  )
}
