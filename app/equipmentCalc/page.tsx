import { queryParamString } from "atomTools"
import { augmentSlots } from "augmenting/types"
import { Metadata } from "next"
import { NextAppdirPageProps } from "pureTypes"
import { encode } from "querystring"
import AugmentList from "./components/AugmentableDisplay/AugmentList"
import Hydrate from "./components/Hydrate"
import { getDescription, getTitle } from "./func/makeSummary"
import { equipmentCalcStore } from "./state/store"

export default function EquipmentCalc({ searchParams }: NextAppdirPageProps) {
  return (
    <Hydrate query={encode(searchParams)}>
      <div>Equipment Calc Hello World</div>
      {augmentSlots.map((s) => (
        <div key={s}>
          <div>{s}</div>
          <AugmentList slot={s} />
        </div>
      ))}
    </Hydrate>
  )
}

export const generateMetadata = async ({
  searchParams,
}: NextAppdirPageProps) => {
  equipmentCalcStore.set(queryParamString, encode(searchParams))
  const title = getTitle()
  const description = getDescription()
  const meta: Metadata = {
    title,
    description,
    openGraph: {
      title,
      description,
    },
  }
  return meta
}

// Until we can make generateMetadata respect searchParams
export const dynamic = "force-dynamic"
