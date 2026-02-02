'use client';

import { useState, useRef } from 'react';

export default function ImageUpload({ onImageUpload, currentImage }) {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(currentImage || null);
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setError('Please select an image file');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError('Image must be less than 5MB');
            return;
        }

        setError('');
        setUploading(true);

        // Show preview
        const reader = new FileReader();
        reader.onload = (e) => setPreview(e.target.result);
        reader.readAsDataURL(file);

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('/Api/Upload', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Upload failed');
            }

            onImageUpload(data.url, data.publicId);
        } catch (err) {
            setError(err.message);
            setPreview(null);
        } finally {
            setUploading(false);
        }
    };

    const handleRemove = () => {
        setPreview(null);
        onImageUpload(null, null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div>
            <div
                className="image-upload"
                onClick={() => !uploading && fileInputRef.current?.click()}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={uploading}
                />

                {preview ? (
                    <img src={preview} alt="Preview" className="image-upload-preview" />
                ) : (
                    <div className="image-upload-content">
                        <div className="image-upload-icon">
                            {uploading ? '⏳' : '📷'}
                        </div>
                        <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
                            {uploading ? 'Uploading...' : 'Click to upload an image'}
                        </p>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            Optional • Max 5MB
                        </p>
                    </div>
                )}
            </div>

            {error && (
                <p style={{ color: 'var(--error)', fontSize: '0.85rem', marginTop: 'var(--space-2)' }}>
                    {error}
                </p>
            )}

            {preview && !uploading && (
                <button
                    type="button"
                    className="btn btn-secondary btn-sm mt-4"
                    onClick={handleRemove}
                    style={{ width: '100%' }}
                >
                    Remove Image
                </button>
            )}
        </div>
    );
}
