'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { FoodItem, nutritionDatabase } from '@/lib/nutritionData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field';
import { useToast } from '@/hooks/use-toast';
import { calculateFoodNutrition, normalizeFoodQuantity, parseServingSize } from '@/lib/nutritionCalculator';

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
  dairy: 'Produits laitiers',
  grain: 'Céréales',
  meat: 'Viande',
  seafood: 'Fruits de mer',
  other: 'Autre',
};

function matchesSearch(food: FoodItem, search: string) {
  const query = search.trim().toLowerCase();
  if (!query) return true;

  return [food.name, food.category, ...(food.aliases || [])]
    .some(value => value.toLowerCase().includes(query));
}

function parseQuantityInput(value: string): number | null {
  const parsed = Number(value.replace(',', '.'));
  if (!Number.isFinite(parsed) || parsed < 1 || parsed > 2000) return null;
  return normalizeFoodQuantity(parsed);
}

export function FoodSearch({ onAddFood }: FoodSearchProps) {
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>('tunisian');
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [quantity, setQuantity] = useState('100');

  const categories = Array.from(new Set(nutritionDatabase.map(f => f.category)));

  const filteredFoods = useMemo(() => {
    return nutritionDatabase.filter(food => {
      const matchesCategory = selectedCategory === null || food.category === selectedCategory;
      return matchesSearch(food, search) && matchesCategory;
    });
  }, [search, selectedCategory]);

  const parsedQuantity = parseQuantityInput(quantity);

  const handleSelectFood = (food: FoodItem) => {
    setSelectedFood(food);
    const defaultQuantity = parseServingSize(food.servingSize).amount;
    setQuantity(String(defaultQuantity));
  };

  const handleAddFood = () => {
    if (!selectedFood) return;

    if (parsedQuantity === null) {
      toast({
        title: 'Quantité invalide',
        description: 'Entrez une quantité entre 1 et 2000 avant d’ajouter cet aliment.',
        variant: 'destructive',
      });
      return;
    }

    const servingUnit = parseServingSize(selectedFood.servingSize).unit;
    onAddFood(selectedFood, parsedQuantity);
    toast({
      title: 'Aliment ajouté ! ✅',
      description: `${parsedQuantity}${servingUnit} de ${selectedFood.name} a été ajouté à votre journée.`,
    });
    setQuantity('100');
    setSelectedFood(null);
  };

  return (
    <div className="space-y-6">
      <Card className="border border-border">
        <CardHeader className="border-b border-border">
          <CardTitle className="text-lg">Ajouter des aliments</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <label htmlFor="food-search" className="text-sm font-medium">Recherche</label>
            <Input
              id="food-search"
              placeholder="Ex. couscous, kosksi, brik, lablebi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-border h-10 text-base"
            />
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Catégories</p>
            <div className="flex flex-wrap gap-2" aria-label="Filtrer par catégorie">
              <Button
                variant={selectedCategory === null ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(null)}
                aria-pressed={selectedCategory === null}
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
                  aria-pressed={selectedCategory === cat}
                  className="border border-border cursor-pointer"
                >
                  {categoryLabels[cat] || cat}
                </Button>
              ))}
            </div>
          </div>

          <p className="text-xs text-muted-foreground" aria-live="polite">
            {filteredFoods.length} aliment{filteredFoods.length !== 1 ? 's' : ''} trouvé{filteredFoods.length !== 1 ? 's' : ''}
          </p>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {filteredFoods.length > 0 ? (
          <div className="grid gap-6">
            {filteredFoods.map((food) => {
              const isSelected = selectedFood?.id === food.id;
              const previewFood = isSelected && parsedQuantity !== null
                ? calculateFoodNutrition(food, parsedQuantity)
                : null;
              const displayFood = previewFood || food;
              const servingUnit = parseServingSize(food.servingSize).unit;

              return (
                <Card
                  key={food.id}
                  role="button"
                  tabIndex={0}
                  aria-pressed={isSelected}
                  className={`border cursor-pointer transition-all hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground ${
                    isSelected
                      ? 'border-foreground ring-2 ring-foreground'
                      : 'border-border hover:border-foreground'
                  }`}
                  onClick={() => handleSelectFood(food)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      handleSelectFood(food);
                    }
                  }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-6 p-4 sm:p-6">
                    <div className="relative h-56 md:h-auto bg-muted rounded-lg overflow-hidden border border-border">
                      <Image
                        src={food.image}
                        alt={`Photo de ${food.name}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 260px"
                      />
                    </div>

                    <div className="flex flex-col justify-between">
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-xl font-semibold mb-1">{food.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {categoryLabels[food.category] || food.category} • portion de référence : {food.servingSize}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          <div className="p-3 bg-muted/40 rounded border border-border">
                            <p className="text-xs text-muted-foreground mb-1">Calories</p>
                            <p className="text-lg font-bold">{Math.round(displayFood.calories)}</p>
                          </div>
                          <div className="p-3 bg-muted/40 rounded border border-border">
                            <p className="text-xs text-muted-foreground mb-1">Protéines</p>
                            <p className="text-lg font-bold">{displayFood.protein}g</p>
                          </div>
                          <div className="p-3 bg-muted/40 rounded border border-border">
                            <p className="text-xs text-muted-foreground mb-1">Glucides</p>
                            <p className="text-lg font-bold">{displayFood.carbs}g</p>
                          </div>
                          <div className="p-3 bg-muted/40 rounded border border-border">
                            <p className="text-xs text-muted-foreground mb-1">Lipides</p>
                            <p className="text-lg font-bold">{displayFood.fat}g</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3 text-sm">
                          <div>
                            <p className="text-xs text-muted-foreground">Fibres</p>
                            <p className="font-semibold">{displayFood.fiber}g</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Vitamines</p>
                            <p className="font-semibold">{Object.values(displayFood.vitamins).filter(v => v > 0).length}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Minéraux</p>
                            <p className="font-semibold">{Object.values(displayFood.minerals).filter(v => v > 0).length}</p>
                          </div>
                        </div>
                      </div>

                      {isSelected && (
                        <div className="mt-6 space-y-4 pt-6 border-t border-border" onClick={(event) => event.stopPropagation()}>
                          <FieldGroup>
                            <Field>
                              <FieldLabel htmlFor={`quantity-${food.id}`}>Quantité réellement consommée ({servingUnit})</FieldLabel>
                              <Input
                                id={`quantity-${food.id}`}
                                type="number"
                                inputMode="decimal"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                min="1"
                                max="2000"
                                step="1"
                                className="border border-border h-10 text-base"
                              />
                            </Field>
                          </FieldGroup>

                          {parsedQuantity !== null ? (
                            <div className="rounded border border-border bg-muted/40 p-3 text-sm">
                              <p className="font-medium">Aperçu pour {parsedQuantity}{servingUnit}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {displayFood.calories} cal • P: {displayFood.protein}g • G: {displayFood.carbs}g • L: {displayFood.fat}g
                              </p>
                            </div>
                          ) : (
                            <p className="text-xs text-destructive">Entrez une quantité valide entre 1 et 2000.</p>
                          )}

                          <Button
                            onClick={handleAddFood}
                            disabled={parsedQuantity === null}
                            className="w-full h-11 text-base font-semibold bg-foreground text-background hover:bg-foreground/90"
                          >
                            Ajouter à la journée
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 border border-dashed border-border rounded-lg">
            <p className="text-muted-foreground text-lg">Aucun aliment trouvé.</p>
            <p className="text-xs text-muted-foreground mt-2">Essayez un nom français, tunisien ou translittéré.</p>
          </div>
        )}
      </div>
    </div>
  );
}
