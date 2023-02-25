import {
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Typography,
} from "@mui/material"
import Container from "Layout"
import { useRouter } from "next/router"
import { NextPage } from "next/types"
import { PropsWithChildren, ReactFragment, useCallback } from "react"

type LinkProps = PropsWithChildren<{
  to: string
  title: string
  children: ReactFragment
}>

function DisplayLink({ to, title, children }: LinkProps) {
  const router = useRouter()
  const nav = useCallback(() => {
    router.push(to)
  }, [to, router])

  const preload = useCallback(() => {
    router.prefetch(to, undefined)
  }, [to, router])

  return (
    <Grid item xs={4}>
      <Card onClick={nav} onMouseEnter={preload}>
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

const HomePage: NextPage = () => {
  return (
    <Container>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Typography>
            Here&apos;s a bunch of neat things I have made
          </Typography>
        </Grid>
        <DisplayLink to="/augment" title="Augment Calculator">
          Figure out your BP, and stats
        </DisplayLink>
        <DisplayLink to="/home" title="App world">
          Version 2 here we go
        </DisplayLink>
      </Grid>
    </Container>
  )
}

export default HomePage
