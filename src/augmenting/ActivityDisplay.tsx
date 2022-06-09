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
import { useAtomValue } from "jotai"
import {
  activityNameByRegion,
  activityByName,
  allRegions,
} from "./data/bprequirements"
import { bpTotalAtom } from "./state/bpState"
import { DEFAULT_ACTIVITIES } from "./state/consts"
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
  const bp = useAtomValue(bpTotalAtom)
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
          {type === "UQ" ? "UQ " : null}
          {name}:{" "}
        </Typography>
      </Grid>
      <Grid item>
        <GroupContainer container>
          {activities.map((a) => (
            <CombatActivityChip key={a.rank} activity={a} />
          ))}
        </GroupContainer>
      </Grid>
    </Grid>
  )
}

function RegionActivities({ region }: { region: string }) {
  const activities = activityNameByRegion[region]
  return (
    <Grid container spacing={1} mb={1}>
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
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Grid container spacing={1}>
          <Grid item xs={2}>
            BP Requirements
          </Grid>
          {DEFAULT_ACTIVITIES.map((activity) => (
            <Grid item key={activity.name}>
              <CombatActivityGroup activities={[activity]} />
            </Grid>
          ))}
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
