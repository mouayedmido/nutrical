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

const COLORS = ['#3b82f6', '#eab308', '#22c55e']

export function MacronutrientChart({ data }: Props) {
  const totalCalories = (data.protein * 4) + (data.carbs * 4) + (data.fat * 9)

  if (totalCalories === 0) return null

  const pProt = (data.protein * 4 / totalCalories) * 100
  const pGluc = (data.carbs * 4 / totalCalories) * 100
  const pLip = (data.fat * 9 / totalCalories) * 100

  const isGlpValid = 
    pGluc >= 50 && pGluc <= 60 &&
    pProt >= 10 && pProt <= 20 &&
    pLip >= 20 && pLip <= 30

  const chartData = [
    { 
      name: `Glucides: ${pGluc.toFixed(1)}% (Rec: 50-60%)`, 
      value: data.carbs * 4 
    },
    { 
      name: `Lipides: ${pLip.toFixed(1)}% (Rec: 20-30%)`, 
      value: data.fat * 9 
    },
    { 
      name: `Protéines: ${pProt.toFixed(1)}% (Rec: 10-20%)`, 
      value: data.protein * 4 
    },
  ]

  return (
    <Card className="border-border bg-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Répartition GLP (%)</CardTitle>
        {isGlpValid ? (
          <div className="flex items-center text-green-500 text-xs font-bold gap-1">
            <CheckCircle2 size={14} /> Règle 4.2.1 respectée
          </div>
        ) : (
          <div className="flex items-center text-destructive text-xs font-bold gap-1">
            <AlertCircle size={14} /> Règle GLP 4.2.1 non respectée
          </div>
        )}
      </CardHeader>
      <CardContent className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
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
              wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}