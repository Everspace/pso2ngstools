import {
  AppBar,
  Button,
  Toolbar,
  Container,
  Typography,
  Box,
} from "@mui/material"
import { ReactFragment, ReactNode } from "react"
import { useRouter } from "next/router"

type AppProps = {
  children: ReactNode | ReactFragment
}

function Layout({ children }: AppProps) {
  const router = useRouter()
  return (
    <>
      <AppBar position="static" sx={{ mb: 2 }}>
        <Toolbar>
          <Typography variant="h6" component="div">
            <Button
              size="large"
              color="inherit"
              href="/"
              onClick={() => router.push("/")}
            >
              PSO2:NGS Tools
            </Button>
          </Typography>
        </Toolbar>
      </AppBar>
      <main>
        <Box
          component="main"
          sx={{
            bgcolor: "background.paper",
          }}
        >
          <Container maxWidth="xl">{children}</Container>
        </Box>
      </main>
    </>
  )
}

export default Layout
