import { getEnv } from '@lib/config';

type DeepSeekPayload = {
  kind: 'property-description' | 'chat-suggestion';
  prompt: string;
  context?: Record<string, unknown>;
};

export type DeepSeekResponse = {
  suggestions: string[];
  usage?: {
    promptTokens: number;
    completionTokens: number;
  };
};

const { deepseekApiUrl, deepseekApiKey } = getEnv();

export const deepSeekFetch = async (payload: DeepSeekPayload) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(`${deepseekApiUrl}/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${deepseekApiKey}`,
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`DeepSeek error: ${response.status}`);
    }

    const data = (await response.json()) as DeepSeekResponse;
    return data;
  } catch (error) {
    if (__DEV__) {
      console.error('[DeepSeek]', error);
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
};
