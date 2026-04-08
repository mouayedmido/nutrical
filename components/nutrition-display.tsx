'use client';

import { DailyRecommendations, calculatePercentDV } from '@/lib/nutrition-calc';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface NutritionDisplayProps {
  macros: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    saturatedFat: number;
    fiber: number;
  };
  recommendations: DailyRecommendations;
  onClear: () => void;
}

export function NutritionDisplay({ macros, recommendations, onClear }: NutritionDisplayProps) {
  const getProgressColor = (current: number, goal: number) => {
    const percent = (current / goal) * 100;
    if (percent >= 100) return 'bg-green-500';
    if (percent >= 75) return 'bg-blue-500';
    if (percent >= 50) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const getProgressWidth = (current: number, goal: number) => {
    return Math.min((current / goal) * 100, 100);
  };

  const MacroBar = ({ label, current, goal, unit = 'g' }: any) => (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="text-muted-foreground">
          {current.toFixed(1)}/{goal} {unit}
        </span>
      </div>
      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
        <div
          className={`h-full transition-all ${getProgressColor(current, goal)}`}
          style={{ width: `${getProgressWidth(current, goal)}%` }}
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <Card className="p-6 border-0 bg-muted/30">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <div className="text-3xl font-bold">{Math.round(macros.calories)}</div>
            <div className="text-xs text-muted-foreground">Calories</div>
            <div className="text-xs font-medium mt-1">
              {Math.round((macros.calories / recommendations.calories) * 100)}% du total
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">{macros.protein.toFixed(1)}</div>
            <div className="text-xs text-muted-foreground">Protéines (g)</div>
            <div className="text-xs font-medium mt-1">
              {calculatePercentDV(macros.protein, recommendations.protein)}% RDA
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">{macros.carbs.toFixed(1)}</div>
            <div className="text-xs text-muted-foreground">Glucides (g)</div>
            <div className="text-xs font-medium mt-1">
              {calculatePercentDV(macros.carbs, recommendations.carbs)}% RDA
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">{macros.fat.toFixed(1)}</div>
            <div className="text-xs text-muted-foreground">Lipides (g)</div>
            <div className="text-xs font-medium mt-1">
              {calculatePercentDV(macros.fat, recommendations.fat)}% RDA
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <MacroBar label="Calories" current={macros.calories} goal={recommendations.calories} unit="kcal" />
          <MacroBar label="Protéines" current={macros.protein} goal={recommendations.protein} unit="g" />
          <MacroBar label="Glucides" current={macros.carbs} goal={recommendations.carbs} unit="g" />
          <MacroBar label="Lipides" current={macros.fat} goal={recommendations.fat} unit="g" />
          <MacroBar label="Fibres" current={macros.fiber} goal={recommendations.fiber} unit="g" />
        </div>
      </Card>

      <Card className="p-6 border-0 bg-muted/30">
        <h4 className="font-semibold mb-4">Répartition Macronutriments</h4>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 border border-border/50 rounded-md">
            <div className="text-2xl font-bold">
              {((macros.protein * 4 / macros.calories) * 100).toFixed(0)}%
            </div>
            <div className="text-xs text-muted-foreground mt-2">Protéines</div>
          </div>
          <div className="text-center p-4 border border-border/50 rounded-md">
            <div className="text-2xl font-bold">
              {((macros.carbs * 4 / macros.calories) * 100).toFixed(0)}%
            </div>
            <div className="text-xs text-muted-foreground mt-2">Glucides</div>
          </div>
          <div className="text-center p-4 border border-border/50 rounded-md">
            <div className="text-2xl font-bold">
              {((macros.fat * 9 / macros.calories) * 100).toFixed(0)}%
            </div>
            <div className="text-xs text-muted-foreground mt-2">Lipides</div>
          </div>
        </div>
      </Card>

      <Card className="p-6 border-0 bg-muted/30">
        <h4 className="font-semibold mb-4">Autres Nutriments</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-muted-foreground">Sodium</div>
            <div className="font-medium">{Math.round(macros.saturatedFat)} mg (limiter)</div>
          </div>
          <div>
            <div className="text-muted-foreground">Gras saturé</div>
            <div className="font-medium">{macros.saturatedFat.toFixed(1)} g</div>
          </div>
        </div>
      </Card>

      <Button
        onClick={onClear}
        variant="outline"
        className="w-full border border-border hover:bg-muted"
      >
        Réinitialiser
      </Button>
    </div>
  );
}
