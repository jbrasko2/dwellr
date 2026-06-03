import type { ListingAddress } from '@generated/types';

export function formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
    }).format(price);
}

export function formatAddress(address: ListingAddress): string {
    return [address.street, address.city, address.state, address.zip]
        .filter(Boolean)
        .join(', ');
}
