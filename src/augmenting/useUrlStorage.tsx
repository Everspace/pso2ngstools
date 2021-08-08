import { useState, useEffect } from "react"
import { useHistory, useParams } from "react-router"
import { allAugments, Augment } from "./data/augment"
import { useAugmentable } from "./state"

type Serialized = {
  w: string[]
  "1": string[]
  "2": string[]
  "3": string[]
}

const emptyState = "eyIxIjpbXSwiMiI6W10sIjMiOltdLCJ3IjpbXX0="

const fromId = (id: string): Serialized => {
  return JSON.parse(atob(id))
}

const toId = (object: any) => {
  return btoa(JSON.stringify(object))
}

const revivify = (names: string[]): Augment[] => {
  return names
    .map((name) => allAugments.find((a) => a.name === name))
    .filter((x) => x) as Augment[]
}

export const useUrlStorage = () => {
  const { data } = useParams<{ data?: string }>()

  const { augments: unit1, setAugments: setunit1Augments } =
    useAugmentable("unit1")
  const { augments: unit2, setAugments: setunit2Augments } =
    useAugmentable("unit2")
  const { augments: unit3, setAugments: setunit3Augments } =
    useAugmentable("unit3")
  const { augments: weapon, setAugments: setweaponAugments } =
    useAugmentable("weapon")

  const hist = useHistory()
  // Skip seralizing back to the URL until after the first pass
  const [readUrl, setReadUrl] = useState(false)

  useEffect(() => {
    setReadUrl(true)
    const {
      w,
      "1": unit1,
      "2": unit2,
      "3": unit3,
    } = fromId(data ?? emptyState) as Serialized
    setweaponAugments(revivify(w))
    setunit1Augments(revivify(unit1))
    setunit2Augments(revivify(unit2))
    setunit3Augments(revivify(unit3))
  }, [
    hist,
    data,
    setReadUrl,
    setweaponAugments,
    setunit1Augments,
    setunit2Augments,
    setunit3Augments,
  ])

  useEffect(() => {
    if (!readUrl) return
    const seralized = toId({
      w: weapon.map((x) => x.name),
      "1": unit1.map((x) => x.name),
      "2": unit2.map((x) => x.name),
      "3": unit3.map((x) => x.name),
    })
    const path = `/augment/${seralized}`
    if (path !== hist.location.pathname) hist.push(path)
  }, [hist, readUrl, weapon, unit1, unit2, unit3])
  return
}
