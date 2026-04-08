'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { FoodItem } from '@/lib/nutritionData';

type FoodCardProps = {
  food: FoodItem;
  onAddFood: (food: FoodItem, quantity: number) => void;
};

export function FoodCard({ food, onAddFood }: FoodCardProps) {
  const [quantity, setQuantity] = useState<number>(100);
  const [isExpanded, setIsExpanded] = useState(false);

  const baseWeight = parseInt(food.servingSize);
  const multiplier = quantity / baseWeight;

  const calories = Math.round(food.calories * multiplier);
  const protein = Math.round(food.protein * multiplier * 10) / 10;
  const carbs = Math.round(food.carbs * multiplier * 10) / 10;
  const fat = Math.round(food.fat * multiplier * 10) / 10;

  return (
    <Card className="overflow-hidden border border-border hover:border-foreground/50 transition-colors">
      <CardContent className="p-0">
        <div className="relative h-64 w-full bg-muted">
          <Image
            src={food.image}
            alt={food.name}
            fill
            className="object-cover"
          />
        </div>
        
        <div className="p-6">
          <h3 className="font-semibold text-base mb-4 line-clamp-2">{food.name}</h3>
          
          <div className="grid grid-cols-2 gap-2 text-sm mb-5 p-3 bg-muted/40 rounded border border-border">
            <div>
              <p className="text-muted-foreground text-xs">Calories</p>
              <p className="font-semibold text-base">{calories}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Protéines</p>
              <p className="font-semibold text-base">{protein}g</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Glucides</p>
              <p className="font-semibold text-base">{carbs}g</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Lipides</p>
              <p className="font-semibold text-base">{fat}g</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground block mb-2 font-medium">
                Quantité (g)
              </label>
              <Input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 100)}
                min="1"
                max="1000"
                className="h-10 text-sm border border-border"
              />
            </div>

            <Button
              onClick={() => {
                const adjustedFood = { ...food, calories, protein, carbs, fat };
                onAddFood(adjustedFood, quantity);
                setQuantity(100);
              }}
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
