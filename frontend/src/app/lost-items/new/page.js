'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import Navbar from '@/Frontend/Components/Navbar';
import ImageUpload from '@/Frontend/Components/ImageUpload';
import BackButton from '@/Frontend/Components/BackButton';
import { API_ROUTES } from '@/Frontend/Lib/api';
import {
    Type,
    Tag,
    Calendar,
    MapPin,
    FileText,
    Image as ImageIcon,
    Save,
    X,
    AlertCircle
} from 'lucide-react';

const CATEGORIES = [
    { value: '', label: 'Select a category' },
    { value: 'Electronics', label: 'Electronics' },
    { value: 'Books', label: 'Books' },
    { value: 'Clothing', label: 'Clothing' },
    { value: 'Accessories', label: 'Accessories' },
    { value: 'Documents', label: 'Documents' },
    { value: 'Keys', label: 'Keys' },
    { value: 'Other', label: 'Other' },
];

export default function NewLostItemPage() {
    const router = useRouter();
    const { user } = useUser();
    const [formData, setFormData] = useState({
        itemName: '',
        category: '',
        description: '',
        dateLost: '',
        lastSeenLocation: '',
        imageUrl: null,
        imagePublicId: null,
    });
    const [loading, setLoading] = useState(false);
    const [imageUploading, setImageUploading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (url, publicId) => {
        setFormData((prev) => ({ ...prev, imageUrl: url, imagePublicId: publicId }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch(API_ROUTES.LOST_ITEMS, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    userId: user?.id,
                    userEmail: user?.emailAddresses[0]?.emailAddress
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to create item');
            }

            router.push('/lost-items?success=true');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />

            <main className="container" style={{ padding: 'var(--space-8) 0' }}>
                <BackButton variant="minimal" style={{ marginBottom: '16px' }} />
                <div style={{ marginBottom: 'var(--space-8)', textAlign: 'center' }}>
                    <h1 style={{ color: 'var(--kec-blue)', fontSize: '2rem', marginBottom: '8px' }}>Report a Lost Item</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Help us help you. Provide as much detail as possible to increase chances of recovery.</p>
                </div>

                <form onSubmit={handleSubmit}>
                    {error && (
                        <div className="error-message">
                            <AlertCircle size={20} />
                            {error}
                        </div>
                    )}

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px', width: '100%' }}>

                        {/* Left Column: Core Details */}
                        <div className="card" style={{ padding: '32px', borderTop: '4px solid var(--kec-blue)', width: '100%' }}>
                            <h3 style={{ marginBottom: '24px', color: 'var(--kec-blue)', fontSize: '1.25rem', borderBottom: '1px solid var(--gray-100)', paddingBottom: '12px' }}>
                                Item Details
                            </h3>

                            <div className="form-group input-group" style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontWeight: '500' }}>
                                    <Type size={16} color="var(--kec-blue)" /> Item Name
                                </label>
                                <input
                                    type="text"
                                    name="itemName"
                                    placeholder="e.g., Blue Dell Laptop"
                                    value={formData.itemName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group input-group" style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontWeight: '500' }}>
                                    <Tag size={16} color="var(--kec-blue)" /> Category
                                </label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    required
                                >
                                    {CATEGORIES.map((cat) => (
                                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group input-group" style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontWeight: '500' }}>
                                    <Calendar size={16} color="var(--kec-blue)" /> Date Lost
                                </label>
                                <input
                                    type="date"
                                    name="dateLost"
                                    value={formData.dateLost}
                                    onChange={handleChange}
                                    max={new Date().toISOString().split('T')[0]}
                                    required
                                />
                            </div>

                            <div className="form-group input-group">
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontWeight: '500' }}>
                                    <MapPin size={16} color="var(--kec-blue)" /> Last Seen Location
                                </label>
                                <input
                                    type="text"
                                    name="lastSeenLocation"
                                    placeholder="e.g., Main Library, Room 304"
                                    value={formData.lastSeenLocation}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        {/* Right Column: Description & Image */}
                        <div className="card" style={{ padding: '32px', borderTop: '4px solid var(--kec-orange)', width: '100%' }}>
                            <h3 style={{ marginBottom: '24px', color: 'var(--kec-orange)', fontSize: '1.25rem', borderBottom: '1px solid var(--gray-100)', paddingBottom: '12px' }}>
                                Visuals & Description
                            </h3>

                            <div className="form-group input-group" style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontWeight: '500' }}>
                                    <FileText size={16} color="var(--kec-orange)" /> Description
                                </label>
                                <textarea
                                    name="description"
                                    placeholder="Provide detailed features, color, model number, scratches, etc."
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={5}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontWeight: '500' }}>
                                    <ImageIcon size={16} color="var(--kec-orange)" /> Upload Photo
                                </label>
                                <div style={{ border: '2px dashed var(--gray-200)', borderRadius: '12px', padding: '16px', background: 'var(--gray-50)' }}>
                                    <ImageUpload
                                        onImageUpload={handleImageUpload}
                                        onUploading={setImageUploading}
                                        currentImage={formData.imageUrl}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="btn"
                            style={{
                                background: 'white',
                                border: '1px solid var(--gray-300)',
                                color: 'var(--text-secondary)'
                            }}
                        >
                            <X size={18} /> Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || imageUploading}
                            className="btn btn-primary"
                            style={{
                                opacity: (loading || imageUploading) ? 0.8 : 1
                            }}
                        >
                            <Save size={18} /> {loading ? 'Posting...' : imageUploading ? 'Uploading Image...' : 'Post Lost Item'}
                        </button>
                    </div>
                </form>
            </main>
        </>
    );
}
