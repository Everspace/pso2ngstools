import { AugmentableSlot } from "augmenting/types"
import AugmentList from "./AugmentList"

export default function AugmentableCard({ slot }: { slot: AugmentableSlot }) {
  return (
    <div className="border px-4 py-2">
      <div>{slot}</div>
      <AugmentList slot={slot} />
    </div>
  )
}
