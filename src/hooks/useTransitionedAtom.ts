import { ExtractAtomArgs, PrimitiveAtom } from "jotai"
import { useTransition } from "react"
import { useSetAtom } from "jotai"

/**
 * useUpdate
 */
export default function useTransitionedAtom<T extends PrimitiveAtom<unknown>>(
  atom: T,
): [
  boolean,
  (v: ExtractAtomArgs<T> | ExtractAtomArgs<T>[number] | void) => void,
] {
  const func = useSetAtom(atom)
  const [pending, startTransition] = useTransition()
  return [
    pending,
    (v: ExtractAtomArgs<T> | ExtractAtomArgs<T>[number] | void) =>
      startTransition(() => func(v)),
  ]
}
