import { useAtom } from "jotai"
import { Card, Divider } from "semantic-ui-react"
import { AugmentibleDisplay } from "./AugmentableDisplay"
import { AugmentCategoryDisplay } from "./AugmentCategoryDisplay"
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
      <Card.Group>
        <AugmentibleDisplay
          label="Weapon"
          stateAtom={weaponAugmentsAtom}
          removeAtom={removeWeaponAugmentAtom}
        />
      </Card.Group>

      <Card.Group>
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
        <pre>{JSON.stringify(stats)}</pre>
      </div>
      <Divider />
      <AugmentCategoryDisplay />
    </div>
  )
}
