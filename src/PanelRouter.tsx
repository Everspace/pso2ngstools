import { HomePage } from "HomePage"
import { Suspense, lazy } from "react"
import { Routes, Route } from "react-router-dom"

const AugmentPanel = lazy(() => import("augmenting/AugmentPanel"))

export default function PanelRouter() {
  return (
    <Suspense fallback="Loading...">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="augment" element={<AugmentPanel />} />
      </Routes>
    </Suspense>
  )
}
