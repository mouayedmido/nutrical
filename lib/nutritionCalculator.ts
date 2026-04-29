import { FoodItem } from './nutritionData';

export type FoodServing = {
  foodId: string;
  quantity: number;
  unit: string;
};

export type ParsedServingSize = {
  amount: number;
  unit: 'g' | 'ml';
};

export type NutritionTotals = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  vitamins: Record<string, number>;
  minerals: Record<string, number>;
};

export type MacroPercentages = {
  protein: number;
  carbs: number;
  fat: number;
};

const MIN_QUANTITY = 1;
const MAX_QUANTITY = 2000;

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

function roundNutrient(value: number): number {
  return Math.round(value * 100) / 100;
}

export function parseServingSize(servingSize: string): ParsedServingSize {
  const match = servingSize.match(/(\d+(?:[.,]\d+)?)/);
  const amount = match ? Number(match[1].replace(',', '.')) : 100;
  const safeAmount = Number.isFinite(amount) && amount > 0 ? amount : 100;
  const unit = /ml|l\b/i.test(servingSize) ? 'ml' : 'g';

  return { amount: safeAmount, unit };
}

export function normalizeFoodQuantity(quantity: number): number {
  if (!Number.isFinite(quantity)) return 100;
  return Math.max(MIN_QUANTITY, Math.min(quantity, MAX_QUANTITY));
}

export function calculateFoodNutrition(food: FoodItem, quantity: number): FoodItem {
  const safeQuantity = normalizeFoodQuantity(quantity);
  const referenceServing = parseServingSize(food.referenceServingSize || food.servingSize);
  const multiplier = safeQuantity / referenceServing.amount;

  const vitamins: Record<string, number> = {};
  const minerals: Record<string, number> = {};

  Object.entries(food.vitamins).forEach(([key, value]) => {
    vitamins[key] = roundNutrient(value * multiplier);
  });

  Object.entries(food.minerals).forEach(([key, value]) => {
    minerals[key] = roundNutrient(value * multiplier);
  });

  return {
    ...food,
    referenceServingSize: food.referenceServingSize || food.servingSize,
    quantityGrams: safeQuantity,
    quantityUnit: referenceServing.unit,
    loggedAt: new Date().toISOString(),
    calories: Math.round(food.calories * multiplier),
    protein: round1(food.protein * multiplier),
    carbs: round1(food.carbs * multiplier),
    fat: round1(food.fat * multiplier),
    fiber: round1(food.fiber * multiplier),
    vitamins,
    minerals,
  };
}

export function calculateTotalNutrition(foods: FoodItem[]): NutritionTotals {
  const totals: NutritionTotals = {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    vitamins: {},
    minerals: {},
  };

  foods.forEach((food) => {
    totals.calories += food.calories;
    totals.protein += food.protein;
    totals.carbs += food.carbs;
    totals.fat += food.fat;
    totals.fiber += food.fiber;

    Object.entries(food.vitamins).forEach(([key, value]) => {
      totals.vitamins[key] = roundNutrient((totals.vitamins[key] || 0) + value);
    });

    Object.entries(food.minerals).forEach(([key, value]) => {
      totals.minerals[key] = roundNutrient((totals.minerals[key] || 0) + value);
    });
  });

  return {
    calories: Math.round(totals.calories),
    protein: round1(totals.protein),
    carbs: round1(totals.carbs),
    fat: round1(totals.fat),
    fiber: round1(totals.fiber),
    vitamins: totals.vitamins,
    minerals: totals.minerals,
  };
}

export function calculateMacroPercentages(
  protein: number,
  carbs: number,
  fat: number
): MacroPercentages {
  const totalCalories = protein * 4 + carbs * 4 + fat * 9;

  if (totalCalories === 0) {
    return { protein: 0, carbs: 0, fat: 0 };
  }

  return {
    protein: Math.round(((protein * 4) / totalCalories) * 100),
    carbs: Math.round(((carbs * 4) / totalCalories) * 100),
    fat: Math.round(((fat * 9) / totalCalories) * 100),
  };
}

export function calculateDailyPercentage(consumed: number, recommended: number): number {
  if (recommended === 0) return 0;
  return Math.round((consumed / recommended) * 100);
}
