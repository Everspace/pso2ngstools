import { allClasses, ClassAbbreviation, ClassLevel } from "augmenting/types"

const statNames = ["HP", "Atk", "Def"]

type RowTuple = [ClassAbbreviation, string, string, string]
const classStats: RowTuple[] = allClasses.map(
  (c) => [c, ...statNames.map((s) => c + s)] as RowTuple,
)

export type ClassStatResultTuple = [number, ClassAbbreviation, ClassLevel]

const toNull = <T extends any>(what: T): number | null =>
  what === "" || what === undefined || what === null ? null : Number(what)

export function handleClassStatRow(
  row: Record<string, string>,
): ClassStatResultTuple[] {
  const classInfo = classStats.map(
    ([className, classHp, classAttack, classDefense]) => {
      const hp = toNull(row[classHp])
      const level = toNull(row[className])
      const attack = toNull(row[classAttack])
      const defense = toNull(row[classDefense])

      if (attack === null) return null
      if (defense === null) return null

      const cl: ClassLevel = {
        attack,
        defense,
      }
      if (hp !== null) cl.hp = Number(hp)
      const result = [Number(level), className, cl] as ClassStatResultTuple
      return result
    },
  )

  return classInfo.filter((thing) => thing !== null) as ClassStatResultTuple[]
}
