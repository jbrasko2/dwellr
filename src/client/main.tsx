import React from 'react';
import ReactDOM from 'react-dom/client';
import '@/styles/globals.css';
import { ThemeProvider } from '@/providers/theme-provider';
import { App } from '@/App';
import { ApolloClient, HttpLink, InMemoryCache, gql } from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react';

const client = new ApolloClient({
    link: new HttpLink({
        uri: import.meta.env.VITE_GRAPHQL_URL ?? '/api/graphql',
    }),
    cache: new InMemoryCache(),
});

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ApolloProvider client={client}>
            <ThemeProvider>
                <App />
            </ThemeProvider>
        </ApolloProvider>
    </React.StrictMode>,
);
