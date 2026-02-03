'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default function BackButton({ style = {}, variant = 'default', href = null }) {
    const router = useRouter();

    const handleClick = (e) => {
        if (!href) {
            e.preventDefault();
            router.back();
        }
    };

    const ButtonContent = () => (
        <>
            <ChevronLeft size={variant === 'minimal' ? 20 : 18} />
            {variant === 'minimal' ? 'Back' : 'Go Back'}
        </>
    );

    const buttonStyle = variant === 'minimal' ? {
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
        textDecoration: 'none',
        ...style
    } : {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        width: 'fit-content',
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
        textDecoration: 'none',
        ...style
    };

    if (href) {
        return (
            <Link href={href} className={`back-btn ${variant}`} style={buttonStyle}>
                <ButtonContent />
            </Link>
        );
    }

    return (
        <button
            onClick={handleClick}
            className={`back-btn ${variant}`}
            style={buttonStyle}
        >
            <ButtonContent />
        </button>
    );
}
