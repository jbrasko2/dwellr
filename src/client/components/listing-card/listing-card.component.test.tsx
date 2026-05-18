import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { Listing } from '../../../generated/types';
import { ListingCard } from './listing-card.component';

const baseListing: Listing = {
    id: '1',
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
    imageUrl: 'https://example.com/photo.jpg',
    listingUrl: 'https://example.com/listing/1',
};

describe('ListingCard', () => {
    it('renders the formatted price', () => {
        render(<ListingCard listing={baseListing} />);
        expect(screen.getByText('$450,000')).toBeInTheDocument();
    });

    it('renders the formatted address', () => {
        render(<ListingCard listing={baseListing} />);
        expect(
            screen.getByText('123 Main St, Austin, TX, 78701'),
        ).toBeInTheDocument();
    });

    it('renders beds, baths, and sqft', () => {
        render(<ListingCard listing={baseListing} />);
        expect(screen.getByText('3 bd')).toBeInTheDocument();
        expect(screen.getByText('2 ba')).toBeInTheDocument();
        expect(screen.getByText('1,800 sqft')).toBeInTheDocument();
    });

    it('links to the listing URL', () => {
        render(<ListingCard listing={baseListing} />);
        expect(screen.getByRole('link')).toHaveAttribute(
            'href',
            'https://example.com/listing/1',
        );
    });

    it('falls back to # when listingUrl is null', () => {
        render(<ListingCard listing={{ ...baseListing, listingUrl: null }} />);
        expect(screen.getByRole('link')).toHaveAttribute('href', '#');
    });

    it('renders the image when imageUrl is provided', () => {
        render(<ListingCard listing={baseListing} />);
        const img = screen.getByRole('img');
        expect(img).toHaveAttribute('src', 'https://example.com/photo.jpg');
        expect(img).toHaveAttribute('alt', '123 Main St, Austin, TX, 78701');
    });

    it('shows "No photo" placeholder when imageUrl is null', () => {
        render(<ListingCard listing={{ ...baseListing, imageUrl: null }} />);
        expect(screen.getByText('No photo')).toBeInTheDocument();
        expect(screen.queryByRole('img')).not.toBeInTheDocument();
    });

    it('omits beds when null', () => {
        render(<ListingCard listing={{ ...baseListing, beds: null }} />);
        expect(screen.queryByText(/bd/)).not.toBeInTheDocument();
    });

    it('omits baths when null', () => {
        render(<ListingCard listing={{ ...baseListing, baths: null }} />);
        expect(screen.queryByText(/ba/)).not.toBeInTheDocument();
    });

    it('omits sqft when null', () => {
        render(<ListingCard listing={{ ...baseListing, sqft: null }} />);
        expect(screen.queryByText(/sqft/)).not.toBeInTheDocument();
    });

    it('opens the link in a new tab', () => {
        render(<ListingCard listing={baseListing} />);
        expect(screen.getByRole('link')).toHaveAttribute('target', '_blank');
        expect(screen.getByRole('link')).toHaveAttribute(
            'rel',
            'noopener noreferrer',
        );
    });
});
