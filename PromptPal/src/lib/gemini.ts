// Gemini API integration via AI Proxy backend
// All API calls go through the secure proxy to keep API keys safe

import { AIProxyClient, AIProxyResponse } from '@/lib/aiProxy';
import { logger } from '@/lib/logger';

export interface GeminiConfig {
  models: {
    text: 'gemini-2.5-flash';
    image: 'gemini-2.5-flash-image';
    vision: 'gemini-2.5-flash';
  };
}

export class GeminiService {
  private config: GeminiConfig;

  constructor(config: GeminiConfig) {
    this.config = config;
  }

  // Generate an image based on a text prompt
  async generateImage(prompt: string): Promise<string> {
    if (!prompt || prompt.trim().length === 0) {
      throw new Error('Prompt cannot be empty');
    }

    try {
      logger.info('GeminiService', 'Generating image via proxy', { promptLength: prompt.length });

      const response: AIProxyResponse = await AIProxyClient.generateImage(prompt);

      if (!response.imageUrl) {
        throw new Error('No image URL returned from proxy');
      }

      logger.info('GeminiService', 'Image generated successfully', {
        model: response.model,
        tokensUsed: response.tokensUsed,
        imageUrlLength: response.imageUrl.length
      });

      return response.imageUrl;
    } catch (error) {
      logger.error('GeminiService', error, { operation: 'generateImage', promptLength: prompt.length });
      throw new Error(`Failed to generate image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Compare two images and return similarity score (0-100)
  async compareImages(targetUrl: string, resultUrl: string): Promise<number> {
    if (!targetUrl || !resultUrl) {
      throw new Error('Both target and result URLs are required');
    }

    try {
      logger.info('GeminiService', 'Comparing images via proxy', {
        targetUrlLength: targetUrl.length,
        resultUrlLength: resultUrl.length
      });

      const response: AIProxyResponse = await AIProxyClient.compareImages(targetUrl, resultUrl);

      // Parse the similarity score from the result
      if (!response.result) {
        throw new Error('No result returned from proxy');
      }

      const score = parseInt(response.result);
      if (isNaN(score)) {
        throw new Error('Invalid response format: expected numeric score');
      }

      const clampedScore = Math.max(0, Math.min(100, score)); // Clamp to 0-100 range

      logger.info('GeminiService', 'Images compared successfully', {
        model: response.model,
        tokensUsed: response.tokensUsed,
        score: clampedScore
      });

      return clampedScore;
    } catch (error) {
      logger.error('GeminiService', error, { operation: 'compareImages' });
      throw new Error(`Failed to compare images: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Get contextual hints for prompt improvement
  async getPromptHints(prompt: string): Promise<string[]> {
    if (!prompt || prompt.trim().length === 0) {
      throw new Error('Prompt cannot be empty');
    }

    try {
      logger.info('GeminiService', 'Getting prompt hints via proxy', { promptLength: prompt.length });

      const response: AIProxyResponse = await AIProxyClient.generateText(
        `Provide 3 hints to improve this image generation prompt: "${prompt}". Return as a JSON array of strings.`
      );

      if (!response.result) {
        throw new Error('No result returned from proxy');
      }

      const hintText = response.result;

      try {
        const hints = JSON.parse(hintText);
        if (!Array.isArray(hints)) {
          throw new Error('Response is not an array');
        }

        logger.info('GeminiService', 'Prompt hints generated successfully', {
          model: response.model,
          tokensUsed: response.tokensUsed,
          hintsCount: hints.length
        });

        return hints.map(hint => String(hint)); // Ensure all hints are strings
      } catch (parseError) {
        logger.warn('GeminiService', 'Failed to parse hints as JSON, using fallback', { parseError });
        // Fallback: try to extract hints from text response
        const fallbackHints = hintText
          .split('\n')
          .filter((line: string) => line.trim().length > 0)
          .slice(0, 3);
        return fallbackHints.length > 0 ? fallbackHints : ['Consider adding more descriptive details', 'Think about style and mood', 'Include specific colors or elements'];
      }
    } catch (error) {
      logger.error('GeminiService', error, { operation: 'getPromptHints', promptLength: prompt.length });
      throw new Error(`Failed to get prompt hints: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

// Export singleton instance
export const geminiService = new GeminiService({
  models: {
    text: 'gemini-2.5-flash',
    image: 'gemini-2.5-flash-image',
    vision: 'gemini-2.5-flash',
  },
});
