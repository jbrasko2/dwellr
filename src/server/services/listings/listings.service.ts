import { type SearchFilters, type Listing } from '../../../generated/types';
import { BASE_URL, getRapidApiHeaders } from '../../lib/rapidapi-client';

const US_STATE_CODES = new Set([
    'AL',
    'AK',
    'AZ',
    'AR',
    'CA',
    'CO',
    'CT',
    'DE',
    'FL',
    'GA',
    'HI',
    'ID',
    'IL',
    'IN',
    'IA',
    'KS',
    'KY',
    'LA',
    'ME',
    'MD',
    'MA',
    'MI',
    'MN',
    'MS',
    'MO',
    'MT',
    'NE',
    'NV',
    'NH',
    'NJ',
    'NM',
    'NY',
    'NC',
    'ND',
    'OH',
    'OK',
    'OR',
    'PA',
    'RI',
    'SC',
    'SD',
    'TN',
    'TX',
    'UT',
    'VT',
    'VA',
    'WA',
    'WV',
    'WI',
    'WY',
    'DC',
]);

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

const applyLocation = (
    location: string,
    radius: number | null | undefined,
    body: Record<string, unknown>,
) => {
    const trimmed = location.trim();

    if (radius != null) {
        body['search_location'] = { radius, location: trimmed };
        return;
    }

    // ZIP code: 5-digit or ZIP+4
    if (/^\d{5}(-\d{4})?$/.test(trimmed)) {
        body['postal_code'] = trimmed.slice(0, 5);
        return;
    }

    // "City, ST" pattern
    const cityStateMatch = trimmed.match(/^(.+),\s*([A-Za-z]{2})$/);
    if (cityStateMatch) {
        const stateCode = cityStateMatch[2].toUpperCase();
        if (US_STATE_CODES.has(stateCode)) {
            body['city'] = cityStateMatch[1].trim();
            body['state_code'] = stateCode;
            return;
        }
    }

    // State code alone
    const upper = trimmed.toUpperCase();
    if (trimmed.length === 2 && US_STATE_CODES.has(upper)) {
        body['state_code'] = upper;
        return;
    }

    body['city'] = trimmed;
};

export const buildRequestBody = (
    filters: SearchFilters,
): Record<string, unknown> => {
    const body: Record<string, unknown> = {
        limit: 42,
        offset: 0,
        status: [filters.status ?? 'for_sale'],
        sort: {
            direction: filters.sortDirection ?? 'desc',
            field: filters.sortField ?? 'list_date',
        },
    };

    if (filters.location) {
        applyLocation(filters.location, filters.locationRadius, body);
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

    if (filters.minBaths != null || filters.maxBaths != null) {
        body['baths'] = {
            ...(filters.minBaths != null && { min: filters.minBaths }),
            ...(filters.maxBaths != null && { max: filters.maxBaths }),
        };
    }

    if (filters.minSqft != null || filters.maxSqft != null) {
        body['sqft'] = {
            ...(filters.minSqft != null && { min: filters.minSqft }),
            ...(filters.maxSqft != null && { max: filters.maxSqft }),
        };
    }

    if (filters.minLotSqft != null || filters.maxLotSqft != null) {
        body['lot_sqft'] = {
            ...(filters.minLotSqft != null && { min: filters.minLotSqft }),
            ...(filters.maxLotSqft != null && { max: filters.maxLotSqft }),
        };
    }

    if (filters.minYearBuilt != null || filters.maxYearBuilt != null) {
        body['year_built'] = {
            ...(filters.minYearBuilt != null && { min: filters.minYearBuilt }),
            ...(filters.maxYearBuilt != null && { max: filters.maxYearBuilt }),
        };
    }

    if (filters.newConstruction === true) body['new_construction'] = true;
    if (filters.foreclosure === true) body['foreclosure'] = true;
    if (filters.hasTour === true) body['has_tour'] = true;
    if (filters.dogs === true) body['dogs'] = true;
    if (filters.cats === true) body['cats'] = true;
    if (filters.noHoaFee === true) body['no_hoa_fee'] = true;

    if (filters.maxHoaFee != null) {
        body['hoa_fee'] = { max: filters.maxHoaFee };
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
        imageUrl: raw.primary_photo?.href?.replace(/s\.jpg$/, 'od.jpg') ?? null,
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
