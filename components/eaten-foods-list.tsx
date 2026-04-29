'use client';

import { Food } from '@/lib/foods-data';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface EatenFoodsListProps {
  foods: Array<{ food: Food; servings: number }>;
  onUpdateServings: (index: number, servings: number) => void;
  onRemove: (index: number) => void;
}

export function EatenFoodsList({ foods, onUpdateServings, onRemove }: EatenFoodsListProps) {
  return (
    <div className="space-y-3">
      {foods.map((item, idx) => {
        const multiplier = item.servings / 100;
        const calories = Math.round(item.food.calories * multiplier);
        const protein = Math.round(item.food.protein * multiplier * 10) / 10;
        const carbs = Math.round(item.food.carbs * multiplier * 10) / 10;
        const fat = Math.round(item.food.fat * multiplier * 10) / 10;

        return (
          <Card key={idx} className="p-4 border hover:border-foreground/20 transition-colors">
            <div className="flex gap-4">
              <div className="relative w-16 h-16 flex-shrink-0 bg-muted rounded-md overflow-hidden">
                <Image
                  src={item.food.imageUrl}
                  alt={item.food.name}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    const img = e.currentTarget;
                    img.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2264%22 height=%2264%22%3E%3Crect fill=%22%23f0f0f0%22 width=%2264%22 height=%2264%22/%3E%3C/svg%3E';
                  }}
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="font-medium text-sm">{item.food.name}</h4>
                  <button
                    onClick={() => onRemove(idx)}
                    className="text-xs px-2 py-1 text-destructive hover:bg-destructive/10 rounded transition-colors"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="text-xs text-muted-foreground">
                    <div className="font-medium text-foreground">{calories} cal</div>
                    <div className="text-xs">P: {protein}g</div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <div className="font-medium text-foreground">C: {carbs}g</div>
                    <div className="text-xs">G: {fat}g</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min="1"
                    step="5"
                    value={item.servings}
                    onChange={(e) => onUpdateServings(idx, parseFloat(e.target.value))}
                    className="w-20 h-8 text-xs border border-border"
                  />
                  <span className="text-xs text-muted-foreground">
                    {item.food.servingUnit}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
