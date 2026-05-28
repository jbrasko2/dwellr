import { parsePromptToFilters } from '../../services/claude/claude.service';
import { fetchListings } from '../../services/listings/listings.service';
import {
    mockResolverArgs,
    mockSearchPrompt,
    searchMocks,
} from './search.mocks';
import { searchResolvers } from './search.resolver';

jest.mock('../../services/claude/claude.service');
jest.mock('../../services/listings/listings.service');

const mockParsePrompt = parsePromptToFilters as jest.MockedFunction<
    typeof parsePromptToFilters
>;
const mockFetchListings = fetchListings as jest.MockedFunction<
    typeof fetchListings
>;

beforeEach(() => {
    mockParsePrompt.mockResolvedValue(searchMocks.filters);
    mockFetchListings.mockResolvedValue({
        listings: searchMocks.listings,
        total: searchMocks.total,
    });
});

describe('searchResolvers', () => {
    describe('Query.searchListings', () => {
        it('should return the correct total count', async () => {
            const result = await searchResolvers.Query.searchListings(
                mockResolverArgs.root,
                { prompt: mockSearchPrompt },
                mockResolverArgs.context,
                mockResolverArgs.info,
            );

            expect(result.total).toBe(2);
        });

        it('should return an array of listings', async () => {
            const result = await searchResolvers.Query.searchListings(
                mockResolverArgs.root,
                { prompt: mockSearchPrompt },
                mockResolverArgs.context,
                mockResolverArgs.info,
            );

            expect(Array.isArray(result.listings)).toBe(true);
            expect(result.listings.length).toBeGreaterThan(0);
        });

        it('should return filters', async () => {
            const result = await searchResolvers.Query.searchListings(
                mockResolverArgs.root,
                { prompt: mockSearchPrompt },
                mockResolverArgs.context,
                mockResolverArgs.info,
            );

            expect(result.filters).toBeDefined();
            expect(result.filters?.location).toBe('Austin, TX');
        });
    });
});
