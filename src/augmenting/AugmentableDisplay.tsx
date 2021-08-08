import { Button, Card, Header, Icon, List } from "semantic-ui-react"
import { AugmentStatDisplay } from "./AugmentStatDisplay"
import { simplifyAugmentStat, sumAugmentStats } from "./data/augment"
import { AugmentableSlot, useAugmentable } from "./state"

export interface AugmentibleDisplayProps {
  label: string
  slot: AugmentableSlot
}

export const AugmentibleDisplay = ({
  label,
  slot,
}: AugmentibleDisplayProps) => {
  const { augments, clearAugments, removeAugment } = useAugmentable(slot)

  const sum = sumAugmentStats(augments)

  return (
    <Card>
      <Card.Content>
        <Card.Header>
          {label}
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
        <AugmentStatDisplay stat={simplifyAugmentStat(sum)} />
      </Card.Content>
    </Card>
  )
}
