
/**
 * Utility to ensure we don't make duplicate API calls for the same business
 */
export class ApiRateLimiter {
  private static cache: Map<string, any> = new Map();
  private static calls: Map<string, number> = new Map();
  
  // Maximum calls per hour for a given business
  private static MAX_CALLS_PER_HOUR = 3;
  
  /**
   * Check if we should allow an API call for a given business
   */
  static shouldAllowCall(businessName: string, location: string): boolean {
    const key = this.getKey(businessName, location);
    
    // Check call count
    const now = Date.now();
    const callHistory = this.calls.get(key) || 0;
    
    if (callHistory >= this.MAX_CALLS_PER_HOUR) {
      console.log(`⚠️ [ApiRateLimiter] Rate limit reached for ${key}`);
      return false;
    }
    
    // Increment call count
    this.calls.set(key, callHistory + 1);
    
    // Reset call count after an hour
    setTimeout(() => {
      const currentCalls = this.calls.get(key) || 0;
      if (currentCalls > 0) {
        this.calls.set(key, currentCalls - 1);
      }
    }, 60 * 60 * 1000); // 1 hour
    
    return true;
  }
  
  /**
   * Cache results for a business
   */
  static cacheResult(businessName: string, location: string, result: any): void {
    const key = this.getKey(businessName, location);
    this.cache.set(key, {
      result,
      timestamp: Date.now()
    });
  }
  
  /**
   * Get cached results if they exist and aren't expired
   */
  static getCachedResult(businessName: string, location: string): any | null {
    const key = this.getKey(businessName, location);
    const cached = this.cache.get(key);
    
    // If no cache or cache is older than 24 hours, return null
    if (!cached || Date.now() - cached.timestamp > 24 * 60 * 60 * 1000) {
      return null;
    }
    
    return cached.result;
  }
  
  /**
   * Create a unique key for the business
   */
  private static getKey(businessName: string, location: string): string {
    return `${businessName.toLowerCase()}_${location.toLowerCase()}`;
  }
}
