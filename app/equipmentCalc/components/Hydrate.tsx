"use client"

import { queryParamString } from "atomTools"
import { useHydrateAtoms } from "jotai/utils"

export default function Hydrate({
  children,
  query = "",
}: React.PropsWithChildren<{ query?: string }>) {
  useHydrateAtoms([[queryParamString, query]])
  return <>{children}</>
}
