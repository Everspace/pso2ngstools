"use client"

import { queryParamString } from "atomTools"
import { useHydrateAtoms } from "jotai/utils"

export default function Hydrate({
  query,
  children,
}: React.PropsWithChildren<{ query: string }>) {
  useHydrateAtoms([[queryParamString, query]])
  return <>{children}</>
}
