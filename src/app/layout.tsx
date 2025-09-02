import type React from "react"
import type { Metadata } from "next"
import { Playfair_Display, DM_Sans } from "next/font/google"
import { Suspense } from "react"
import "./globals.css"

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
})

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
})

export const metadata: Metadata = {
  title: "Your Next Secret Obsession - Romance Audio Stories",
  description:
    "Bite-sized romance stories you can listen to anywhere, anytime. Join the waitlist for intimate audio dramas.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${playfair.variable} ${dmSans.variable}`}>
        <Suspense fallback={<div>Loading...</div>}>
          {children}
          {/*<Analytics />*/}
        </Suspense>
      </body>
    </html>
  )
}
