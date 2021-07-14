import { useAtom } from "jotai"
import { Card, Divider, Header } from "semantic-ui-react"
import { AugmentibleDisplay } from "./AugmentableDisplay"
import { AugmentCategoryDisplay } from "./AugmentCategoryDisplay"
import { AugmentStatDisplay } from "./AugmentStatDisplay"
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

export const AugmentPanel = () => {
  const [stats] = useAtom(statTotalAtom)
  return (
    <div>
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
        <AugmentStatDisplay stat={stats} />
      </div>
      <Divider />
      <AugmentCategoryDisplay />
    </div>
  )
}
