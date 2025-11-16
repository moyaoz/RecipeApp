export interface RecipePreferences {
  duration: 'quick' | 'medium' | 'long'
  servings: number
  cuisines: string[]
  mealType?: 'breakfast' | 'lunch' | 'dinner'
  mealPrepDuration?: number
  difficulty: 'easy' | 'medium' | 'hard'
  dietaryRestrictions: string[]
  healthGoals: string[]
  fridgeItems?: string[]
}

export interface Recipe {
  id: string
  title: string
  image: string
  cuisines: string[]
  mealType?: 'breakfast' | 'lunch' | 'dinner'
  mealPrepDuration?: number
  difficulty: 'easy' | 'medium' | 'hard'
  cookTime: number
  servings: number
  rating: number
  source: string
  sourceUrl: string
  ingredients: { quantity: number | string | null; unit: string; item: string }[]
  instructions: string[]
  dietaryTags: string[]
  healthTags: string[]
  // User-selected scaling preferences (optional)
  userServings?: number
  userDays?: number
}

export interface Ingredient {
  name: string
  amount: number
  unit: string
}

export interface UserRating {
  recipeId: string
  rating: number
  cooked: boolean
  timestamp: number
}
