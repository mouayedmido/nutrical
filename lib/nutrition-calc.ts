export interface UserProfile {
  age: number;
  weight: number; // kg
  height: number; // cm
  sex: 'male' | 'female';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very-active';
}

export interface DailyRecommendations {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  saturatedFat: number;
  sodium: number;
  potassium: number;
  vitaminA: number;
  vitaminC: number;
  vitaminD: number;
  vitaminE: number;
  vitaminK: number;
  thiamine: number;
  riboflavin: number;
  niacin: number;
  pantothenicAcid: number;
  vitaminB6: number;
  biotin: number;
  folate: number;
  vitaminB12: number;
  calcium: number;
  iron: number;
  magnesium: number;
  phosphorus: number;
  zinc: number;
  copper: number;
  manganese: number;
  selenium: number;
}

// Calculate BMR using Mifflin-St Jeor equation
export function calculateBMR(profile: UserProfile): number {
  let bmr: number;
  
  if (profile.sex === 'male') {
    bmr = 10 * profile.weight + 6.25 * profile.height - 5 * profile.age + 5;
  } else {
    bmr = 10 * profile.weight + 6.25 * profile.height - 5 * profile.age - 161;
  }
  
  return bmr;
}

// Calculate TDEE based on activity level
export function calculateTDEE(profile: UserProfile): number {
  const bmr = calculateBMR(profile);
  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    'very-active': 1.9,
  };
  
  return bmr * activityMultipliers[profile.activityLevel];
}

// Get daily nutrient recommendations based on user profile
export function getDailyRecommendations(profile: UserProfile): DailyRecommendations {
  const tdee = calculateTDEE(profile);
  
  // Base macronutrient recommendations
  const proteinRatio = 0.25; // 25% of calories
  const carbRatio = 0.45; // 45% of calories
  const fatRatio = 0.30; // 30% of calories
  
  const protein = (tdee * proteinRatio) / 4; // 4 cal/g
  const carbs = (tdee * carbRatio) / 4; // 4 cal/g
  const fat = (tdee * fatRatio) / 9; // 9 cal/g
  
  // Micronutrient recommendations (US RDA)
  let vitaminA = 900; // mcg (male)
  let vitaminC = 90; // mg (male)
  let vitaminD = 15; // mcg
  let vitaminE = 15; // mg
  let vitaminK = 120; // mcg (male)
  let thiamine = 1.2; // mg (male)
  let riboflavin = 1.3; // mg (male)
  let niacin = 16; // mg (male)
  let pantothenicAcid = 5; // mg (AI)
  let vitaminB6 = 1.3; // mg (male < 50)
  let biotin = 30; // mcg (AI)
  let folate = 400; // mcg
  let vitaminB12 = 2.4; // mcg
  let calcium = 1000; // mg (male < 50)
  let iron = 8; // mg (male)
  let magnesium = 400; // mg (male)
  let phosphorus = 700; // mg
  let zinc = 11; // mg (male)
  let copper = 0.9; // mg
  let manganese = 2.3; // mg (male)
  let selenium = 55; // mcg
  
  // Adjust for sex and age
  if (profile.sex === 'female') {
    vitaminA = 700;
    vitaminC = 75;
    vitaminK = 90;
    thiamine = 1.1;
    riboflavin = 1.1;
    niacin = 14;
    vitaminB6 = 1.3;
    calcium = 1000;
    iron = profile.age >= 51 ? 8 : 18;
    magnesium = 310;
    zinc = 8;
    manganese = 1.8;
  }
  
  if (profile.age >= 51) {
    if (profile.sex === 'male') {
      vitaminB6 = 1.7;
    } else {
      vitaminB6 = 1.5;
    }
  }
  
  if (profile.age >= 71) {
    vitaminD = 20;
  }
  
  // Potassium adequate intake
  let potassium = 3400; // mg (male)
  if (profile.sex === 'female') {
    potassium = 2600;
  }
  
  // Sodium and fiber estimates
  const fiber = profile.weight / 15; // Roughly 1g per 15kg of body weight
  const sodium = 2300; // Adequate intake limit
  const saturatedFat = (tdee * 0.07) / 9; // Limit to 7% of calories
  
  return {
    calories: tdee,
    protein: Math.round(protein),
    carbs: Math.round(carbs),
    fat: Math.round(fat),
    fiber: Math.round(fiber * 10) / 10,
    saturatedFat: Math.round(saturatedFat * 10) / 10,
    sodium: Math.round(sodium),
    potassium: Math.round(potassium),
    vitaminA: Math.round(vitaminA),
    vitaminC: Math.round(vitaminC),
    vitaminD: Math.round(vitaminD * 10) / 10,
    vitaminE: Math.round(vitaminE),
    vitaminK: Math.round(vitaminK),
    thiamine: Math.round(thiamine * 100) / 100,
    riboflavin: Math.round(riboflavin * 100) / 100,
    niacin: Math.round(niacin),
    pantothenicAcid: Math.round(pantothenicAcid * 10) / 10,
    vitaminB6: Math.round(vitaminB6 * 100) / 100,
    biotin: Math.round(biotin),
    folate: Math.round(folate),
    vitaminB12: Math.round(vitaminB12 * 100) / 100,
    calcium: Math.round(calcium),
    iron: Math.round(iron * 10) / 10,
    magnesium: Math.round(magnesium),
    phosphorus: Math.round(phosphorus),
    zinc: Math.round(zinc * 10) / 10,
    copper: Math.round(copper * 100) / 100,
    manganese: Math.round(manganese * 10) / 10,
    selenium: Math.round(selenium),
  };
}

// Calculate percentage of daily value
export function calculatePercentDV(
  nutrientValue: number,
  dailyRecommendation: number,
  nutrientType?: string
): number {
  if (dailyRecommendation === 0) return 0;
  return Math.round((nutrientValue / dailyRecommendation) * 100);
}

// Get color code for nutrient level
export function getNutrientLevelColor(percentDV: number): string {
  if (percentDV >= 100) return 'bg-green-100 text-green-900'; // Good
  if (percentDV >= 75) return 'bg-blue-100 text-blue-900'; // Adequate
  if (percentDV >= 50) return 'bg-amber-100 text-amber-900'; // Fair
  return 'bg-red-100 text-red-900'; // Insufficient
}
