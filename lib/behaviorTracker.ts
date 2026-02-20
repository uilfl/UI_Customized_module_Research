import { UserBehavior, defaultBehavior } from './types';

const STORAGE_KEY = 'user_behavior_data';
const SESSION_KEY = 'session_id';

class BehaviorTracker {
  private behavior: UserBehavior;
  private startTime: number;
  private scrollHandler: (() => void) | null = null;
  private clickHandler: ((e: MouseEvent) => void) | null = null;
  private observers: ((behavior: UserBehavior) => void)[] = [];
  private updateInterval: ReturnType<typeof setInterval> | null = null;

  constructor() {
    this.behavior = this.loadBehavior();
    this.startTime = Date.now();
    this.detectDevice();
  }

  // Load behavior from localStorage
  private loadBehavior(): UserBehavior {
    if (typeof window === 'undefined') return { ...defaultBehavior };
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Check if it's a new session
        const sessionId = sessionStorage.getItem(SESSION_KEY);
        if (!sessionId) {
          sessionStorage.setItem(SESSION_KEY, Date.now().toString());
          parsed.sessionCount = (parsed.sessionCount || 0) + 1;
        }
        return { ...defaultBehavior, ...parsed };
      }
    } catch (e) {
      console.error('Failed to load behavior data:', e);
    }
    
    sessionStorage.setItem(SESSION_KEY, Date.now().toString());
    return { ...defaultBehavior };
  }

  // Save behavior to localStorage
  private saveBehavior(): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.behavior));
    } catch (e) {
      console.error('Failed to save behavior data:', e);
    }
  }

  // Detect device type
  private detectDevice(): void {
    if (typeof window === 'undefined') return;
    
    const width = window.innerWidth;
    if (width < 768) {
      this.behavior.deviceType = 'mobile';
    } else if (width < 1024) {
      this.behavior.deviceType = 'tablet';
    } else {
      this.behavior.deviceType = 'desktop';
    }
  }

  // Start tracking user behavior
  startTracking(): void {
    if (typeof window === 'undefined') return;

    // Track scroll depth
    this.scrollHandler = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      this.behavior.scrollDepth = Math.max(this.behavior.scrollDepth, scrollPercent);
      this.notifyObservers();
    };
    window.addEventListener('scroll', this.scrollHandler);

    // Track clicks
    this.clickHandler = (e: MouseEvent) => {
      this.behavior.clickCount++;
      
      // Track specific element clicks
      const target = e.target as HTMLElement;
      if (target.dataset.product) {
        this.trackProductView(target.dataset.product);
      }
      if (target.dataset.category) {
        this.trackCategoryInteraction(target.dataset.category);
      }
      if (target.dataset.cart) {
        this.behavior.cartInteractions++;
      }
      if (target.dataset.review) {
        this.behavior.reviewReads++;
      }
      if (target.dataset.priceFilter) {
        this.behavior.priceFilterUsage++;
      }
      
      this.notifyObservers();
      this.saveBehavior();
    };
    document.addEventListener('click', this.clickHandler);

    // Update time on page periodically
    this.updateInterval = setInterval(() => {
      this.behavior.timeOnPage = (Date.now() - this.startTime) / 1000;
      this.notifyObservers();
      this.saveBehavior();
    }, 5000);
  }

  // Stop tracking
  stopTracking(): void {
    if (this.scrollHandler) {
      window.removeEventListener('scroll', this.scrollHandler);
    }
    if (this.clickHandler) {
      document.removeEventListener('click', this.clickHandler);
    }
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
    this.saveBehavior();
  }

  // Track product view
  trackProductView(productId: string): void {
    if (!this.behavior.productViews.includes(productId)) {
      this.behavior.productViews.push(productId);
    }
    this.notifyObservers();
    this.saveBehavior();
  }

  // Track search query
  trackSearch(query: string): void {
    if (query && !this.behavior.searchQueries.includes(query)) {
      this.behavior.searchQueries.push(query);
    }
    this.notifyObservers();
    this.saveBehavior();
  }

  // Track category interaction
  trackCategoryInteraction(category: string): void {
    this.behavior.categoryPreferences[category] = 
      (this.behavior.categoryPreferences[category] || 0) + 1;
    this.notifyObservers();
    this.saveBehavior();
  }

  // Track cart interaction
  trackCartInteraction(): void {
    this.behavior.cartInteractions++;
    this.notifyObservers();
    this.saveBehavior();
  }

  // Track review read
  trackReviewRead(): void {
    this.behavior.reviewReads++;
    this.notifyObservers();
    this.saveBehavior();
  }

  // Track price filter usage
  trackPriceFilterUsage(): void {
    this.behavior.priceFilterUsage++;
    this.notifyObservers();
    this.saveBehavior();
  }

  // Subscribe to behavior updates
  subscribe(callback: (behavior: UserBehavior) => void): () => void {
    this.observers.push(callback);
    return () => {
      this.observers = this.observers.filter(cb => cb !== callback);
    };
  }

  // Notify all observers
  private notifyObservers(): void {
    this.observers.forEach(callback => callback(this.behavior));
  }

  // Get current behavior
  getBehavior(): UserBehavior {
    return { ...this.behavior };
  }

  // Reset behavior data
  reset(): void {
    this.behavior = { ...defaultBehavior };
    this.saveBehavior();
    this.notifyObservers();
  }
}

// Singleton instance
let behaviorTrackerInstance: BehaviorTracker | null = null;

export function getBehaviorTracker(): BehaviorTracker {
  if (typeof window === 'undefined') {
    // Return a dummy tracker for SSR
    return new BehaviorTracker();
  }
  
  if (!behaviorTrackerInstance) {
    behaviorTrackerInstance = new BehaviorTracker();
  }
  return behaviorTrackerInstance;
}

export { BehaviorTracker };
