'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FoodItem } from '@/lib/nutritionData';
import { calculateTotalNutrition } from '@/lib/nutritionCalculator';
import { DailyRecommendations } from '@/lib/recommendations';
import { AlertCircle } from 'lucide-react';

type VitaminsPanelProps = {
  foods: FoodItem[];
  dailyRecommendations: DailyRecommendations | null;
};

const DEFICIENCY_DANGERS: Record<string, string> = {
  'a': "La carence en Vitamine A peut affaiblir la vision nocturne.",
  'c': "Le manque de Vitamine C peut causer une fatigue intense.",
  'd': "Une carence en Vitamine D fragilise les os.",
  'e': "Le manque de Vitamine E peut entraîner des troubles de la coordination.",
  'k': "La carence en Vitamine K peut causer des problèmes de coagulation.",
  'b1': "Le manque de B1 (Thiamine) affecte le système nerveux.",
  'b2': "Une carence en B2 (Riboflavine) peut causer des lésions cutanées.",
  'b3': "Le manque de B3 (Niacine) peut entraîner des troubles digestifs.",
  'b5': "La carence en B5 peut provoquer une fatigue intense.",
  'b6': "Le manque de B6 peut affecter l'humeur et l'immunité.",
  'b7': "La carence en B7 (Biotine) peut causer la chute des cheveux.",
  'b9': "Le manque de B9 (Folate) est risqué pour le renouvellement cellulaire.",
  'b12': "La carence en B12 peut causer une anémie et des troubles neurologiques.",
  'calcium': "Le manque de Calcium fragilise les os et les dents.",
  'iron': "La carence en Fer cause l'anémie et une fatigue constante.",
  'fer': "La carence en Fer cause l'anémie et une fatigue constante.",
  'magnesium': "Le manque de Magnésium provoque des crampes et du stress.",
  'zinc': "Une carence en Zinc affaiblit les défenses immunitaires.",
  'potassium': "Le manque de Potassium peut causer des faiblesses cardiaques.",
  'phosphorus': "Une carence en Phosphore peut entraîner une faiblesse osseuse.",
};

export function VitaminsPanel({ foods, dailyRecommendations }: VitaminsPanelProps) {
  const totals = calculateTotalNutrition(foods);

  const vitaminPercentages = useMemo(() => {
    if (!dailyRecommendations) return {};
    return Object.entries(dailyRecommendations.vitamins).reduce(
      (acc, [key, value]) => {
        const consumed = totals.vitamins[key] || 0;
        const percentage = Math.round((consumed / value.rda) * 100);
        acc[key] = { percentage, consumed, ...value };
        return acc;
      },
      {} as Record<string, { percentage: number; consumed: number; name: string; rda: number; unit: string }>
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
      {} as Record<string, { percentage: number; consumed: number; name: string; rda: number; unit: string }>
    );
  }, [dailyRecommendations, totals]);

  const activeWarnings = useMemo(() => {
    const warnings: string[] = [];
    const allNutrients = [
      ...Object.entries(vitaminPercentages),
      ...Object.entries(mineralPercentages)
    ];
    
    allNutrients.forEach(([key, data]) => {
      if (data.percentage < 50) {
        const lowerKey = key.toLowerCase();
        
        // Match specific B vitamins first to avoid "b" matching everything
        const bMatch = lowerKey.match(/b\d+/);
        const searchKey = bMatch ? bMatch[0] : lowerKey;

        if (DEFICIENCY_DANGERS[searchKey]) {
          warnings.push(DEFICIENCY_DANGERS[searchKey]);
        } else {
          // Fallback check for keys like 'iron' or 'calcium'
          const fallback = Object.keys(DEFICIENCY_DANGERS).find(dKey => lowerKey.includes(dKey));
          if (fallback) warnings.push(DEFICIENCY_DANGERS[fallback]);
        }
      }
    });
    return Array.from(new Set(warnings));
  }, [vitaminPercentages, mineralPercentages]);

  const getStatusColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-foreground/10 border-foreground/30';
    if (percentage >= 50) return 'bg-foreground/5 border-foreground/10';
    return 'bg-muted/40 border-border';
  };

  const getStatusText = (percentage: number) => {
    if (percentage >= 100) return '✓ Adéquat';
    if (percentage >= 75) return 'Bon';
    if (percentage >= 50) return 'Passable';
    return 'Faible';
  };

  const NutrientItem = ({ name, consumed, rda, unit, percentage }: { name: string; consumed: number; rda: number; unit: string; percentage: number }) => (
    <div className={`p-3 border rounded-lg transition-colors ${getStatusColor(percentage)}`}>
      <div className="flex justify-between items-start mb-2">
        <div>
          <p className="text-sm font-semibold">{name}</p>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
            {consumed.toFixed(1)} / {rda} {unit}
          </p>
        </div>
        <span className="text-xs font-bold">{percentage}%</span>
      </div>
      <div className="w-full h-1 bg-border rounded-full overflow-hidden">
        <div
          className="h-full bg-foreground transition-all duration-500"
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      <p className="text-[10px] font-medium mt-2 opacity-70">{getStatusText(percentage)}</p>
    </div>
  );

  if (!dailyRecommendations) return null;

  return (
    <Card className="border-border bg-card">
      <CardHeader className="border-b border-border pb-4">
        <CardTitle className="text-xl font-bold">Vitamines & Minéraux</CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        {foods.length > 0 && activeWarnings.length > 0 && (
          <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-4 ring-1 ring-destructive/10">
            <div className="flex items-center gap-2 mb-3 text-destructive">
              <AlertCircle className="size-4" />
              <h4 className="text-xs font-black uppercase tracking-widest">Avertissements de carence</h4>
            </div>
            {/* Standard tailwind scrollbar styling */}
            <div className="max-h-[160px] overflow-y-auto space-y-2 pr-2 scrollbar-thin scrollbar-thumb-destructive/20">
              {activeWarnings.map((warning, i) => (
                <div key={i} className="flex gap-2">
                  <span className="text-destructive font-bold text-xs leading-relaxed">•</span>
                  <p className="text-xs text-destructive/80 leading-relaxed font-medium">{warning}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {foods.length === 0 ? (
          <div className="py-12 text-center border-2 border-dashed border-border rounded-xl">
            <p className="text-sm text-muted-foreground font-medium">Ajoutez des aliments pour analyser votre nutrition.</p>
          </div>
        ) : (
          <Tabs defaultValue="vitamins" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-muted/50 p-1 rounded-lg">
              <TabsTrigger value="vitamins" className="text-xs font-bold uppercase tracking-wider">Vitamines</TabsTrigger>
              <TabsTrigger value="minerals" className="text-xs font-bold uppercase tracking-wider">Minéraux</TabsTrigger>
            </TabsList>

            <TabsContent value="vitamins" className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(vitaminPercentages).map(([key, data]) => (
                  <NutrientItem key={key} {...data} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="minerals" className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(mineralPercentages).map(([key, data]) => (
                  <NutrientItem key={key} {...data} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}