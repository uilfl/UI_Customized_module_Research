'use client';

import React from 'react';
import { Product } from '@/lib/products';
import { usePersonalization } from '@/lib/PersonalizationContext';
import { getBehaviorTracker } from '@/lib/behaviorTracker';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onViewDetails: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart, onViewDetails }: ProductCardProps) {
  const { uiPreferences } = usePersonalization();

  const handleClick = () => {
    getBehaviorTracker().trackProductView(product.id);
    onViewDetails(product);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    getBehaviorTracker().trackCartInteraction();
    onAddToCart(product);
  };

  const getLayoutClasses = () => {
    switch (uiPreferences.layoutStyle) {
      case 'list':
        return 'flex flex-row gap-4';
      case 'compact':
        return 'flex flex-col';
      case 'spacious':
        return 'flex flex-col p-6';
      default:
        return 'flex flex-col';
    }
  };

  const getImageClasses = () => {
    switch (uiPreferences.layoutStyle) {
      case 'list':
        return 'w-32 h-32 object-cover rounded-lg flex-shrink-0';
      case 'compact':
        return 'w-full h-32 object-cover';
      case 'spacious':
        return 'w-full h-64 object-cover rounded-lg';
      default:
        return 'w-full h-48 object-cover';
    }
  };

  const getColorAccent = () => {
    switch (uiPreferences.colorScheme) {
      case 'vibrant':
        return 'hover:border-pink-500 hover:shadow-pink-200';
      case 'minimal':
        return 'hover:border-gray-400 hover:shadow-gray-200';
      case 'warm':
        return 'hover:border-orange-500 hover:shadow-orange-200';
      case 'cool':
        return 'hover:border-blue-500 hover:shadow-blue-200';
      default:
        return 'hover:border-blue-500 hover:shadow-blue-200';
    }
  };

  const getButtonClasses = () => {
    switch (uiPreferences.colorScheme) {
      case 'vibrant':
        return 'bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600';
      case 'minimal':
        return 'bg-gray-800 hover:bg-gray-900';
      case 'warm':
        return 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600';
      case 'cool':
        return 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600';
      default:
        return 'bg-blue-600 hover:bg-blue-700';
    }
  };

  const getFontSize = () => {
    switch (uiPreferences.fontSize) {
      case 'small':
        return 'text-sm';
      case 'large':
        return 'text-lg';
      default:
        return 'text-base';
    }
  };

  const getAnimationClass = () => {
    switch (uiPreferences.animationLevel) {
      case 'none':
        return '';
      case 'full':
        return 'transform hover:scale-105 transition-all duration-300';
      default:
        return 'transition-shadow duration-200';
    }
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div
      onClick={handleClick}
      data-product={product.id}
      data-category={product.category}
      className={`
        bg-white rounded-lg border border-gray-200 overflow-hidden cursor-pointer
        ${getLayoutClasses()}
        ${getColorAccent()}
        ${getAnimationClass()}
        shadow-sm hover:shadow-lg
      `}
    >
      {/* Product Image */}
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className={getImageClasses()}
        />
        {uiPreferences.showDeals && discount > 0 && (
          <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-xs font-bold rounded">
            {discount}% OFF
          </span>
        )}
        {product.tags.includes('bestseller') && (
          <span className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 text-xs font-bold rounded">
            Bestseller
          </span>
        )}
      </div>

      {/* Product Info */}
      <div className={`p-4 flex-1 flex flex-col ${uiPreferences.layoutStyle === 'list' ? 'justify-between' : ''}`}>
        <div>
          <h3 className={`font-semibold text-gray-800 ${getFontSize()} line-clamp-2`}>
            {product.name}
          </h3>
          
          {uiPreferences.layoutStyle === 'list' && (
            <p className="text-gray-600 text-sm mt-1 line-clamp-2">
              {product.description}
            </p>
          )}

          {/* Rating */}
          {uiPreferences.showReviews && (
            <div className="flex items-center gap-1 mt-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-gray-500">({product.reviewCount})</span>
            </div>
          )}
        </div>

        {/* Price */}
        <div className="mt-3">
          <div className="flex items-center gap-2">
            <span className={`font-bold text-gray-900 ${uiPreferences.fontSize === 'large' ? 'text-xl' : 'text-lg'}`}>
              ${product.price.toFixed(2)}
            </span>
            {uiPreferences.showPriceComparison && product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          data-cart="add"
          className={`
            mt-3 w-full py-2 px-4 rounded-lg text-white font-medium
            ${getButtonClasses()}
            ${uiPreferences.animationLevel !== 'none' ? 'transition-colors' : ''}
          `}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
