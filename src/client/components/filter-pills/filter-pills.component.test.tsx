import type { SearchFilters } from '@generated/types';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { FilterPills } from '@/components/filter-pills/filter-pills.component';

const emptyFilters: SearchFilters = { features: [] };

const renderPills = (filters: Partial<SearchFilters>, onRemove = vi.fn()) =>
    render(
        <FilterPills
            filters={{ ...emptyFilters, ...filters }}
            onRemove={onRemove}
        />,
    );

describe('FilterPills', () => {
    describe('empty state', () => {
        it('renders nothing when no filters are set', () => {
            const { container } = renderPills({});
            expect(container).toBeEmptyDOMElement();
        });

        it('renders nothing when only sort fields are set', () => {
            const { container } = renderPills({
                sortField: 'list_price',
                sortDirection: 'asc',
            });
            expect(container).toBeEmptyDOMElement();
        });
    });

    describe('pill labels', () => {
        it('renders location pill', () => {
            renderPills({ location: 'Austin, TX' });
            expect(screen.getByText('Austin, TX')).toBeInTheDocument();
        });

        it('renders location with radius', () => {
            renderPills({ location: 'Austin, TX', locationRadius: 5 });
            expect(screen.getByText('Austin, TX (5 Mi)')).toBeInTheDocument();
        });

        it('renders minBeds-only pill', () => {
            renderPills({ minBeds: 2 });
            expect(screen.getByText('2+ Beds')).toBeInTheDocument();
        });

        it('renders maxBeds-only pill', () => {
            renderPills({ maxBeds: 4 });
            expect(screen.getByText('Up To 4 Beds')).toBeInTheDocument();
        });

        it('renders combined beds range pill', () => {
            renderPills({ minBeds: 2, maxBeds: 4 });
            expect(screen.getByText('2-4 Beds')).toBeInTheDocument();
        });

        it('renders exact bed count as singular when min equals max', () => {
            renderPills({ minBeds: 1, maxBeds: 1 });
            expect(screen.getByText('1 Bed')).toBeInTheDocument();
        });

        it('renders exact bed count as plural when min equals max and count > 1', () => {
            renderPills({ minBeds: 3, maxBeds: 3 });
            expect(screen.getByText('3 Beds')).toBeInTheDocument();
        });

        it('renders minBaths-only pill', () => {
            renderPills({ minBaths: 2 });
            expect(screen.getByText('2+ Baths')).toBeInTheDocument();
        });

        it('renders combined baths range pill', () => {
            renderPills({ minBaths: 1, maxBaths: 3 });
            expect(screen.getByText('1-3 Baths')).toBeInTheDocument();
        });

        it('renders minPrice-only pill', () => {
            renderPills({ minPrice: 300000 });
            expect(screen.getByText('$300,000+')).toBeInTheDocument();
        });

        it('renders maxPrice-only pill', () => {
            renderPills({ maxPrice: 700000 });
            expect(screen.getByText('Under $700,000')).toBeInTheDocument();
        });

        it('renders price range pill', () => {
            renderPills({ minPrice: 400000, maxPrice: 900000 });
            expect(screen.getByText('$400,000 - $900,000')).toBeInTheDocument();
        });

        it('renders sqft range pill', () => {
            renderPills({ minSqft: 1000, maxSqft: 2500 });
            expect(screen.getByText('1,000-2,500 Sqft')).toBeInTheDocument();
        });

        it('renders year built range pill', () => {
            renderPills({ minYearBuilt: 2000, maxYearBuilt: 2020 });
            expect(screen.getByText('Built 2000-2020')).toBeInTheDocument();
        });

        it('renders minYearBuilt-only pill', () => {
            renderPills({ minYearBuilt: 2010 });
            expect(screen.getByText('Built After 2010')).toBeInTheDocument();
        });

        it('renders propertyType with title case', () => {
            renderPills({ propertyType: 'single family' });
            expect(screen.getByText('Single Family')).toBeInTheDocument();
        });

        it('renders newConstruction pill', () => {
            renderPills({ newConstruction: true });
            expect(screen.getByText('New Construction')).toBeInTheDocument();
        });

        it('renders noHoaFee pill', () => {
            renderPills({ noHoaFee: true });
            expect(screen.getByText('No HOA Fee')).toBeInTheDocument();
        });

        it('renders maxHoaFee pill', () => {
            renderPills({ maxHoaFee: 200 });
            expect(screen.getByText('HOA ≤ $200/Mo')).toBeInTheDocument();
        });

        it('renders foreclosure pill', () => {
            renderPills({ foreclosure: true });
            expect(screen.getByText('Foreclosure')).toBeInTheDocument();
        });

        it('renders hasTour pill', () => {
            renderPills({ hasTour: true });
            expect(screen.getByText('Has Virtual Tour')).toBeInTheDocument();
        });

        it('renders dogs pill', () => {
            renderPills({ dogs: true });
            expect(screen.getByText('Dogs OK')).toBeInTheDocument();
        });

        it('renders cats pill', () => {
            renderPills({ cats: true });
            expect(screen.getByText('Cats OK')).toBeInTheDocument();
        });

        it('renders feature labels with underscores replaced and title cased', () => {
            renderPills({ features: ['swimming_pool', 'garage_2_or_more'] });
            expect(screen.getByText('Swimming Pool')).toBeInTheDocument();
            expect(screen.getByText('Garage 2 Or More')).toBeInTheDocument();
        });

        it('renders one pill per feature', () => {
            renderPills({
                features: ['fireplace', 'hardwood_floors', 'dishwasher'],
            });
            expect(screen.getAllByRole('row')).toHaveLength(3);
        });

        it('renders multiple pill types simultaneously', () => {
            renderPills({
                location: 'Denver, CO',
                minBeds: 3,
                features: ['garage_1_or_more'],
            });
            expect(screen.getByText('Denver, CO')).toBeInTheDocument();
            expect(screen.getByText('3+ Beds')).toBeInTheDocument();
            expect(screen.getByText('Garage 1 Or More')).toBeInTheDocument();
        });
    });

    describe('onRemove', () => {
        it('calls onRemove with location cleared when location pill is removed', async () => {
            const onRemove = vi.fn();
            renderPills({ location: 'Austin, TX', minBeds: 2 }, onRemove);
            await userEvent.click(
                screen.getAllByRole('button', { name: /Remove this tag/ })[0],
            );
            expect(onRemove).toHaveBeenCalledOnce();
            const updated = onRemove.mock.calls[0][0];
            expect(updated.location).toBeNull();
            expect(updated.minBeds).toBe(2);
        });

        it('calls onRemove with minBeds cleared when beds pill is removed', async () => {
            const onRemove = vi.fn();
            renderPills({ minBeds: 3 }, onRemove);
            await userEvent.click(
                screen.getByRole('button', { name: /Remove this tag/ }),
            );
            expect(onRemove).toHaveBeenCalledOnce();
            expect(onRemove.mock.calls[0][0].minBeds).toBeNull();
        });

        it('clears both minBeds and maxBeds when range pill is removed', async () => {
            const onRemove = vi.fn();
            renderPills({ minBeds: 2, maxBeds: 4 }, onRemove);
            await userEvent.click(
                screen.getByRole('button', { name: /Remove this tag/ }),
            );
            const updated = onRemove.mock.calls[0][0];
            expect(updated.minBeds).toBeNull();
            expect(updated.maxBeds).toBeNull();
        });

        it('calls onRemove with price cleared when price pill is removed', async () => {
            const onRemove = vi.fn();
            renderPills({ minPrice: 400000, maxPrice: 900000 }, onRemove);
            await userEvent.click(
                screen.getByRole('button', { name: /Remove this tag/ }),
            );
            const updated = onRemove.mock.calls[0][0];
            expect(updated.minPrice).toBeNull();
            expect(updated.maxPrice).toBeNull();
        });

        it('removes only the clicked feature and preserves others', async () => {
            const onRemove = vi.fn();
            renderPills({ features: ['fireplace', 'dishwasher'] }, onRemove);
            await userEvent.click(
                screen.getAllByRole('button', { name: /Remove this tag/ })[0],
            );
            expect(onRemove).toHaveBeenCalledOnce();
            expect(onRemove.mock.calls[0][0].features).toEqual(['dishwasher']);
        });

        it('preserves unrelated filters when removing a pill', async () => {
            const onRemove = vi.fn();
            renderPills(
                { minBeds: 2, maxPrice: 700000, location: 'Austin, TX' },
                onRemove,
            );
            const removeButtons = screen.getAllByRole('button', {
                name: /Remove this tag/,
            });
            await userEvent.click(removeButtons[0]);
            const updated = onRemove.mock.calls[0][0];
            expect(updated.maxPrice).toBe(700000);
            expect(updated.minBeds).toBe(2);
        });
    });
});
