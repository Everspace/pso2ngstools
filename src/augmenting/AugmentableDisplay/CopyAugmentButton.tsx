import { Button } from "@mui/material"
import {
  copyAugmentAtom,
  CopyAugmentAtomOptions,
} from "augmenting/state/equipmentState"
import useTransitionedAtom from "hooks/useTransitionedAtom"
import { capitalize } from "lodash"

type CopyAugmentButtonProps = CopyAugmentAtomOptions

export function CopyAugmentButton({ from, to }: CopyAugmentButtonProps) {
  const [, set] = useTransitionedAtom(copyAugmentAtom)
  return (
    <Button
      size="small"
      onClick={() => {
        set({ from, to })
      }}
    >
      Copy to {capitalize(to)}
    </Button>
  )
}
