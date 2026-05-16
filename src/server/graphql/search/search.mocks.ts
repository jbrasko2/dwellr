import { type GraphQLResolveInfo } from 'graphql';

export const searchMocks = {
    filters: {
        location: 'Austin, TX',
        minBeds: null,
        maxBeds: null,
        minBaths: null,
        maxPrice: 500000,
        minPrice: null,
        propertyType: null,
        features: [],
    },
    listings: [
        {
            id: '1',
            address: {
                street: '123 Main St',
                city: 'Austin',
                state: 'TX',
                zip: '78701',
            },
            price: 450000,
            beds: 3,
            baths: 2,
            sqft: 1800,
            propertyType: 'Single Family',
            imageUrl: 'https://placehold.co/400x300',
            listingUrl: '#',
            description: 'Beautiful home in central Austin',
        },
        {
            id: '2',
            address: {
                street: '456 Oak Ave',
                city: 'Austin',
                state: 'TX',
                zip: '78702',
            },
            price: 375000,
            beds: 3,
            baths: 1.5,
            sqft: 1500,
            propertyType: 'Townhouse',
            imageUrl: 'https://placehold.co/400x300',
            listingUrl: '#',
            description: 'Charming townhouse with modern updates',
        },
    ],
    total: 2,
};

export const mockResolverArgs = {
    root: {},
    context: {},
    info: {} as GraphQLResolveInfo,
};

export const mockSearchPrompt = '3 bedroom house in Austin under 500k';
