import { Atom, useAtom, WritableAtom } from "jotai"
import { Button, Card } from "semantic-ui-react"
import { Augment, sumAugmentStats } from "./data/augment"

export interface AugmentibleDisplayProps {
  label: string
  stateAtom: Atom<Augment[]>
  removeAtom: WritableAtom<unknown, Augment>
}

export const AugmentibleDisplay = ({
  label,
  stateAtom,
  removeAtom,
}: AugmentibleDisplayProps) => {
  const [augments] = useAtom(stateAtom)
  const [, remove] = useAtom(removeAtom)
  const sum = sumAugmentStats(augments)

  return (
    <Card>
      <Card.Content>
        <Card.Header>{label}</Card.Header>
      </Card.Content>
      <Card.Content>
        <ol>
          {augments.map((c) => (
            <li key={c.name}>
              <Button
                icon={() => "x"}
                compact
                size="tiny"
                onClick={() => remove(c)}
                color="red"
              />
              {c.rate * 10}% - {c.name}
            </li>
          ))}
        </ol>
      </Card.Content>
      <Card.Content extra>
        <pre>{JSON.stringify(sum)}</pre>
      </Card.Content>
    </Card>
  )
}
