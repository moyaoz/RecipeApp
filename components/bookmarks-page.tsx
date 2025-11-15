'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { RecipeDetails } from '@/components/recipe-details'
import { MOCK_RECIPES } from '@/lib/mock-recipes'
import type { Recipe } from '@/types/recipe'

interface BookmarksPageProps {
  onBack: () => void
}

export function BookmarksPage({ onBack }: BookmarksPageProps) {
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set())
  const [bookmarkedRecipes, setBookmarkedRecipes] = useState<Recipe[]>([])
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem('recipe-bookmarks')
    if (saved) {
      const bookmarkIds = new Set(JSON.parse(saved))
      setBookmarks(bookmarkIds)
      const recipes = MOCK_RECIPES.filter(r => bookmarkIds.has(r.id))
      setBookmarkedRecipes(recipes)
    }
  }, [])

  const handleRemoveBookmark = (recipeId: string) => {
    const newBookmarks = new Set(bookmarks)
    newBookmarks.delete(recipeId)
    setBookmarks(newBookmarks)
    localStorage.setItem('recipe-bookmarks', JSON.stringify(Array.from(newBookmarks)))
    setBookmarkedRecipes(bookmarkedRecipes.filter(r => r.id !== recipeId))
  }

  const toggleBookmark = (recipeId: string) => {
    handleRemoveBookmark(recipeId)
  }

  if (selectedRecipe) {
    return (
      <RecipeDetails
        recipe={selectedRecipe}
        isBookmarked={bookmarks.has(selectedRecipe.id)}
        onBookmarkToggle={() => toggleBookmark(selectedRecipe.id)}
        onClose={() => setSelectedRecipe(null)}
      />
    )
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Bookmarked Recipes</h1>
            <p className="text-muted-foreground">{bookmarkedRecipes.length} recipes saved</p>
          </div>
        </div>

        {bookmarkedRecipes.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-lg text-muted-foreground mb-6">No bookmarked recipes yet</p>
            <Button onClick={onBack}>Back to Discovery</Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bookmarkedRecipes.map(recipe => (
              <Card
                key={recipe.id}
                className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedRecipe(recipe)}
              >
                <div className="relative h-48 bg-muted overflow-hidden">
                  <img
                    src={recipe.image || '/placeholder.svg'}
                    alt={recipe.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <button
                    onClick={e => {
                      e.stopPropagation()
                      handleRemoveBookmark(recipe.id)
                    }}
                    className="absolute top-3 right-3 p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-bold mb-2 line-clamp-2">{recipe.title}</h3>
                  <div className="flex gap-3 text-sm text-muted-foreground mb-4 flex-wrap">
                    <span>{recipe.cuisines[0]}</span>
                    <span>•</span>
                    <span>{recipe.cookTime} min</span>
                    <span>•</span>
                    <span>⭐ {recipe.rating.toFixed(1)}</span>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {recipe.dietaryTags.map(tag => (
                      <span
                        key={tag}
                        className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 text-xs px-2 py-1 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
