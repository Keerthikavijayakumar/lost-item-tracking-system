'use client';

import {
    MapPin,
    Calendar,
    Smartphone,
    Book,
    Shirt,
    Watch,
    FileText,
    Key,
    HelpCircle,
    Package,
    BellRing,
    UserCircle2,
    CheckCircle2
} from 'lucide-react';
import { useUser } from '@clerk/nextjs';

export default function LostItemCard({ item, onAlertClick }) {
    const { user: currentUser } = useUser();
    const isOwner = currentUser?.id === item.ownerUserId;

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const getCategoryIcon = (category, size = 16) => {
        const props = { size, className: "text-current" };
        switch (category) {
            case 'Electronics': return <Smartphone {...props} />;
            case 'Books': return <Book {...props} />;
            case 'Clothing': return <Shirt {...props} />;
            case 'Accessories': return <Watch {...props} />;
            case 'Documents': return <FileText {...props} />;
            case 'Keys': return <Key {...props} />;
            case 'Other':
            default: return <HelpCircle {...props} />;
        }
    };

    return (
        <div className="card item-card" style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            border: '1px solid var(--gray-200)',
            boxShadow: 'var(--shadow-md)',
            background: 'white',
            borderRadius: '4px' // Square off corners slightly to match blog card style
        }}>
            {/* Image Section */}
            <div className="item-card-image" style={{
                height: '240px',
                width: '100%',
                position: 'relative',
                overflow: 'hidden',
                borderBottom: '1px solid var(--gray-100)'
            }}>
                {item.imageUrl ? (
                    <img
                        src={item.imageUrl}
                        alt={item.itemName}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                ) : (
                    <div style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'var(--gray-50)',
                        color: 'var(--kec-blue)'
                    }}>
                        {getCategoryIcon(item.category, 64)}
                    </div>
                )}

                {/* Category Badge - Overlaid like in the reference or just top right */}
                <div style={{
                    position: 'absolute',
                    top: '16px',
                    left: '16px',
                    background: '#FFD700', // Yellowish background like reference
                    color: '#000',
                    padding: '4px 12px',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                }}>
                    {getCategoryIcon(item.category, 12)}
                    {item.category.toUpperCase()}
                </div>

                {/* Owner Badge */}
                {isOwner && (
                    <div style={{
                        position: 'absolute',
                        top: '16px',
                        right: '16px',
                        background: 'rgba(37, 99, 235, 0.9)',
                        color: 'white',
                        padding: '4px 10px',
                        borderRadius: '4px',
                        fontSize: '0.7rem',
                        fontWeight: '700',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        backdropFilter: 'blur(4px)',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}>
                        <CheckCircle2 size={12} /> MY POST
                    </div>
                )}
            </div>

            {/* Content Section */}
            <div className="item-card-content" style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>

                <h3 className="item-card-title" style={{
                    fontSize: '1.25rem',
                    fontWeight: '700',
                    color: 'var(--text-primary)',
                    marginBottom: '12px',
                    lineHeight: '1.4'
                }}>
                    {item.itemName}
                </h3>

                {/* Author / Date Meta */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    fontSize: '0.85rem',
                    color: 'var(--text-muted)',
                    marginBottom: '16px',
                    fontWeight: '500'
                }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <UserCircle2 size={16} /> By Student
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Calendar size={16} /> {formatDate(item.dateLost)}
                    </span>
                </div>

                <p className="item-card-description" style={{
                    color: 'var(--text-secondary)',
                    fontSize: '0.95rem',
                    lineHeight: '1.6',
                    marginBottom: '24px',
                    flex: 1
                }}>
                    {item.description.length > 120 ? item.description.substring(0, 120) + '...' : item.description}
                </p>

                {/* Footer Actions */}
                <div style={{ marginTop: 'auto' }}>
                    <button
                        onClick={() => onAlertClick(item)}
                        style={{
                            background: 'white',
                            border: '1px solid var(--gray-300)',
                            color: 'var(--text-primary)',
                            padding: '10px 20px',
                            fontWeight: '600',
                            fontSize: '0.9rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            width: '100%'
                        }}
                        onMouseOver={(e) => {
                            e.target.style.background = 'var(--text-primary)';
                            e.target.style.color = 'white';
                            e.target.style.borderColor = 'var(--text-primary)';
                        }}
                        onMouseOut={(e) => {
                            e.target.style.background = 'white';
                            e.target.style.color = 'var(--text-primary)';
                            e.target.style.borderColor = 'var(--gray-300)';
                        }}
                    >
                        Notify Owner
                    </button>

                    {/* Location Tag */}
                    <div style={{ marginTop: '16px', fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <MapPin size={14} /> {item.lastSeenLocation}
                    </div>
                </div>
            </div>
        </div>
    );
}
