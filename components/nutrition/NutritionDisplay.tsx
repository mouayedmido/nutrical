'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FoodItem } from '@/lib/nutritionData';
import { calculateTotalNutrition, calculateMacroPercentages, parseServingSize } from '@/lib/nutritionCalculator';

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

function ProgressBar({ value, target, label }: { value: number; target?: number; label: string }) {
  const percentage = target ? Math.min(Math.round((value / target) * 100), 100) : 0;
  const color = percentage >= 95 ? 'bg-foreground' : percentage >= 75 ? 'bg-foreground/70' : 'bg-foreground/40';

  return (
    <div className="w-full h-1.5 bg-border rounded-full overflow-hidden mt-2" aria-label={`${label}: ${percentage}%`}>
      <div className={`h-full ${target ? color : 'bg-border'}`} style={{ width: `${percentage}%` }} />
    </div>
  );
}

function formatLoggedQuantity(food: FoodItem): string {
  if (!food.quantityGrams) return food.servingSize;

  const unit = food.quantityUnit || parseServingSize(food.referenceServingSize || food.servingSize).unit;
  return `${food.quantityGrams}${unit}`;
}

export function NutritionDisplay({ foods, dailyTargets, onRemoveFood }: NutritionDisplayProps) {
  const totals = calculateTotalNutrition(foods);
  const macroPercentages = calculateMacroPercentages(totals.protein, totals.carbs, totals.fat);
  const caloriesPercentage = dailyTargets?.calories ? Math.round((totals.calories / dailyTargets.calories) * 100) : 0;

  return (
    <div className="space-y-6">
      <Card className="border border-border">
        <CardHeader className="border-b border-border">
          <CardTitle className="text-lg">Résumé de la journée</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {foods.length === 0 ? (
            <p className="text-sm text-muted-foreground">Ajoutez des aliments pour voir votre résumé nutritionnel.</p>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="p-4 bg-muted/40 rounded border border-border sm:col-span-1">
                  <div className="text-xs text-muted-foreground mb-2">Calories</div>
                  <p className="text-3xl font-bold">{totals.calories}</p>
                  {dailyTargets && <p className="text-xs text-muted-foreground mt-1">/ {dailyTargets.calories} cal ({caloriesPercentage}%)</p>}
                  <ProgressBar value={totals.calories} target={dailyTargets?.calories} label="Calories" />
                </div>

                <div className="p-4 bg-muted/40 rounded border border-border">
                  <div className="text-xs text-muted-foreground mb-2">Protéines</div>
                  <p className="text-xl font-bold">{totals.protein}g</p>
                  <p className="text-xs text-muted-foreground">{macroPercentages.protein}% des calories</p>
                  {dailyTargets && <p className="text-xs text-muted-foreground">/ {dailyTargets.protein}g</p>}
                  <ProgressBar value={totals.protein} target={dailyTargets?.protein} label="Protéines" />
                </div>

                <div className="p-4 bg-muted/40 rounded border border-border">
                  <div className="text-xs text-muted-foreground mb-2">Glucides</div>
                  <p className="text-xl font-bold">{totals.carbs}g</p>
                  <p className="text-xs text-muted-foreground">{macroPercentages.carbs}% des calories</p>
                  {dailyTargets && <p className="text-xs text-muted-foreground">/ {dailyTargets.carbs}g</p>}
                  <ProgressBar value={totals.carbs} target={dailyTargets?.carbs} label="Glucides" />
                </div>

                <div className="p-4 bg-muted/40 rounded border border-border">
                  <div className="text-xs text-muted-foreground mb-2">Lipides</div>
                  <p className="text-xl font-bold">{totals.fat}g</p>
                  <p className="text-xs text-muted-foreground">{macroPercentages.fat}% des calories</p>
                  {dailyTargets && <p className="text-xs text-muted-foreground">/ {dailyTargets.fat}g</p>}
                  <ProgressBar value={totals.fat} target={dailyTargets?.fat} label="Lipides" />
                </div>
              </div>

              <div className="p-4 bg-muted/40 rounded border border-border w-full sm:w-fit">
                <span className="text-xs text-muted-foreground">Fibres</span>
                <p className="text-sm font-semibold">{totals.fiber}g</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {foods.length > 0 && (
        <Card className="border border-border">
          <CardHeader className="border-b border-border">
            <CardTitle className="text-lg">Aliments consommés</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-2">
              {foods.map((food, index) => (
                <div key={`${food.id}-${index}`} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 bg-muted/40 border border-border rounded">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{food.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatLoggedQuantity(food)} • {food.calories} cal • P: {food.protein}g • G: {food.carbs}g • L: {food.fat}g
                    </p>
                    {food.referenceServingSize && (
                      <p className="text-[11px] text-muted-foreground mt-1">Calculé depuis la portion de référence : {food.referenceServingSize}</p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveFood(food.id, index)}
                    className="h-8 px-3 text-xs hover:bg-foreground/10 w-fit"
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
