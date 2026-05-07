import { GraphQLResolveInfo } from 'graphql';

export const searchMocks = {
    summary: 'Showing results for your search',
    filters: {
        location: 'Austin, TX',
        maxPrice: 500000,
        bedrooms: 3,
    },
    listings: [
        {
            id: '1',
            address: '123 Main St, Austin, TX 78701',
            price: 450000,
            bedrooms: 3,
            bathrooms: 2,
            squareFeet: 1800,
            imageUrl: 'https://placehold.co/400x300',
            listingUrl: '#',
        },
        {
            id: '2',
            address: '456 Oak Ave, Austin, TX 78702',
            price: 375000,
            bedrooms: 3,
            bathrooms: 1.5,
            squareFeet: 1500,
            imageUrl: 'https://placehold.co/400x300',
            listingUrl: '#',
        },
    ],
};

export const mockResolverArgs = {
    root: {},
    context: {},
    info: {} as GraphQLResolveInfo,
};

export const mockSearchPrompt = '3 bedroom house in Austin under 500k';
