import { type PropsWithChildren } from 'react';
import { RouterProvider } from 'react-aria-components';
import { useHref, useNavigate } from 'react-router-dom';
import type { NavigateOptions } from 'react-router-dom';

declare module 'react-aria-components' {
    interface RouterConfig {
        routerOptions: NavigateOptions;
    }
}

export const RouteProvider = ({ children }: PropsWithChildren) => {
    const navigate = useNavigate();

    return (
        <RouterProvider navigate={navigate} useHref={useHref}>
            {children}
        </RouterProvider>
    );
};
