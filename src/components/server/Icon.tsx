import clsx from "clsx"
import Image from "next/image"

export type Icon = (props: React.ComponentProps<typeof Image>) => JSX.Element

export const ImageIcon: Icon = ({ className, alt, ...props }) => (
  <Image {...props} alt={alt} className={clsx(className, "mx-1 inline")} />
)
