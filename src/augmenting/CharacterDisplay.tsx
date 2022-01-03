import { Grid, Paper, Typography } from "@mui/material"
import { useAtom } from "jotai"
import { ChangeClassDropdown } from "./ChangeClassDropdown"
import { ChangeLevelDropdown } from "./ChangeLevelDropdown"
import { getClassBp } from "./state/bpState"
import { classInfoAtom, skillpointAtom } from "./state/characterState"

export function CharacterBPDisplay() {
  const [classInfo] = useAtom(classInfoAtom)
  const [skillpoint] = useAtom(skillpointAtom)
  return (
    <Paper>
      <Grid
        container
        direction="row"
        justifyContent="flex-start"
        alignItems="center"
      >
        <Grid item>
          <ChangeLevelDropdown />
        </Grid>
        <Grid item>
          <ChangeClassDropdown />
        </Grid>
        <Grid item>
          <Typography>
            (Class: {getClassBp(classInfo).toNumber()} BP + Skill:{" "}
            {skillpoint * 3} BP)
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  )
}
