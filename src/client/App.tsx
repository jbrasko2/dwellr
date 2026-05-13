import { HomePage } from '@/pages/home.page';
import { type FunctionComponent } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

export const App: FunctionComponent = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
            </Routes>
        </BrowserRouter>
    );
};
