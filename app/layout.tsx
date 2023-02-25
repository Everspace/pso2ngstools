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
      <body>{children}</body>
    </html>
  )
}
