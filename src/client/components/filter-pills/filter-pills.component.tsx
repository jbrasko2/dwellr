import type { SearchFilters, SearchFiltersInput } from '@generated/types';
import type { FunctionComponent } from 'react';
import { Tag, TagGroup, TagList } from '@/components/base/tags/tags';
import { formatPrice } from '@/helpers/formatters';

interface FilterPillsProps {
    filters: SearchFilters;
    onRemove: (updatedFilters: SearchFiltersInput) => void;
}

interface Pill {
    id: string;
    label: string;
    updatedFilters: SearchFiltersInput;
}

const filtersToInput = (f: SearchFilters): SearchFiltersInput => ({
    location: f.location,
    minBeds: f.minBeds,
    maxBeds: f.maxBeds,
    minBaths: f.minBaths,
    maxBaths: f.maxBaths,
    minPrice: f.minPrice,
    maxPrice: f.maxPrice,
    minSqft: f.minSqft,
    maxSqft: f.maxSqft,
    minLotSqft: f.minLotSqft,
    maxLotSqft: f.maxLotSqft,
    minYearBuilt: f.minYearBuilt,
    maxYearBuilt: f.maxYearBuilt,
    newConstruction: f.newConstruction,
    propertyType: f.propertyType,
    features: f.features,
    status: f.status,
    locationRadius: f.locationRadius,
    noHoaFee: f.noHoaFee,
    maxHoaFee: f.maxHoaFee,
    foreclosure: f.foreclosure,
    hasTour: f.hasTour,
    dogs: f.dogs,
    cats: f.cats,
    sortField: f.sortField,
    sortDirection: f.sortDirection,
});

const toTitleCase = (s: string) =>
    s.replace(/\b[a-z]/g, (c) => c.toUpperCase());

