import type { FunctionComponent, ReactNode } from 'react';

export type PageWrapperProps = {
    children: ReactNode;
};

export const PageWrapper: FunctionComponent<PageWrapperProps> = ({
    children,
}) => {
    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
        </main>
    );
};
