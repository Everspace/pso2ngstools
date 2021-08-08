import { useAtom } from "jotai"
import { Card, Divider, Header } from "semantic-ui-react"
import { AugmentibleDisplay } from "./AugmentableDisplay"
import { AugmentCategoryDisplay } from "./AugmentCategoryDisplay"
import { AugmentStatDisplay } from "./AugmentStatDisplay"
import { statTotalAtom } from "./state"
import { useUrlStorage } from "./useUrlStorage"

export const AugmentPanel = () => {
  useUrlStorage()
  const [stats] = useAtom(statTotalAtom)

  return (
    <div>
      <Header as="h1">Augmenting</Header>
      <Card.Group stackable doubling itemsPerRow="4">
        <AugmentibleDisplay label="Weapon" slot="weapon" />
        <AugmentibleDisplay label="Unit 1" slot="unit1" />
        <AugmentibleDisplay label="Unit 2" slot="unit2" />
        <AugmentibleDisplay label="Unit 3" slot="unit3" />
      </Card.Group>
      <Divider />
      <div>
        <Header size="medium">Total</Header>
        <AugmentStatDisplay simple stat={stats} />
      </div>
      <Divider />
      <AugmentCategoryDisplay />
    </div>
  )
}
