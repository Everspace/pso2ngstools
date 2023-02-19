import { ExpandMore } from "@mui/icons-material"
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grid,
  Paper,
  Typography,
} from "@mui/material"
import { NumberInput } from "components/NumberInput"
import { ClassIcon } from "icons"
import { useAtomValue } from "jotai/react"
import { ChangeClassDropdown } from "./ChangeClassDropdown"
import {
  classNameAtom,
  levelAtom,
  skillpointAtom,
} from "./state/characterState"
import { MAX_LEVEL, MAX_SKILLPOINTS } from "./data/consts"
import { getClassBp, getSkillpointBp } from "./bpCalc"

export function CharacterBPDisplay() {
  const skillpoint = useAtomValue(skillpointAtom)
  const level = useAtomValue(levelAtom)
  const name = useAtomValue(classNameAtom)
  const classBp = getClassBp({ name, level }).toNumber()
  const skillBp = getSkillpointBp(skillpoint).toNumber()

  return (
    <Paper>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Grid container justifyItems="center" alignItems="flex-start">
            <Grid item>
              <ClassIcon shortname={name} />
            </Grid>
            <Grid item>
              <Typography>
                Lv.{level} {name} ({skillpoint} Skillpoints):{" "}
                {classBp + skillBp} BP
              </Typography>
            </Grid>
          </Grid>
        </AccordionSummary>
        <AccordionDetails>
          <Grid
            container
            direction="row"
            justifyContent="flex-start"
            alignItems="center"
            rowSpacing={2}
            columnSpacing={1}
          >
            <Grid item xs="auto">
              <ChangeClassDropdown />
            </Grid>
            <Grid item xs="auto">
              <NumberInput
                label={`Lv (Max ${MAX_LEVEL})`}
                atom={levelAtom}
                max={MAX_LEVEL}
                min={1}
                resetValue={MAX_LEVEL}
                sx={{ maxWidth: 120 }}
              />
            </Grid>
            <Grid item xs="auto">
              <NumberInput
                label={`Skillpoints (${MAX_SKILLPOINTS})`}
                atom={skillpointAtom}
                resetValue={MAX_SKILLPOINTS}
                sx={{ maxWidth: 120 }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md>
              <Typography>
                (Class: {classBp} BP + Skill: {skillBp * 2} [{skillBp} Main +{" "}
                {skillBp} Sub] BP)
              </Typography>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </Paper>
  )
}
