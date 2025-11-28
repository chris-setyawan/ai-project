import type React from "react"
import type { Metadata } from "next"
import { Poppins } from "next/font/google"
import "leaflet/dist/leaflet.css" // ⭐ TAMBAHKAN BARIS INI
import "./globals.css"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "iFire - AI Forest Fire Detection",
  description: "Detect, Monitor, and Predict Wildfires using Artificial Intelligence",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.className} font-sans antialiased`}>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
