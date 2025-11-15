'use client'

import { useState, useEffect } from 'react'
import { Search, BookmarkIcon } from 'lucide-react'
import { RecipeCard } from '@/components/recipe-card'
import { RecipeDetails } from '@/components/recipe-details'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MOCK_RECIPES } from '@/lib/mock-recipes'
import type { Recipe, RecipePreferences } from '@/types/recipe'

interface RecipeDiscoveryProps {
  preferences: RecipePreferences
  onReset: () => void
  onViewBookmarks: () => void
}

export function RecipeDiscovery({ preferences, onReset, onViewBookmarks }: RecipeDiscoveryProps) {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [activeFilters, setActiveFilters] = useState({
    difficulty: '',
    cuisine: '',
    maxTime: 999,
  })

  useEffect(() => {
    // Load bookmarks from localStorage
    const saved = localStorage.getItem('recipe-bookmarks')
    if (saved) {
      setBookmarks(new Set(JSON.parse(saved)))
    }

    // Filter recipes based on preferences
    const filtered = MOCK_RECIPES.filter(recipe => {
      const matchesCuisine = preferences.cuisines.length === 0 || 
        recipe.cuisines.some(c => preferences.cuisines.includes(c))
      const matchesDifficulty = !preferences.difficulty || recipe.difficulty === preferences.difficulty
      const matchesMeal = !preferences.mealType || recipe.mealType === preferences.mealType
      const matchesDiet = preferences.dietaryRestrictions.length === 0 ||
        recipe.dietaryTags.some(tag => preferences.dietaryRestrictions.includes(tag))

      return matchesCuisine && matchesDifficulty && matchesDiet && matchesMeal
    })

    setRecipes(filtered)
    applyFilters(filtered, searchQuery, activeFilters)
  }, [preferences])

  const applyFilters = (
    recipesToFilter: Recipe[],
    search: string,
    filters: typeof activeFilters
  ) => {
    let result = recipesToFilter

    // Search filter
    if (search.trim()) {
      result = result.filter(recipe =>
        recipe.title.toLowerCase().includes(search.toLowerCase()) ||
        recipe.source.toLowerCase().includes(search.toLowerCase())
      )
    }

    // Difficulty filter
    if (filters.difficulty) {
      result = result.filter(recipe => recipe.difficulty === filters.difficulty)
    }

    // Cuisine filter
    if (filters.cuisine) {
      result = result.filter(recipe => recipe.cuisines.includes(filters.cuisine))
    }

    // Cook time filter
    result = result.filter(recipe => recipe.cookTime <= filters.maxTime)

    setFilteredRecipes(result)
    setCurrentIndex(0)
  }

  const handleSearch = (value: string) => {
    setSearchQuery(value)
    applyFilters(recipes, value, activeFilters)
  }

  const handleFilterChange = (key: string, value: string | number) => {
    const newFilters = { ...activeFilters, [key]: value }
    setActiveFilters(newFilters)
    applyFilters(recipes, searchQuery, newFilters)
  }

  const handleSwipe = (direction: 'left' | 'right') => {
    if (direction === 'right' && filteredRecipes[currentIndex]) {
      const newBookmarks = new Set(bookmarks)
      newBookmarks.add(filteredRecipes[currentIndex].id)
      setBookmarks(newBookmarks)
      localStorage.setItem('recipe-bookmarks', JSON.stringify(Array.from(newBookmarks)))
    }
    
    if (currentIndex < filteredRecipes.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const toggleBookmark = (recipeId: string) => {
    const newBookmarks = new Set(bookmarks)
    if (newBookmarks.has(recipeId)) {
      newBookmarks.delete(recipeId)
    } else {
      newBookmarks.add(recipeId)
    }
    setBookmarks(newBookmarks)
    localStorage.setItem('recipe-bookmarks', JSON.stringify(Array.from(newBookmarks)))
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

  if (filteredRecipes.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No recipes found</h2>
          <p className="text-muted-foreground mb-6">Try adjusting your filters or search</p>
          <div className="flex gap-3 justify-center">
            <Button onClick={onReset} variant="outline">Start Over</Button>
            <Button onClick={() => setShowFilters(true)}>Adjust Filters</Button>
          </div>
        </div>
      </div>
    )
  }

  if (currentIndex >= filteredRecipes.length) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">You've seen all recipes!</h2>
          <p className="text-muted-foreground mb-6">You bookmarked {bookmarks.size} recipes</p>
          <div className="flex gap-3 justify-center">
            <Button onClick={onReset}>Start Over</Button>
            <Button onClick={onViewBookmarks} variant="outline">View Bookmarks</Button>
          </div>
        </div>
      </div>
    )
  }

  const currentRecipe = filteredRecipes[currentIndex]
  const allCuisines = Array.from(new Set(recipes.flatMap(r => r.cuisines)))

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex justify-between items-center gap-3">
          <h1 className="text-3xl font-bold">Find a Recipe</h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={onViewBookmarks}
              className="relative"
            >
              <BookmarkIcon className="w-5 h-5" />
              {bookmarks.size > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center">
                  {bookmarks.size}
                </span>
              )}
            </Button>
            <Button variant="outline" size="sm" onClick={onReset}>
              Reset
            </Button>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-6 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search recipes..."
              value={searchQuery}
              onChange={e => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filter Toggle */}
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>

          {/* Filter Panel */}
          {showFilters && (
            <div className="bg-card border border-border rounded-lg p-4 space-y-4">
              {/* Difficulty Filter */}
              <div>
                <label className="text-sm font-semibold mb-2 block">Difficulty</label>
                <div className="flex gap-2">
                  {['', 'easy', 'medium', 'hard'].map(val => (
                    <button
                      key={val}
                      onClick={() => handleFilterChange('difficulty', val)}
                      className={`px-3 py-2 rounded text-sm font-medium transition-all ${
                        activeFilters.difficulty === val
                          ? 'bg-orange-500 text-white'
                          : 'bg-border hover:bg-orange-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      {val ? val.charAt(0).toUpperCase() + val.slice(1) : 'All'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cuisine Filter */}
              <div>
                <label className="text-sm font-semibold mb-2 block">Cuisine</label>
                <div className="flex gap-2 flex-wrap">
                  {['', ...allCuisines].map(cuisine => (
                    <button
                      key={cuisine}
                      onClick={() => handleFilterChange('cuisine', cuisine)}
                      className={`px-3 py-2 rounded text-sm font-medium transition-all ${
                        activeFilters.cuisine === cuisine
                          ? 'bg-orange-500 text-white'
                          : 'bg-border hover:bg-orange-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      {cuisine ? cuisine : 'All'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cook Time Filter */}
              <div>
                <label className="text-sm font-semibold mb-2 block">
                  Max Cook Time: {activeFilters.maxTime === 999 ? 'Any' : `${activeFilters.maxTime} min`}
                </label>
                <input
                  type="range"
                  min="5"
                  max="120"
                  step="5"
                  value={activeFilters.maxTime === 999 ? 120 : activeFilters.maxTime}
                  onChange={e => {
                    const val = parseInt(e.target.value)
                    handleFilterChange('maxTime', val === 120 ? 999 : val)
                  }}
                  className="w-full"
                />
              </div>

              {/* Clear Filters */}
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setActiveFilters({ difficulty: '', cuisine: '', maxTime: 999 })
                  applyFilters(recipes, searchQuery, { difficulty: '', cuisine: '', maxTime: 999 })
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}

          {/* Recipe Count */}
          <p className="text-sm text-muted-foreground">
            Showing {currentIndex + 1} of {filteredRecipes.length} recipes
          </p>
        </div>

        {/* Recipe Card */}
        <RecipeCard
          recipe={currentRecipe}
          isBookmarked={bookmarks.has(currentRecipe.id)}
          onSwipe={handleSwipe}
          onBookmarkToggle={() => toggleBookmark(currentRecipe.id)}
          onClick={() => setSelectedRecipe(currentRecipe)}
        />
      </div>
    </div>
  )
}
