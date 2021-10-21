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
import { Box, IconButton, Stack, Tab, Tabs, TextField } from "@mui/material"
import { Clear, Search } from "@mui/icons-material"

const CategoryPane = ({ category }: { category: AugmentCategory }) => {
  const [searchRaw, setSearch] = useState<string>("")
  const search = searchRaw.toLocaleLowerCase()

  const handleSearchInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setSearch(e.target.value),
    [setSearch],
  )

  const filterateGroupname = (entry: [string, Augment[]]) => {
    if (search === "") return true
    return entry[0].toLocaleLowerCase().indexOf(search) > -1
  }

  const filterateGroupless = (a: Augment) => {
    if (search === "") return true
    return a.name.toLocaleLowerCase().indexOf(search) > -1
  }

  const groups = groupBy(augmentByCategory[category], (a) =>
    a.baseName ? "base" : "noBase",
  )

  const base = groups["base"]
  const noBase: Augment[] | undefined = groups["noBase"]

  const baseGroups = groupBy(base, (a) => a.baseName)

  return (
    <Box>
      <Box>
        <Box sx={{ display: "flex", alignItems: "flex-end" }}>
          <Search sx={{ color: "action.active", mr: 1, my: 0.5 }} />
          <TextField
            value={search}
            InputLabelProps={{ shrink: search !== "" }}
            onChange={handleSearchInput}
            label="Search"
            variant="standard"
          />
          {search !== "" ? (
            <IconButton
              color="error"
              onClick={() => setSearch("")}
              size="small"
            >
              <Clear />
            </IconButton>
          ) : null}
        </Box>
      </Box>
      <Box>
        <Stack>
          {Object.entries(baseGroups)
            .filter(filterateGroupname)
            .map(([group, augments]) => (
              <MultiAugmentDisplay
                key={group}
                group={group}
                augments={augments}
              />
            ))}
          {noBase
            ? noBase
                .filter(filterateGroupless)
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
