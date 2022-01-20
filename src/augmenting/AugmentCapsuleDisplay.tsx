import { SingleAugmentDisplay } from "./AugmentCapsuleDisplay/SingleAugmentLine"
import { MultiAugmentDisplay } from "./AugmentCapsuleDisplay/MultiAugmentLine"
import { Stack } from "@mui/material"
import { AugmentSearch } from "./AugmentCapsuleDisplay/AugmentSearch"
import { augmentGroupsAtom } from "./AugmentCapsuleDisplay/augmentSearchState"
import { useAtomValue } from "jotai/utils"

function CapsuleList() {
  const augmentGroups = useAtomValue(augmentGroupsAtom)

  return (
    <Stack>
      {augmentGroups.map(([groupName, augments]) =>
        augments.length === 1 ? (
          <SingleAugmentDisplay key={groupName} augment={augments[0]} />
        ) : (
          <MultiAugmentDisplay key={groupName} augments={augments} />
        ),
      )}
    </Stack>
  )
}

export function AugmentCategoryDisplay() {
  return (
    <>
      <AugmentSearch />
      <CapsuleList />
    </>
  )
}
