import { type SearchFilters } from '../../../generated/types';
import { getAnthropicClient } from '../../lib/anthropic-client';

const SYSTEM_PROMPT = `You are a real estate search assistant. Your job is to parse natural language home search queries into structured JSON filters.

Always respond with ONLY a valid JSON object matching this exact shape — no preamble, no explanation, no markdown:

{
  "location": "string (required — city, neighborhood, or zip code)",
  "minPrice": number or null,
  "maxPrice": number or null,
  "minBeds": number or null,
  "maxBeds": number or null,
  "minBaths": number or null,
  "maxBaths": number or null (set equal to minBaths when user specifies an exact bath count, null when they say 'at least'),
  "minSqft": number or null,
  "maxSqft": number or null,
  "minLotSqft": number or null,
  "maxLotSqft": number or null,
  "minYearBuilt": number or null,
  "maxYearBuilt": number or null,
  "newConstruction": boolean or null (true only when user explicitly asks for new construction),
  "propertyType": "string or null (house, condo, townhouse, etc.)",
  "features": ["array of strings — only use exact values from this list: basement, carport, central_air, central_heat, city_view, community_swimming_pool, den_or_office, dining_room, dishwasher, energy_efficient, family_room, fireplace, garage_1_or_more, garage_2_or_more, garage_3_or_more, golf_course_view, hardwood_floors, hill_or_mountain_view, horse_facilities, lake_view, laundry_room, ocean_view, pets_allowed, single_story, spa_or_hot_tub, swimming_pool, tennis_court, two_or_more_stories, washer_dryer, waterfront"]
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
