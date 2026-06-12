import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PageWrapper } from '@/components/layout/page-wrapper.component';

describe('PageWrapper', () => {
    it('renders children', () => {
        render(<PageWrapper>hello dwellr</PageWrapper>);
        expect(screen.getByText('hello dwellr')).toBeInTheDocument();
    });
});
