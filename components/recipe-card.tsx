'use client'

import { useState } from 'react'
import { Bookmark, BookMarked as BookmarkOpen, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import type { Recipe } from '@/types/recipe'

interface RecipeCardProps {
  recipe: Recipe
  isBookmarked: boolean
  onSwipe: (direction: 'left' | 'right') => void
  onBookmarkToggle: () => void
  onClick: () => void
}

export function RecipeCard({
  recipe,
  isBookmarked,
  onSwipe,
  onBookmarkToggle,
  onClick,
}: RecipeCardProps) {
  const [dragStart, setDragStart] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragStart(e.clientX)
    setIsDragging(true)
  }

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDragging) return
    
    const dragEnd = e.clientX
    const diff = dragStart - dragEnd

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        onSwipe('left')
      } else {
        onSwipe('right')
      }
    }
    
    setIsDragging(false)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setDragStart(e.touches[0].clientX)
    setIsDragging(true)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging) return
    
    const dragEnd = e.changedTouches[0].clientX
    const diff = dragStart - dragEnd

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        onSwipe('left')
      } else {
        onSwipe('right')
      }
    }
    
    setIsDragging(false)
  }

  const difficultyColor = {
    easy: 'text-green-600 dark:text-green-400',
    medium: 'text-yellow-600 dark:text-yellow-400',
    hard: 'text-red-600 dark:text-red-400',
  }

  return (
    <Card
      className="overflow-hidden cursor-grab active:cursor-grabbing select-none"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="relative h-96 bg-muted overflow-hidden">
        <img
          src={recipe.image || "/placeholder.svg"}
          alt={recipe.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        
        {/* Bookmark Button */}
        <button
          onClick={e => {
            e.stopPropagation()
            onBookmarkToggle()
          }}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/90 hover:bg-white transition-colors"
        >
          {isBookmarked ? (
            <BookmarkOpen className="w-6 h-6 text-orange-500 fill-orange-500" />
          ) : (
            <Bookmark className="w-6 h-6 text-gray-600" />
          )}
        </button>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h3 className="text-2xl font-bold mb-2">{recipe.title}</h3>
          <div className="flex gap-3 flex-wrap">
            <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
              {recipe.cuisines[0]}
            </span>
            <span className={`font-medium text-sm capitalize ${difficultyColor[recipe.difficulty]}`}>
              {recipe.difficulty}
            </span>
            <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
              {recipe.cookTime} min
            </span>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Servings</p>
              <p className="text-lg font-bold">{recipe.servings}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Rating</p>
              <p className="text-lg font-bold">⭐ {recipe.rating.toFixed(1)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Source</p>
              <p className="text-sm font-medium truncate">{recipe.source}</p>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={e => {
              e.stopPropagation()
              onSwipe('left')
            }}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Skip
          </Button>
          <Button
            onClick={e => {
              e.stopPropagation()
              onClick()
            }}
            className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
          >
            View Recipe
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={e => {
              e.stopPropagation()
              onSwipe('right')
            }}
          >
            <ChevronRight className="w-4 h-4 ml-2" />
            Save
          </Button>
        </div>
      </div>
    </Card>
  )
}
