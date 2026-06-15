import type { FunctionComponent } from 'react';
import { Link } from 'react-router-dom';

export const Header: FunctionComponent = () => {
    return (
        <header className="sticky top-0 z-40 border-b border-brand-900/10 bg-cream/80 backdrop-blur-md dark:border-cream/10 dark:bg-brand-950/80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <Link
                    to="/"
                    className="font-display text-2xl font-semibold tracking-tight text-brand-900 transition-colors hover:text-brand-600 dark:text-cream dark:hover:text-brand-200"
                >
                    <span>dwellr</span>
                    <span aria-hidden="true" className="text-brand-500">
                        .
                    </span>
                </Link>
                <p className="hidden text-xs font-medium tracking-[0.25em] text-brand-900/40 uppercase sm:block dark:text-cream/40">
                    Natural-Language Home Search
                </p>
            </div>
        </header>
    );
};
