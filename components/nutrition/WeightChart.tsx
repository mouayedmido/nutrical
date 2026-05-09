'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface WeightEntry {
  id: string
  date: string
  weight: number
}

interface Props {
  data: WeightEntry[]
}

export function WeightChart({ data }: Props) {
  if (data.length === 0) return null

  // 1. Improved sorting: first by date, then by the unique ID (time created) 
  // to ensure entries on the same day appear in the order they were added.
  const chartData = [...data].sort((a, b) => {
    const dateCompare = new Date(a.date).getTime() - new Date(b.date).getTime();
    if (dateCompare !== 0) return dateCompare;
    return a.id.localeCompare(b.id);
  })

  return (
    <Card className="border-border bg-card mb-6">
      <CardHeader>
        <CardTitle className="text-sm font-medium">Évolution du poids (kg)</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
            <XAxis 
              dataKey="date" 
              stroke="#888" 
              fontSize={12} 
              // TickFormatter ensures the labels look clean even with duplicate dates
              tickFormatter={(str) => new Date(str).toLocaleDateString()}
              minTickGap={30}
            />
            <YAxis 
              stroke="#888" 
              fontSize={12} 
              domain={['dataMin - 5', 'dataMax + 5']} 
            />
            <Tooltip
              contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px' }}
              labelStyle={{ color: '#fff' }}
              itemStyle={{ color: '#3b82f6' }}
            />
            <Line
              type="linear" // Changed from 'monotone' to 'linear' for straight lines
              dataKey="weight"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ r: 5, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 7 }}
              animationDuration={500}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}