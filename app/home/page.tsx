import LinkBlock from "components/client/LinkBlock"
import { NextPage } from "next"
import { PropsWithChildren } from "react"

type DisplayLinkProps = PropsWithChildren<{
  to: string
  title: string
}>

function DisplayLink({ to, title, children }: DisplayLinkProps) {
  return (
    <LinkBlock
      className="cursor-pointer rounded border p-4 shadow transition-colors hover:bg-gray-200"
      to={to}
      as="article"
    >
      <h5 className="mb-2 text-xl font-bold">{title}</h5>
      <article className="text-sm">{children}</article>
    </LinkBlock>
  )
}

const HomePage: NextPage = () => {
  return (
    <>
      <p className="my-2">Here&apos;s a bunch of neat things I have made</p>
      <div className="grid grid-cols-2 md:grid-cols-4">
        <DisplayLink to="/equipmentCalc" title="Equipment Calculator">
          <p>Figure out your BP, and stats</p>
        </DisplayLink>
      </div>
    </>
  )
}

export default HomePage
