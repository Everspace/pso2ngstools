import { AugmentPanel } from "augmenting/AugmentPanel"
import React from "react"
import { Switch, Route } from "react-router-dom"
type RouteDefinition = {
  path: string
  component: React.ComponentType<any>
}

const routes: RouteDefinition[] = [
  {
    path: "/augment/:data",
    component: AugmentPanel,
  },
  {
    path: "/augment/",
    component: AugmentPanel,
  },
]

export default function PanelRouter() {
  return (
    <Switch>
      {routes.map((def) => (
        <Route key={def.path} path={def.path} component={def.component} />
      ))}
    </Switch>
  )
}
