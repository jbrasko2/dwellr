import { type SearchFilters } from '../../generated/types';
import { getAnthropicClient } from '../lib/anthropic-client';

const SYSTEM_PROMPT = `You are a real estate search assistant. Your job is to parse natural language home search queries into structured JSON filters.

Always respond with ONLY a valid JSON object matching this exact shape — no preamble, no explanation, no markdown:

{
  "location": "string (required — city, neighborhood, or zip code)",
  "minPrice": number or null,
  "maxPrice": number or null,
  "minBeds": number or null,
  "maxBeds": number or null,
  "minBaths": number or null,
  "propertyType": "string or null (house, condo, townhouse, etc.)",
  "features": ["array of strings like pool, garage, backyard, etc."]
}`;

class ClaudeParseError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ClaudeParseError';
    }
}

export async function parsePromptToFilters(
    prompt: string,
): Promise<SearchFilters> {
    const message = await getAnthropicClient().messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 256,
        system: [
            {
                type: 'text',
                text: SYSTEM_PROMPT,
                cache_control: { type: 'ephemeral' },
            },
        ],
        messages: [{ role: 'user', content: prompt }],
    });

    const text =
        message.content[0].type === 'text' ? message.content[0].text : '';

    try {
        const cleaned = text.replace(/```json\n?|\n?```/g, '').trim();
        return JSON.parse(cleaned);
    } catch {
        throw new ClaudeParseError(
            `Failed to parse Claude response as JSON: ${text}`,
        );
    }
}
