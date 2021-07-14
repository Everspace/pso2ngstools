import { useAtom } from "jotai"
import { useEffect, useState } from "react"
import { useHistory, useParams } from "react-router"
import { Card, Divider, Header } from "semantic-ui-react"
import { AugmentibleDisplay } from "./AugmentableDisplay"
import { AugmentCategoryDisplay } from "./AugmentCategoryDisplay"
import { AugmentStatDisplay } from "./AugmentStatDisplay"
import { allAugments, Augment, AugmentStat } from "./data/augment"
import {
  removeUnit1AugmentAtom,
  removeUnit2AugmentAtom,
  removeUnit3AugmentAtom,
  removeWeaponAugmentAtom,
  statTotalAtom,
  unit1AugmentsAtom,
  unit2AugmentsAtom,
  unit3AugmentsAtom,
  weaponAugmentsAtom,
} from "./state"

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

const simplifyStat = (stats: AugmentStat): AugmentStat => {
  const potency = stats?.potency ?? 0
  let meleePotency = (stats?.meleePotency ?? 0) + potency
  let rangePotency = (stats?.rangePotency ?? 0) + potency
  let techPotency = (stats?.techPotency ?? 0) + potency

  const compoundStat: AugmentStat = {
    ...stats,
    meleePotency,
    rangePotency,
    techPotency,
  }
  delete compoundStat.potency
  return compoundStat
}

export const AugmentPanel = () => {
  const [stats] = useAtom(statTotalAtom)
  const { data } = useParams<{ data?: string }>()
  const [unit1, setunit1Augments] = useAtom(unit1AugmentsAtom)
  const [unit2, setunit2Augments] = useAtom(unit2AugmentsAtom)
  const [unit3, setunit3Augments] = useAtom(unit3AugmentsAtom)
  const [weapon, setweaponAugments] = useAtom(weaponAugmentsAtom)
  const hist = useHistory()
  // Rehydrate from url changes
  useEffect(() => {
    if (!data) return
    const { w, "1": unit1, "2": unit2, "3": unit3 } = fromId(data) as Serialized
    setweaponAugments(revivify(w))
    setunit1Augments(revivify(unit1))
    setunit2Augments(revivify(unit2))
    setunit3Augments(revivify(unit3))
  }, [data])

  //
  useEffect(() => {
    const seralized = toId({
      w: weapon.map((x) => x.name),
      "1": unit1.map((x) => x.name),
      "2": unit2.map((x) => x.name),
      "3": unit3.map((x) => x.name),
    })
    if (seralized !== emptyState) hist.push(`/augment/${seralized}`)
  }, [weapon, unit1, unit2, unit3])

  return (
    <div>
      <Header as="h1">Augmenting</Header>
      <Card.Group stackable doubling itemsPerRow="4">
        <AugmentibleDisplay
          label="Weapon"
          stateAtom={weaponAugmentsAtom}
          removeAtom={removeWeaponAugmentAtom}
        />
        <AugmentibleDisplay
          label="Unit 1"
          stateAtom={unit1AugmentsAtom}
          removeAtom={removeUnit1AugmentAtom}
        />
        <AugmentibleDisplay
          label="Unit 2"
          stateAtom={unit2AugmentsAtom}
          removeAtom={removeUnit2AugmentAtom}
        />
        <AugmentibleDisplay
          label="Unit 3"
          stateAtom={unit3AugmentsAtom}
          removeAtom={removeUnit3AugmentAtom}
        />
      </Card.Group>
      <Divider />
      <div>
        <Header size="medium">Total</Header>
        <AugmentStatDisplay stat={simplifyStat(stats)} />
      </div>
      <Divider />
      <AugmentCategoryDisplay />
    </div>
  )
}
