export type UserProfile = {
  age: number;
  sex: 'male' | 'female';
  weight: number; // in kg
  height?: number; // in cm
};

export type DailyRecommendations = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  vitamins: Record<string, { name: string; rda: number; unit: string }>;
  minerals: Record<string, { name: string; rda: number; unit: string }>;
};

// BMR formula calculation
function calculateBMR(weight: number, height: number = 170, age: number, sex: 'male' | 'female'): number {
  if (sex === 'male') {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    return 10 * weight + 6.25 * height - 5 * age - 161;
  }
}

export function getRecommendations(profile: UserProfile): DailyRecommendations {
  // esti height if not provided (average)
  const height = profile.height || (profile.sex === 'male' ? 175 : 165);
  
  // BMR
  const bmr = calculateBMR(profile.weight, height, profile.age, profile.sex);
  
  // activity factor (1.55 for moderate activity)
  const calories = Math.round(bmr * 1.55);
  
  // macro recommendations
  const protein = Math.round((calories * 0.25) / 4); // 25% of calories / 4 cal per gram
  const carbs = Math.round((calories * 0.50) / 4); // 50% of calories / 4 cal per gram
  const fat = Math.round((calories * 0.25) / 9); // 25% of calories / 9 cal per gram
  
  // values adjusted by age and sex
  const vitamins: Record<string, { name: string; rda: number; unit: string }> = {
    'vitamin_a': { name: 'Vitamine A', rda: profile.sex === 'male' ? 900 : 700, unit: 'μg' },
    'vitamin_b1': { name: 'Thiamine (B1)', rda: profile.age < 18 ? 1.0 : (profile.sex === 'male' ? 1.2 : 1.1), unit: 'mg' },
    'vitamin_b2': { name: 'Riboflavine (B2)', rda: profile.age < 18 ? 1.0 : (profile.sex === 'male' ? 1.3 : 1.1), unit: 'mg' },
    'vitamin_b3': { name: 'Niacine (B3)', rda: profile.age < 18 ? 12 : (profile.sex === 'male' ? 16 : 14), unit: 'mg' },
    'vitamin_b5': { name: 'Acide Pantothénique (B5)', rda: 5, unit: 'mg' },
    'vitamin_b6': { name: 'Pyridoxine (B6)', rda: profile.age < 18 ? 1.3 : (profile.sex === 'male' ? 1.3 : 1.2), unit: 'mg' },
    'vitamin_b7': { name: 'Biotine (B7)', rda: 30, unit: 'μg' },
    'vitamin_b9': { name: 'Folate (B9)', rda: 400, unit: 'μg' },
    'vitamin_b12': { name: 'Cobalamine (B12)', rda: 2.4, unit: 'μg' },
    'vitamin_c': { name: 'Vitamine C', rda: profile.sex === 'male' ? 90 : 75, unit: 'mg' },
    'vitamin_d': { name: 'Vitamine D', rda: profile.age < 70 ? 15 : 20, unit: 'μg' },
    'vitamin_e': { name: 'Vitamine E', rda: 15, unit: 'mg' },
    'vitamin_k': { name: 'Vitamine K', rda: profile.sex === 'male' ? 120 : 90, unit: 'μg' },
  };
  
  const minerals: Record<string, { name: string; rda: number; unit: string }> = {
    'calcium': { name: 'Calcium', rda: profile.age < 18 ? 1300 : (profile.age < 50 ? 1000 : 1200), unit: 'mg' },
    'iron': { name: 'Fer', rda: profile.age < 18 ? (profile.sex === 'male' ? 11 : 15) : (profile.sex === 'male' ? 8 : 18), unit: 'mg' },
    'magnesium': { name: 'Magnésium', rda: profile.age < 18 ? (profile.sex === 'male' ? 410 : 360) : (profile.sex === 'male' ? 400 : 310), unit: 'mg' },
    'phosphorus': { name: 'Phosphore', rda: profile.age < 18 ? 1250 : 700, unit: 'mg' },
    'potassium': { name: 'Potassium', rda: 3400, unit: 'mg' },
    'zinc': { name: 'Zinc', rda: profile.age < 18 ? (profile.sex === 'male' ? 11 : 9) : (profile.sex === 'male' ? 11 : 8), unit: 'mg' },
    'copper': { name: 'Cuivre', rda: 900, unit: 'μg' },
    'manganese': { name: 'Manganèse', rda: profile.sex === 'male' ? 2.3 : 1.8, unit: 'mg' },
    'selenium': { name: 'Sélénium', rda: 55, unit: 'μg' },
    'iodine': { name: 'Iode', rda: 150, unit: 'μg' },
  };
  
  return {
    calories,
    protein,
    carbs,
    fat,
    vitamins,
    minerals,
  };
}
