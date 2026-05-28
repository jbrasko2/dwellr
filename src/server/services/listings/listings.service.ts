import { type SearchFilters, type Listing } from '../../../generated/types';
import { getRapidApiHeaders } from '../../lib/rapidapi-client';

interface RapidApiAddress {
    line?: string | null;
    city?: string | null;
    state_code?: string | null;
    postal_code?: string | null;
}

interface RapidApiDescription {
    type?: string | null;
    beds?: number | null;
    baths?: number | null;
    sqft?: number | null;
    text?: string | null;
}

interface RapidApiListing {
    property_id?: string | null;
    href?: string | null;
    list_price?: number | null;
    location?: {
        address?: RapidApiAddress | null;
    } | null;
    description?: RapidApiDescription | null;
    primary_photo?: {
        href?: string | null;
    } | null;
}

interface RapidApiResponse {
    data?: {
        home_search?: {
            count?: number | null;
            results?: RapidApiListing[] | null;
        } | null;
    } | null;
}

export class ListingsServiceError extends Error {
    constructor(
        message: string,
        public readonly statusCode?: number,
    ) {
        super(message);
        this.name = 'ListingsServiceError';
    }
}

export const mapListing = (raw: RapidApiListing): Listing | null => {
    if (!raw.property_id || raw.list_price == null) return null;

    const addr = raw.location?.address;

    return {
        id: raw.property_id,
        price: raw.list_price,
        address: {
            street: addr?.line ?? null,
            city: addr?.city ?? null,
            state: addr?.state_code ?? null,
            zip: addr?.postal_code ?? null,
        },
        beds: raw.description?.beds ?? null,
        baths: raw.description?.baths ?? null,
        sqft: raw.description?.sqft ?? null,
        propertyType: raw.description?.type ?? null,
        description: raw.description?.text ?? null,
        imageUrl: raw.primary_photo?.href ?? null,
        listingUrl: raw.href ?? null,
    };
};

export const fetchListings = async (
    filters: SearchFilters,
): Promise<{ listings: Listing[]; total: number }> => {
    const response = await fetch(`${BASE_URL}/properties/v3/list`, {
        method: 'POST',
        headers: getRapidApiHeaders(),
        body: JSON.stringify(buildRequestBody(filters)),
    });

    if (!response.ok) {
        throw new ListingsServiceError(
            `RapidAPI request failed: ${response.statusText}`,
            response.status,
        );
    }

    const json: RapidApiResponse = await response.json();
    const homeSearch = json.data?.home_search;
    const rawListings = homeSearch?.results ?? [];
    const total = homeSearch?.count ?? 0;

    const listings = rawListings
        .map(mapListing)
        .filter((l): l is Listing => l !== null);

    return { listings, total };
};
