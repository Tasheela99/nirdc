import { useState, useEffect, useRef } from 'react';

export type AutoSaveStatus = 'idle' | 'saving' | 'saved' | 'error';

interface UseAutoSaveProps<T> {
    data: T;
    onSave: (data: T) => void;
    delay?: number;
}

export function useAutoSave<T>({ data, onSave, delay = 1500 }: UseAutoSaveProps<T>) {
    const [status, setStatus] = useState<AutoSaveStatus>('idle');
    const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
    const initialRender = useRef(true);
    const onSaveRef = useRef(onSave);

    // Keep the latest onSave callback without triggering re-runs
    useEffect(() => {
        onSaveRef.current = onSave;
    }, [onSave]);

    useEffect(() => {
        if (initialRender.current) {
            initialRender.current = false;
            return;
        }

        setStatus('saving');

        const handler = setTimeout(() => {
            try {
                onSaveRef.current(data);
                setStatus('saved');
                setLastSavedAt(new Date());
            } catch (error) {
                console.error("Auto-save failed", error);
                setStatus('error');
            }
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [data, delay]);

    return { status, lastSavedAt, setStatus, setLastSavedAt };
}
