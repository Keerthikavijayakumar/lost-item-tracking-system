'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/Frontend/Components/Navbar';
import LostItemCard from '@/Frontend/Components/LostItemCard';
import AlertOwnerForm from '@/Frontend/Components/AlertOwnerForm';
import BackButton from '@/Frontend/Components/BackButton';
import { API_ROUTES } from '@/Frontend/Lib/api';
import { Search, Tablet, Smartphone, Book, Shirt, Briefcase, FileText, Key, Package, Inbox, CheckCircle } from 'lucide-react';

const CATEGORIES = [
    { value: 'all', label: 'All Categories' },
    { value: 'Electronics', label: 'Electronics' },
    { value: 'Books', label: 'Books' },
    { value: 'Clothing', label: 'Clothing' },
    { value: 'Accessories', label: 'Accessories' },
    { value: 'Documents', label: 'Documents' },
    { value: 'Keys', label: 'Keys' },
    { value: 'Other', label: 'Other' },
];

export default function LostItemsFeedPage() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('all');
    const [sort, setSort] = useState('newest');
    const [dateFilter, setDateFilter] = useState('');
    const [selectedItem, setSelectedItem] = useState(null);
    const [toast, setToast] = useState(null);

    useEffect(() => {
        fetchItems();
    }, [category, sort, dateFilter]);

    const fetchItems = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (category !== 'all') params.append('category', category);
            if (search) params.append('search', search);
            if (dateFilter) params.append('date', dateFilter);
            params.append('sort', sort);

            const response = await fetch(`${API_ROUTES.LOST_ITEMS}?${params.toString()}`);
            const data = await response.json();

            if (response.ok) {
                setItems(data.items);
            }
        } catch (error) {
            console.error('Error fetching items:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchItems();
    };

    const handleAlertSuccess = () => {
        setSelectedItem(null);
        setToast({ type: 'success', message: 'Alert sent successfully! The owner has been notified.' });
        fetchItems(); // Refresh to remove the item from the list

        setTimeout(() => setToast(null), 5000);
    };

    return (
        <>
            <Navbar />

            <main className="container" style={{ padding: 'var(--space-8) var(--space-4)' }}>
                {/* Header Section */}
                <div className="stack-mobile" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', gap: '20px', borderBottom: '2px solid var(--gray-100)', paddingBottom: '24px' }}>
                    <div style={{ textAlign: 'left' }}>
                        <BackButton variant="minimal" style={{ marginBottom: '12px' }} />
                        <h1 style={{ color: 'var(--kec-blue)', fontSize: '2rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '12px', margin: 0, letterSpacing: '-0.5px' }}>
                            <Search size={32} /> Lost Items Feed
                        </h1>
                        <p style={{ color: 'var(--text-secondary)', marginTop: '6px', fontSize: '1rem', fontWeight: '500' }}>Browse items reported as lost on campus</p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '12px 24px', background: 'var(--gray-50)', borderRadius: '12px', border: '1px solid var(--gray-200)', width: 'fit-content' }}>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--kec-blue)', lineHeight: '1' }}>{items.length}</div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '700', marginTop: '4px', letterSpacing: '0.5px' }}>TOTAL LISTED</div>
                        </div>
                        <div style={{ width: '1px', height: '32px', background: 'var(--gray-300)' }}></div>
                        <Package size={28} color="var(--kec-orange)" />
                    </div>
                </div>

                {/* Filter Section - Prominent & Highly Visible Card */}
                <div style={{ padding: '32px', marginBottom: '48px', background: 'white', borderRadius: '16px', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--gray-100)', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: 'linear-gradient(90deg, var(--kec-blue), var(--kec-orange))' }}></div>

                    <form onSubmit={handleSearch} style={{ display: 'grid', gap: '24px' }}>
                        <div className="filter-grid">
                            <div className="input-group form-group">
                                <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.8rem', fontWeight: '700', color: 'var(--kec-blue)', letterSpacing: '0.5px' }}>SEARCH KEYWORD</label>
                                <div className="search-input-wrapper">
                                    <Search size={18} className="search-icon" />
                                    <input
                                        type="text"
                                        placeholder="Bag, bottle, wallet..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="form-input"
                                    />
                                </div>
                            </div>

                            <div className="input-group form-group">
                                <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.8rem', fontWeight: '700', color: 'var(--kec-blue)', letterSpacing: '0.5px' }}>CATEGORY</label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                >
                                    {CATEGORIES.map((cat) => (
                                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="input-group form-group">
                                <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.8rem', fontWeight: '700', color: 'var(--kec-blue)', letterSpacing: '0.5px' }}>DATE LOST</label>
                                <input
                                    type="date"
                                    value={dateFilter}
                                    onChange={(e) => setDateFilter(e.target.value)}
                                />
                            </div>

                            <div className="input-group form-group">
                                <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.8rem', fontWeight: '700', color: 'var(--kec-blue)', letterSpacing: '0.5px' }}>SORT ORDER</label>
                                <select
                                    value={sort}
                                    onChange={(e) => setSort(e.target.value)}
                                >
                                    <option value="newest">Newest First</option>
                                    <option value="oldest">Oldest First</option>
                                    <option value="dateLost">Date Lost (Recent)</option>
                                </select>
                            </div>
                        </div>

                        <div className="filter-actions">
                            <div style={{ display: 'flex', gap: '12px' }}>
                                {(search || category !== 'all' || dateFilter) && (
                                    <button
                                        type="button"
                                        onClick={() => { setSearch(''); setCategory('all'); setDateFilter(''); }}
                                        style={{ background: '#fef2f2', border: '1px solid #fee2e2', padding: '8px 16px', borderRadius: '8px', fontSize: '0.85rem', cursor: 'pointer', color: '#ef4444', fontWeight: '700', transition: 'all 0.2s' }}
                                    >
                                        Clear All Filters ×
                                    </button>
                                )}
                            </div>
                            <button type="submit" className="btn btn-primary">
                                <Search size={20} /> Search Items
                            </button>
                        </div>
                    </form>
                </div>

                {/* Items Grid */}
                {loading ? (
                    <div style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div className="spinner"></div>
                    </div>
                ) : items.length === 0 ? (
                    <div style={{ padding: '80px 40px', textAlign: 'center', background: 'var(--gray-50)', borderRadius: '24px', border: '2px dashed var(--gray-200)' }}>
                        <Inbox size={80} color="var(--gray-300)" style={{ margin: '0 auto 24px' }} />
                        <h3 style={{ fontSize: '1.75rem', color: 'var(--kec-blue)', marginBottom: '12px' }}>No matches found</h3>
                        <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto', fontSize: '1.1rem', lineHeight: '1.6' }}>
                            We couldn&apos;t find any lost items matching your current filters. Try searching for something else or clearing your filters.
                        </p>
                        <button onClick={() => { setSearch(''); setCategory('all'); setDateFilter(''); }} className="btn btn-primary" style={{ marginTop: '24px' }}>
                            Reset All Filters
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-3" style={{ gap: '32px' }}>
                        {items.map((item) => (
                            <LostItemCard
                                key={item._id}
                                item={item}
                                onAlertClick={setSelectedItem}
                            />
                        ))}
                    </div>
                )}
            </main>

            {/* Alert Owner Modal */}
            {selectedItem && (
                <AlertOwnerForm
                    item={selectedItem}
                    onClose={() => setSelectedItem(null)}
                    onSuccess={handleAlertSuccess}
                />
            )}

            {/* Toast Notification */}
            {toast && (
                <div className={`toast toast-${toast.type}`} style={{ display: 'flex', alignItems: 'center', gap: '12px', position: 'fixed', bottom: '40px', left: '50%', transform: 'translateX(-50%)', zIndex: 10000, boxShadow: 'var(--shadow-xl)', padding: '16px 24px', borderRadius: '12px', background: 'white', borderLeft: '6px solid var(--kec-green)', fontWeight: '600' }}>
                    <CheckCircle size={20} color="var(--kec-green)" /> {toast.message}
                </div>
            )}
        </>
    );
}
