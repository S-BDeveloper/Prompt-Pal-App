import axios from 'axios';
import { useAuth } from '@clerk/clerk-expo';

const AI_PROXY_URL = process.env.EXPO_PUBLIC_AI_PROXY_URL || 'http://localhost:3000';

export const aiProxy = axios.create({
  baseURL: AI_PROXY_URL,
  timeout: 30000, // Longer timeout for AI requests
});

// Request interceptor for JWT token
aiProxy.interceptors.request.use(async (config) => {
  const { getToken } = useAuth();
  const token = await getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Add app identifier
  config.headers['x-app-id'] = 'prompt-pal';

  return config;
});

// Response interceptor for quota handling
aiProxy.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 429) {
      // Quota exceeded - could show upgrade prompt
      console.warn('Quota exceeded:', error.response.data);
    }
    return Promise.reject(error);
  }
);

export interface AIProxyRequest {
  type: 'text' | 'image';
  model?: string;
  input: {
    prompt: string;
    context?: string;
    seed?: number;
    size?: string;
  };
}

export interface AIProxyResponse {
  type: 'text' | 'image';
  model: string;
  result?: string;
  imageUrl?: string;
  tokensUsed?: number;
  remaining: {
    textCalls?: number;
    imageCalls?: number;
  };
  metadata: any;
}

export class AIProxyClient {
  static async generateText(prompt: string, context?: string): Promise<AIProxyResponse> {
    const response = await aiProxy.post<AIProxyResponse>('/api/ai/proxy', {
      appId: 'prompt-pal',
      type: 'text',
      input: { prompt, context },
    });
    return response.data;
  }

  static async generateImage(prompt: string, seed?: number): Promise<AIProxyResponse> {
    const response = await aiProxy.post<AIProxyResponse>('/api/ai/proxy', {
      appId: 'prompt-pal',
      type: 'image',
      input: { prompt, seed },
    });
    return response.data;
  }
}