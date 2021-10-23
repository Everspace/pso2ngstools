import { AugmentLine, AugmentLineHeader } from "./AugmentLine"
import { Augment } from "../data/augment"

interface SingleAugmentDisplayProps {
  augment: Augment
}

export const SingleAugmentDisplay = ({
  augment,
}: SingleAugmentDisplayProps) => {
  return (
    <AugmentLine augment={augment}>
      <AugmentLineHeader>{augment.name}</AugmentLineHeader>
    </AugmentLine>
  )
}
