import { Grid, Paper, Typography } from "@mui/material"
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
      <Grid
        container
        p={1}
        direction="row"
        justifyContent="flex-start"
        alignItems="center"
        spacing={1}
      >
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
            Base: {classBp + skillBp} BP (Class: {classBp} BP + Skill: {skillBp}{" "}
            BP)
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  )
}
