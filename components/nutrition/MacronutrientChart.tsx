'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MacronutrientChartProps {
  data: {
    protein: number;
    carbs: number;
    fat: number;
  };
}

export function MacronutrientChart({ data }: MacronutrientChartProps) {
  const chartData = [
    { name: 'Glucides (G)', value: data.carbs, color: 'hsl(var(--foreground) / 0.8)' },
    { name: 'Protéines (P)', value: data.protein, color: 'hsl(var(--foreground) / 0.5)' },
    { name: 'Lipides (L)', value: data.fat, color: 'hsl(var(--foreground) / 0.2)' },
  ];

  const total = data.protein + data.carbs + data.fat;

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-bold uppercase tracking-wider text-center">
          Répartition GPL (g)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] w-full">
          {total === 0 ? (
            <div className="h-full flex items-center justify-center text-muted-foreground text-xs italic">
              Aucune donnée à afficher
            </div>
          ) : (
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
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))', 
                    borderColor: 'hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  formatter={(value) => <span className="text-[11px] font-medium uppercase">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}