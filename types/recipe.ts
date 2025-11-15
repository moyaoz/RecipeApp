export interface RecipePreferences {
  duration: 'quick' | 'medium' | 'long'
  servings: number
  cuisines: string[]
  mealType?: 'breakfast' | 'lunch' | 'dinner'
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
  difficulty: 'easy' | 'medium' | 'hard'
  cookTime: number
  servings: number
  rating: number
  source: string
  sourceUrl: string
  ingredients: Ingredient[]
  instructions: string[]
  dietaryTags: string[]
  healthTags: string[]
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
