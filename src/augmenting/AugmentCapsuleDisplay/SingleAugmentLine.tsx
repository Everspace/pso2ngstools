import { Augment } from "augmenting/types"
import { AugmentLine, AugmentLineHeader } from "./AugmentLine"

interface SingleAugmentDisplayProps {
  augment: Augment
}

export function SingleAugmentDisplay({ augment }: SingleAugmentDisplayProps) {
  return (
    <AugmentLine augment={augment}>
      <AugmentLineHeader>{augment.name}</AugmentLineHeader>
    </AugmentLine>
  )
}
