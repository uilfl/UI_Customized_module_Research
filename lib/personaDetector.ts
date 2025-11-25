import * as tf from '@tensorflow/tfjs';
import { PersonaType, UserBehavior, UIPreferences } from './types';

// Browser-based AI model for persona detection
class PersonaDetector {
  private model: tf.LayersModel | null = null;
  private initialized: boolean = false;

  // Initialize the TensorFlow.js model
  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      // Create a simple neural network for persona classification
      const model = tf.sequential();
      
      // Input layer - takes normalized behavior features
      model.add(tf.layers.dense({
        units: 16,
        activation: 'relu',
        inputShape: [10], // 10 behavior features
      }));
      
      // Hidden layer
      model.add(tf.layers.dense({
        units: 8,
        activation: 'relu',
      }));
      
      // Output layer - 5 persona types
      model.add(tf.layers.dense({
        units: 5,
        activation: 'softmax',
      }));

      model.compile({
        optimizer: 'adam',
        loss: 'categoricalCrossentropy',
        metrics: ['accuracy'],
      });

      this.model = model;
      this.initialized = true;
      
      // Pre-train with synthetic data
      await this.trainWithSyntheticData();
      
    } catch (error) {
      console.error('Failed to initialize persona detector:', error);
    }
  }

  // Generate synthetic training data
  private async trainWithSyntheticData(): Promise<void> {
    if (!this.model) return;

    // Generate training data for different personas
    const trainingData: number[][] = [];
    const labels: number[][] = [];

    // Bargain Hunter patterns
    for (let i = 0; i < 50; i++) {
      trainingData.push([
        Math.random() * 0.3, // low click count
        0.8 + Math.random() * 0.2, // high scroll depth
        0.6 + Math.random() * 0.4, // medium-high time
        Math.random() * 0.4, // low-medium product views
        Math.random() * 0.3, // low cart interactions
        Math.random() * 0.5, // medium searches
        0.7 + Math.random() * 0.3, // HIGH price filter usage
        Math.random() * 0.4, // medium reviews
        Math.random() * 0.5, // varied category
        Math.random(), // device type
      ]);
      labels.push([1, 0, 0, 0, 0]); // bargain_hunter
    }

    // Impulse Buyer patterns
    for (let i = 0; i < 50; i++) {
      trainingData.push([
        0.7 + Math.random() * 0.3, // HIGH click count
        Math.random() * 0.4, // low scroll depth
        Math.random() * 0.3, // LOW time on page
        0.5 + Math.random() * 0.5, // medium-high product views
        0.7 + Math.random() * 0.3, // HIGH cart interactions
        Math.random() * 0.3, // low searches
        Math.random() * 0.2, // low price filter
        Math.random() * 0.2, // low reviews
        Math.random() * 0.8, // varied category
        Math.random(), // device type
      ]);
      labels.push([0, 1, 0, 0, 0]); // impulse_buyer
    }

    // Researcher patterns
    for (let i = 0; i < 50; i++) {
      trainingData.push([
        0.4 + Math.random() * 0.3, // medium clicks
        0.8 + Math.random() * 0.2, // HIGH scroll depth
        0.8 + Math.random() * 0.2, // HIGH time on page
        0.3 + Math.random() * 0.4, // medium product views
        Math.random() * 0.4, // low-medium cart
        0.6 + Math.random() * 0.4, // HIGH searches
        0.4 + Math.random() * 0.4, // medium price filter
        0.8 + Math.random() * 0.2, // HIGH review reads
        0.5 + Math.random() * 0.3, // focused category
        Math.random(), // device type
      ]);
      labels.push([0, 0, 1, 0, 0]); // researcher
    }

    // Loyal Customer patterns
    for (let i = 0; i < 50; i++) {
      trainingData.push([
        0.5 + Math.random() * 0.3, // medium-high clicks
        0.5 + Math.random() * 0.3, // medium scroll
        0.4 + Math.random() * 0.4, // medium time
        0.6 + Math.random() * 0.4, // high product views
        0.5 + Math.random() * 0.4, // medium-high cart
        0.3 + Math.random() * 0.3, // low-medium searches
        Math.random() * 0.4, // low-medium price filter
        0.3 + Math.random() * 0.4, // medium reviews
        0.7 + Math.random() * 0.3, // HIGH category preference
        Math.random(), // device type
      ]);
      labels.push([0, 0, 0, 1, 0]); // loyal_customer
    }

    // New Visitor patterns
    for (let i = 0; i < 50; i++) {
      trainingData.push([
        Math.random() * 0.3, // low clicks
        Math.random() * 0.5, // low-medium scroll
        Math.random() * 0.4, // low time
        Math.random() * 0.3, // low product views
        Math.random() * 0.2, // low cart
        Math.random() * 0.4, // low-medium searches
        Math.random() * 0.3, // low price filter
        Math.random() * 0.3, // low reviews
        Math.random() * 0.3, // low category
        Math.random(), // device type
      ]);
      labels.push([0, 0, 0, 0, 1]); // new_visitor
    }

    // Convert to tensors and train
    const xs = tf.tensor2d(trainingData);
    const ys = tf.tensor2d(labels);

    await this.model.fit(xs, ys, {
      epochs: 50,
      batchSize: 32,
      shuffle: true,
      verbose: 0,
    });

    // Cleanup tensors
    xs.dispose();
    ys.dispose();
  }

  // Normalize behavior data to [0, 1] range
  private normalizeBehavior(behavior: UserBehavior): number[] {
    return [
      Math.min(behavior.clickCount / 100, 1), // Normalize clicks
      Math.min(behavior.scrollDepth / 100, 1), // Scroll already %
      Math.min(behavior.timeOnPage / 300, 1), // Normalize to 5 min
      Math.min(behavior.productViews.length / 20, 1), // Normalize views
      Math.min(behavior.cartInteractions / 10, 1), // Normalize cart
      Math.min(behavior.searchQueries.length / 10, 1), // Normalize searches
      Math.min(behavior.priceFilterUsage / 10, 1), // Normalize filter
      Math.min(behavior.reviewReads / 10, 1), // Normalize reviews
      Math.min(Object.keys(behavior.categoryPreferences).length / 5, 1), // Categories
      behavior.deviceType === 'mobile' ? 0.3 : behavior.deviceType === 'tablet' ? 0.6 : 1, // Device
    ];
  }

  // Detect user persona from behavior
  async detectPersona(behavior: UserBehavior): Promise<PersonaType> {
    if (!this.model || !this.initialized) {
      await this.initialize();
    }

    if (!this.model) {
      return 'new_visitor'; // Default fallback
    }

    const normalizedInput = this.normalizeBehavior(behavior);
    const inputTensor = tf.tensor2d([normalizedInput]);
    
    const prediction = this.model.predict(inputTensor) as tf.Tensor;
    const scores = await prediction.data();
    
    // Cleanup tensors
    inputTensor.dispose();
    prediction.dispose();

    // Find the highest scoring persona
    const personaTypes: PersonaType[] = [
      'bargain_hunter',
      'impulse_buyer',
      'researcher',
      'loyal_customer',
      'new_visitor',
    ];

    let maxIndex = 0;
    let maxScore = scores[0];
    for (let i = 1; i < scores.length; i++) {
      if (scores[i] > maxScore) {
        maxScore = scores[i];
        maxIndex = i;
      }
    }

    return personaTypes[maxIndex];
  }

  // Get confidence scores for all personas
  async getPersonaScores(behavior: UserBehavior): Promise<Record<PersonaType, number>> {
    if (!this.model || !this.initialized) {
      await this.initialize();
    }

    if (!this.model) {
      return {
        bargain_hunter: 0.2,
        impulse_buyer: 0.2,
        researcher: 0.2,
        loyal_customer: 0.2,
        new_visitor: 0.2,
      };
    }

    const normalizedInput = this.normalizeBehavior(behavior);
    const inputTensor = tf.tensor2d([normalizedInput]);
    
    const prediction = this.model.predict(inputTensor) as tf.Tensor;
    const scores = await prediction.data();
    
    inputTensor.dispose();
    prediction.dispose();

    return {
      bargain_hunter: scores[0],
      impulse_buyer: scores[1],
      researcher: scores[2],
      loyal_customer: scores[3],
      new_visitor: scores[4],
    };
  }
}

