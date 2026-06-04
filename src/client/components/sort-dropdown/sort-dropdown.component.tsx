import { ChevronDown } from '@untitledui/icons';
import { type FunctionComponent } from 'react';
import { cx } from '@/utils/cx';

export type SortKey =
    | 'price_asc'
    | 'price_desc'
    | 'beds_asc'
    | 'beds_desc'
    | 'baths_asc'
    | 'baths_desc'
    | 'sqft_asc'
    | 'sqft_desc';

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'beds_asc', label: 'Beds: Fewest First' },
    { value: 'beds_desc', label: 'Beds: Most First' },
    { value: 'baths_asc', label: 'Baths: Fewest First' },
    { value: 'baths_desc', label: 'Baths: Most First' },
    { value: 'sqft_asc', label: 'Sq Ft: Smallest First' },
    { value: 'sqft_desc', label: 'Sq Ft: Largest First' },
];

export type SortDropdownProps = {
    value: SortKey | null;
    onChange: (value: SortKey | null) => void;
};

export const SortDropdown: FunctionComponent<SortDropdownProps> = ({
    value,
    onChange,
}) => {
    const isSortKey = (v: string): v is SortKey =>
        SORT_OPTIONS.some((opt) => opt.value === v);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selected = e.target.value;
        onChange(isSortKey(selected) ? selected : null);
    };

    return (
        <div className="relative inline-flex items-center">
            <select
                value={value ?? ''}
                onChange={handleChange}
                className={cx(
                    'appearance-none cursor-pointer rounded-lg bg-primary shadow-xs ring-1 ring-primary ring-inset',
                    'py-2 pl-3 pr-9 text-sm text-primary',
                    'transition-shadow duration-100 ease-linear',
                    'hover:ring-2 hover:ring-brand',
                    'focus:outline-none focus:ring-2 focus:ring-brand',
                )}
            >
                <option value="">Sort by</option>
                {SORT_OPTIONS.map(({ value: optVal, label }) => (
                    <option key={optVal} value={optVal}>
                        {label}
                    </option>
                ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 size-4 text-fg-quaternary stroke-[2.25px]" />
        </div>
    );
};
