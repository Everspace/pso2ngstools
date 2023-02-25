import { PropsWithChildren } from "react"
import EquipmentCalcProviders from "./components/EquipmentCalcProviders"

export default function Layout({ children }: PropsWithChildren) {
  return <EquipmentCalcProviders>{children}</EquipmentCalcProviders>
}
