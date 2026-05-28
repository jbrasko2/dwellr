import { getRapidApiHeaders, BASE_URL } from '../../lib/rapidapi-client';
import {
    buildRequestBody,
    fetchListings,
    mapListing,
} from './listings.service';

jest.mock('../../lib/rapidapi-client');

const mockGetRapidApiHeaders = getRapidApiHeaders as jest.MockedFunction<
    typeof getRapidApiHeaders
>;
mockGetRapidApiHeaders.mockReturnValue({
    'x-rapidapi-key': 'test-key',
    'x-rapidapi-host': 'test-host',
    'Content-Type': 'application/json',
});

const baseFilters = {
    location: null,
    minPrice: null,
    maxPrice: null,
    minBeds: null,
    maxBeds: null,
    minBaths: null,
    propertyType: null,
    features: [],
};

describe('buildRequestBody', () => {
    it('returns defaults when no filters are set', () => {
        const body = buildRequestBody(baseFilters);
        expect(body).toEqual({
            limit: 42,
            offset: 0,
            status: ['for_sale'],
            sort: { direction: 'desc', field: 'list_date' },
        });
    });

    it('maps location to city', () => {
        const body = buildRequestBody({
            ...baseFilters,
            location: 'Austin, TX',
        });
        expect(body['city']).toBe('Austin, TX');
    });

    it('maps minPrice only', () => {
        const body = buildRequestBody({ ...baseFilters, minPrice: 200000 });
        expect(body['list_price']).toEqual({ min: 200000 });
    });

    it('maps maxPrice only', () => {
        const body = buildRequestBody({ ...baseFilters, maxPrice: 500000 });
        expect(body['list_price']).toEqual({ max: 500000 });
    });

    it('maps both minPrice and maxPrice', () => {
        const body = buildRequestBody({
            ...baseFilters,
            minPrice: 100000,
            maxPrice: 500000,
        });
        expect(body['list_price']).toEqual({ min: 100000, max: 500000 });
    });

    it('maps minBeds only', () => {
        const body = buildRequestBody({ ...baseFilters, minBeds: 2 });
        expect(body['beds']).toEqual({ min: 2 });
    });

    it('maps maxBeds only', () => {
        const body = buildRequestBody({ ...baseFilters, maxBeds: 4 });
        expect(body['beds']).toEqual({ max: 4 });
    });

    it('maps both minBeds and maxBeds', () => {
        const body = buildRequestBody({
            ...baseFilters,
            minBeds: 2,
            maxBeds: 4,
        });
        expect(body['beds']).toEqual({ min: 2, max: 4 });
    });

    it('maps minBaths', () => {
        const body = buildRequestBody({ ...baseFilters, minBaths: 2 });
        expect(body['baths']).toEqual({ min: 2 });
    });

    it('maps known propertyType values', () => {
        const cases: Array<[string, string]> = [
            ['house', 'single_family'],
            ['condo', 'condos'],
            ['townhouse', 'townhomes'],
            ['multi_family', 'multi_family'],
            ['land', 'land'],
            ['mobile', 'mobile'],
            ['farm', 'farm'],
        ];
        for (const [input, expected] of cases) {
            const body = buildRequestBody({
                ...baseFilters,
                propertyType: input,
            });
            expect(body['type']).toEqual([expected]);
        }
    });

    it('omits type for unknown propertyType', () => {
        const body = buildRequestBody({
            ...baseFilters,
            propertyType: 'yacht',
        });
        expect(body).not.toHaveProperty('type');
    });

    it('maps features as keywords', () => {
        const body = buildRequestBody({
            ...baseFilters,
            features: ['pool', 'backyard'],
        });
        expect(body['keywords']).toEqual(['pool', 'backyard']);
    });

    it('omits keywords when features is empty', () => {
        const body = buildRequestBody(baseFilters);
        expect(body).not.toHaveProperty('keywords');
    });
});

