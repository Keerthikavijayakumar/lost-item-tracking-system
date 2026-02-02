'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { X, MapPin, Calendar, FileText, Send, AlertCircle, Smartphone, Building2, Camera, ShieldCheck } from 'lucide-react';
import ImageUpload from './ImageUpload';
import { API_ROUTES } from '@/Frontend/Lib/api';
export default function AlertOwnerForm({ item, onClose, onSuccess }) {
    const { user: currentUser } = useUser();
    const isOwner = currentUser?.id === item.ownerUserId;

    const [formData, setFormData] = useState({
        foundLocation: '',
        dateFound: new Date().toISOString().split('T')[0],
        additionalNotes: '',
        proofImageUrl: '',
        uniqueIdentifierDescription: '',
        finderPhoneNumber: '',
        finderDepartment: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch(API_ROUTES.ALERT_OWNER, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    lostItemId: item._id,
                    userId: currentUser?.id,
                    finderName: `${currentUser?.firstName || ''} ${currentUser?.lastName || ''}`.trim(),
                    finderEmail: currentUser?.emailAddresses[0]?.emailAddress,
                    ...formData,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to send alert');
            }

            onSuccess();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose} style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
        }}>
            <div className="modal" onClick={(e) => e.stopPropagation()} style={{
                background: 'white',
                borderRadius: '16px',
                width: '100%',
                maxWidth: '500px',
                maxHeight: 'calc(100vh - 40px)',
                boxShadow: 'var(--shadow-xl)',
                border: 'none',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                animation: 'slideUp 0.3s ease-out'
            }}>
                {/* Header */}
                <div className="modal-header" style={{
                    padding: '24px',
                    borderBottom: '1px solid var(--gray-100)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    background: 'var(--gray-50)'
                }}>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <div style={{
                            background: 'var(--primary-100)',
                            color: 'var(--primary-600)',
                            padding: '12px',
                            borderRadius: '12px'
                        }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.25rem', color: 'var(--kec-blue)', marginBottom: '4px' }}>Alert the Owner</h3>
                            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Found <strong>{item.itemName}</strong>?</p>
                        </div>
                    </div>
                    <button onClick={onClose} style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--text-muted)',
                        fontSize: '1.5rem',
                        padding: '4px',
                        lineHeight: 1
                    }}>×</button>
                </div>

                <div className="modal-body" style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
                    {isOwner ? (
                        <div style={{ textAlign: 'center', padding: '20px 0' }}>
                            <div style={{ background: '#fff9db', color: '#f59f00', padding: '24px', borderRadius: '12px', marginBottom: '8px', border: '1px solid #ffe066' }}>
                                <AlertCircle size={40} style={{ marginBottom: '16px' }} />
                                <h3 style={{ margin: '0 0 10px 0', fontSize: '1.2rem' }}>This is your post</h3>
                                <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: '1.5' }}>
                                    You cannot report your own item as found. If you have recovered it, please delete the post from your dashboard.
                                </p>
                            </div>
                            <button onClick={onClose} className="btn" style={{ background: 'var(--gray-200)', color: 'var(--text-primary)', border: 'none', padding: '10px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', marginTop: '16px' }}>Close</button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} id="alert-form">
                            {error && (
                                <div className="error-message" style={{ fontSize: '0.9rem', padding: '12px', marginBottom: '20px' }}>
                                    <AlertCircle size={18} /> {error}
                                </div>
                            )}

                            <div className="input-group" style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: 'var(--text-primary)' }}>
                                    <Camera size={18} style={{ verticalAlign: 'text-bottom', marginRight: '8px' }} />
                                    Proof of Possession (Required)
                                </label>
                                <ImageUpload
                                    onImageUpload={(url) => setFormData(prev => ({ ...prev, proofImageUrl: url }))}
                                    currentImage={formData.proofImageUrl}
                                />
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                                    Upload a photo of the item in your current possession.
                                </p>
                            </div>

                            <div className="input-group" style={{ marginBottom: '20px' }}>
                                <label htmlFor="foundLocation" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontWeight: '600', color: 'var(--text-primary)' }}>
                                    <MapPin size={18} /> Location Found
                                </label>
                                <input
                                    type="text"
                                    id="foundLocation"
                                    placeholder="e.g., Main Library, 2nd Floor"
                                    value={formData.foundLocation}
                                    onChange={(e) => setFormData({ ...formData, foundLocation: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="input-group" style={{ marginBottom: '20px' }}>
                                <label htmlFor="uniqueIdentifierDescription" style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: 'var(--text-primary)' }}>
                                    <ShieldCheck size={18} style={{ verticalAlign: 'text-bottom', marginRight: '8px' }} />
                                    Unique Identifier
                                </label>
                                <textarea
                                    id="uniqueIdentifierDescription"
                                    placeholder="Details only the real owner would know..."
                                    rows={3}
                                    value={formData.uniqueIdentifierDescription}
                                    onChange={(e) => setFormData({ ...formData, uniqueIdentifierDescription: e.target.value })}
                                    required
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '16px', marginBottom: '20px' }}>
                                <div className="input-group">
                                    <label htmlFor="dateFound" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontWeight: '600', color: 'var(--text-primary)' }}>
                                        <Calendar size={18} /> Date Found
                                    </label>
                                    <input
                                        type="date"
                                        id="dateFound"
                                        value={formData.dateFound}
                                        onChange={(e) => setFormData({ ...formData, dateFound: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="input-group">
                                    <label htmlFor="finderPhoneNumber" style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: 'var(--text-primary)' }}>
                                        <Smartphone size={18} style={{ verticalAlign: 'text-bottom', marginRight: '8px' }} />
                                        Phone No.
                                    </label>
                                    <input
                                        type="tel"
                                        id="finderPhoneNumber"
                                        placeholder="Phone"
                                        value={formData.finderPhoneNumber}
                                        onChange={(e) => setFormData({ ...formData, finderPhoneNumber: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="input-group" style={{ marginBottom: '20px' }}>
                                <label htmlFor="finderDepartment" style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: 'var(--text-primary)' }}>
                                    <Building2 size={18} style={{ verticalAlign: 'text-bottom', marginRight: '8px' }} />
                                    Your Department
                                </label>
                                <input
                                    type="text"
                                    id="finderDepartment"
                                    placeholder="e.g. IT, Mechanical"
                                    value={formData.finderDepartment}
                                    onChange={(e) => setFormData({ ...formData, finderDepartment: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="input-group">
                                <label htmlFor="additionalNotes" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontWeight: '600', color: 'var(--text-primary)' }}>
                                    <FileText size={18} /> Note (Optional)
                                </label>
                                <textarea
                                    id="additionalNotes"
                                    placeholder="Additional info..."
                                    rows={2}
                                    value={formData.additionalNotes}
                                    onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
                                />
                            </div>
                        </form>
                    )}
                </div>

                {!isOwner && (
                    <div className="modal-footer" style={{
                        padding: '20px 24px',
                        borderTop: '1px solid var(--gray-100)',
                        background: 'var(--gray-50)',
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: '12px'
                    }}>
                        <button type="button" className="btn" onClick={onClose} style={{
                            background: 'white',
                            border: '1px solid var(--gray-300)',
                            color: 'var(--text-primary)'
                        }}>
                            Cancel
                        </button>
                        <button type="submit" form="alert-form" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Sending...' : (
                                <>
                                    <Send size={18} /> Notify Owner
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
