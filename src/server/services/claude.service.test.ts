import { getAnthropicClient } from '../lib/anthropic-client';
import { parsePromptToFilters } from './claude.service';

jest.mock('../lib/anthropic-client');

const mockCreate = jest.fn();
const mockGetAnthropicClient = getAnthropicClient as jest.MockedFunction<
    typeof getAnthropicClient
>;
mockGetAnthropicClient.mockReturnValue({
    messages: { create: mockCreate },
} as unknown as ReturnType<typeof getAnthropicClient>);

function makeResponse(text: string) {
    return { content: [{ type: 'text', text }] };
}

const validFilters = {
    location: 'Austin, TX',
    minPrice: null,
    maxPrice: 500000,
    minBeds: 3,
    maxBeds: null,
    minBaths: null,
    propertyType: 'house',
    features: ['backyard'],
};

describe('parsePromptToFilters', () => {
    beforeEach(() => {
        mockCreate.mockReset();
    });

    it('parses a plain JSON response', async () => {
        mockCreate.mockResolvedValue(
            makeResponse(JSON.stringify(validFilters)),
        );
        const result = await parsePromptToFilters(
            '3 bed house in Austin under $500k',
        );
        expect(result).toEqual(validFilters);
    });

    it('strips markdown code fences before parsing', async () => {
        const wrapped = `\`\`\`json\n${JSON.stringify(validFilters)}\n\`\`\``;
        mockCreate.mockResolvedValue(makeResponse(wrapped));
        const result = await parsePromptToFilters('any prompt');
        expect(result).toEqual(validFilters);
    });

    it('throws ClaudeParseError when response is not valid JSON', async () => {
        mockCreate.mockResolvedValue(
            makeResponse('Sorry, I cannot help with that.'),
        );
        await expect(parsePromptToFilters('bad prompt')).rejects.toMatchObject({
            name: 'ClaudeParseError',
        });
    });

    it('calls the API with the correct model and cache_control on the system prompt', async () => {
        mockCreate.mockResolvedValue(
            makeResponse(JSON.stringify(validFilters)),
        );
        await parsePromptToFilters('any prompt');

        const call = mockCreate.mock.calls[0][0];
        expect(call.model).toBe('claude-sonnet-4-6');
        expect(call.system[0].cache_control).toEqual({ type: 'ephemeral' });
    });

    it('passes the user prompt as a user message', async () => {
        mockCreate.mockResolvedValue(
            makeResponse(JSON.stringify(validFilters)),
        );
        const prompt = '2 bed condo in Denver';
        await parsePromptToFilters(prompt);

        const call = mockCreate.mock.calls[0][0];
        expect(call.messages).toEqual([{ role: 'user', content: prompt }]);
    });

    it('returns an empty features array when omitted', async () => {
        const noFeatures = { ...validFilters, features: [] };
        mockCreate.mockResolvedValue(makeResponse(JSON.stringify(noFeatures)));
        const result = await parsePromptToFilters('any prompt');
        expect(result.features).toEqual([]);
    });
});
