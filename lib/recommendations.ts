export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very-active';
export type NutritionGoal = 'lose' | 'maintain' | 'gain';

export type UserProfile = {
  age: number;
  sex: 'male' | 'female';
  weight: number; // kg
  height?: number; // cm
  activityLevel?: ActivityLevel;
  goal?: NutritionGoal;
};

export type DailyRecommendations = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  activityLevel: ActivityLevel;
  goal: NutritionGoal;
  vitamins: Record<string, { name: string; rda: number; unit: string }>;
  minerals: Record<string, { name: string; rda: number; unit: string }>;
};

const activityMultipliers: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  'very-active': 1.9,
};

const goalAdjustments: Record<NutritionGoal, number> = {
  lose: -300,
  maintain: 0,
  gain: 300,
};

function calculateBMR(weight: number, height: number = 170, age: number, sex: 'male' | 'female'): number {
  return sex === 'male'
    ? 10 * weight + 6.25 * height - 5 * age + 5
    : 10 * weight + 6.25 * height - 5 * age - 161;
}

export function getRecommendations(profile: UserProfile): DailyRecommendations {
  const height = profile.height || (profile.sex === 'male' ? 175 : 165);
  const activityLevel = profile.activityLevel || 'moderate';
  const goal = profile.goal || 'maintain';
  const bmr = calculateBMR(profile.weight, height, profile.age, profile.sex);
  const calories = Math.max(1200, Math.round(bmr * activityMultipliers[activityLevel] + goalAdjustments[goal]));

  const proteinRatio = goal === 'lose' ? 0.30 : 0.25;
  const fatRatio = 0.30;
  const carbRatio = 1 - proteinRatio - fatRatio;

  const protein = Math.round((calories * proteinRatio) / 4);
  const carbs = Math.round((calories * carbRatio) / 4);
  const fat = Math.round((calories * fatRatio) / 9);

  const vitamins: Record<string, { name: string; rda: number; unit: string }> = {
    vitamin_a: { name: 'Vitamine A', rda: profile.sex === 'male' ? 900 : 700, unit: 'μg' },
    vitamin_b1: { name: 'Thiamine (B1)', rda: profile.age < 18 ? 1.0 : profile.sex === 'male' ? 1.2 : 1.1, unit: 'mg' },
    vitamin_b2: { name: 'Riboflavine (B2)', rda: profile.age < 18 ? 1.0 : profile.sex === 'male' ? 1.3 : 1.1, unit: 'mg' },
    vitamin_b3: { name: 'Niacine (B3)', rda: profile.age < 18 ? 12 : profile.sex === 'male' ? 16 : 14, unit: 'mg' },
    vitamin_b5: { name: 'Acide pantothénique (B5)', rda: 5, unit: 'mg' },
    vitamin_b6: { name: 'Pyridoxine (B6)', rda: profile.age >= 51 ? (profile.sex === 'male' ? 1.7 : 1.5) : 1.3, unit: 'mg' },
    vitamin_b7: { name: 'Biotine (B7)', rda: 30, unit: 'μg' },
    vitamin_b9: { name: 'Folate (B9)', rda: 400, unit: 'μg' },
    vitamin_b12: { name: 'Cobalamine (B12)', rda: 2.4, unit: 'μg' },
    vitamin_c: { name: 'Vitamine C', rda: profile.sex === 'male' ? 90 : 75, unit: 'mg' },
    vitamin_d: { name: 'Vitamine D', rda: profile.age >= 71 ? 20 : 15, unit: 'μg' },
    vitamin_e: { name: 'Vitamine E', rda: 15, unit: 'mg' },
    vitamin_k: { name: 'Vitamine K', rda: profile.sex === 'male' ? 120 : 90, unit: 'μg' },
  };

  const minerals: Record<string, { name: string; rda: number; unit: string }> = {
    calcium: { name: 'Calcium', rda: profile.age < 18 ? 1300 : profile.age >= 51 ? 1200 : 1000, unit: 'mg' },
    iron: { name: 'Fer', rda: profile.age < 18 ? (profile.sex === 'male' ? 11 : 15) : profile.sex === 'male' ? 8 : profile.age >= 51 ? 8 : 18, unit: 'mg' },
    magnesium: { name: 'Magnésium', rda: profile.age < 18 ? (profile.sex === 'male' ? 410 : 360) : profile.sex === 'male' ? 400 : 310, unit: 'mg' },
    phosphorus: { name: 'Phosphore', rda: profile.age < 18 ? 1250 : 700, unit: 'mg' },
    potassium: { name: 'Potassium', rda: profile.sex === 'male' ? 3400 : 2600, unit: 'mg' },
    zinc: { name: 'Zinc', rda: profile.age < 18 ? (profile.sex === 'male' ? 11 : 9) : profile.sex === 'male' ? 11 : 8, unit: 'mg' },
    copper: { name: 'Cuivre', rda: 0.9, unit: 'mg' },
    manganese: { name: 'Manganèse', rda: profile.sex === 'male' ? 2.3 : 1.8, unit: 'mg' },
    selenium: { name: 'Sélénium', rda: 55, unit: 'μg' },
    iodine: { name: 'Iode', rda: 150, unit: 'μg' },
  };

  return {
    calories,
    protein,
    carbs,
    fat,
    activityLevel,
    goal,
    vitamins,
    minerals,
  };
}
