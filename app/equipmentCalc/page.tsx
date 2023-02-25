import { queryParamString } from "atomTools"
import { Metadata } from "next"
import { NextAppdirPageProps } from "pureTypes"
import { encode } from "querystring"
import Hydrate from "./components/Hydrate"
import { getDescription, getTitle } from "./func/makeSummary"
import { equipmentCalcStore } from "./state/store"

const EquipmentCalc = ({ searchParams }: NextAppdirPageProps) => {
  return (
    <Hydrate query={encode(searchParams)}>
      <div>Equipment Calc Hello World</div>
    </Hydrate>
  )
}

export default EquipmentCalc

export const generateMetadata = ({ searchParams }: NextAppdirPageProps) => {
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
