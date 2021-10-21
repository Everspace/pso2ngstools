import { groupBy } from "lodash"
import { useState, useCallback } from "react"
import { SingleAugmentDisplay } from "./SingleAugmentDisplay"
import {
  allAugmentCategories,
  Augment,
  augmentByCategory,
  AugmentCategory,
} from "./data/augment"
import { MultiAugmentDisplay } from "./MultiAugmentDisplay"
import { Box, Stack, Tab, Tabs } from "@mui/material"

const CategoryPane = ({ category }: { category: AugmentCategory }) => {
  const [search, setSearch] = useState<null | string>(null)
  const groups = groupBy(augmentByCategory[category], (a) =>
    a.baseName ? "base" : "noBase",
  )

  const base = groups["base"]
  const noBase: Augment[] | undefined = groups["noBase"]

  const baseGroups = groupBy(base, (a) => a.baseName)

  const filterate = (a: Augment) => {
    if (!search) return true
    return a.name.indexOf(search) > -1
  }

  return (
    <Box>
      <Box>
        {/* <Input
          action
          value={search ?? ""}
          icon="search"
          iconPosition="left"
          placeholder="Search..."
          onChange={(e) => setSearch(e.target.value)}
        >
          <Icon name="search" />
          <input />
          <Button
            icon="cancel"
            onClick={() => {
              setSearch(null)
            }}
          />
        </Input> */}
      </Box>
      <Box>
        <Stack>
          {Object.entries(baseGroups).map(([group, augments]) => (
            <MultiAugmentDisplay
              key={group}
              group={group}
              augments={augments}
            />
          ))}
          {noBase
            ? noBase
                .filter(filterate)
                .map((a) => <SingleAugmentDisplay key={a.name} augment={a} />)
            : null}
        </Stack>
      </Box>
    </Box>
  )
}

export const AugmentCategoryDisplay = () => {
  const [category, setCategory] = useState<AugmentCategory>(
    allAugmentCategories[0],
  )

  const handleChange = useCallback(
    (event, newValue: AugmentCategory) => {
      setCategory(newValue)
    },
    [setCategory],
  )

  return (
    <>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={category} onChange={handleChange}>
          {allAugmentCategories.map((c) => (
            <Tab key={c} label={c} value={c} />
          ))}
        </Tabs>
        <CategoryPane category={category} />
      </Box>
    </>
  )
}
