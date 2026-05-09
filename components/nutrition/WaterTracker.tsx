'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Droplets } from 'lucide-react'

interface WaterTrackerProps {
  weight: number
  consumedItems: { name: string; quantity: number }[]
}

export function WaterTracker({ weight, consumedItems }: WaterTrackerProps) {
  const goalMl = weight * 35
  
  const currentWaterMl = consumedItems
    .filter(item => item.name.toLowerCase() === 'eau')
    .reduce((acc, item) => acc + item.quantity, 0)

  const percentage = Math.min(100, (currentWaterMl / goalMl) * 100)

  return (
    <Card className="border border-border bg-card">
      <CardHeader className="flex flex-row items-center gap-2 border-b border-border">
        <Droplets className="size-5 text-blue-500" />
        <CardTitle className="text-lg">Hydratation</CardTitle>
      </CardHeader>
      <CardContent className="pt-8 flex flex-col items-center space-y-6">
        <div className="relative w-24 h-48 border-4 border-muted rounded-b-2xl overflow-hidden bg-muted/20 shadow-inner">
          <div 
            className="absolute bottom-0 left-0 w-full bg-blue-500 transition-all duration-700 ease-in-out"
            style={{ height: `${percentage}%` }}
          >
            {percentage > 0 && (
              <div className="absolute top-0 left-0 w-full h-4 bg-blue-400/50 -translate-y-1/2 animate-pulse" />
            )}
          </div>
        </div>

        <div className="text-center space-y-2">
          <p className="text-4xl font-black text-blue-500">{percentage.toFixed(0)}%</p>
          <p className="text-sm font-medium text-muted-foreground">
            {(currentWaterMl / 1000).toFixed(2)}L / {(goalMl / 1000).toFixed(2)}L
          </p>
          <p className="text-xs text-muted-foreground italic">
            Objectif calculé pour {weight}kg
          </p>
        </div>
      </CardContent>
    </Card>
  )
}