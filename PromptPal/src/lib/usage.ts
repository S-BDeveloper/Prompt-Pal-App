import { aiProxy } from './aiProxy';

export interface UsageStats {
  tier: 'free' | 'pro';
  used: {
    textCalls: number;
    imageCalls: number;
  };
  limits: {
    textCalls: number;
    imageCalls: number;
  };
  periodStart: number;
}

export class UsageClient {
  static async getUsage(): Promise<UsageStats> {
    const response = await aiProxy.get('/api/user/usage?appId=prompt-pal');
    return response.data;
  }

  static getRemainingCalls(usage: UsageStats): { textCalls: number; imageCalls: number } {
    return {
      textCalls: Math.max(0, usage.limits.textCalls - usage.used.textCalls),
      imageCalls: Math.max(0, usage.limits.imageCalls - usage.used.imageCalls),
    };
  }

  static isNearLimit(usage: UsageStats, thresholdPercent = 80): boolean {
    const textUsagePercent = (usage.used.textCalls / usage.limits.textCalls) * 100;
    const imageUsagePercent = (usage.used.imageCalls / usage.limits.imageCalls) * 100;

    return textUsagePercent >= thresholdPercent || imageUsagePercent >= thresholdPercent;
  }
}