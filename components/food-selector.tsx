'use client';

import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Food, foodsDatabase } from '@/lib/foods-data';
import Image from 'next/image';

interface FoodSelectorProps {
  onSelect: (food: Food, servings: number) => void;
}

export function FoodSelector({ onSelect }: FoodSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [servings, setServings] = useState<{ [key: string]: number }>({});

  const categories = [
    { id: 'all', label: 'Tous' },
    { id: 'burgers', label: 'Burgers' },
    { id: 'desserts', label: 'Gâteaux' },
    { id: 'thai', label: 'Thaïlandais' },
    { id: 'arab', label: 'Arabe' },
    { id: 'breakfast', label: 'Petit-déj' },
    { id: 'drinks', label: 'Boissons' },
  ];

  const filteredFoods = useMemo(() => {
    return foodsDatabase.filter(food => {
      const matchesSearch = food.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || food.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const handleServingChange = (foodId: string, value: number) => {
    setServings(prev => ({
      ...prev,
      [foodId]: Math.max(0.1, value),
    }));
  };

  const handleAddFood = (food: Food) => {
    const servingAmount = servings[food.id] || 1;
    onSelect(food, servingAmount);
    handleServingChange(food.id, 1);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Ajouter des Aliments</h3>
        <Input
          placeholder="Rechercher des aliments..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="mb-4 border border-border"
        />

        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 text-sm rounded-md transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto pr-4">
        {filteredFoods.map(food => (
          <Card key={food.id} className="p-4 border hover:border-foreground/20 transition-colors flex flex-col">
            <div className="flex gap-3 flex-1">
              <div className="relative w-20 h-20 flex-shrink-0 bg-muted rounded-md overflow-hidden">
                <Image
                  src={food.imageUrl}
                  alt={food.name}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    const img = e.currentTarget;
                    img.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2280%22 height=%2280%22%3E%3Crect fill=%22%23f0f0f0%22 width=%2280%22 height=%2280%22/%3E%3C/svg%3E';
                  }}
                />
              </div>

              <div className="flex-1">
                <h4 className="font-medium text-sm mb-1">{food.name}</h4>
                <p className="text-xs text-muted-foreground mb-2">
                  {food.calories} cal / {food.servingSize}
                  {food.servingUnit}
                </p>
                <div className="flex items-center gap-2 mb-2">
                  <Input
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={servings[food.id] || 1}
                    onChange={e => handleServingChange(food.id, parseFloat(e.target.value))}
                    className="w-16 h-8 text-xs border border-border"
                  />
                  <span className="text-xs text-muted-foreground">
                    {food.servingUnit}
                  </span>
                </div>
                <Button
                  size="sm"
                  onClick={() => handleAddFood(food)}
                  className="w-full h-7 text-xs bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Ajouter
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredFoods.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          Aucun aliment trouvé
        </div>
      )}
    </div>
  );
}
