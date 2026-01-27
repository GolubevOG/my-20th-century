'use client';

import { useState } from 'react';
import { Category, repressedData, CategoryData, RepressedPerson } from '@/lib/repressed-data';
import { CategorySelector } from '@/components/CategorySelector';
import { PersonCard } from '@/components/PersonCard';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<Category>('Политические деятели');
  const categoryData: CategoryData | undefined = repressedData.find(cat => cat.id === selectedCategory);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-stone-100 to-stone-200 dark:from-stone-900 dark:to-stone-800">
      {/* Header */}
      <header className="border-b border-stone-300 dark:border-stone-700 bg-stone-50/80 dark:bg-stone-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-stone-800 dark:text-stone-100 mb-2 tracking-wide">
              Стулья
            </h1>
            <p className="text-lg md:text-xl text-stone-600 dark:text-stone-400">
              Репрессированные деятели СССР 1930-х годов
            </p>
            <p className="text-sm text-stone-500 dark:text-stone-500 mt-2 italic">
              Экспозиция выставки «Мой 20 век»
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Category Selector */}
        <div className="mb-8">
          <CategorySelector
            categories={repressedData}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>

        {/* Category Title */}
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-semibold text-stone-700 dark:text-stone-200">
            {categoryData?.label}
          </h2>
          <div className="w-24 h-1 bg-amber-700 dark:bg-amber-500 mx-auto mt-3"></div>
        </div>

        {/* People Grid */}
        {categoryData && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {categoryData.people.map((person) => (
              <PersonCard key={person.id} person={person} />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-900 mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-stone-600 dark:text-stone-400 text-sm">
            <p className="mb-2">Выставка «Мой 20 век»</p>
            <p className="text-xs text-stone-500 dark:text-stone-500">
              Память о жертвах политических репрессий
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
