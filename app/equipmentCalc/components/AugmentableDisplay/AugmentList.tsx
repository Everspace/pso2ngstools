"use client"

import { augmentableFamily } from "augmenting/state/augmentableState"
import { augmentsPerSlotAtom } from "augmenting/state/equipmentState"
import { AugmentableSlot } from "augmenting/types"
import { useAtomValue } from "jotai"
import { AugmentSearch } from "./AugmentSearch"

type AugmentSlotListProps = {
  slot: AugmentableSlot
}

export default function AugmentList({ slot }: AugmentSlotListProps) {
  const augments = useAtomValue(augmentableFamily(slot))
  const max = useAtomValue(augmentsPerSlotAtom)
  const displayEmpty = augments.length < max

  return (
    <div>
      {augments.map((aug, index) => (
        <div key={`${slot}aug${index}`}>
          <AugmentSearch slot={slot} number={index} augment={aug} />
        </div>
      ))}
      {displayEmpty ? (
        <div>
          <AugmentSearch
            slot={slot}
            number={augments.length}
            key={`${slot}aug${augments.length}`}
          />
        </div>
      ) : null}
    </div>
  )
}