describe('mapListing', () => {
    const rawListing = {
        property_id: 'prop-1',
        href: 'https://realtor.com/listing/1',
        list_price: 450000,
        location: {
            address: {
                line: '123 Main St',
                city: 'Austin',
                state_code: 'TX',
                postal_code: '78701',
            },
        },
        description: {
            type: 'single_family',
            beds: 3,
            baths: 2,
            sqft: 1800,
            text: 'A lovely home.',
        },
        primary_photo: { href: 'https://example.com/photo-s.jpg' },
    };

    it('maps all fields correctly', () => {
        const result = mapListing(rawListing);
        expect(result).toEqual({
            id: 'prop-1',
            price: 450000,
            address: {
                street: '123 Main St',
                city: 'Austin',
                state: 'TX',
                zip: '78701',
            },
            beds: 3,
            baths: 2,
            sqft: 1800,
            propertyType: 'single_family',
            description: 'A lovely home.',
            imageUrl: 'https://example.com/photo-od.jpg',
            listingUrl: 'https://realtor.com/listing/1',
        });
    });

    it('replaces s.jpg with od.jpg in imageUrl', () => {
        const result = mapListing(rawListing);
        expect(result?.imageUrl).toBe('https://example.com/photo-od.jpg');
    });

    it('returns null when property_id is missing', () => {
        expect(
            mapListing({ ...rawListing, property_id: undefined }),
        ).toBeNull();
    });

    it('returns null when list_price is null', () => {
        expect(mapListing({ ...rawListing, list_price: null })).toBeNull();
    });

    it('returns null fields when optional data is absent', () => {
        const result = mapListing({
            property_id: 'prop-2',
            list_price: 300000,
        });
        expect(result).toEqual({
            id: 'prop-2',
            price: 300000,
            address: { street: null, city: null, state: null, zip: null },
            beds: null,
            baths: null,
            sqft: null,
            propertyType: null,
            description: null,
            imageUrl: null,
            listingUrl: null,
        });
    });
});

describe('fetchListings', () => {
    const mockFetch = jest.fn();

    beforeEach(() => {
        global.fetch = mockFetch;
        mockFetch.mockReset();
    });

    function makeResponse(body: unknown, ok = true, status = 200) {
        return {
            ok,
            status,
            statusText: ok ? 'OK' : 'Bad Request',
            text: () => Promise.resolve(JSON.stringify(body)),
        };
    }

    const apiResponse = {
        data: {
            home_search: {
                count: 1,
                results: [
                    {
                        property_id: 'prop-1',
                        list_price: 450000,
                        href: 'https://realtor.com/listing/1',
                        location: {
                            address: {
                                line: '123 Main St',
                                city: 'Austin',
                                state_code: 'TX',
                                postal_code: '78701',
                            },
                        },
                        description: {
                            type: 'single_family',
                            beds: 3,
                            baths: 2,
                            sqft: 1800,
                            text: 'A lovely home.',
                        },
                        primary_photo: {
                            href: 'https://example.com/photo-s.jpg',
                        },
                    },
                ],
            },
        },
    };

    it('calls the correct URL and method', async () => {
        mockFetch.mockResolvedValue(makeResponse(apiResponse));
        await fetchListings(baseFilters);

        expect(mockFetch).toHaveBeenCalledWith(
            `${BASE_URL}/properties/v3/list`,
            expect.objectContaining({ method: 'POST' }),
        );
    });

    it('includes RapidAPI headers', async () => {
        mockFetch.mockResolvedValue(makeResponse(apiResponse));
        await fetchListings(baseFilters);

        const [, options] = mockFetch.mock.calls[0] as [string, RequestInit];
        expect(options.headers).toEqual(mockGetRapidApiHeaders());
    });

    it('returns mapped listings and total', async () => {
        mockFetch.mockResolvedValue(makeResponse(apiResponse));
        const { listings, total } = await fetchListings(baseFilters);

        expect(total).toBe(1);
        expect(listings).toHaveLength(1);
        expect(listings[0].id).toBe('prop-1');
    });

    it('filters out unmappable listings', async () => {
        const withInvalid = {
            data: {
                home_search: {
                    count: 2,
                    results: [
                        { property_id: 'prop-1', list_price: 450000 },
                        { list_price: 300000 },
                    ],
                },
            },
        };
        mockFetch.mockResolvedValue(makeResponse(withInvalid));
        const { listings } = await fetchListings(baseFilters);
        expect(listings).toHaveLength(1);
    });

    it('returns empty listings and zero total when results are absent', async () => {
        mockFetch.mockResolvedValue(
            makeResponse({ data: { home_search: {} } }),
        );
        const { listings, total } = await fetchListings(baseFilters);
        expect(listings).toEqual([]);
        expect(total).toBe(0);
    });

    it('throws ListingsServiceError when response is not ok', async () => {
        mockFetch.mockResolvedValue(makeResponse({}, false, 422));
        await expect(fetchListings(baseFilters)).rejects.toMatchObject({
            name: 'ListingsServiceError',
            statusCode: 422,
        });
    });
});
