import { type QueryResolvers } from '../../../generated/types';
import { parsePromptToFilters } from '../../services/claude/claude.service';
import { fetchListings } from '../../services/listings/listings.service';

const searchListings: QueryResolvers['searchListings'] = async (
    _,
    { prompt, filters },
) => {
    const resolvedFilters = filters ?? (await parsePromptToFilters(prompt));
    const { listings, total } = await fetchListings(resolvedFilters);

    return { filters: resolvedFilters, listings, total };
};

export const searchResolvers = {
    Query: {
        searchListings,
    },
};
