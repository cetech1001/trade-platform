import { Injectable } from '@nestjs/common';

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

@Injectable()
export class RateLimiterService {
  private requests: Map<string, { count: number; resetTime: number }> = new Map();

  constructor(private config: RateLimitConfig) {}

  async checkLimit(key: string): Promise<boolean> {
    const now = Date.now();
    const limit = this.requests.get(key);

    if (!limit || now > limit.resetTime) {
      this.requests.set(key, {
        count: 1,
        resetTime: now + this.config.windowMs,
      });
      return true;
    }

    if (limit.count >= this.config.maxRequests) {
      const waitTime = limit.resetTime - now;
      throw new Error(`Rate limit exceeded. Try again in ${Math.ceil(waitTime / 1000)} seconds`);
    }

    limit.count++;
    return true;
  }

  async executeWithLimit<T>(key: string, fn: () => Promise<T>): Promise<T> {
    await this.checkLimit(key);
    return fn();
  }
}

// Usage in API services
export class APIRateLimiter {
  private static limiters = new Map<string, RateLimiterService>();

  static getLimiter(service: string): RateLimiterService {
    if (!this.limiters.has(service)) {
      const config = this.getConfig(service);
      this.limiters.set(service, new RateLimiterService(config));
    }
    return this.limiters.get(service)!;
  }

  private static getConfig(service: string): RateLimitConfig {
    const configs: Record<string, RateLimitConfig> = {
      'alphavantage': { maxRequests: 5, windowMs: 60000 }, // 5 per minute
      'polygon': { maxRequests: 5, windowMs: 1000 }, // 5 per second
      'coingecko': { maxRequests: 50, windowMs: 60000 }, // 50 per minute
      'frankfurter': { maxRequests: 100, windowMs: 60000 }, // 100 per minute
    };
    return configs[service] || { maxRequests: 10, windowMs: 60000 };
  }
}
