import type { FunctionComponent } from 'react';
import { ListingCard } from '@/components/listing-card/listing-card.component';
import type { Listing } from '@generated/types';

export type ListingGridProps = {
    listings: Listing[];
    loading: boolean;
};

export const ListingGrid: FunctionComponent<ListingGridProps> = ({
    listings,
    loading,
}) => {
    if (loading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div
                        key={i}
                        className="rounded-xl bg-gray-100 animate-pulse aspect-video"
                    />
                ))}
            </div>
        );
    }

    if (listings.length === 0) {
        return (
            <p className="text-gray-500 text-center py-12">
                No listings found. Try adjusting your search.
            </p>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
            ))}
        </div>
    );
};
