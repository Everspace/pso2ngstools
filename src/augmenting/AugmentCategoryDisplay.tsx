import { groupBy } from "lodash"
import { SingleAugmentDisplay } from "./AugmentDisplay/SingleAugmentLine"
import { MultiAugmentDisplay } from "./AugmentDisplay/MultiAugmentLine"
import { Stack } from "@mui/material"
import { useAtom } from "jotai"
import { availableAugments } from "./augmentSearchState"
import { AugmentSearch } from "./AugmentSearch"

const CategoryPane = () => {
  const [augments] = useAtom(availableAugments)

  const groups = groupBy(augments, (a) => (a.baseName ? a.baseName : a.name))

  return (
    <Stack>
      {Object.entries(groups)
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([group, augments]) =>
          augments.length === 1 ? (
            <SingleAugmentDisplay key={group} augment={augments[0]} />
          ) : (
            <MultiAugmentDisplay key={group} augments={augments} />
          ),
        )}
    </Stack>
  )
}

export const AugmentCategoryDisplay = () => {
  return (
    <>
      <AugmentSearch />
      <CategoryPane />
    </>
  )
}
