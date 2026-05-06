import { searchMocks } from './search.mocks';

export const searchResolvers = {
    Query: {
        searchListings: (_: unknown, { prompt }: { prompt: string }) => {
            return {
                ...searchMocks,
                summary: `Showing results for: "${prompt}"`,
            };
        },
    },
};
