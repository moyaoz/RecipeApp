'use client'

import { useState } from 'react'
import { ArrowLeft, Bookmark, BookMarked as BookmarkOpen, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import type { Recipe, UserRating } from '@/types/recipe'

interface RecipeDetailsProps {
  recipe: Recipe
  isBookmarked: boolean
  onBookmarkToggle: () => void
  onClose: () => void
}

export function RecipeDetails({
  recipe,
  isBookmarked,
  onBookmarkToggle,
  onClose,
}: RecipeDetailsProps) {
  const [userRating, setUserRating] = useState<UserRating | null>(null)
  const [showRating, setShowRating] = useState(false)

  const handleRating = (cooked: boolean, rating: number) => {
    const newRating: UserRating = {
      recipeId: recipe.id,
      rating,
      cooked,
      timestamp: Date.now(),
    }
    setUserRating(newRating)
    
    // Save to localStorage
    const ratings = JSON.parse(localStorage.getItem('recipe-ratings') || '[]')
    ratings.push(newRating)
    localStorage.setItem('recipe-ratings', JSON.stringify(ratings))

    setTimeout(() => {
      onClose()
    }, 1000)
  }

  const difficultyColor = {
    easy: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
    hard: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold flex-1">{recipe.title}</h1>
          <button
            onClick={onBookmarkToggle}
            className="p-2 rounded-full hover:bg-muted transition-colors"
          >
            {isBookmarked ? (
              <BookmarkOpen className="w-6 h-6 text-orange-500 fill-orange-500" />
            ) : (
              <Bookmark className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Recipe Image */}
        <div className="mb-6 rounded-lg overflow-hidden h-80">
          <img
            src={recipe.image || "/placeholder.svg"}
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Card className="p-4">
            <p className="text-sm text-muted-foreground mb-1">Cooking Time</p>
            <p className="text-2xl font-bold">{recipe.cookTime} min</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground mb-1">Servings</p>
            <p className="text-2xl font-bold">{recipe.servings}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground mb-1">Difficulty</p>
            <p className={`text-lg font-bold capitalize ${
              recipe.difficulty === 'easy' ? 'text-green-600' :
              recipe.difficulty === 'medium' ? 'text-yellow-600' :
              'text-red-600'
            }`}>
              {recipe.difficulty}
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground mb-1">Rating</p>
            <p className="text-2xl font-bold">⭐ {recipe.rating.toFixed(1)}</p>
          </Card>
        </div>

        {/* Tags */}
        <div className="mb-6 flex flex-wrap gap-2">
          {recipe.cuisines.map(cuisine => (
            <span
              key={cuisine}
              className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium"
            >
              {cuisine}
            </span>
          ))}
          {recipe.dietaryTags.map(tag => (
            <span
              key={tag}
              className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 px-3 py-1 rounded-full text-sm font-medium"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Ingredients */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Ingredients</h2>
          <ul className="space-y-3">
            {recipe.ingredients.map((ing, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <input type="checkbox" className="mt-1 w-4 h-4 rounded" />
                <span className="text-foreground">
                  {ing.amount} {ing.unit} {ing.name}
                </span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Instructions */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Instructions</h2>
          <ol className="space-y-4">
            {recipe.instructions.map((instruction, idx) => (
              <li key={idx} className="flex gap-4">
                <span className="text-lg font-bold text-primary min-w-8">{idx + 1}</span>
                <p className="text-foreground pt-1">{instruction}</p>
              </li>
            ))}
          </ol>
        </Card>

        {/* Source */}
        <Card className="p-6 mb-6 bg-muted">
          <p className="text-sm text-muted-foreground mb-2">Recipe from</p>
          <a
            href={recipe.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary font-semibold hover:underline"
          >
            {recipe.source} ↗
          </a>
        </Card>

        {/* Rating Section */}
        {!userRating && (
          <div className="space-y-4">
            {!showRating ? (
              <Button
                onClick={() => setShowRating(true)}
                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 py-6 text-lg"
              >
                Did you cook this?
              </Button>
            ) : (
              <div className="space-y-4">
                <h3 className="font-bold text-lg">How was it?</h3>
                <div className="flex justify-center gap-2 mb-4">
                  {[1, 2, 3, 4, 5].map(rating => (
                    <button
                      key={rating}
                      onClick={() => handleRating(true, rating)}
                      className="text-4xl hover:scale-125 transition-transform"
                    >
                      {rating <= 3 ? '😕' : rating === 4 ? '😊' : '🤩'}
                    </button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  onClick={() => setShowRating(false)}
                  className="w-full"
                >
                  Not yet
                </Button>
              </div>
            )}
          </div>
        )}

        {userRating && (
          <Card className="p-6 bg-green-100 dark:bg-green-900 text-center">
            <p className="text-green-900 dark:text-green-100 font-semibold">
              ✓ Thanks for rating! We'll recommend similar recipes next time.
            </p>
          </Card>
        )}
      </div>
    </div>
  )
}
