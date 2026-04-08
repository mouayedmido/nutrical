import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'NutriCalc - Calculateur de Calories et Nutrition',
  description: 'Analyseur professionnel de calories, macronutriments et vitamines. Calculez vos besoins nutritionnels quotidiens basés sur votre profil personnalisé.',
  generator: 'printHallo',
  keywords: 'calories, nutrition, vitamines, macronutriments, calculateur, santé, régime',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr">
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
