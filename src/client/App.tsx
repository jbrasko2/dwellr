import { HomePage } from '@/pages/home/home.page';
import { ResultsPage } from '@/pages/results/results.page';
import { type FunctionComponent } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

export const App: FunctionComponent = () => {
    return (
        <BrowserRouter>
            <div className="min-h-screen bg-cream">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/results" element={<ResultsPage />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
};
