import { useAtom, WritableAtom } from "jotai"
import { Button, Card, Header, Icon, List } from "semantic-ui-react"
import { AugmentStatDisplay } from "./AugmentStatDisplay"
import { Augment, simplifyAugmentStat, sumAugmentStats } from "./data/augment"

export interface AugmentibleDisplayProps {
  label: string
  stateAtom: WritableAtom<Augment[], Augment[]>
  removeAtom: WritableAtom<unknown, Augment>
}

export const AugmentibleDisplay = ({
  label,
  stateAtom,
  removeAtom,
}: AugmentibleDisplayProps) => {
  const [augments, setAugments] = useAtom(stateAtom)
  const [, remove] = useAtom(removeAtom)
  const sum = sumAugmentStats(augments)

  return (
    <Card>
      <Card.Content>
        <Card.Header>
          {label}
          <Button onClick={() => setAugments([])} floated="right">
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
                onClick={() => remove(c)}
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
