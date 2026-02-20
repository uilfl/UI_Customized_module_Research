'use client';

import React from 'react';
import { Product, products } from '@/lib/products';
import { usePersonalization } from '@/lib/PersonalizationContext';
import { getBehaviorTracker } from '@/lib/behaviorTracker';

interface RecommendationsProps {
  onAddToCart: (product: Product) => void;
  onViewDetails: (product: Product) => void;
}

export default function Recommendations({ onAddToCart, onViewDetails }: RecommendationsProps) {
  const { uiPreferences, behavior, persona } = usePersonalization();

  if (!uiPreferences.showRecommendations) {
    return null;
  }

  // Get recommended products based on behavior and persona
  const getRecommendations = (): Product[] => {
    let recommendations: Product[] = [];

    // For bargain hunters, recommend products with discounts
    if (persona === 'bargain_hunter') {
      recommendations = products.filter(p => p.originalPrice && p.originalPrice > p.price);
    }
    // For impulse buyers, recommend trending and bestsellers
    else if (persona === 'impulse_buyer') {
      recommendations = products.filter(p => 
        p.tags.includes('trending') || p.tags.includes('bestseller')
      );
    }
    // For researchers, recommend highly-rated products
    else if (persona === 'researcher') {
      recommendations = [...products].sort((a, b) => b.rating - a.rating);
    }
    // For loyal customers, recommend based on category preferences
    else if (persona === 'loyal_customer' && Object.keys(behavior.categoryPreferences).length > 0) {
      const topCategory = Object.entries(behavior.categoryPreferences)
        .sort((a, b) => b[1] - a[1])[0][0];
      recommendations = products.filter(p => p.category === topCategory);
    }
    // For new visitors, show bestsellers
    else {
      recommendations = products.filter(p => p.tags.includes('bestseller'));
    }

    // Don't recommend already viewed products
    recommendations = recommendations.filter(p => !behavior.productViews.includes(p.id));

    return recommendations.slice(0, 4);
  };

  const recommendations = getRecommendations();

  if (recommendations.length === 0) {
    return null;
  }

  const handleProductClick = (product: Product) => {
    getBehaviorTracker().trackProductView(product.id);
    onViewDetails(product);
  };

  const getAccentColor = () => {
    switch (uiPreferences.colorScheme) {
      case 'vibrant':
        return 'from-purple-600 to-pink-500';
      case 'minimal':
        return 'from-gray-600 to-gray-700';
      case 'warm':
        return 'from-orange-500 to-red-500';
      case 'cool':
        return 'from-blue-500 to-cyan-500';
      default:
        return 'from-blue-500 to-blue-600';
    }
  };

  const getRecommendationTitle = () => {
    switch (persona) {
      case 'bargain_hunter':
        return '🏷️ Best Deals For You';
      case 'impulse_buyer':
        return '🔥 Trending Now';
      case 'researcher':
        return '⭐ Top Rated Products';
      case 'loyal_customer':
        return '💝 Picked For You';
      default:
        return '✨ Recommended For You';
    }
  };

  return (
    <div className="mb-8">
      <h2 className={`text-xl font-bold mb-4 bg-gradient-to-r ${getAccentColor()} bg-clip-text text-transparent`}>
        {getRecommendationTitle()}
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {recommendations.map((product) => (
          <div
            key={product.id}
            onClick={() => handleProductClick(product)}
            className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
          >
            <div className="relative">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-32 object-cover"
              />
              {product.originalPrice && (
                <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                  Sale
                </span>
              )}
            </div>
            <div className="p-3">
              <h3 className="font-medium text-sm text-gray-800 line-clamp-1">{product.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="font-bold text-gray-900">${product.price.toFixed(2)}</span>
                {product.originalPrice && (
                  <span className="text-xs text-gray-500 line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  getBehaviorTracker().trackCartInteraction();
                  onAddToCart(product);
                }}
                className={`mt-2 w-full py-1 text-xs bg-gradient-to-r ${getAccentColor()} text-white rounded hover:opacity-90 transition-opacity`}
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
