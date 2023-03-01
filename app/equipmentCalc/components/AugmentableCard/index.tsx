import { AugmentableSlot } from "augmenting/types"
import AugmentList from "./AugmentList"

export default function AugmentableCard({ slot }: { slot: AugmentableSlot }) {
  return (
    <div className="rounded border px-3 py-2 shadow">
      <h3 className="mb-1 text-lg capitalize">{slot}</h3>
      <AugmentList slot={slot} />
    </div>
  )
}
