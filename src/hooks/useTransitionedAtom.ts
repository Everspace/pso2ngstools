import { WritableAtom } from "jotai"
import { useTransition } from "react"
import { useUpdateAtom } from "jotai/utils"

/**
 * useUpdate
 */
export default function useTransitionedAtom<Value, Update>(
  atom: WritableAtom<Value, Update>,
): [boolean, (v: Update) => void] {
  const func = useUpdateAtom(atom)
  const [pending, startTransition] = useTransition()
  return [pending, (v: Update) => startTransition(() => func(v))]
}
