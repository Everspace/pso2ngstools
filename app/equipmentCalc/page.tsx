import { queryParamString } from "atomTools"
import { augmentSlots } from "augmenting/types"
import { Metadata } from "next"
import { NextAppdirPageProps } from "pureTypes"
import { encode } from "querystring"
import AugmentableCard from "./components/AugmentableCard"
import Hydrate from "./components/Hydrate"
import { getDescription, getTitle } from "./func/makeSummary"
import { equipmentCalcStore } from "./state/store"

export default function EquipmentCalc({ searchParams }: NextAppdirPageProps) {
  return (
    <>
      <div>Equipment Calc Hello World</div>
      <div>
        <Hydrate query={encode(searchParams)}>
          <div className="grid grid-cols-1 gap-1 md:grid-cols-2 xl:grid-cols-4">
            {augmentSlots.map((s) => (
              <AugmentableCard slot={s} key={s} />
            ))}
          </div>
        </Hydrate>
      </div>
    </>
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
