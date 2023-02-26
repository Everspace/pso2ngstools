import "./globals.css"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="shortcut icon" href="/NGSUIMSTIcon.png" />
      </head>
      <body className="h-screen">
        <div className="mx-auto max-w-screen-2xl px-4">{children}</div>
      </body>
    </html>
  )
}
