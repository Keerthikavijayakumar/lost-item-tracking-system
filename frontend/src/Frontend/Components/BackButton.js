'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

export default function BackButton({ style = {}, variant = 'default' }) {
    const router = useRouter();

    if (variant === 'minimal') {
        return (
            <button
                onClick={() => router.back()}
                className="back-btn minimal"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    fontWeight: '600',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    padding: '8px 0',
                    transition: 'color 0.2s',
                    ...style
                }}
            >
                <ChevronLeft size={20} /> Back
            </button>
        );
    }

    return (
        <button
            onClick={() => router.back()}
            className="back-btn"
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'white',
                border: '1px solid var(--gray-200)',
                color: 'var(--text-primary)',
                fontWeight: '600',
                padding: '8px 16px',
                borderRadius: '8px',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-sm)',
                transition: 'all 0.2s',
                marginBottom: 'var(--space-6)',
                ...style
            }}
        >
            <ChevronLeft size={18} /> Go Back
        </button>
    );
}
