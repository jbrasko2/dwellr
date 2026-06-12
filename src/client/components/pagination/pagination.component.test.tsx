import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Pagination } from '@/components/pagination/pagination.component';

describe('Pagination', () => {
    describe('when totalPages is 1 or less', () => {
        it('renders nothing when totalPages is 1', () => {
            const { container } = render(
                <Pagination
                    currentPage={1}
                    totalPages={1}
                    onPageChange={vi.fn()}
                />,
            );
            expect(container).toBeEmptyDOMElement();
        });

        it('renders nothing when totalPages is 0', () => {
            const { container } = render(
                <Pagination
                    currentPage={1}
                    totalPages={0}
                    onPageChange={vi.fn()}
                />,
            );
            expect(container).toBeEmptyDOMElement();
        });
    });

    describe('when totalPages is greater than 1', () => {
        it('renders a Previous and Next button', () => {
            render(
                <Pagination
                    currentPage={2}
                    totalPages={4}
                    onPageChange={vi.fn()}
                />,
            );
            expect(
                screen.getByRole('button', { name: 'Previous page' }),
            ).toBeInTheDocument();
            expect(
                screen.getByRole('button', { name: 'Next page' }),
            ).toBeInTheDocument();
        });

        it('renders a button for each page', () => {
            render(
                <Pagination
                    currentPage={1}
                    totalPages={4}
                    onPageChange={vi.fn()}
                />,
            );
            expect(
                screen.getByRole('button', { name: 'Page 1' }),
            ).toBeInTheDocument();
            expect(
                screen.getByRole('button', { name: 'Page 2' }),
            ).toBeInTheDocument();
            expect(
                screen.getByRole('button', { name: 'Page 3' }),
            ).toBeInTheDocument();
            expect(
                screen.getByRole('button', { name: 'Page 4' }),
            ).toBeInTheDocument();
        });

        it('marks the current page button with aria-current="page"', () => {
            render(
                <Pagination
                    currentPage={2}
                    totalPages={4}
                    onPageChange={vi.fn()}
                />,
            );
            expect(
                screen.getByRole('button', { name: 'Page 2' }),
            ).toHaveAttribute('aria-current', 'page');
            expect(
                screen.getByRole('button', { name: 'Page 1' }),
            ).not.toHaveAttribute('aria-current');
        });

        it('disables the Previous button on the first page', () => {
            render(
                <Pagination
                    currentPage={1}
                    totalPages={4}
                    onPageChange={vi.fn()}
                />,
            );
            expect(
                screen.getByRole('button', { name: 'Previous page' }),
            ).toBeDisabled();
            expect(
                screen.getByRole('button', { name: 'Next page' }),
            ).toBeEnabled();
        });

        it('disables the Next button on the last page', () => {
            render(
                <Pagination
                    currentPage={4}
                    totalPages={4}
                    onPageChange={vi.fn()}
                />,
            );
            expect(
                screen.getByRole('button', { name: 'Next page' }),
            ).toBeDisabled();
            expect(
                screen.getByRole('button', { name: 'Previous page' }),
            ).toBeEnabled();
        });

        it('calls onPageChange with the next page when Next is clicked', async () => {
            const onPageChange = vi.fn();
            render(
                <Pagination
                    currentPage={2}
                    totalPages={4}
                    onPageChange={onPageChange}
                />,
            );
            await userEvent.click(
                screen.getByRole('button', { name: 'Next page' }),
            );
            expect(onPageChange).toHaveBeenCalledOnce();
            expect(onPageChange).toHaveBeenCalledWith(3);
        });

        it('calls onPageChange with the previous page when Previous is clicked', async () => {
            const onPageChange = vi.fn();
            render(
                <Pagination
                    currentPage={3}
                    totalPages={4}
                    onPageChange={onPageChange}
                />,
            );
            await userEvent.click(
                screen.getByRole('button', { name: 'Previous page' }),
            );
            expect(onPageChange).toHaveBeenCalledOnce();
            expect(onPageChange).toHaveBeenCalledWith(2);
        });

        it('calls onPageChange with the correct page when a page button is clicked', async () => {
            const onPageChange = vi.fn();
            render(
                <Pagination
                    currentPage={1}
                    totalPages={4}
                    onPageChange={onPageChange}
                />,
            );
            await userEvent.click(
                screen.getByRole('button', { name: 'Page 3' }),
            );
            expect(onPageChange).toHaveBeenCalledOnce();
            expect(onPageChange).toHaveBeenCalledWith(3);
        });
    });
});
