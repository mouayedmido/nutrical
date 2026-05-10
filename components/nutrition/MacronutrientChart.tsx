'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, CheckCircle2 } from 'lucide-react'

interface Props {
  data: {
    protein: number
    carbs: number
    fat: number
  }
}

const COLORS = ['#3b82f6', '#22c55e', '#eab308'] // Blue (G), Green (P), Yellow (L)

export function MacronutrientChart({ data }: Props) {
  const totalCalories = (data.protein * 4) + (data.carbs * 4) + (data.fat * 9)

  if (totalCalories === 0) return null

  const pProt = (data.protein * 4 / totalCalories) * 100
  const pGluc = (data.carbs * 4 / totalCalories) * 100
  const pLip = (data.fat * 9 / totalCalories) * 100

  const isGplValid = 
    pGluc >= 50 && pGluc <= 65 &&
    pProt >= 20 && pProt <= 35 &&
    pLip >= 10 && pLip <= 20

  const chartData = [
    { 
      name: `Glucides: ${pGluc.toFixed(1)}% (Rec: 50-65%)`, 
      value: data.carbs * 4 
    },
    { 
      name: `Protéines: ${pProt.toFixed(1)}% (Rec: 20-35%)`, 
      value: data.protein * 4 
    },
    { 
      name: `Lipides: ${pLip.toFixed(1)}% (Rec: 10-20%)`, 
      value: data.fat * 9 
    },
  ]

  return (
    <Card className="border-border bg-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Répartition GPL (%)</CardTitle>
        {isGplValid ? (
          <div className="flex items-center text-green-500 text-xs font-bold gap-1">
            <CheckCircle2 size={14} /> Règle 4.2.1 respectée
          </div>
        ) : (
          <div className="flex items-center text-destructive text-xs font-bold gap-1">
            <AlertCircle size={14} /> Règle GPL 4.2.1 non respectée
          </div>
        )}
      </CardHeader>
      <CardContent className="h-[450px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={110}
              paddingAngle={5}
              dataKey="value"
            >
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number) => [`${((value / totalCalories) * 100).toFixed(1)}% des calories`]}
              contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
              itemStyle={{ color: 'hsl(var(--foreground))' }}
            />
            <Legend 
              verticalAlign="bottom" 
              align="center"
              layout="vertical"
              iconType="circle"
              wrapperStyle={{ fontSize: '14px', paddingTop: '30px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}