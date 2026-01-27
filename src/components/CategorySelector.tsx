'use client';

import { Category, CategoryData } from '@/lib/repressed-data';

interface CategorySelectorProps {
  categories: CategoryData[];
  selectedCategory: Category;
  onCategoryChange: (category: Category) => void;
}

export function CategorySelector({ categories, selectedCategory, onCategoryChange }: CategorySelectorProps) {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      {categories.map((category) => {
        const isSelected = category.id === selectedCategory;
        return (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`
              px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300
              ${isSelected
                ? 'bg-amber-700 text-white shadow-lg scale-105'
                : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-amber-100 dark:hover:bg-stone-700 hover:shadow-md'
              }
              border border-stone-300 dark:border-stone-600
            `}
          >
            {category.label}
          </button>
        );
      })}
    </div>
  );
}
