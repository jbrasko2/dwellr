import type { Listing } from '@generated/types';
import { SearchLg } from '@untitledui/icons';
import type { FunctionComponent } from 'react';
import { ListingCard } from '@/components/listing-card/listing-card.component';

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
                        className="animate-pulse overflow-hidden rounded-2xl border border-brand-900/10 bg-white dark:border-cream/10 dark:bg-brand-900"
                    >
                        <div className="aspect-[4/3] bg-brand-100 dark:bg-brand-800" />
                        <div className="space-y-2.5 p-5">
                            <div className="h-5 w-24 rounded-md bg-brand-100 dark:bg-brand-800" />
                            <div className="h-3.5 w-3/4 rounded-md bg-brand-50 dark:bg-brand-800/60" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (listings.length === 0) {
        return (
            <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-brand-900/15 bg-white/50 px-6 py-16 text-center dark:border-cream/15 dark:bg-brand-900/40">
                <SearchLg
                    aria-hidden="true"
                    className="size-6 text-brand-400"
                />
                <p className="font-display text-lg text-brand-900 dark:text-cream">
                    No listings found. Try adjusting your search.
                </p>
                <p className="text-sm text-brand-900/50 dark:text-cream/50">
                    Loosen a filter or two — or describe the home differently.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing, i) => (
                <div
                    key={listing.id}
                    className="animate-rise"
                    style={{ animationDelay: `${Math.min(i, 11) * 60}ms` }}
                >
                    <ListingCard listing={listing} />
                </div>
            ))}
        </div>
    );
};
