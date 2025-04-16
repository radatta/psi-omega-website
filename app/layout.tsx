import type React from "react"
import "./globals.css"
import localFont from 'next/font/local'
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

const futura = localFont({
  src: [
    {
      path: '/../public/fonts/FuturaCyrillicBold.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '/../public/fonts/FuturaCyrillicBook.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '/../public/fonts/FuturaCyrillicDemi.ttf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '/../public/fonts/FuturaCyrillicExtraBold.ttf',
      weight: '800',
      style: 'normal',
    },
    {
      path: '/../public/fonts/FuturaCyrillicHeavy.ttf',
      weight: '900',
      style: 'normal',
    },
    {
      path: '/../public/fonts/FuturaCyrillicLight.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '/../public/fonts/FuturaCyrillicMedium.ttf',
      weight: '500',
      style: 'normal',
    },
  ],
  variable: '--font-futura', // Optional: for CSS variable usage
});
export const metadata = {
  title: "SCU AKΨ | Alpha Kappa Psi at Santa Clara University",
  description: "Alpha Kappa Psi is the premier developer of principled business leaders at Santa Clara University.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={futura.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <Navbar />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
