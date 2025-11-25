'use client';

import React from 'react';
import { Product, reviews } from '@/lib/products';
import { usePersonalization } from '@/lib/PersonalizationContext';
import { getBehaviorTracker } from '@/lib/behaviorTracker';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
}

export default function ProductModal({ product, isOpen, onClose, onAddToCart }: ProductModalProps) {
  const { uiPreferences } = usePersonalization();

  if (!isOpen || !product) return null;

  const productReviews = reviews.filter(r => r.productId === product.id);
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleReviewRead = () => {
    getBehaviorTracker().trackReviewRead();
  };

  const getAccentColor = () => {
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

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-4 md:inset-8 lg:inset-16 bg-white rounded-xl shadow-2xl z-50 overflow-hidden flex flex-col md:flex-row">
        {/* Image Section */}
        <div className="md:w-1/2 bg-gray-100 relative">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-64 md:h-full object-cover"
          />
          {uiPreferences.showDeals && discount > 0 && (
            <span className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 text-sm font-bold rounded-full">
              {discount}% OFF
            </span>
          )}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Details Section */}
        <div className="md:w-1/2 flex flex-col overflow-y-auto">
          <div className="p-6 flex-1">
            {/* Category */}
            <span className="text-sm text-gray-500">{product.category}</span>
            
            {/* Name */}
            <h1 className="text-2xl font-bold text-gray-800 mt-1">{product.name}</h1>
            
            {/* Rating */}
            <div className="flex items-center gap-2 mt-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-gray-600">{product.rating}</span>
              <span className="text-gray-400">|</span>
              <span className="text-gray-500">{product.reviewCount} reviews</span>
            </div>

            {/* Price */}
            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-3xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
              {uiPreferences.showPriceComparison && product.originalPrice && (
                <span className="text-xl text-gray-500 line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="mt-4 text-gray-600 leading-relaxed">{product.description}</p>

            {/* Tags */}
            <div className="mt-4 flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full capitalize"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Stock Status */}
            <div className="mt-4 flex items-center gap-2">
              {product.inStock ? (
                <>
                  <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                  <span className="text-green-600 font-medium">In Stock</span>
                </>
              ) : (
                <>
                  <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                  <span className="text-red-600 font-medium">Out of Stock</span>
                </>
              )}
            </div>

            {/* Reviews Section */}
            {uiPreferences.showReviews && productReviews.length > 0 && (
              <div className="mt-6" onClick={handleReviewRead} data-review="true">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Customer Reviews</h3>
                <div className="space-y-3">
                  {productReviews.map((review, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="font-medium text-gray-800">{review.userName}</span>
                      </div>
                      <p className="text-gray-600 text-sm">{review.comment}</p>
                      <span className="text-xs text-gray-400 mt-1 block">{review.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Add to Cart Button */}
          <div className="p-6 border-t border-gray-200">
            <button
              onClick={() => {
                getBehaviorTracker().trackCartInteraction();
                onAddToCart(product);
                onClose();
              }}
              disabled={!product.inStock}
              data-cart="add"
              className={`
                w-full py-3 ${getAccentColor()} text-white rounded-lg font-medium
                hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed
              `}
            >
              {product.inStock ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
