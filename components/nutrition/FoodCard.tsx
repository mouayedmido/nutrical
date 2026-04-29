'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { FoodItem } from '@/lib/nutritionData';
import { calculateFoodNutrition, normalizeFoodQuantity, parseServingSize } from '@/lib/nutritionCalculator';

type FoodCardProps = {
  food: FoodItem;
  onAddFood: (food: FoodItem, quantity: number) => void;
};

function parseQuantityInput(value: string): number | null {
  const parsed = Number(value.replace(',', '.'));
  if (!Number.isFinite(parsed) || parsed < 1 || parsed > 2000) return null;
  return normalizeFoodQuantity(parsed);
}

export function FoodCard({ food, onAddFood }: FoodCardProps) {
  const referenceServing = parseServingSize(food.servingSize);
  const [quantity, setQuantity] = useState(String(referenceServing.amount));
  const parsedQuantity = parseQuantityInput(quantity);
  const previewFood = parsedQuantity === null ? food : calculateFoodNutrition(food, parsedQuantity);

  return (
    <Card className="overflow-hidden border border-border hover:border-foreground/50 transition-colors">
      <CardContent className="p-0">
        <div className="relative h-64 w-full bg-muted">
          <Image
            src={food.image}
            alt={food.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 384px"
          />
        </div>

        <div className="p-6">
          <h3 className="font-semibold text-base mb-1 line-clamp-2">{food.name}</h3>
          <p className="text-xs text-muted-foreground mb-4">Portion de référence : {food.servingSize}</p>

          <div className="grid grid-cols-2 gap-2 text-sm mb-5 p-3 bg-muted/40 rounded border border-border">
            <div>
              <p className="text-muted-foreground text-xs">Calories</p>
              <p className="font-semibold text-base">{previewFood.calories}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Protéines</p>
              <p className="font-semibold text-base">{previewFood.protein}g</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Glucides</p>
              <p className="font-semibold text-base">{previewFood.carbs}g</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Lipides</p>
              <p className="font-semibold text-base">{previewFood.fat}g</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor={`food-card-quantity-${food.id}`} className="text-sm text-muted-foreground block mb-2 font-medium">
                Quantité réellement consommée ({referenceServing.unit})
              </label>
              <Input
                id={`food-card-quantity-${food.id}`}
                type="number"
                inputMode="decimal"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                min="1"
                max="2000"
                step="1"
                className="h-10 text-sm border border-border"
              />
              {parsedQuantity === null && (
                <p className="text-xs text-destructive mt-2">Entrez une quantité valide entre 1 et 2000.</p>
              )}
            </div>

            <Button
              onClick={() => {
                if (parsedQuantity === null) return;
                onAddFood(food, parsedQuantity);
                setQuantity(String(referenceServing.amount));
              }}
              disabled={parsedQuantity === null}
              className="w-full h-10 text-sm font-medium bg-foreground text-background hover:bg-foreground/90"
            >
              Ajouter
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
