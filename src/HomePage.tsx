import {
  Typography,
  Card,
  CardActionArea,
  CardContent,
  Grid,
} from "@mui/material"
import { PropsWithChildren, ReactText, useCallback } from "react"

import { useNavigate } from "react-router"

type LinkProps = PropsWithChildren<{
  to: string
  title: string
  children: ReactText
}>

function DisplayLink({ to, title, children }: LinkProps) {
  const navigate = useNavigate()
  const nav = useCallback(() => {
    navigate(to)
  }, [to, navigate])
  return (
    <Grid item xs={4}>
      <Card onClick={nav}>
        <CardActionArea>
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {children}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Grid>
  )
}

export function HomePage() {
  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <Typography>Here's a bunch of neat things I have made</Typography>
      </Grid>
      <DisplayLink to="/augment" title="Augment Calculator">
        Figure out your BP, and stats
      </DisplayLink>
    </Grid>
  )
}
