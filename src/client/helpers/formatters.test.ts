import { formatAddress, formatPrice } from '@/helpers/formatters';
import { describe, expect, it } from 'vitest';

describe('formatPrice', () => {
    it('formats a whole dollar amount with commas and no cents', () => {
        expect(formatPrice(450000)).toBe('$450,000');
    });

    it('formats a small amount', () => {
        expect(formatPrice(1000)).toBe('$1,000');
    });

    it('formats zero', () => {
        expect(formatPrice(0)).toBe('$0');
    });

    it('rounds fractional cents', () => {
        expect(formatPrice(250500.99)).toBe('$250,501');
    });
});

describe('formatAddress', () => {
    it('joins all parts with commas', () => {
        expect(
            formatAddress({
                street: '123 Main St',
                city: 'Austin',
                state: 'TX',
                zip: '78701',
            }),
        ).toBe('123 Main St, Austin, TX, 78701');
    });

    it('omits null parts', () => {
        expect(
            formatAddress({
                street: '123 Main St',
                city: null,
                state: 'TX',
                zip: null,
            }),
        ).toBe('123 Main St, TX');
    });

    it('returns empty string when all parts are null', () => {
        expect(
            formatAddress({
                street: null,
                city: null,
                state: null,
                zip: null,
            }),
        ).toBe('');
    });
});
