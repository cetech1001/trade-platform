import { Injectable } from '@nestjs/common';

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  cacheMs: number; // How long to cache data
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

@Injectable()
export class EnhancedRateLimiterService<T> {
  private requests: Map<string, RateLimitEntry> = new Map();
  private cache: Map<string, CacheEntry<T>> = new Map();

  constructor(private config: RateLimitConfig) {
    // Cleanup expired entries periodically
    setInterval(() => {
      this.cleanup();
    }, 60000); // Every minute
  }

  private cleanup() {
    const now = Date.now();

    // Cleanup expired rate limit entries
    for (const [key, entry] of this.requests.entries()) {
      if (now > entry.resetTime) {
        this.requests.delete(key);
      }
    }

    // Cleanup expired cache entries
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.config.cacheMs) {
        this.cache.delete(key);
      }
    }
  }

  private isRateLimited(key: string): boolean {
    const now = Date.now();
    const limit = this.requests.get(key);

    if (!limit || now > limit.resetTime) {
      // Reset or create new rate limit entry
      this.requests.set(key, {
        count: 1,
        resetTime: now + this.config.windowMs,
      });
      return false;
    }

    if (limit.count >= this.config.maxRequests) {
      return true;
    }

    limit.count++;
    return false;
  }

  private getCachedData(key: string): T | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    const now = Date.now();
    if (now - cached.timestamp > this.config.cacheMs) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  private setCachedData(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  async executeWithCaching<R extends T>(
    key: string,
    fetchFunction: () => Promise<R>
  ): Promise<R> {
    // First, try to get fresh cached data (regardless of rate limits)
    const cachedData = this.getCachedData(key);

    // Check if we're rate limited
    if (this.isRateLimited(key)) {
      // We're rate limited, serve from cache if available
      if (cachedData) {
        console.log(`🚦 Rate limited for ${key}, serving from cache (age: ${Date.now() - this.cache.get(key).timestamp}ms)`);
        return cachedData as R;
      } else {
        throw new Error(
          `Rate limit exceeded for ${key} and no cached data available. Try again in ${Math.ceil((this.requests.get(key)?.resetTime - Date.now()) / 1000)} seconds`
        );
      }
    }

    // We're not rate limited, make the API call
    try {
      const data = await fetchFunction();
      this.setCachedData(key, data);
      return data;
    } catch (error) {
      // If API call fails, try to serve from cache as fallback
      if (cachedData) {
        console.log(`❌ API call failed for ${key}, serving stale cache as fallback:`, error.message);
        return cachedData as R;
      }
      throw error;
    }
  }

  // Get cache statistics for monitoring
  getCacheStats() {
    return {
      cacheSize: this.cache.size,
      rateLimitEntries: this.requests.size,
      cacheEntries: Array.from(this.cache.entries()).map(([key, entry]) => ({
        key,
        age: Date.now() - entry.timestamp,
        ageMinutes: Math.round((Date.now() - entry.timestamp) / 60000)
      }))
    };
  }

  // Force clear cache for testing/debugging
  clearCache() {
    this.cache.clear();
    this.requests.clear();
  }
}

// Enhanced API Rate Limiter with proper caching
export class APIRateLimiter {
  private static limiters = new Map<string, EnhancedRateLimiterService<number>>();

  static getLimiter(service: string): EnhancedRateLimiterService<number> {
    if (!this.limiters.has(service)) {
      const config = this.getConfig(service);
      this.limiters.set(service, new EnhancedRateLimiterService(config));
    }
    return this.limiters.get(service);
  }

  private static getConfig(service: string): RateLimitConfig {
    const configs: Record<string, RateLimitConfig> = {
      'alphavantage': {
        maxRequests: 5,
        windowMs: 60000, // 5 per minute
        cacheMs: 300000  // Cache for 5 minutes
      },
      'polygon': {
        maxRequests: 5,
        windowMs: 60000,  // 5 per second
        cacheMs: 300000  // Cache for 5 minutes
      },
      'coingecko': {
        maxRequests: 50,
        windowMs: 60000, // 50 per minute
        cacheMs: 300000  // Cache for 5 minutes
      },
      'frankfurter': {
        maxRequests: 100,
        windowMs: 60000, // 100 per minute
        cacheMs: 300000  // Cache for 5 minutes
      },
    };
    return configs[service] || {
      maxRequests: 10,
      windowMs: 60000,
      cacheMs: 300000
    };
  }

  // Get statistics for all rate limiters
  static getAllStats() {
    const stats: Record<string, any> = {};
    for (const [service, limiter] of this.limiters.entries()) {
      stats[service] = limiter.getCacheStats();
    }
    return stats;
  }

  // Clear all caches (useful for testing)
  static clearAllCaches() {
    for (const [service, limiter] of this.limiters.entries()) {
      limiter.clearCache();
    }
  }
}
