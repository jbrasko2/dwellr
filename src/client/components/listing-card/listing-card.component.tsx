import type { Listing } from '@generated/types';
import { ArrowUpRight, Home01 } from '@untitledui/icons';
import { Fragment, type FunctionComponent } from 'react';
import { formatAddress, formatPrice } from '@/helpers/formatters';

export type ListingCardProps = {
    listing: Listing;
};

export const ListingCard: FunctionComponent<ListingCardProps> = ({
    listing,
}) => {
    const specs = [
        listing.beds != null ? `${listing.beds} bd` : null,
        listing.baths != null ? `${listing.baths} ba` : null,
        listing.sqft != null ? `${listing.sqft.toLocaleString()} sqft` : null,
    ].filter((spec): spec is string => spec !== null);

    return (
        <a
            href={listing.listingUrl ?? '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="group block overflow-hidden rounded-2xl border border-brand-900/10 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-brand-500/40 hover:shadow-[0_24px_48px_-16px_rgba(30,46,26,0.25)] dark:border-cream/10 dark:bg-brand-900"
        >
            <div className="relative aspect-[4/3] overflow-hidden bg-brand-50 dark:bg-brand-950">
                {listing.imageUrl ? (
                    <img
                        src={listing.imageUrl}
                        alt={formatAddress(listing.address)}
                        className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-brand-900/30 dark:text-cream/30">
                        <Home01 aria-hidden="true" className="size-6" />
                        <span className="text-xs font-medium tracking-[0.2em] uppercase">
                            No photo
                        </span>
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-950/25 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </div>
            <div className="p-5">
                <div className="flex items-baseline justify-between gap-2">
                    <p className="font-display text-xl font-semibold text-brand-900 dark:text-cream">
                        {formatPrice(listing.price)}
                    </p>
                    <ArrowUpRight
                        aria-hidden="true"
                        className="size-4 shrink-0 text-brand-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    />
                </div>
                <p className="mt-1 truncate text-sm text-brand-900/55 dark:text-cream/55">
                    {formatAddress(listing.address)}
                </p>
                {specs.length > 0 && (
                    <div className="mt-3 flex items-center gap-2.5 border-t border-brand-900/10 pt-3 text-sm text-brand-800 dark:border-cream/10 dark:text-cream/80">
                        {specs.map((spec, i) => (
                            <Fragment key={spec}>
                                {i > 0 && (
                                    <span
                                        aria-hidden="true"
                                        className="size-1 rounded-full bg-sand"
                                    />
                                )}
                                <span>{spec}</span>
                            </Fragment>
                        ))}
                    </div>
                )}
            </div>
        </a>
    );
};
