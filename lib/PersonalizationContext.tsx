'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { PersonaType, UserBehavior, UIPreferences, defaultBehavior, defaultUIPreferences } from './types';
import { getBehaviorTracker } from './behaviorTracker';
import { getPersonaDetector, generateUIPreferences } from './personaDetector';

interface PersonalizationContextType {
  behavior: UserBehavior;
  persona: PersonaType;
  uiPreferences: UIPreferences;
  personaScores: Record<PersonaType, number>;
  isLoading: boolean;
  updatePersona: () => Promise<void>;
  resetPersonalization: () => void;
  setManualPreference: (key: keyof UIPreferences, value: UIPreferences[keyof UIPreferences]) => void;
  submitFeedback: (feedback: UserFeedback) => void;
}

interface UserFeedback {
  type: 'like' | 'dislike' | 'suggestion';
  target: 'layout' | 'colors' | 'recommendations' | 'overall';
  message?: string;
}

const defaultPersonaScores: Record<PersonaType, number> = {
  bargain_hunter: 0.2,
  impulse_buyer: 0.2,
  researcher: 0.2,
  loyal_customer: 0.2,
  new_visitor: 0.2,
};

const PersonalizationContext = createContext<PersonalizationContextType | null>(null);

export function PersonalizationProvider({ children }: { children: ReactNode }) {
  const [behavior, setBehavior] = useState<UserBehavior>(defaultBehavior);
  const [persona, setPersona] = useState<PersonaType>('new_visitor');
  const [uiPreferences, setUIPreferences] = useState<UIPreferences>(defaultUIPreferences);
  const [personaScores, setPersonaScores] = useState<Record<PersonaType, number>>(defaultPersonaScores);
  const [isLoading, setIsLoading] = useState(true);
  const [feedbackHistory, setFeedbackHistory] = useState<UserFeedback[]>([]);

  // Initialize tracking and persona detection
  useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      const tracker = getBehaviorTracker();
      tracker.startTracking();

      // Subscribe to behavior updates
      const unsubscribe = tracker.subscribe((newBehavior) => {
        if (mounted) {
          setBehavior(newBehavior);
        }
      });

      // Initial behavior
      setBehavior(tracker.getBehavior());

      // Initialize AI model and detect persona
      try {
        const detector = getPersonaDetector();
        await detector.initialize();
        
        if (mounted) {
          const detectedPersona = await detector.detectPersona(tracker.getBehavior());
          const scores = await detector.getPersonaScores(tracker.getBehavior());
          
          setPersona(detectedPersona);
          setPersonaScores(scores);
          setUIPreferences(generateUIPreferences(detectedPersona));
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Failed to initialize persona detection:', error);
        if (mounted) {
          setIsLoading(false);
        }
      }

      return () => {
        unsubscribe();
        tracker.stopTracking();
      };
    };

    initialize();

    return () => {
      mounted = false;
    };
  }, []);

  // Update persona based on current behavior
  const updatePersona = useCallback(async () => {
    setIsLoading(true);
    try {
      const detector = getPersonaDetector();
      const detectedPersona = await detector.detectPersona(behavior);
      const scores = await detector.getPersonaScores(behavior);
      
      setPersona(detectedPersona);
      setPersonaScores(scores);
      
      // Apply feedback adjustments to preferences
      const basePreferences = generateUIPreferences(detectedPersona);
      const adjustedPreferences = applyFeedbackAdjustments(basePreferences, feedbackHistory);
      setUIPreferences(adjustedPreferences);
    } catch (error) {
      console.error('Failed to update persona:', error);
    } finally {
      setIsLoading(false);
    }
  }, [behavior, feedbackHistory]);

  // Apply feedback to adjust preferences
  const applyFeedbackAdjustments = (
    preferences: UIPreferences,
    feedback: UserFeedback[]
  ): UIPreferences => {
    const adjusted = { ...preferences };
    
    for (const fb of feedback) {
      if (fb.type === 'dislike') {
        switch (fb.target) {
          case 'layout':
            // Cycle through layout styles
            const layouts: UIPreferences['layoutStyle'][] = ['grid', 'list', 'compact', 'spacious'];
            const currentIndex = layouts.indexOf(adjusted.layoutStyle);
            adjusted.layoutStyle = layouts[(currentIndex + 1) % layouts.length];
            break;
          case 'colors':
            // Cycle through color schemes
            const colors: UIPreferences['colorScheme'][] = ['default', 'vibrant', 'minimal', 'warm', 'cool'];
            const colorIndex = colors.indexOf(adjusted.colorScheme);
            adjusted.colorScheme = colors[(colorIndex + 1) % colors.length];
            break;
          case 'recommendations':
            adjusted.showRecommendations = !adjusted.showRecommendations;
            break;
        }
      } else if (fb.type === 'like') {
        // Reinforce current preferences - no change needed
      }
    }
    
    return adjusted;
  };

  // Reset all personalization data
  const resetPersonalization = useCallback(() => {
    const tracker = getBehaviorTracker();
    tracker.reset();
    setBehavior(defaultBehavior);
    setPersona('new_visitor');
    setUIPreferences(defaultUIPreferences);
    setPersonaScores(defaultPersonaScores);
    setFeedbackHistory([]);
  }, []);

  // Manually set a UI preference
  const setManualPreference = useCallback((
    key: keyof UIPreferences,
    value: UIPreferences[keyof UIPreferences]
  ) => {
    setUIPreferences(prev => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  // Submit user feedback
  const submitFeedback = useCallback((feedback: UserFeedback) => {
    setFeedbackHistory(prev => [...prev, feedback]);
    
    // Immediately apply feedback
    setUIPreferences(prev => applyFeedbackAdjustments(prev, [feedback]));
  }, []);

  // Periodically update persona based on behavior
  useEffect(() => {
    const interval = setInterval(() => {
      updatePersona();
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [updatePersona]);

  return (
    <PersonalizationContext.Provider
      value={{
        behavior,
        persona,
        uiPreferences,
        personaScores,
        isLoading,
        updatePersona,
        resetPersonalization,
        setManualPreference,
        submitFeedback,
      }}
    >
      {children}
    </PersonalizationContext.Provider>
  );
}

export function usePersonalization() {
  const context = useContext(PersonalizationContext);
  if (!context) {
    throw new Error('usePersonalization must be used within a PersonalizationProvider');
  }
  return context;
}
