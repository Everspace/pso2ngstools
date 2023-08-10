import { ExpandMore } from "@mui/icons-material"
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Typography,
  Stack,
  alpha,
} from "@mui/material"
import { styled } from "@mui/system"
import {
  activityNameByRegion,
  activityByName,
  allRegions,
} from "./data/bprequirements"
import { DEFAULT_ACTIVITIES } from "./data/consts"
import { useTotalBp } from "./hooks"
import { CombatActivity } from "./types"

const GroupItem = styled(Grid)(({ theme }) => ({
  minWidth: 20,
  border: 0,
  display: "flex",
  borderRadius: theme.shape.borderRadius,
  "&:not(:first-of-type)": {
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    borderLeft: 1,
    borderStyle: "solid",
    borderColor: alpha(theme.palette["success"].main, 0.5),
  },
  "&:not(:last-of-type)": {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
}))

const GroupContainer = styled(Grid)(({ theme }) => ({
  display: "inline-flex",
  border: 1,
  borderStyle: "solid",
  borderColor: alpha(theme.palette["success"].main, 0.5),
  borderRadius: theme.shape.borderRadius,
  boxShadow: "none",
}))

function CombatActivityChip({ activity }: { activity: CombatActivity }) {
  const bp = useTotalBp()
  const meetsRequirement = activity.bp <= bp
  return (
    <GroupItem
      px={1}
      sx={{
        backgroundColor: meetsRequirement ? "success.main" : "default",
      }}
      item
      alignContent="center"
      key={activity.rank}
      xs="auto"
    >
      <Typography sx={{ margin: "auto" }} component="span">
        {activity.rank}
        {meetsRequirement ? null : ` (${activity.bp} bp)`}
      </Typography>
    </GroupItem>
  )
}

function CombatActivityGroup({ activities }: { activities: CombatActivity[] }) {
  const [{ name, type }] = activities
  return (
    <Grid container alignItems="center" spacing={1}>
      <Grid item xs="auto">
        <Typography component="span">
          {type}: {name}{" "}
        </Typography>
      </Grid>
      <Grid item>
        <GroupContainer container>
          {activities.map((a) => (
            <CombatActivityChip key={a.region + a.name + a.rank} activity={a} />
          ))}
        </GroupContainer>
      </Grid>
    </Grid>
  )
}

function RegionActivities({ region }: { region: string }) {
  const activities = activityNameByRegion[region]
  return (
    <Grid
      container
      spacing={1}
      my={1}
      sx={{ borderTop: 1, borderColor: "text.disabled" }}
    >
      <Grid item xs={12}>
        <Typography variant="h5">{region}</Typography>
      </Grid>
      {activities.map((name) => (
        <Grid item key={name} md={4}>
          <CombatActivityGroup activities={activityByName[name]} />
        </Grid>
      ))}
    </Grid>
  )
}

export function ActivityDisplay() {
  return (
    <Accordion TransitionProps={{ unmountOnExit: true }}>
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Grid container>
          <Grid item xs={2}>
            BP Requirements
          </Grid>
          <Grid item container xs={10} spacing={1}>
            {DEFAULT_ACTIVITIES.map((activity) => (
              <Grid item key={`${activity.name}${activity.rank}`}>
                <CombatActivityGroup activities={[activity]} />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </AccordionSummary>
      <AccordionDetails>
        <Stack>
          {allRegions.map((r) => (
            <RegionActivities region={r} key={r} />
          ))}
        </Stack>
      </AccordionDetails>
    </Accordion>
  )
}
