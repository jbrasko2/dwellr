import type { FunctionComponent } from 'react';
import { Link } from 'react-router-dom';

export const Header: FunctionComponent = () => {
    return (
        <header className="border-b border-gray-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
                <Link
                    to="/"
                    className="text-2xl font-bold text-brand-700"
                >
                    dwellr
                </Link>
            </div>
        </header>
    );
};
