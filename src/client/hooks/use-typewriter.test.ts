import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useTypewriter } from '@/hooks/use-typewriter';

describe('useTypewriter', () => {
    beforeEach(() => vi.useFakeTimers());
    afterEach(() => vi.useRealTimers());

    it('starts with an empty string and done=false', () => {
        const { result } = renderHook(() => useTypewriter('hello', 50));
        expect(result.current.displayed).toBe('');
        expect(result.current.done).toBe(false);
    });

    it('types characters one at a time at the given speed', async () => {
        const { result } = renderHook(() => useTypewriter('hi', 100));

        await act(async () => {
            vi.advanceTimersByTime(100);
        });
        expect(result.current.displayed).toBe('h');

        await act(async () => {
            vi.advanceTimersByTime(100);
        });
        expect(result.current.displayed).toBe('hi');
    });

    it('sets done=true once the full string is typed', async () => {
        const { result } = renderHook(() => useTypewriter('hi', 100));

        await act(async () => {
            vi.advanceTimersByTime(200);
        });
        expect(result.current.displayed).toBe('hi');
        expect(result.current.done).toBe(true);
    });

    it('respects the delay before starting', async () => {
        const { result } = renderHook(() => useTypewriter('hi', 100, 500));

        await act(async () => {
            vi.advanceTimersByTime(400);
        });
        expect(result.current.displayed).toBe('');

        await act(async () => {
            vi.advanceTimersByTime(200);
        });
        expect(result.current.displayed).toBe('h');
    });

    it('does not type past the full string length', async () => {
        const { result } = renderHook(() => useTypewriter('ab', 100));

        await act(async () => {
            vi.advanceTimersByTime(1000);
        });
        expect(result.current.displayed).toBe('ab');
        expect(result.current.done).toBe(true);
    });
});
