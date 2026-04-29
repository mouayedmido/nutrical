'use client';

import { parseServingSize } from '@/lib/nutritionData';
import { useState, useMemo } from 'react';
import Image from 'next/image';
import { FoodItem, nutritionDatabase } from '@/lib/nutritionData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field';
import { useToast } from "@/hooks/use-toast";

type FoodSearchProps = {
  onAddFood: (food: FoodItem, quantity: number) => void;
};

const categoryLabels: Record<string, string> = {
  tunisian: 'Tunisienne',
  burger: 'Burgers',
  cake: 'Gâteaux',
  thai: 'Thaï',
  arab: 'Arabe',
  healthy: 'Sain',
  vegetable: 'Légumes',
  fruit: 'Fruits',
  drink: 'Boissons',
  dairy: 'Produits Laitiers',
  grain: 'Céréales',
  meat: 'Viande',
  seafood: 'Fruits de Mer',
  other: 'Autre',
};

export function FoodSearch({ onAddFood }: FoodSearchProps) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>('tunisian');
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [quantity, setQuantity] = useState(100);
  const { toast } = useToast();

  const categories = Array.from(new Set(nutritionDatabase.map(f => f.category)));

  const filteredFoods = useMemo(() => {
    return nutritionDatabase.filter(food => {
      const matchesSearch = search === '' || food.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = selectedCategory === null || food.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, selectedCategory]);

  const handleAddFood = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedFood) {
      const baseWeight = parseServingSize(selectedFood.servingSize);
      const ratio = quantity / baseWeight;

      const calculatedFood: FoodItem = {
        ...selectedFood,
        calories: Math.round(selectedFood.calories * ratio),
        protein: Number((selectedFood.protein * ratio).toFixed(1)),
        carbs: Number((selectedFood.carbs * ratio).toFixed(1)),
        fat: Number((selectedFood.fat * ratio).toFixed(1)),
        fiber: Number((selectedFood.fiber * ratio).toFixed(1)),
      };

      onAddFood(calculatedFood, quantity);
      
      toast({
        title: "Aliment ajouté ! ✅",
        description: `${quantity}g de ${selectedFood.name} a été ajouté à votre journée.`,
      });
      setQuantity(100);
      setSelectedFood(null);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border border-border">
        <CardHeader className="border-b border-border">
          <CardTitle className="text-lg">Ajouter des Aliments</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <Input
            placeholder="Rechercher par nom..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-border h-10 text-base"
          />

          <div className="space-y-2">
            <p className="text-sm font-medium">Catégories</p>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === null ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(null)}
                className="border border-border cursor-pointer"
              >
                Tous
              </Button>
              {categories.map((cat) => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(cat)}
                  className="border border-border cursor-pointer"
                >
                  {categoryLabels[cat]}
                </Button>
              ))}
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            {filteredFoods.length} aliment{filteredFoods.length !== 1 ? 's' : ''} trouvé{filteredFoods.length !== 1 ? 's' : ''}
          </p>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {filteredFoods.length > 0 ? (
          <div className="grid gap-6">
            {filteredFoods.map((food) => (
              <Card 
                key={food.id} 
                className={`border cursor-pointer transition-all hover:shadow-md ${
                  selectedFood?.id === food.id 
                    ? 'border-foreground ring-2 ring-foreground' 
                    : 'border-border hover:border-foreground'
                }`}
                onClick={() => {
                  setSelectedFood(food);
                  setQuantity(parseServingSize(food.servingSize));
                }}
              >
                <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6 p-6">
                  <div className="relative h-64 md:h-auto bg-muted rounded-lg overflow-hidden border border-border">
                    <Image
                      src={food.image}
                      alt={food.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 300px"
                    />
                  </div>

                  <div className="flex flex-col justify-between">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-xl font-semibold mb-1">{food.name}</h3>
                        <p className="text-sm text-muted-foreground">{categoryLabels[food.category]} • {food.servingSize}</p>
                      </div>

                      <div className="grid grid-cols-4 gap-3">
                        <div className="p-3 bg-muted/40 rounded border border-border">
                          <p className="text-xs text-muted-foreground mb-1">Calories</p>
                          <p className="text-lg font-bold">{Math.round(food.calories)}</p>
                        </div>
                        <div className="p-3 bg-muted/40 rounded border border-border">
                          <p className="text-xs text-muted-foreground mb-1">Protéines</p>
                          <p className="text-lg font-bold">{food.protein}g</p>
                        </div>
                        <div className="p-3 bg-muted/40 rounded border border-border">
                          <p className="text-xs text-muted-foreground mb-1">Glucides</p>
                          <p className="text-lg font-bold">{food.carbs}g</p>
                        </div>
                        <div className="p-3 bg-muted/40 rounded border border-border">
                          <p className="text-xs text-muted-foreground mb-1">Lipides</p>
                          <p className="text-lg font-bold">{food.fat}g</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3 text-sm">
                        <div>
                          <p className="text-xs text-muted-foreground">Fibres</p>
                          <p className="font-semibold">{food.fiber}g</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Vitamines</p>
                          <p className="font-semibold">{Object.values(food.vitamins).filter(v => v > 0).length}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Minéraux</p>
                          <p className="font-semibold">{Object.values(food.minerals).filter(v => v > 0).length}</p>
                        </div>
                      </div>
                    </div>

                    {selectedFood?.id === food.id && (
                      <div className="mt-6 space-y-4 pt-6 border-t border-border">
                        <FieldGroup>
                          <Field>
                            <FieldLabel>Quantité ({selectedFood.servingSize.toLowerCase().includes('ml') ? 'ml' : 'g'})</FieldLabel>
                            <Input
                              type="number"
                              value={quantity}
                              onChange={(e) => setQuantity(parseInt(e.target.value) || 100)}
                              min="1"
                              max="1000"
                              className="border border-border h-10 text-base"
                            />
                          </Field>
                        </FieldGroup>
                        <Button
                          onClick={handleAddFood}
                          className="w-full h-11 text-base font-semibold bg-foreground text-background hover:bg-foreground/90 cursor-pointer"
                        >
                          Ajouter à la Journée
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">Aucun aliment trouvé.</p>
          </div>
        )}
      </div>
    </div>
  );
}