const buildPills = (filters: SearchFilters): Pill[] => {
    const base = filtersToInput(filters);
    const pills: Pill[] = [];

    const push = (
        id: string,
        label: string,
        overrides: Partial<Omit<SearchFiltersInput, 'features'>>,
    ) => {
        pills.push({
            id,
            label: toTitleCase(label),
            updatedFilters: { ...base, ...overrides },
        });
    };

    if (filters.location) {
        const label = filters.locationRadius
            ? `${filters.location} (${filters.locationRadius} mi)`
            : filters.location;
        push('location', label, { location: null, locationRadius: null });
    }

    const { minBeds, maxBeds } = filters;
    if (minBeds != null && maxBeds != null) {
        const label =
            minBeds === maxBeds
                ? `${minBeds} bed${minBeds !== 1 ? 's' : ''}`
                : `${minBeds}-${maxBeds} beds`;
        push('beds', label, { minBeds: null, maxBeds: null });
    } else if (minBeds != null) {
        push('minBeds', `${minBeds}+ beds`, { minBeds: null });
    } else if (maxBeds != null) {
        push('maxBeds', `Up to ${maxBeds} beds`, { maxBeds: null });
    }

    const { minBaths, maxBaths } = filters;
    if (minBaths != null && maxBaths != null) {
        const label =
            minBaths === maxBaths
                ? `${minBaths} bath${minBaths !== 1 ? 's' : ''}`
                : `${minBaths}-${maxBaths} baths`;
        push('baths', label, { minBaths: null, maxBaths: null });
    } else if (minBaths != null) {
        push('minBaths', `${minBaths}+ baths`, { minBaths: null });
    } else if (maxBaths != null) {
        push('maxBaths', `Up to ${maxBaths} baths`, { maxBaths: null });
    }

    const { minPrice, maxPrice } = filters;
    if (minPrice != null && maxPrice != null) {
        push('price', `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`, {
            minPrice: null,
            maxPrice: null,
        });
    } else if (minPrice != null) {
        push('minPrice', `${formatPrice(minPrice)}+`, { minPrice: null });
    } else if (maxPrice != null) {
        push('maxPrice', `Under ${formatPrice(maxPrice)}`, { maxPrice: null });
    }

    const { minSqft, maxSqft } = filters;
    if (minSqft != null && maxSqft != null) {
        push(
            'sqft',
            `${minSqft.toLocaleString()}-${maxSqft.toLocaleString()} sqft`,
            { minSqft: null, maxSqft: null },
        );
    } else if (minSqft != null) {
        push('minSqft', `${minSqft.toLocaleString()}+ sqft`, {
            minSqft: null,
        });
    } else if (maxSqft != null) {
        push('maxSqft', `Under ${maxSqft.toLocaleString()} sqft`, {
            maxSqft: null,
        });
    }

    const { minLotSqft, maxLotSqft } = filters;
    if (minLotSqft != null && maxLotSqft != null) {
        push(
            'lotSqft',
            `${minLotSqft.toLocaleString()}-${maxLotSqft.toLocaleString()} lot sqft`,
            { minLotSqft: null, maxLotSqft: null },
        );
    } else if (minLotSqft != null) {
        push('minLotSqft', `${minLotSqft.toLocaleString()}+ lot sqft`, {
            minLotSqft: null,
        });
    } else if (maxLotSqft != null) {
        push('maxLotSqft', `Lot under ${maxLotSqft.toLocaleString()} sqft`, {
            maxLotSqft: null,
        });
    }

    const { minYearBuilt, maxYearBuilt } = filters;
    if (minYearBuilt != null && maxYearBuilt != null) {
        push('yearBuilt', `Built ${minYearBuilt}-${maxYearBuilt}`, {
            minYearBuilt: null,
            maxYearBuilt: null,
        });
    } else if (minYearBuilt != null) {
        push('minYearBuilt', `Built after ${minYearBuilt}`, {
            minYearBuilt: null,
        });
    } else if (maxYearBuilt != null) {
        push('maxYearBuilt', `Built before ${maxYearBuilt}`, {
            maxYearBuilt: null,
        });
    }

    if (filters.newConstruction) {
        push('newConstruction', 'New construction', {
            newConstruction: null,
        });
    }
    if (filters.propertyType) {
        push('propertyType', filters.propertyType, { propertyType: null });
    }
    if (filters.status) {
        push('status', filters.status, { status: null });
    }
    if (filters.noHoaFee) {
        push('noHoaFee', 'No HOA fee', { noHoaFee: null });
    }
    if (filters.maxHoaFee != null) {
        push('maxHoaFee', `HOA ≤ ${formatPrice(filters.maxHoaFee)}/mo`, {
            maxHoaFee: null,
        });
    }
    if (filters.foreclosure) {
        push('foreclosure', 'Foreclosure', { foreclosure: null });
    }
    if (filters.hasTour) {
        push('hasTour', 'Has virtual tour', { hasTour: null });
    }
    if (filters.dogs) {
        push('dogs', 'Dogs OK', { dogs: null });
    }
    if (filters.cats) {
        push('cats', 'Cats OK', { cats: null });
    }

    for (const feature of filters.features) {
        pills.push({
            id: `feature-${feature}`,
            label: toTitleCase(feature.replace(/_/g, ' ')),
            updatedFilters: {
                ...base,
                features: filters.features.filter((f) => f !== feature),
            },
        });
    }

    return pills;
};

export const FilterPills: FunctionComponent<FilterPillsProps> = ({
    filters,
    onRemove,
}) => {
    const pills = buildPills(filters);

    if (pills.length === 0) return null;

    const pillMap = new Map(pills.map((p) => [p.id, p.updatedFilters]));

    const handleClose = (id: string) => {
        const updatedFilters = pillMap.get(id);
        if (updatedFilters) {
            onRemove(updatedFilters);
        }
    };

    return (
        <TagGroup label="Active filters" size="md">
            <TagList className="flex flex-wrap gap-2">
                {pills.map((pill) => (
                    <Tag key={pill.id} id={pill.id} onClose={handleClose}>
                        {pill.label}
                    </Tag>
                ))}
            </TagList>
        </TagGroup>
    );
};
