import { allAugmentableSlotStatSum } from "./state/augmentableState"
import { useAtomValue } from "jotai/utils"
import { augmentStatToDisplayInfo, augmentValueToString } from "./info"
import { simplifyAugmentStat } from "./tools"
import { zero } from "MathConstants"
import { BigNumber } from "mathjs"
import { AugmentStat } from "./types"
import { bpTotalAtom } from "./state/bpState"
import { classNameAtom, levelAtom } from "./state/characterState"

const Helmet = ({ children }: any) => <>{children}</>

export function AugmentPanelHelm() {
  const bp = useAtomValue(bpTotalAtom)
  const className = useAtomValue(classNameAtom)
  const level = useAtomValue(levelAtom)
  const {
    hp,
    bp: _, // pluck out this one
    pp,
    ...listableStats
  } = useAtomValue(allAugmentableSlotStatSum)
  const statLines = []
  const stats = simplifyAugmentStat(listableStats)

  if (hp && !hp.equals(zero)) {
    statLines.push(`HP: ${hp}`)
  }
  if (pp && !pp.equals(zero)) {
    statLines.push(`PP: ${pp}`)
  }

  Object.entries(stats).forEach((entry) => {
    const [statName, value] = entry as [keyof AugmentStat, BigNumber]
    if (value.eq(0)) {
      return
    }
    const { name } = augmentStatToDisplayInfo[statName]
    const valueString = augmentValueToString(statName, value)
    statLines.push(`${name}: ${valueString}`)
  })

  const lines = [`Lv.${level} ${className} - BP: ${bp}`, statLines.join("; ")]

  return (
    <Helmet>
      <title>PSO2:NGS Tools - Augment Calculator</title>
      <meta property="og:title" content="Augment Calculator" />
      <meta property="og:description" content={lines.join("\n")} />
    </Helmet>
  )
}
