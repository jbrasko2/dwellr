import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import '@/styles/globals.css';
import { RouteProvider } from '@/providers/router-provider';
import { ThemeProvider } from '@/providers/theme-provider';
import { App } from '@/components/App';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <BrowserRouter>
            <RouteProvider>
                <ThemeProvider>
                    <App />
                </ThemeProvider>
            </RouteProvider>
        </BrowserRouter>
    </React.StrictMode>,
);
