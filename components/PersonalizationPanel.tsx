'use client';

import React, { useState } from 'react';
import { usePersonalization } from '@/lib/PersonalizationContext';
import { PersonaType, UIPreferences } from '@/lib/types';

const personaLabels: Record<PersonaType, { label: string; description: string; icon: string }> = {
  bargain_hunter: {
    label: 'Bargain Hunter',
    description: 'You love finding the best deals and comparing prices!',
    icon: '💰',
  },
  impulse_buyer: {
    label: 'Impulse Buyer',
    description: 'Quick decisions and exciting finds are your style!',
    icon: '⚡',
  },
  researcher: {
    label: 'Researcher',
    description: 'You value detailed information and reviews!',
    icon: '🔍',
  },
  loyal_customer: {
    label: 'Loyal Customer',
    description: 'Welcome back! We know what you like!',
    icon: '❤️',
  },
  new_visitor: {
    label: 'New Visitor',
    description: 'Welcome! Explore our amazing products!',
    icon: '👋',
  },
};

const colorSchemeOptions: { value: UIPreferences['colorScheme']; label: string }[] = [
  { value: 'default', label: 'Default' },
  { value: 'vibrant', label: 'Vibrant' },
  { value: 'minimal', label: 'Minimal' },
  { value: 'warm', label: 'Warm' },
  { value: 'cool', label: 'Cool' },
];

const layoutOptions: { value: UIPreferences['layoutStyle']; label: string }[] = [
  { value: 'grid', label: 'Grid' },
  { value: 'list', label: 'List' },
  { value: 'compact', label: 'Compact' },
  { value: 'spacious', label: 'Spacious' },
];

export default function PersonalizationPanel() {
  const {
    persona,
    uiPreferences,
    personaScores,
    isLoading,
    updatePersona,
    resetPersonalization,
    setManualPreference,
    submitFeedback,
  } = usePersonalization();

  const [isExpanded, setIsExpanded] = useState(false);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const personaInfo = personaLabels[persona];

  const handleFeedbackSubmit = (type: 'like' | 'dislike', target: 'layout' | 'colors' | 'recommendations' | 'overall') => {
    submitFeedback({ type, target, message: feedbackMessage });
    setFeedbackMessage('');
    setShowFeedbackForm(false);
  };

  const getAccentColor = () => {
    switch (uiPreferences.colorScheme) {
      case 'vibrant':
        return 'from-purple-600 to-pink-500';
      case 'minimal':
        return 'from-gray-700 to-gray-800';
      case 'warm':
        return 'from-orange-500 to-red-500';
      case 'cool':
        return 'from-blue-600 to-cyan-500';
      default:
        return 'from-blue-600 to-blue-700';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`
          w-14 h-14 rounded-full bg-gradient-to-r ${getAccentColor()} text-white
          shadow-lg hover:shadow-xl transition-all flex items-center justify-center
          ${isExpanded ? 'rotate-45' : ''}
        `}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </button>

      {/* Panel */}
      {isExpanded && (
        <div className="absolute bottom-16 right-0 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className={`bg-gradient-to-r ${getAccentColor()} p-4 text-white`}>
            <div className="flex items-center gap-3">
              <span className="text-3xl">{personaInfo.icon}</span>
              <div>
                <h3 className="font-bold">{personaInfo.label}</h3>
                <p className="text-sm opacity-90">{personaInfo.description}</p>
              </div>
            </div>
          </div>

          {/* Persona Scores */}
          <div className="p-4 border-b border-gray-100">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">AI Persona Analysis</h4>
            <div className="space-y-2">
              {(Object.entries(personaScores) as [PersonaType, number][]).map(([type, score]) => (
                <div key={type} className="flex items-center gap-2">
                  <span className="text-sm w-24 truncate">{personaLabels[type].label}</span>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${getAccentColor()} transition-all duration-500`}
                      style={{ width: `${score * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 w-8">{Math.round(score * 100)}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* UI Preferences */}
          <div className="p-4 border-b border-gray-100">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Customize Your Experience</h4>
            
            {/* Color Scheme */}
            <div className="mb-3">
              <label className="text-xs text-gray-600 block mb-1">Color Theme</label>
              <div className="flex gap-1">
                {colorSchemeOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setManualPreference('colorScheme', option.value)}
                    className={`
                      flex-1 py-1 px-2 text-xs rounded border transition-colors
                      ${uiPreferences.colorScheme === option.value
                        ? `bg-gradient-to-r ${getAccentColor()} text-white border-transparent`
                        : 'border-gray-300 hover:bg-gray-100'
                      }
                    `}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Layout Style */}
            <div className="mb-3">
              <label className="text-xs text-gray-600 block mb-1">Layout Style</label>
              <div className="flex gap-1">
                {layoutOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setManualPreference('layoutStyle', option.value)}
                    className={`
                      flex-1 py-1 px-2 text-xs rounded border transition-colors
                      ${uiPreferences.layoutStyle === option.value
                        ? `bg-gradient-to-r ${getAccentColor()} text-white border-transparent`
                        : 'border-gray-300 hover:bg-gray-100'
                      }
                    `}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Toggle Options */}
            <div className="space-y-2">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm text-gray-600">Show Reviews</span>
                <input
                  type="checkbox"
                  checked={uiPreferences.showReviews}
                  onChange={(e) => setManualPreference('showReviews', e.target.checked)}
                  className="w-4 h-4 rounded"
                />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm text-gray-600">Show Deals</span>
                <input
                  type="checkbox"
                  checked={uiPreferences.showDeals}
                  onChange={(e) => setManualPreference('showDeals', e.target.checked)}
                  className="w-4 h-4 rounded"
                />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm text-gray-600">Show Recommendations</span>
                <input
                  type="checkbox"
                  checked={uiPreferences.showRecommendations}
                  onChange={(e) => setManualPreference('showRecommendations', e.target.checked)}
                  className="w-4 h-4 rounded"
                />
              </label>
            </div>
          </div>

          {/* Feedback Section */}
          <div className="p-4 border-b border-gray-100">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">How's the experience?</h4>
            {!showFeedbackForm ? (
              <div className="flex gap-2">
                <button
                  onClick={() => handleFeedbackSubmit('like', 'overall')}
                  className="flex-1 py-2 px-4 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors flex items-center justify-center gap-1"
                >
                  <span>👍</span> Love it!
                </button>
                <button
                  onClick={() => setShowFeedbackForm(true)}
                  className="flex-1 py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-1"
                >
                  <span>💭</span> Suggest
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-xs text-gray-600">What should we change?</p>
                <div className="flex flex-wrap gap-1">
                  {(['layout', 'colors', 'recommendations'] as const).map((target) => (
                    <button
                      key={target}
                      onClick={() => handleFeedbackSubmit('dislike', target)}
                      className="py-1 px-3 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-red-100 hover:text-red-700 transition-colors capitalize"
                    >
                      Change {target}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setShowFeedbackForm(false)}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="p-4 flex gap-2">
            <button
              onClick={updatePersona}
              disabled={isLoading}
              className={`
                flex-1 py-2 px-4 bg-gradient-to-r ${getAccentColor()} text-white rounded-lg
                hover:opacity-90 transition-opacity disabled:opacity-50 text-sm
              `}
            >
              {isLoading ? 'Analyzing...' : '🔄 Re-analyze'}
            </button>
            <button
              onClick={resetPersonalization}
              className="py-2 px-4 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors text-sm"
            >
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
