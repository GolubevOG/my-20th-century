'use client';

import { useState } from 'react';
import { RepressedPerson } from '@/lib/repressed-data';

interface PersonCardProps {
  person: RepressedPerson;
}

export function PersonCard({ person }: PersonCardProps) {
  const [showAfterPhoto, setShowAfterPhoto] = useState(false);

  // Check if photoAfter is a valid URL (contains http/https)
  const hasValidAfterUrl = person.photoAfter && (person.photoAfter.includes('http://') || person.photoAfter.includes('https://'));

  const currentPhoto = showAfterPhoto && hasValidAfterUrl ? person.photoAfter : person.photoBefore;
  const shouldBlur = showAfterPhoto && !hasValidAfterUrl;

  return (
    <div className="bg-white dark:bg-stone-800 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-stone-200 dark:border-stone-700 flex flex-col h-full">
      {/* Photo Section */}
      <div
        className="relative aspect-[3/4] bg-stone-200 dark:bg-stone-700 overflow-hidden cursor-pointer group"
        onClick={() => setShowAfterPhoto(!showAfterPhoto)}
      >
        {/* Photo with sepia filter and blur if needed */}
        <img
          src={currentPhoto}
          alt={person.name}
          className={`w-full h-full object-cover transition-all duration-500 ${
            shouldBlur ? 'blur-sm grayscale' : 'hover:scale-105'
          }`}
          style={{ filter: shouldBlur ? 'blur(8px) grayscale(100%)' : 'grayscale(30%) sepia(20%)' }}
          onError={(e) => {
            e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ccc" width="100" height="100"/%3E%3Ctext fill="%23666" x="50%25" y="50%25" text-anchor="middle" dy=".3em" font-size="12"%3EФото недоступно%3C/text%3E%3C/svg%3E';
          }}
        />

        {/* Overlay with hint */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <p className="text-white text-sm font-medium text-center px-4">
            {showAfterPhoto ? 'Нажмите для фото до' : 'Нажмите для фото после'}
          </p>
        </div>

        {/* Status indicator */}
        <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold ${
          showAfterPhoto
            ? 'bg-red-800 text-white'
            : 'bg-amber-700 text-white'
        }`}>
          {showAfterPhoto ? 'После репрессии' : 'До репрессии'}
        </div>
      </div>

      {/* Info Section */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Name */}
        <h3 className="text-lg font-bold text-stone-800 dark:text-stone-100 mb-1 leading-tight">
          {person.name}
        </h3>

        {/* Years */}
        <p className="text-sm text-amber-700 dark:text-amber-500 font-medium mb-2">
          {person.years}
        </p>

        {/* Field */}
        <p className="text-sm text-stone-600 dark:text-stone-400 mb-3 italic">
          {person.field}
        </p>

        {/* Biography */}
        <div className="flex-1 overflow-y-auto max-h-48 mb-3">
          <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
            {person.biography}
          </p>
        </div>

        {/* Additional Info */}
        <div className="space-y-2 text-xs border-t border-stone-200 dark:border-stone-700 pt-3">
          <div>
            <span className="font-semibold text-stone-600 dark:text-stone-400">Дата репрессии:</span>
            <span className="ml-1 text-stone-700 dark:text-stone-300">{person.repressionDate}</span>
          </div>
          <div>
            <span className="font-semibold text-stone-600 dark:text-stone-400">Судьба:</span>
            <span className="ml-1 text-stone-700 dark:text-stone-300">{person.fate}</span>
          </div>
          {shouldBlur && (
            <div className="text-amber-600 dark:text-amber-400 italic">
              * Фото после репрессии недоступно (архивные данные)
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
