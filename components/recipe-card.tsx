'use client'

import { useState, useEffect } from 'react'
import { Bookmark, BookMarked as BookmarkOpen, ChevronLeft, ChevronRight, X, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Recipe } from '@/types/recipe'

interface RecipeCardProps {
  recipe: Recipe
  isBookmarked: boolean
  onSwipe: (direction: 'left' | 'right') => void
  onBookmarkToggle: () => void
  onClick: () => void
  isActive?: boolean
}

export function RecipeCard({
  recipe,
  isBookmarked,
  onSwipe,
  onBookmarkToggle,
  onClick,
  isActive = true,
}: RecipeCardProps) {
  const [dragStart, setDragStart] = useState(0)
  const [dragCurrent, setDragCurrent] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null)

  // mouse drag handlers intentionally removed to enforce keyboard-only swipe for mouse users

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (isAnimating || !isActive) return
    setDragStart(e.touches[0].clientX)
    setDragCurrent(e.touches[0].clientX)
    setIsDragging(true)
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging || isAnimating) return
    setDragCurrent(e.touches[0].clientX)
  }

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging || isAnimating) return
    
    const diff = dragStart - dragCurrent
    setIsDragging(false)

    if (Math.abs(diff) > 100) {
      triggerSwipe(diff > 0 ? 'left' : 'right')
    } else {
      setDragCurrent(0)
    }
  }

  const triggerSwipe = (direction: 'left' | 'right') => {
    setSwipeDirection(direction)
    setIsAnimating(true)
    setTimeout(() => {
      onSwipe(direction)
      setSwipeDirection(null)
      setIsAnimating(false)
      setDragCurrent(0)
    }, 300)
  }
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isAnimating || !isActive) return
      if (e.key === 'ArrowLeft') {
        triggerSwipe('left')
      } else if (e.key === 'ArrowRight') {
        triggerSwipe('right')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isAnimating, isActive])

  const getSwipeTransform = () => {
    if (isAnimating && swipeDirection === 'left') {
      return 'translate(-150%, 0) rotate(-10deg)'
    }
    if (isAnimating && swipeDirection === 'right') {
      return 'translate(150%, 0) rotate(10deg)'
    }
    if (isDragging && dragCurrent !== dragStart) {
      const diff = dragCurrent - dragStart
      const rotate = (diff / 100) * 10
      return `translate(${diff * 0.5}px, 0) rotate(${rotate}deg)`
    }
    return 'translate(0, 0) rotate(0deg)'
  }

  const getSwipeOpacity = () => {
    if (isAnimating) return 0
    return 1
  }

  const difficultyColor = {
    easy: 'text-green-600 dark:text-green-400',
    medium: 'text-yellow-600 dark:text-yellow-400',
    hard: 'text-red-600 dark:text-red-400',
  }

  return (
    <div
      className="relative flex items-center justify-center px-4 py-6"
      // mouse handlers intentionally removed so mouse users can't swipe; keyboard arrows control swipes
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="w-full lg:w-11/12 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden cursor-grab active:cursor-grabbing select-none"
        style={{
          transform: getSwipeTransform(),
          opacity: getSwipeOpacity(),
          transition: isDragging ? 'none' : 'all 0.3s ease-out',
          transformStyle: 'preserve-3d',
          willChange: 'transform, opacity',
          maxHeight: 'calc(100vh - 48px)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Image Section */}
        <div className="relative bg-muted overflow-hidden flex-shrink-0" style={{ height: 'min(55vh, 420px)' }}>
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
            className="absolute top-4 right-4 p-2 rounded-full bg-white/90 hover:bg-white transition-colors z-10"
          >
            {isBookmarked ? (
              <BookmarkOpen className="w-6 h-6 text-orange-500 fill-orange-500" />
            ) : (
              <Bookmark className="w-6 h-6 text-gray-600" />
            )}
          </button>

          {/* Swipe Indicators */}
          {isDragging && dragCurrent < dragStart && (
            <div className="absolute top-6 left-6 flex items-center gap-2 text-white animate-pulse">
              <X className="w-8 h-8" />
              <span className="text-lg font-bold">SKIP</span>
            </div>
          )}
          {isDragging && dragCurrent > dragStart && (
            <div className="absolute top-6 right-6 flex items-center gap-2 text-white animate-pulse">
              <span className="text-lg font-bold">SAVE</span>
              <Check className="w-8 h-8" />
            </div>
          )}

          {/* Title and Tags */}
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <h3 className="text-xl font-bold mb-2">{recipe.title}</h3>
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

        {/* Info Section */}
        <div className="p-4 space-y-3 flex-1 overflow-auto">
          <div className="flex gap-4 text-sm">
              <div>
              <p className="text-muted-foreground text-xs font-medium">RATING</p>
              <p className="text-lg font-bold">⭐ {recipe.rating.toFixed(1)}</p>
            </div>
            <div className="flex-1">
              <p className="text-muted-foreground text-xs font-medium">SOURCE</p>
              <p className="text-sm font-medium truncate">{recipe.source}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            <Button
              variant="default"
              size="sm"
              onClick={e => {
                e.stopPropagation()
                triggerSwipe('left')
              }}
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 flex flex-col items-center gap-1 h-auto py-2"
            >
              <X className="w-5 h-5" />
              <span className="text-xs">Skip</span>
            </Button>

            <Button
              variant="default"
              size="sm"
              onClick={e => {
                e.stopPropagation()
                onClick()
              }}
              className="flex flex-col items-center gap-1 h-auto py-2 bg-orange-100 text-orange-700 hover:bg-orange-200"
            >
              <ChevronRight className="w-5 h-5" />
              <span className="text-xs">View Recipe</span>
            </Button>

            <Button
              variant="default"
              size="sm"
              onClick={e => {
                e.stopPropagation()
                triggerSwipe('right')
              }}
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 flex flex-col items-center gap-1 h-auto py-2"
            >
              <Check className="w-5 h-5" />
              <span className="text-xs">Save</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
