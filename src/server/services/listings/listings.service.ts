import { type SearchFilters, type Listing } from '../../../generated/types';
import { BASE_URL, getRapidApiHeaders } from '../../lib/rapidapi-client';

const PROPERTY_TYPE_MAP: Record<string, string> = {
    house: 'single_family',
    condo: 'condos',
    townhouse: 'townhomes',
    multi_family: 'multi_family',
    land: 'land',
    mobile: 'mobile',
    farm: 'farm',
};

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

export const buildRequestBody = (
    filters: SearchFilters,
): Record<string, unknown> => {
    const body: Record<string, unknown> = {
        limit: 42,
        offset: 0,
        status: ['for_sale'],
        sort: {
            direction: 'desc',
            field: 'list_date',
        },
    };

    if (filters.location) {
        body['city'] = filters.location;
    }

    if (filters.minPrice != null || filters.maxPrice != null) {
        body['list_price'] = {
            ...(filters.minPrice != null && { min: filters.minPrice }),
            ...(filters.maxPrice != null && { max: filters.maxPrice }),
        };
    }

    if (filters.minBeds != null || filters.maxBeds != null) {
        body['beds'] = {
            ...(filters.minBeds != null && { min: filters.minBeds }),
            ...(filters.maxBeds != null && { max: filters.maxBeds }),
        };
    }

    if (filters.minBaths != null) {
        body['baths'] = { min: filters.minBaths };
    }

    if (filters.propertyType) {
        const mapped = PROPERTY_TYPE_MAP[filters.propertyType.toLowerCase()];
        if (mapped) {
            body['type'] = [mapped];
        }
    }

    if (filters.features.length > 0) {
        body['keywords'] = filters.features;
    }

    return body;
};

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

    const json: RapidApiResponse = JSON.parse(await response.text());
    const homeSearch = json.data?.home_search;
    const rawListings = homeSearch?.results ?? [];
    const total = homeSearch?.count ?? 0;

    const listings = rawListings
        .map(mapListing)
        .filter((l): l is Listing => l !== null);

    return { listings, total };
};
