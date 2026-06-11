import { useEffect, useState } from 'react';

export function useTypewriter(text: string, speedMs: number, delayMs = 0) {
    const [displayed, setDisplayed] = useState('');
    const [done, setDone] = useState(false);

    useEffect(() => {
        let i = 0;
        let intervalId: ReturnType<typeof setInterval>;

        const startId = setTimeout(() => {
            intervalId = setInterval(() => {
                i += 1;
                setDisplayed(text.slice(0, i));
                if (i >= text.length) {
                    clearInterval(intervalId);
                    setDone(true);
                }
            }, speedMs);
        }, delayMs);

        return () => {
            clearTimeout(startId);
            clearInterval(intervalId);
        };
    }, [text, speedMs, delayMs]);

    return { displayed, done };
}
