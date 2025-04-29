export type FoodAnalysisResult = {
  foodItems: FoodItem[];
  totalMacros: Macros;
  confidenceLevel: 'Low' | 'Medium' | 'High';
};

export type FoodItem = {
  name: string;
  macros: Macros;
};

export type Macros = {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  sugar: number;
};

export interface UserProfile {
  goal: string; // e.g., "weight loss", "muscle gain", "maintenance"
  activityLevel: string; // e.g., "sedentary", "moderate", "active"
  dietaryRestrictions: string[]; // e.g., ["vegetarian", "gluten-free"]
  healthConditions: string[]; // e.g., ["diabetes", "hypertension"]
}
