import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatMinutes(totalMinutes: number) {
  const mins = Math.max(0, Math.floor(totalMinutes || 0))
  const hours = Math.floor(mins / 60)
  const minutes = mins % 60

  if (hours > 0 && minutes > 0) return `${hours}h ${minutes}m`
  if (hours > 0) return `${hours}h`
  return `${minutes}m`
}

/**
 * Converts a decimal number to a fraction string.
 * Returns the closest common fraction for better recipe readability.
 * 
 * @param decimal - The decimal number to convert
 * @returns Fraction string like "1/2", "1 1/4", etc., or the decimal if no good fraction match
 */
function decimalToFraction(decimal: number): string {
  const tolerance = 0.01
  const whole = Math.floor(decimal)
  const remainder = decimal - whole
  
  // Common fractions used in recipes
  const fractions = [
    { decimal: 0, fraction: '' },
    { decimal: 0.125, fraction: '1/8' },
    { decimal: 0.167, fraction: '1/6' },
    { decimal: 0.2, fraction: '1/5' },
    { decimal: 0.25, fraction: '1/4' },
    { decimal: 0.333, fraction: '1/3' },
    { decimal: 0.375, fraction: '3/8' },
    { decimal: 0.4, fraction: '2/5' },
    { decimal: 0.5, fraction: '1/2' },
    { decimal: 0.6, fraction: '3/5' },
    { decimal: 0.625, fraction: '5/8' },
    { decimal: 0.667, fraction: '2/3' },
    { decimal: 0.75, fraction: '3/4' },
    { decimal: 0.8, fraction: '4/5' },
    { decimal: 0.833, fraction: '5/6' },
    { decimal: 0.875, fraction: '7/8' },
  ]
  
  // Find the closest fraction
  let closestFraction = null
  let minDiff = tolerance
  
  for (const frac of fractions) {
    const diff = Math.abs(remainder - frac.decimal)
    if (diff < minDiff) {
      minDiff = diff
      closestFraction = frac.fraction
    }
  }
  
  // Build the result
  if (closestFraction !== null) {
    if (whole === 0 && closestFraction === '') {
      return '0'
    }
    if (whole === 0) {
      return closestFraction
    }
    if (closestFraction === '') {
      return whole.toString()
    }
    return `${whole} ${closestFraction}`
  }
  
  // If no good fraction match, return decimal with reasonable precision
  return decimal < 10 
    ? decimal.toFixed(2).replace(/\.?0+$/, '')
    : Math.round(decimal).toString()
}

/**
 * Formats a single ingredient quantity as a fraction string.
 * Used for displaying original recipe quantities in fraction format.
 * 
 * @param quantity - The quantity to format (number, string, or null)
 * @returns Formatted quantity as string or null
 */
export function formatQuantityAsFraction(quantity: number | string | null): string | null {
  if (quantity === null || quantity === 0 || quantity === '') {
    return null
  }
  
  const numericQuantity = typeof quantity === 'string' 
    ? parseFloat(quantity) 
    : quantity
  
  if (isNaN(numericQuantity)) {
    return typeof quantity === 'string' ? quantity : null
  }
  
  return decimalToFraction(numericQuantity)
}

/**
 * Scales recipe ingredients based on the number of people and days.
 * First normalizes ingredients to 1 serving, then multiplies by target servings and days.
 * Converts decimal quantities to fractions for better readability.
 * 
 * @param ingredients - Array of recipe ingredients
 * @param originalServings - Original serving size from the recipe
 * @param targetPeople - Number of people to cook for
 * @param targetDays - Number of days for meal prep
 * @returns Array of scaled ingredients with updated quantities (as fraction strings or numbers)
 */
export function scaleIngredients(
  ingredients: { quantity: number | string | null; unit: string; item: string }[],
  originalServings: number,
  targetPeople: number,
  targetDays: number
) {
  const scaleFactor = (targetPeople * targetDays) / originalServings

  return ingredients.map(ingredient => {
    // Handle null or 0 quantities (like "to taste")
    if (ingredient.quantity === null || ingredient.quantity === 0 || ingredient.quantity === '') {
      return ingredient
    }

    // Convert string to number if needed (in case ingredient is already scaled)
    const numericQuantity = typeof ingredient.quantity === 'string' 
      ? parseFloat(ingredient.quantity) 
      : ingredient.quantity
    
    if (isNaN(numericQuantity)) {
      return ingredient // Keep original if can't parse
    }

    const scaledQuantity = numericQuantity * scaleFactor
    
    // Convert to fraction for display
    const fractionString = decimalToFraction(scaledQuantity)

    return {
      ...ingredient,
      quantity: fractionString
    }
  })
}
