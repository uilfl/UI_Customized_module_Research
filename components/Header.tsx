'use client';

import React, { useState } from 'react';
import { usePersonalization } from '@/lib/PersonalizationContext';
import { getBehaviorTracker } from '@/lib/behaviorTracker';

interface HeaderProps {
  cartItemCount: number;
  onCartClick: () => void;
  onSearch: (query: string) => void;
}

export default function Header({ cartItemCount, onCartClick, onSearch }: HeaderProps) {
  const { uiPreferences } = usePersonalization();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      getBehaviorTracker().trackSearch(searchQuery);
      onSearch(searchQuery);
    }
  };

  const getColorSchemeClasses = () => {
    switch (uiPreferences.colorScheme) {
      case 'vibrant':
        return 'bg-gradient-to-r from-purple-600 to-pink-500';
      case 'minimal':
        return 'bg-gray-800';
      case 'warm':
        return 'bg-gradient-to-r from-orange-500 to-red-500';
      case 'cool':
        return 'bg-gradient-to-r from-blue-600 to-cyan-500';
      default:
        return 'bg-blue-600';
    }
  };

  const getFontSizeClass = () => {
    switch (uiPreferences.fontSize) {
      case 'small':
        return 'text-sm';
      case 'large':
        return 'text-xl';
      default:
        return 'text-base';
    }
  };

  return (
    <header className={`${getColorSchemeClasses()} text-white shadow-lg sticky top-0 z-50`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span className={`font-bold ${getFontSizeClass()} lg:text-xl`}>
              AI Shop
            </span>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-xl">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className={`w-full px-4 py-2 rounded-full text-gray-800 ${getFontSizeClass()} focus:outline-none focus:ring-2 focus:ring-white`}
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </form>

          {/* Cart Button */}
          <button
            onClick={onCartClick}
            data-cart="true"
            className="relative p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
