import { QueryResolvers } from '../../../generated/types';
import { searchMocks } from './search.mocks';

const searchListings: QueryResolvers['searchListings'] = (_, { prompt }) => {
    return {
        ...searchMocks,
        summary: `Showing results for: "${prompt}"`,
    };
};

export const searchResolvers = {
    Query: {
        searchListings,
    },
};
