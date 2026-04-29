import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from '@/components/ui/toaster'
import './globals.css'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist-sans' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' })

export const metadata: Metadata = {
  title: 'NutriCal Tunisie - Calculateur de Nutrition',
  description:
    'Suivi nutritionnel personnalisé pour calories, macronutriments, vitamines, minéraux et poids, avec des aliments adaptés aux utilisateurs tunisiens.',
  generator: 'printHallo',
  keywords: 'calories, nutrition, Tunisie, vitamines, macronutriments, calculateur, santé, régime, poids',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr">
      <body className={`${geist.variable} ${geistMono.variable} font-sans antialiased`}>
        {children}
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
