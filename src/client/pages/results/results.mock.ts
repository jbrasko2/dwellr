import type { SearchResult } from '../../../generated/types';

// VITE_USE_MOCK_DATA=true npm run dev:client
// http://localhost:5173/results?q=anything

export const mockSearchResult: SearchResult = {
    listings: [
        {
            id: '1',
            price: 549000,
            address: {
                street: '2415 Barton Creek Blvd',
                city: 'Austin',
                state: 'TX',
                zip: '78735',
            },
            beds: 3,
            baths: 2,
            sqft: 1842,
            imageUrl: null,
            listingUrl: 'https://example.com/1',
            propertyType: 'Single Family',
            description: null,
        },
        {
            id: '2',
            price: 725000,
            address: {
                street: '812 W 12th St',
                city: 'Austin',
                state: 'TX',
                zip: '78703',
            },
            beds: 4,
            baths: 3,
            sqft: 2310,
            imageUrl: null,
            listingUrl: 'https://example.com/2',
            propertyType: 'Single Family',
            description: null,
        },
        {
            id: '3',
            price: 389000,
            address: {
                street: '5501 N Lamar Blvd #204',
                city: 'Austin',
                state: 'TX',
                zip: '78751',
            },
            beds: 2,
            baths: 2,
            sqft: 1100,
            imageUrl: null,
            listingUrl: 'https://example.com/3',
            propertyType: 'Condo',
            description: null,
        },
        {
            id: '4',
            price: 875000,
            address: {
                street: '3301 Bee Cave Rd #650',
                city: 'Austin',
                state: 'TX',
                zip: '78746',
            },
            beds: 3,
            baths: 2.5,
            sqft: 1975,
            imageUrl: null,
            listingUrl: 'https://example.com/4',
            propertyType: 'Townhome',
            description: null,
        },
    ],
    total: 4,
    filters: {
        features: [],
        location: 'Austin, TX',
        minBeds: 2,
        maxBeds: null,
        minBaths: null,
        minPrice: null,
        maxPrice: null,
        propertyType: null,
    },
};
