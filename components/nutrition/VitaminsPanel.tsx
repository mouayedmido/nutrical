'use client';

import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FoodItem } from '@/lib/nutritionData';
import { calculateTotalNutrition } from '@/lib/nutritionCalculator';
import { DailyRecommendations } from '@/lib/recommendations';

type VitaminsPanelProps = {
  foods: FoodItem[];
  dailyRecommendations: DailyRecommendations | null;
};

export function VitaminsPanel({ foods, dailyRecommendations }: VitaminsPanelProps) {
  const totals = calculateTotalNutrition(foods);
  const [expandedVitamin, setExpandedVitamin] = useState<string | null>(null);

  const vitaminPercentages = useMemo(() => {
    if (!dailyRecommendations) return {};
    return Object.entries(dailyRecommendations.vitamins).reduce(
      (acc, [key, value]) => {
        const consumed = totals.vitamins[key] || 0;
        const percentage = Math.round((consumed / value.rda) * 100);
        acc[key] = { percentage, consumed, ...value };
        return acc;
      },
      {} as Record<
        string,
        { percentage: number; consumed: number; name: string; rda: number; unit: string }
      >
    );
  }, [dailyRecommendations, totals]);

  const mineralPercentages = useMemo(() => {
    if (!dailyRecommendations) return {};
    return Object.entries(dailyRecommendations.minerals).reduce(
      (acc, [key, value]) => {
        const consumed = totals.minerals[key] || 0;
        const percentage = Math.round((consumed / value.rda) * 100);
        acc[key] = { percentage, consumed, ...value };
        return acc;
      },
      {} as Record<
        string,
        { percentage: number; consumed: number; name: string; rda: number; unit: string }
      >
    );
  }, [dailyRecommendations, totals]);

  const getStatusColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-foreground/20 border-foreground';
    if (percentage >= 50) return 'bg-foreground/10 border-foreground/50';
    return 'bg-muted/40 border-border';
  };

  const getStatusText = (percentage: number) => {
    if (percentage >= 100) return '✓ Adéquat';
    if (percentage >= 75) return 'Bon';
    if (percentage >= 50) return 'Passable';
    return 'Faible';
  };

  const NutrientItem = ({
    name,
    consumed,
    rda,
    unit,
    percentage,
  }: {
    name: string;
    consumed: number;
    rda: number;
    unit: string;
    percentage: number;
  }) => (
    <div className={`p-3 border rounded ${getStatusColor(percentage)}`}>
      <div className="flex justify-between items-start mb-2">
        <div>
          <p className="text-sm font-medium">{name}</p>
          <p className="text-xs text-muted-foreground">
            {consumed.toFixed(1)} / {rda} {unit}
          </p>
        </div>
        <span className="text-xs font-semibold">{percentage}%</span>
      </div>
      <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
        <div
          className="h-full bg-foreground transition-all"
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      <p className="text-xs text-muted-foreground mt-2">{getStatusText(percentage)}</p>
    </div>
  );

  if (!dailyRecommendations) {
    return (
      <Card className="border border-border">
        <CardHeader className="border-b border-border">
          <CardTitle className="text-lg">Vitamines & Minéraux</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">
            Configurez d'abord votre profil pour voir les recommandations.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-border">
      <CardHeader className="border-b border-border">
        <CardTitle className="text-lg">Vitamines & Minéraux</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {foods.length === 0 ? (
          <p className="text-sm text-muted-foreground">Ajoutez des aliments pour voir les détails.</p>
        ) : (
          <Tabs defaultValue="vitamins" className="w-full">
            <TabsList className="grid w-full grid-cols-2 border border-border bg-muted/40 p-1">
              <TabsTrigger value="vitamins" className="text-xs">Vitamines</TabsTrigger>
              <TabsTrigger value="minerals" className="text-xs">Minéraux</TabsTrigger>
            </TabsList>

            <TabsContent value="vitamins" className="space-y-3 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(vitaminPercentages).map(([key, data]) => (
                  <NutrientItem
                    key={key}
                    name={data.name}
                    consumed={data.consumed}
                    rda={data.rda}
                    unit={data.unit}
                    percentage={data.percentage}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="minerals" className="space-y-3 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(mineralPercentages).map(([key, data]) => (
                  <NutrientItem
                    key={key}
                    name={data.name}
                    consumed={data.consumed}
                    rda={data.rda}
                    unit={data.unit}
                    percentage={data.percentage}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}
