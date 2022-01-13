import { Box, Grid, Paper, Typography } from "@mui/material"
import { useAtomValue } from "jotai/utils"
import { ChangeClassDropdown } from "./ChangeClassDropdown"
import { ChangeLevelDropdown } from "./ChangeLevelDropdown"
import { ChangeSkillpoints } from "./ChangeSkillpoints"
import { classBpAtom } from "./state/bpState"
import { skillpointAtom } from "./state/characterState"
export function CharacterBPDisplay() {
  const skillpoint = useAtomValue(skillpointAtom)
  const classBpRaw = useAtomValue(classBpAtom)

  const classBp = classBpRaw.toNumber()
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
