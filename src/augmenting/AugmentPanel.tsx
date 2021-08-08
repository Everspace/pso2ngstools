import { useAtom } from "jotai"
import { Card, Divider, Header } from "semantic-ui-react"
import { AugmentibleDisplay } from "./AugmentableDisplay"
import { AugmentCategoryDisplay } from "./AugmentCategoryDisplay"
import { AugmentStatDisplay } from "./AugmentStatDisplay"
import { augmentSlots, statTotalAtom } from "./state"
import { useUrlStorage } from "./useUrlStorage"

export const AugmentPanel = () => {
  useUrlStorage()
  const [stats] = useAtom(statTotalAtom)

  return (
    <div>
      <Header as="h1">Augmenting</Header>
      <Card.Group stackable doubling itemsPerRow="4">
        {augmentSlots.map((slot) => (
          <AugmentibleDisplay key={slot} slot={slot} />
        ))}
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
