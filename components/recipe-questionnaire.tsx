'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import type { RecipePreferences } from '@/types/recipe'

const CUISINES = ['Italian', 'Asian', 'Mexican', 'Indian', 'Mediterranean', 'American', 'Thai', 'French']
const DIETARY_RESTRICTIONS = ['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Nut-Free']
const HEALTH_GOALS = ['High Protein', 'Low Carb', 'Low Cholesterol', 'Low Sodium']

interface RecipeQuestionnaireProps {
  onSubmit: (preferences: RecipePreferences) => void
  onBack?: () => void
}

export function RecipeQuestionnaire({ onSubmit, onBack }: RecipeQuestionnaireProps) {
  const [step, setStep] = useState(0)
  const [preferences, setPreferences] = useState<Partial<RecipePreferences>>({
    cuisines: [],
    dietaryRestrictions: [],
    healthGoals: [],
    mealPrepDuration: 1,
  })
  

  const steps = [
    {
      question: 'Which meal are you planning for?',
      type: 'select',
      key: 'mealType',
      options: [
        { label: 'Breakfast', value: 'breakfast' },
        { label: 'Lunch', value: 'lunch' },
        { label: 'Dinner', value: 'dinner' },
      ],
    },
    {
      question: 'How many days do you want your meal prep to last?',
      type: 'number',
      key: 'mealPrepDuration',
      min: 1,
      max: 7,
    },
    {
      question: 'How long do you want to spend cooking?',
      type: 'select',
      key: 'duration',
      options: [
        { label: 'Quick (under 30 min)', value: 'quick' },
        { label: 'Medium (30-60 min)', value: 'medium' },
        { label: 'Long (over 60 min)', value: 'long' },
      ],
    },
    {
      question: 'How many people are you cooking for?',
      type: 'number',
      key: 'servings',
      min: 1,
      max: 6,
    },
    {
      question: 'What cuisines interest you?',
      type: 'multi-select',
      key: 'cuisines',
      options: CUISINES,
    },
    {
      question: 'Any dietary restrictions?',
      type: 'multi-select',
      key: 'dietaryRestrictions',
      options: DIETARY_RESTRICTIONS,
    },
    {
      question: 'Health goals?',
      type: 'multi-select',
      key: 'healthGoals',
      options: HEALTH_GOALS,
    },
  ]

  const currentStep = steps[step]

  const handleSelect = (value: string | number) => {
    setPreferences(prev => ({ ...prev, [currentStep.key]: value }))
    handleNext()
  }

  const handleMultiSelect = (value: string) => {
    const current = preferences[currentStep.key as keyof RecipePreferences] as string[] || []
    const updated = current.includes(value)
      ? current.filter(item => item !== value)
      : [...current, value]
    setPreferences(prev => ({ ...prev, [currentStep.key]: updated }))
  }

  const handleNumberChange = (value: number) => {
    setPreferences(prev => ({ ...prev, [currentStep.key]: value }))
  }

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1)
    } else {
      onSubmit(preferences as RecipePreferences)
    }
  }

  const handlePrev = () => {
    if (step > 0) {
      setStep(step - 1)
    } else if (onBack) {
      onBack()
    }
  }

  const canProceed = () => true

  const handleSeeAll = () => {
    // Skip the questionnaire and show all recipes
    onSubmit({} as RecipePreferences)
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center p-4">
      {/* Fixed top-right skip button visible in the viewport */}
      <div className="fixed right-4 top-4 z-50">
        <Button variant="outline" onClick={handleSeeAll}>
          See All Recipes
        </Button>
      </div>
      <Card className="w-full max-w-md shadow-xl">
        <div className="p-8">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-medium text-muted-foreground">
                Step {step + 1} of {steps.length}
              </p>
              <p className="text-sm font-medium text-muted-foreground">
                {Math.round(((step + 1) / steps.length) * 100)}%
              </p>
            </div>
            <div className="w-full h-2 bg-border rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-300"
                style={{ width: `${((step + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question */}
          <h2 className="text-2xl font-bold mb-6 text-foreground">
            {currentStep.question}
          </h2>

          {/* Options */}
          <div className="space-y-3 mb-8">
            {currentStep.type === 'select' && (
              <div className="space-y-2">
                {currentStep.options?.map(optionItem => {
                  const optionValue = typeof optionItem === 'string' ? optionItem : optionItem.value
                  const optionLabel = typeof optionItem === 'string' ? optionItem : optionItem.label
                  return (
                    <button
                      key={optionValue}
                      onClick={() => handleSelect(optionValue)}
                      className={`w-full p-4 rounded-lg border-2 transition-all text-left font-medium ${
                        preferences[currentStep.key as keyof RecipePreferences] === optionValue
                          ? 'border-orange-500 bg-orange-50 dark:bg-orange-950 text-orange-900 dark:text-orange-100'
                          : 'border-border hover:border-orange-300 hover:bg-orange-50/50 dark:hover:bg-slate-800'
                      }`}
                    >
                      {optionLabel}
                    </button>
                  )
                })}
                
              </div>
            )}

            {currentStep.type === 'number' && (
              <div className="space-y-4">
                {currentStep.key === 'servings' ? (
                  <div className="flex justify-center gap-2">
                    {Array.from({ length: 6 }, (_, i) => {
                      const val = i + 1
                      return (
                        <button
                          key={val}
                          onClick={() => handleNumberChange(val)}
                          className={`w-10 h-10 rounded-full font-semibold transition-all ${
                            preferences.servings === val
                              ? 'bg-orange-500 text-white'
                              : 'bg-border hover:bg-orange-100 dark:hover:bg-slate-700'
                          }`}
                        >
                          {val}
                        </button>
                      )
                    })}
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => {
                        const key = currentStep.key as keyof RecipePreferences
                        const min = (currentStep as any).min ?? 1
                        const cur = (preferences[key] as number) || min
                        const next = Math.max(min, cur - 1)
                        setPreferences(prev => ({ ...prev, [key]: next }))
                      }}
                      className="w-10 h-10 rounded-md bg-border hover:bg-orange-100 flex items-center justify-center"
                      aria-label="Decrease"
                    >
                      −
                    </button>

                    <input
                      type="number"
                      min={currentStep.min}
                      max={currentStep.max}
                      value={(preferences[currentStep.key as keyof RecipePreferences] as number) || ''}
                      onChange={e => handleNumberChange(parseInt(e.target.value))}
                      readOnly
                      className="w-28 p-4 rounded-lg border-2 border-border focus:border-orange-500 outline-none text-center text-lg font-bold cursor-default"
                    />

                    <button
                      onClick={() => {
                        const key = currentStep.key as keyof RecipePreferences
                        const max = (currentStep as any).max ?? 7
                        const cur = (preferences[key] as number) || ((currentStep as any).min ?? 1)
                        const next = Math.min(max, cur + 1)
                        setPreferences(prev => ({ ...prev, [key]: next }))
                      }}
                      className="w-10 h-10 rounded-md bg-border hover:bg-orange-100 flex items-center justify-center"
                      aria-label="Increase"
                    >
                      +
                    </button>
                  </div>
                )}
              </div>
            )}

            {currentStep.type === 'multi-select' && (
              <div className="flex flex-wrap gap-2">
                {currentStep.options?.map(optionItem => {
                  const optionValue = typeof optionItem === 'string' ? optionItem : optionItem.value
                  const optionLabel = typeof optionItem === 'string' ? optionItem : optionItem.label
                  const current = (preferences[currentStep.key as keyof RecipePreferences] as string[]) || []
                  const isSelected = current.includes(optionValue)
                  return (
                    <button
                      key={optionValue}
                      onClick={() => handleMultiSelect(optionValue)}
                      className={`px-4 py-2 rounded-full font-medium transition-all ${
                        isSelected
                          ? 'bg-orange-500 text-white shadow-md'
                          : 'bg-border hover:bg-orange-100 dark:hover:bg-slate-700 text-foreground'
                      }`}
                    >
                      {optionLabel}
                    </button>
                  )
                })}
                
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="hidden sm:flex gap-3">
            <Button
              onClick={handlePrev}
              disabled={!onBack && step === 0}
              variant="outline"
              className="flex-1"
            >
              Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
            >
              {step === steps.length - 1 ? 'Swipe Recipes' : 'Next'}
            </Button>
          </div>
        </div>
      </Card>

      {/* Mobile bottom action bar */}
      <div className="sm:hidden fixed bottom-6 left-1/2 transform -translate-x-1/2 w-[92%] max-w-md z-20">
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur rounded-full p-3 flex items-center justify-between shadow-lg">
          <button
            onClick={handlePrev}
            disabled={!onBack && step === 0}
            className="px-4 py-2 rounded-full font-medium text-sm"
          >
            ←
          </button>

          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className="-mt-6 bg-gradient-to-r from-orange-500 to-amber-500 w-14 h-14 rounded-full flex items-center justify-center text-white shadow-xl"
            aria-label="Primary action"
          >
            {step === steps.length - 1 ? '✓' : '→'}
          </button>

          <div className="w-10" />
        </div>
      </div>
    </div>
  )
}
