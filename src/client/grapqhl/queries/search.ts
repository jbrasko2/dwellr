import { gql } from '@apollo/client';

export const SEARCH_LISTINGS = gql`
    query SearchListings($prompt: String, $filters: SearchFiltersInput) {
        searchListings(prompt: $prompt, filters: $filters) {
            filters {
                location
                minBeds
                maxBeds
                minBaths
                maxBaths
                minPrice
                maxPrice
                minSqft
                maxSqft
                minLotSqft
                maxLotSqft
                minYearBuilt
                maxYearBuilt
                newConstruction
                propertyType
                features
                status
                locationRadius
                noHoaFee
                maxHoaFee
                foreclosure
                hasTour
                dogs
                cats
                sortField
                sortDirection
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
