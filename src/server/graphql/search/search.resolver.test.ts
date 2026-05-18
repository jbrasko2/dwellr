import { mockResolverArgs, mockSearchPrompt } from './search.mocks';
import { searchResolvers } from './search.resolver';

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
