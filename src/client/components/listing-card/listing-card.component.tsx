import { formatAddress, formatPrice } from '@/helpers/formatters';
import type { Listing } from '@generated/types';
import type { FunctionComponent } from 'react';

export type ListingCardProps = {
    listing: Listing;
};

export const ListingCard: FunctionComponent<ListingCardProps> = ({
    listing,
}) => {
    return (
        <a
            href={listing.listingUrl ?? '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="group block bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
        >
            <div className="aspect-video bg-gray-100 overflow-hidden">
                {listing.imageUrl ? (
                    <img
                        src={listing.imageUrl}
                        alt={formatAddress(listing.address)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                        No photo
                    </div>
                )}
            </div>
            <div className="p-4">
                <p className="text-lg font-semibold text-gray-900">
                    {formatPrice(listing.price)}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                    {formatAddress(listing.address)}
                </p>
                <div className="flex gap-3 mt-2 text-sm text-gray-600">
                    {listing.beds != null && <span>{listing.beds} bd</span>}
                    {listing.baths != null && <span>{listing.baths} ba</span>}
                    {listing.sqft != null && (
                        <span>{listing.sqft.toLocaleString()} sqft</span>
                    )}
                </div>
            </div>
        </a>
    );
};
