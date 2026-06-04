import { ArrowLeft, ArrowRight } from '@untitledui/icons';
import { type FunctionComponent } from 'react';
import { Button } from '@/components/base/buttons/button';

export type PaginationProps = {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
};

export const Pagination: FunctionComponent<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
}) => {
    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-center gap-1">
            <Button
                color="secondary"
                size="sm"
                iconLeading={ArrowLeft}
                isDisabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
                aria-label="Previous page"
            />

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                    key={page}
                    color={page === currentPage ? 'primary' : 'tertiary'}
                    size="sm"
                    onClick={() => onPageChange(page)}
                    aria-label={`Page ${page}`}
                    aria-current={page === currentPage ? 'page' : undefined}
                >
                    {page}
                </Button>
            ))}

            <Button
                color="secondary"
                size="sm"
                iconLeading={ArrowRight}
                isDisabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                aria-label="Next page"
            />
        </div>
    );
};
