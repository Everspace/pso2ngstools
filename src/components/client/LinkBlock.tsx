"use client"

import { useRouter } from "next/navigation"
import {
  createElement,
  ElementType,
  PropsWithChildren,
  useCallback,
} from "react"

type LinkBlockProps = PropsWithChildren<{
  className?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  as?: ElementType<any>
  to: string
}>

/**
 * Like Link, but a div or whatever else you like.
 */
export default function LinkBlock({
  to,
  as: targetElement,
  ...props
}: LinkBlockProps) {
  const router = useRouter()
  const nav = useCallback(() => {
    router.push(to)
  }, [to, router])

  const preload = useCallback(() => {
    router.prefetch(to)
  }, [to, router])

  return createElement(targetElement ?? "div", {
    onClick: nav,
    onMouseEnter: preload,
    ...props,
  })
}
