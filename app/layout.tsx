import clsx from "clsx"
import { Roboto_Flex } from "next/font/google"
import Link from "next/link"
import "./globals.css"

const roboto = Roboto_Flex({
  subsets: ["latin"],
  variable: "--font-roboto-flex",
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={roboto.variable}>
      <head>
        <link rel="shortcut icon" href="/NGSUIMSTIcon.png" />
      </head>
      <body className={clsx("h-screen")}>
        <header className="mb-4 flex h-16 items-center justify-start gap-2 px-4 shadow">
          <Link
            className="block rounded p-2 transition-colors hover:bg-gray-200 hover:shadow-md"
            href="/home"
          >
            PSO2:NGS Tools
          </Link>
        </header>
        <main className="mx-auto max-w-screen-2xl px-4">{children}</main>
      </body>
    </html>
  )
}
