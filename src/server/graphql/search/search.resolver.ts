import { type QueryResolvers } from '../../../generated/types';
import { searchMocks } from './search.mocks';

const searchListings: QueryResolvers['searchListings'] = () => {
    return searchMocks;
};

export const searchResolvers = {
    Query: {
        searchListings,
    },
};
