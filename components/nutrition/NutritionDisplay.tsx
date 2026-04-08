'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FoodItem } from '@/lib/nutritionData';
import { calculateTotalNutrition, calculateMacroPercentages } from '@/lib/nutritionCalculator';

type NutritionDisplayProps = {
  foods: FoodItem[];
  dailyTargets?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  onRemoveFood: (foodId: string, index: number) => void;
};

export function NutritionDisplay({
  foods,
  dailyTargets,
  onRemoveFood,
}: NutritionDisplayProps) {
  const totals = calculateTotalNutrition(foods);
  const macroPercentages = calculateMacroPercentages(totals.protein, totals.carbs, totals.fat);

  const getProgressColor = (current: number, target: number) => {
    if (!target || current === 0) return 'bg-border';
    const percentage = (current / target) * 100;
    if (percentage >= 95) return 'bg-foreground';
    if (percentage >= 75) return 'bg-foreground/70';
    return 'bg-foreground/40';
  };

  const getProgressPercentage = (current: number, target: number) => {
    if (!target) return 0;
    return Math.min((current / target) * 100, 100);
  };

  return (
    <div className="space-y-4">
      <Card className="border border-border">
        <CardHeader className="border-b border-border">
          <CardTitle className="text-lg">Résumé Nutritionnel</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {foods.length === 0 ? (
            <p className="text-sm text-muted-foreground">Ajoutez des aliments pour voir votre résumé nutritionnel.</p>
          ) : (
            <div className="space-y-6">
              {/* cals */}
              <div>
                <div className="flex justify-between items-end mb-2">
                  <span className="text-sm font-medium">Calories</span>
                  <span className="text-sm font-semibold">
                    {totals.calories} {dailyTargets && `/ ${dailyTargets.calories}`}
                  </span>
                </div>
                <div className="w-full h-2 bg-border rounded-full overflow-hidden">
                  <div
                    className={`h-full ${getProgressColor(totals.calories, dailyTargets?.calories || 0)} transition-all`}
                    style={{
                      width: `${getProgressPercentage(totals.calories, dailyTargets?.calories || 0)}%`,
                    }}
                  />
                </div>
              </div>

              {/* macros */}
              <div className="grid grid-cols-3 gap-4">
                {/* prot */}
                <div>
                  <div className="text-xs text-muted-foreground mb-2">Protéines</div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold">{totals.protein}g</p>
                    <p className="text-xs text-muted-foreground">{macroPercentages.protein}%</p>
                    {dailyTargets && (
                      <p className="text-xs text-muted-foreground">
                        / {dailyTargets.protein}g
                      </p>
                    )}
                  </div>
                  <div className="w-full h-1.5 bg-border rounded-full overflow-hidden mt-2">
                    <div
                      className={`h-full ${getProgressColor(totals.protein, dailyTargets?.protein || 0)}`}
                      style={{
                        width: `${getProgressPercentage(totals.protein, dailyTargets?.protein || 0)}%`,
                      }}
                    />
                  </div>
                </div>

                {/* carbs */}
                <div>
                  <div className="text-xs text-muted-foreground mb-2">Glucides</div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold">{totals.carbs}g</p>
                    <p className="text-xs text-muted-foreground">{macroPercentages.carbs}%</p>
                    {dailyTargets && (
                      <p className="text-xs text-muted-foreground">
                        / {dailyTargets.carbs}g
                      </p>
                    )}
                  </div>
                  <div className="w-full h-1.5 bg-border rounded-full overflow-hidden mt-2">
                    <div
                      className={`h-full ${getProgressColor(totals.carbs, dailyTargets?.carbs || 0)}`}
                      style={{
                        width: `${getProgressPercentage(totals.carbs, dailyTargets?.carbs || 0)}%`,
                      }}
                    />
                  </div>
                </div>

                {/* fat */}
                <div>
                  <div className="text-xs text-muted-foreground mb-2">Lipides</div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold">{totals.fat}g</p>
                    <p className="text-xs text-muted-foreground">{macroPercentages.fat}%</p>
                    {dailyTargets && (
                      <p className="text-xs text-muted-foreground">
                        / {dailyTargets.fat}g
                      </p>
                    )}
                  </div>
                  <div className="w-full h-1.5 bg-border rounded-full overflow-hidden mt-2">
                    <div
                      className={`h-full ${getProgressColor(totals.fat, dailyTargets?.fat || 0)}`}
                      style={{
                        width: `${getProgressPercentage(totals.fat, dailyTargets?.fat || 0)}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* fibahh */}
              <div>
                <span className="text-xs text-muted-foreground">Fibres</span>
                <p className="text-sm font-semibold">{totals.fiber}g</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* foods consumed */}
      {foods.length > 0 && (
        <Card className="border border-border">
          <CardHeader className="border-b border-border">
            <CardTitle className="text-lg">Aliments Consommés</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-2">
              {foods.map((food, index) => (
                <div
                  key={`${food.id}-${index}`}
                  className="flex items-center justify-between p-3 bg-muted/40 border border-border rounded"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium">{food.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {food.calories} cal • P: {food.protein}g • C: {food.carbs}g • L: {food.fat}g
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveFood(food.id, index)}
                    className="h-7 px-2 text-xs hover:bg-foreground/10"
                  >
                    Retirer
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
