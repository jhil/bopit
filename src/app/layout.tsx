import type { Metadata } from "next"
import "./globals.css"
export const metadata: Metadata = {
  title: "Bop It",
  description:
    "Bop, pull, twist. A quick reaction game for your keyboard or touchscreen. No Leap Motion needed.",
  metadataBase: new URL("https://bopit.jeffand.co"),
  alternates: { canonical: "/" },
}
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
