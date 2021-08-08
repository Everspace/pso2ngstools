import { Button, Card, Header, Icon, List } from "semantic-ui-react"
import { AugmentStatDisplay } from "./AugmentStatDisplay"
import { AugmentableSlot, augmentSlotNiceName, useAugmentable } from "./state"

export interface AugmentibleDisplayProps {
  slot: AugmentableSlot
}

export const AugmentibleDisplay = ({ slot }: AugmentibleDisplayProps) => {
  const { augments, clearAugments, removeAugment } = useAugmentable(slot)

  return (
    <Card>
      <Card.Content>
        <Card.Header>
          {augmentSlotNiceName[slot]}
          <Button onClick={clearAugments} floated="right">
            Clear
          </Button>
        </Card.Header>
      </Card.Content>
      <Card.Content>
        <List>
          {augments.map((c) => (
            <List.Item key={c.name}>
              <Icon
                link
                inline
                color="red"
                name="x"
                onClick={() => removeAugment(c)}
              />
              {c.rate * 10}% - {c.name}
            </List.Item>
          ))}
        </List>
      </Card.Content>
      <Card.Content>
        <Header size="medium">Stats</Header>
        <AugmentStatDisplay simple stat={augments} />
      </Card.Content>
    </Card>
  )
}
