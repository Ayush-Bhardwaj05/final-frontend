import type React from "react"
import type { Metadata } from "next"
import { Geist as Geist_Sans } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/navbar"
import { ThemeProvider } from "@/components/theme-provider"

const geist = Geist_Sans({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "VibeSense - Advanced AI",
  
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${geist.className} bg-black text-slate-200`}>
        <ThemeProvider defaultTheme="dark" attribute="class" enableSystem={false} disableTransitionOnChange>
          <div className="flex min-h-screen flex-col bg-gradient-to-br from-black via-[#13071E] to-[#1E0B33]">
            <Navbar />
            <main className="flex-1">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'