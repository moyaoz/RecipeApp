"use client"

import { Button } from '@/components/ui/button'
import React from 'react'

interface LandingHeroProps {
  onStart: () => void
}

export function LandingHero({ onStart }: LandingHeroProps) {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-white to-pink-50 p-6">
      <div className="relative w-full max-w-4xl mx-auto">
        {/* soft decorative shapes */}
        <div aria-hidden className="absolute -top-12 -left-8 w-44 h-44 bg-amber-200 rounded-3xl opacity-90 blur-sm transform rotate-6" />
        <div aria-hidden className="absolute -bottom-10 right-6 w-36 h-36 bg-pink-200 rounded-2xl opacity-90 blur-sm transform -rotate-6" />

        <div className="bg-white/90 dark:bg-slate-900/80 backdrop-blur-md rounded-3xl shadow-2xl p-12 sm:p-16 z-10">
          <div className="max-w-2xl">
            <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight mb-4">Recipe Swipe</h1>
            <p className="text-lg text-orange-600 font-semibold mb-6">Swipe your way to better meal prep.</p>

            <p className="text-base text-muted-foreground mb-8">
              We help you meal prep smarter by letting you swipe through delicious, trustworthy recipes tailored to your tastes and goals. No endless scrolling. No random AI recipes. Just real meals you’ll actually want to make, matched to you.
            </p>

            <div className="flex items-center gap-4">
              <Button
                onClick={onStart}
                className="bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-3 transform transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-orange-200"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
