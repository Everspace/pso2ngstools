import { Box, Grid, Paper, Typography } from "@mui/material"
import { useAtomValue } from "jotai/utils"
import { ChangeClassDropdown } from "./ChangeClassDropdown"
import { ChangeLevelDropdown } from "./ChangeLevelDropdown"
import { ChangeSkillpoints } from "./ChangeSkillpoints"
import { getClassBp } from "./state/bpState"
import { classInfoAtom, skillpointAtom } from "./state/characterState"

export function CharacterBPDisplay() {
  const classInfo = useAtomValue(classInfoAtom)
  const skillpoint = useAtomValue(skillpointAtom)
  const classBp = getClassBp(classInfo).toNumber()
  const skillBp = skillpoint * 2 * 3
  return (
    <Paper>
      <Box p={2}>
        <Grid
          container
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
          rowSpacing={2}
          columnSpacing={1}
        >
          <Grid item xs={12}>
            <Typography>Class: {classBp + skillBp} BP</Typography>
          </Grid>
          <Grid item>
            <ChangeLevelDropdown />
          </Grid>
          <Grid item>
            <ChangeClassDropdown />
          </Grid>
          <Grid item>
            <ChangeSkillpoints />
          </Grid>
          <Grid item>
            <Typography>
              (Class: {classBp} BP + Skill: {skillBp} BP)
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  )
}
