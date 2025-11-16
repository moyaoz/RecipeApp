'use client'

import { useState } from 'react'
import { RecipeQuestionnaire } from '@/components/recipe-questionnaire'
import { LandingHero } from '@/components/landing-hero'
import { RecipeDiscovery } from '@/components/recipe-discovery'
import { BookmarksPage } from '@/components/bookmarks-page'
import type { RecipePreferences } from '@/types/recipe'

type View = 'landing' | 'questionnaire' | 'discovery' | 'bookmarks'

export default function Home() {
  const [preferences, setPreferences] = useState<RecipePreferences | null>(null)
  const [view, setView] = useState<View>('landing')

  const handleQuestionnaire = (prefs: RecipePreferences) => {
    setPreferences(prefs)
    setView('discovery')
  }

  const handleReset = () => {
    setPreferences(null)
    setView('questionnaire')
  }

  return (
    <main className="min-h-screen bg-background">
      {view === 'landing' && (
        <LandingHero onStart={() => setView('questionnaire')} />
      )}

      {view === 'questionnaire' && (
        <RecipeQuestionnaire onSubmit={handleQuestionnaire} onBack={() => setView('landing')} />
      )}

      {view === 'discovery' && preferences && (
        <RecipeDiscovery 
          preferences={preferences} 
          onReset={handleReset}
          onViewBookmarks={() => setView('bookmarks')}
        />
      )}

      {view === 'bookmarks' && (
        <BookmarksPage onBack={() => setView('discovery')} />
      )}
    </main>
  )
}
