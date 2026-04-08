import { FoodItem } from './nutritionData';

export type FoodServing = {
  foodId: string;
  quantity: number;
  unit: string; // 'g', 'piece', 'cup', etc.
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

// parser for serving size to get base weight in grams
function parseServingSize(servingSize: string): number {
  const match = servingSize.match(/(\d+)/);
  if (match) {
    return parseInt(match[1], 10);
  }
  return 100; // default to 100g
}

// nutrition for a given quantity
export function calculateFoodNutrition(food: FoodItem, quantity: number): FoodItem {
  const baseWeight = parseServingSize(food.servingSize);
  const multiplier = quantity / baseWeight;
  
  const vitamins: Record<string, number> = {};
  const minerals: Record<string, number> = {};
  
  Object.entries(food.vitamins).forEach(([key, value]) => {
    vitamins[key] = value * multiplier;
  });
  
  Object.entries(food.minerals).forEach(([key, value]) => {
    minerals[key] = value * multiplier;
  });
  
  return {
    ...food,
    calories: Math.round(food.calories * multiplier),
    protein: Math.round(food.protein * multiplier * 10) / 10,
    carbs: Math.round(food.carbs * multiplier * 10) / 10,
    fat: Math.round(food.fat * multiplier * 10) / 10,
    fiber: Math.round(food.fiber * multiplier * 10) / 10,
    vitamins,
    minerals,
  };
}

// total nutrition from multiple foods
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
      totals.vitamins[key] = (totals.vitamins[key] || 0) + value;
    });
    
    Object.entries(food.minerals).forEach(([key, value]) => {
      totals.minerals[key] = (totals.minerals[key] || 0) + value;
    });
  });
  
  return totals;
}

// macro percentages
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
    protein: Math.round((protein * 4 / totalCalories) * 100),
    carbs: Math.round((carbs * 4 / totalCalories) * 100),
    fat: Math.round((fat * 9 / totalCalories) * 100),
  };
}

// percentage of daily recommended value
export function calculateDailyPercentage(
  consumed: number,
  recommended: number
): number {
  if (recommended === 0) return 0;
  return Math.round((consumed / recommended) * 100);
}