// Generate UI preferences based on detected persona
export function generateUIPreferences(persona: PersonaType): UIPreferences {
  switch (persona) {
    case 'bargain_hunter':
      return {
        colorScheme: 'warm', // Warm colors highlight deals
        layoutStyle: 'compact', // See more items at once
        showReviews: false, // Less interested in reviews
        showPriceComparison: true, // Important for bargain hunters
        showDeals: true, // Highlight deals prominently
        showRecommendations: true, // Similar cheaper alternatives
        fontSize: 'medium',
        animationLevel: 'subtle',
      };
    
    case 'impulse_buyer':
      return {
        colorScheme: 'vibrant', // Eye-catching colors
        layoutStyle: 'spacious', // Large images, clear CTAs
        showReviews: false, // Quick decisions
        showPriceComparison: false, // Don't slow down purchase
        showDeals: true, // Trigger impulse
        showRecommendations: true, // More opportunities
        fontSize: 'large',
        animationLevel: 'full', // Engaging animations
      };
    
    case 'researcher':
      return {
        colorScheme: 'minimal', // Clean, distraction-free
        layoutStyle: 'list', // Detailed information
        showReviews: true, // Very important
        showPriceComparison: true, // For comparison
        showDeals: false, // Not a priority
        showRecommendations: true, // Similar products to compare
        fontSize: 'medium',
        animationLevel: 'none', // No distractions
      };
    
    case 'loyal_customer':
      return {
        colorScheme: 'cool', // Familiar, professional
        layoutStyle: 'grid', // Familiar layout
        showReviews: true, // Trust in reviews
        showPriceComparison: false, // Already trusts the store
        showDeals: true, // Reward loyalty
        showRecommendations: true, // Personalized picks
        fontSize: 'medium',
        animationLevel: 'subtle',
      };
    
    case 'new_visitor':
    default:
      return {
        colorScheme: 'default', // Standard appearance
        layoutStyle: 'grid', // Standard grid
        showReviews: true, // Build trust
        showPriceComparison: true, // Show value
        showDeals: true, // Attract attention
        showRecommendations: false, // Don't overwhelm
        fontSize: 'medium',
        animationLevel: 'subtle',
      };
  }
}

// Singleton instance
let personaDetectorInstance: PersonaDetector | null = null;

export function getPersonaDetector(): PersonaDetector {
  if (!personaDetectorInstance) {
    personaDetectorInstance = new PersonaDetector();
  }
  return personaDetectorInstance;
}

export { PersonaDetector };
