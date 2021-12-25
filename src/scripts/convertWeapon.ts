import { Weapon } from "augmenting/types"

interface DataSheetRow {
  Series: string
  Lv: string
  Stars: string
  Base: string
  GrindMax: string
  Element: string
  VarianceLow: string
  VarianceHigh: string
}

export function handleWeaponRow(row: DataSheetRow): Weapon {
  const {
    Series,
    Lv,
    Stars,
    Base,
    GrindMax,
    Element,
    VarianceLow,
    VarianceHigh,
  } = row

  const data: Partial<Record<keyof Weapon, any>> = {
    name: Series,
    level: Number(Lv),
    stars: Number(Stars),
    attackBase: Number(Base),
    attackMax: Number(GrindMax),
    varianceLow: Number(VarianceLow),
    varianceHigh: Number(VarianceHigh),
  }

  if (Element !== "") data.element = Element

  return data as Weapon
}
