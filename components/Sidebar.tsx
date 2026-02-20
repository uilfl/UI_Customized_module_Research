'use client';

import React from 'react';
import { categories } from '@/lib/products';
import { usePersonalization } from '@/lib/PersonalizationContext';
import { getBehaviorTracker } from '@/lib/behaviorTracker';

interface SidebarProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
}

export default function Sidebar({
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
}: SidebarProps) {
  const { uiPreferences } = usePersonalization();

  const handleCategoryClick = (category: string) => {
    if (category !== 'All') {
      getBehaviorTracker().trackCategoryInteraction(category);
    }
    onCategoryChange(category);
  };

  const handlePriceChange = (min: number, max: number) => {
    getBehaviorTracker().trackPriceFilterUsage();
    onPriceRangeChange([min, max]);
  };

  const getAccentColor = () => {
    switch (uiPreferences.colorScheme) {
      case 'vibrant':
        return 'bg-pink-500';
      case 'minimal':
        return 'bg-gray-800';
      case 'warm':
        return 'bg-orange-500';
      case 'cool':
        return 'bg-blue-500';
      default:
        return 'bg-blue-600';
    }
  };

  const getHoverColor = () => {
    switch (uiPreferences.colorScheme) {
      case 'vibrant':
        return 'hover:bg-pink-50 hover:text-pink-600';
      case 'minimal':
        return 'hover:bg-gray-100 hover:text-gray-900';
      case 'warm':
        return 'hover:bg-orange-50 hover:text-orange-600';
      case 'cool':
        return 'hover:bg-blue-50 hover:text-blue-600';
      default:
        return 'hover:bg-blue-50 hover:text-blue-600';
    }
  };

  const getSelectedColor = () => {
    switch (uiPreferences.colorScheme) {
      case 'vibrant':
        return 'bg-pink-100 text-pink-700 border-l-4 border-pink-500';
      case 'minimal':
        return 'bg-gray-100 text-gray-900 border-l-4 border-gray-800';
      case 'warm':
        return 'bg-orange-100 text-orange-700 border-l-4 border-orange-500';
      case 'cool':
        return 'bg-blue-100 text-blue-700 border-l-4 border-blue-500';
      default:
        return 'bg-blue-100 text-blue-700 border-l-4 border-blue-600';
    }
  };

  return (
    <aside className="w-64 bg-white rounded-lg shadow-sm p-4 h-fit sticky top-24">
      {/* Categories */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
          </svg>
          Categories
        </h3>
        <ul className="space-y-1">
          {categories.map((category) => (
            <li key={category}>
              <button
                onClick={() => handleCategoryClick(category)}
                data-category={category}
                className={`
                  w-full text-left px-3 py-2 rounded-r-lg transition-colors
                  ${selectedCategory === category
                    ? getSelectedColor()
                    : `text-gray-600 ${getHoverColor()}`
                  }
                `}
              >
                {category}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Price Filter */}
      {uiPreferences.showPriceComparison && (
        <div className="mb-6">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Price Range
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={priceRange[0]}
                onChange={(e) => handlePriceChange(Number(e.target.value), priceRange[1])}
                data-priceFilter="min"
                placeholder="Min"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-gray-400">-</span>
              <input
                type="number"
                value={priceRange[1]}
                onChange={(e) => handlePriceChange(priceRange[0], Number(e.target.value))}
                data-priceFilter="max"
                placeholder="Max"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2">
              {[50, 100, 200].map((price) => (
                <button
                  key={price}
                  onClick={() => handlePriceChange(0, price)}
                  data-priceFilter={`under${price}`}
                  className={`
                    flex-1 py-1 px-2 text-xs rounded border border-gray-300
                    ${priceRange[1] === price ? getAccentColor() + ' text-white border-transparent' : 'hover:bg-gray-100'}
                  `}
                >
                  &lt;${price}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Deal Filter */}
      {uiPreferences.showDeals && (
        <div className="mb-6">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            Deals
          </h3>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded text-blue-600" />
              <span className="text-gray-600">On Sale</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded text-blue-600" />
              <span className="text-gray-600">Bestsellers</span>
            </label>
          </div>
        </div>
      )}
    </aside>
  );
}
