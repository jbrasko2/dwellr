import { gql } from '@apollo/client';

export const SEARCH_LISTINGS = gql`
    query SearchListings($prompt: String!) {
        searchListings(prompt: $prompt) {
            filters {
                location
                minBeds
                maxBeds
                minBaths
                maxPrice
                minPrice
                propertyType
                features
            }
            listings {
                id
                address {
                    street
                    city
                    state
                    zip
                }
                price
                beds
                baths
                sqft
                propertyType
                imageUrl
                listingUrl
                description
            }
            total
        }
    }
`;
