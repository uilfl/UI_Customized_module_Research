// User persona types based on behavior patterns
export type PersonaType = 
  | 'bargain_hunter'    // Looks for deals, compares prices
  | 'impulse_buyer'     // Quick decisions, responsive to promotions
  | 'researcher'        // Spends time reading details, reviews
  | 'loyal_customer'    // Regular visitor, consistent patterns
  | 'new_visitor';      // First-time or infrequent visitor

// User behavior data structure
export interface UserBehavior {
  clickCount: number;
  scrollDepth: number;
  timeOnPage: number;
  productViews: string[];
  cartInteractions: number;
  searchQueries: string[];
  priceFilterUsage: number;
  reviewReads: number;
  categoryPreferences: Record<string, number>;
  deviceType: 'mobile' | 'tablet' | 'desktop';
  sessionCount: number;
}

// UI customization preferences
export interface UIPreferences {
  colorScheme: 'vibrant' | 'minimal' | 'warm' | 'cool' | 'default';
  layoutStyle: 'grid' | 'list' | 'compact' | 'spacious';
  showReviews: boolean;
  showPriceComparison: boolean;
  showDeals: boolean;
  showRecommendations: boolean;
  fontSize: 'small' | 'medium' | 'large';
  animationLevel: 'none' | 'subtle' | 'full';
}

// Default behavior
export const defaultBehavior: UserBehavior = {
  clickCount: 0,
  scrollDepth: 0,
  timeOnPage: 0,
  productViews: [],
  cartInteractions: 0,
  searchQueries: [],
  priceFilterUsage: 0,
  reviewReads: 0,
  categoryPreferences: {},
  deviceType: 'desktop',
  sessionCount: 1,
};

// Default UI preferences
export const defaultUIPreferences: UIPreferences = {
  colorScheme: 'default',
  layoutStyle: 'grid',
  showReviews: true,
  showPriceComparison: true,
  showDeals: true,
  showRecommendations: true,
  fontSize: 'medium',
  animationLevel: 'subtle',
};
