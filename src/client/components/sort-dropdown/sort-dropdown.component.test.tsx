import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { SortDropdown } from '@/components/sort-dropdown/sort-dropdown.component';

describe('SortDropdown', () => {
    it('renders a combobox with "Sort by" as the default label', () => {
        render(<SortDropdown value={null} onChange={vi.fn()} />);
        expect(screen.getByRole('combobox')).toBeInTheDocument();
        expect(
            screen.getByRole('option', { name: 'Sort by' }),
        ).toBeInTheDocument();
    });

    it('renders all 8 sort options plus the default', () => {
        render(<SortDropdown value={null} onChange={vi.fn()} />);
        expect(screen.getAllByRole('option')).toHaveLength(9);
    });

    it('shows the placeholder "Sort by" selected when value is null', () => {
        render(<SortDropdown value={null} onChange={vi.fn()} />);
        expect(screen.getByRole('combobox')).toHaveValue('');
    });

    it('reflects the controlled value when set', () => {
        render(<SortDropdown value="price_asc" onChange={vi.fn()} />);
        expect(screen.getByRole('combobox')).toHaveValue('price_asc');
    });

    it('calls onChange with the selected SortKey', async () => {
        const onChange = vi.fn();
        render(<SortDropdown value={null} onChange={onChange} />);

        await userEvent.selectOptions(
            screen.getByRole('combobox'),
            'price_desc',
        );

        expect(onChange).toHaveBeenCalledOnce();
        expect(onChange).toHaveBeenCalledWith('price_desc');
    });

    it('calls onChange with null when the placeholder option is re-selected', async () => {
        const onChange = vi.fn();
        render(<SortDropdown value="beds_desc" onChange={onChange} />);

        await userEvent.selectOptions(screen.getByRole('combobox'), '');

        expect(onChange).toHaveBeenCalledOnce();
        expect(onChange).toHaveBeenCalledWith(null);
    });

    it.each([
        ['price_asc', 'Price: Low to High'],
        ['price_desc', 'Price: High to Low'],
        ['beds_asc', 'Beds: Fewest First'],
        ['beds_desc', 'Beds: Most First'],
        ['baths_asc', 'Baths: Fewest First'],
        ['baths_desc', 'Baths: Most First'],
        ['sqft_asc', 'Sq Ft: Smallest First'],
        ['sqft_desc', 'Sq Ft: Largest First'],
    ] as const)('renders the option "%s" with label "%s"', (value, label) => {
        render(<SortDropdown value={null} onChange={vi.fn()} />);
        expect(screen.getByRole('option', { name: label })).toHaveValue(value);
    });
});
