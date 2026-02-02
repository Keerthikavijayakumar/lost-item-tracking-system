'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import Navbar from '@/Frontend/Components/Navbar';
import BackButton from '@/Frontend/Components/BackButton';
import { API_ROUTES } from '@/Frontend/Lib/api';
import {
    Package,
    Plus,
    Inbox,
    Trash2,
    CheckCircle,
    Search,
    MapPin,
    Calendar,
    MessageSquare,
    Mail,
    Bell,
    Send
} from 'lucide-react';

export default function DashboardPage() {
    const { user } = useUser();
    const [data, setData] = useState({
        myItems: [],
        foundItems: [],
        myAlerts: [],
    });
    const [loading, setLoading] = useState(true);
    const [deleteLoading, setDeleteLoading] = useState(null);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const response = await fetch(`${API_ROUTES.USER_DASHBOARD}?userId=${user?.id}`);
            const result = await response.json();

            if (response.ok) {
                setData(result);
            }
        } catch (error) {
            console.error('Error fetching dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteItem = async (itemId) => {
        if (!confirm('Are you sure you want to delete this item?')) return;

        setDeleteLoading(itemId);
        try {
            const response = await fetch(`${API_ROUTES.LOST_ITEMS}/${itemId}?userId=${user?.id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setData(prev => ({
                    ...prev,
                    myItems: prev.myItems.filter(item => item._id !== itemId)
                }));
            }
        } catch (error) {
            console.error('Error deleting item:', error);
        } finally {
            setDeleteLoading(null);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="loading">
                    <div className="spinner"></div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />

            <main className="container" style={{ padding: 'var(--space-8) 0' }}>
                <BackButton />
                {/* Welcome Header */}
                <div className="page-header">
                    <h1 style={{ fontSize: '2.5rem', color: 'var(--kec-blue)' }}>
                        Welcome back, {user?.firstName || 'Student'}!
                    </h1>
                    <p style={{ fontSize: '1.1rem' }}>
                        Manage your reported items and check for updates.
                    </p>
                </div>

                {/* KPI Stats Row */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                    gap: '24px',
                    marginBottom: 'var(--space-12)'
                }}>
                    <div className="card stats-card" style={{ borderLeft: '4px solid var(--kec-orange)' }}>
                        <div className="stats-card-icon" style={{ color: 'var(--kec-orange)' }}>
                            <Package size={32} />
                        </div>
                        <div>
                            <div className="stats-card-number">{data.myItems.length}</div>
                            <div className="stats-card-label">Active Lost Items</div>
                        </div>
                    </div>

                    <div className="card stats-card" style={{ borderLeft: '4px solid var(--kec-green)' }}>
                        <div className="stats-card-icon" style={{ background: 'var(--success-50)', color: 'var(--kec-green)' }}>
                            <CheckCircle size={32} />
                        </div>
                        <div>
                            <div className="stats-card-number">{data.foundItems.length}</div>
                            <div className="stats-card-label">Items Found</div>
                        </div>
                    </div>

                    <div className="card stats-card" style={{ borderLeft: '4px solid var(--kec-blue)' }}>
                        <div className="stats-card-icon" style={{ background: 'var(--info-50)', color: 'var(--kec-blue)' }}>
                            <Send size={32} />
                        </div>
                        <div>
                            <div className="stats-card-number">{data.myAlerts.length}</div>
                            <div className="stats-card-label">Alerts Sent</div>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div style={{ display: 'grid', gap: '40px' }}>

                    {/* Section: My Lost Items */}
                    <section>
                        <div className="section-header stack-mobile">
                            <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--kec-blue)', fontSize: '1.5rem', margin: 0 }}>
                                <Package size={24} /> My Lost Items
                            </h2>
                            <Link href="/lost-items/new" className="btn btn-primary btn-sm">
                                <Plus size={16} /> Report New
                            </Link>
                        </div>

                        {data.myItems.length === 0 ? (
                            <div className="card empty-state" style={{ padding: '40px', background: 'var(--gray-50)', border: '2px dashed var(--gray-200)' }}>
                                <Inbox size={48} color="var(--gray-400)" style={{ margin: '0 auto 16px' }} />
                                <p style={{ marginBottom: '16px' }}>You haven&apos;t reported any lost items yet.</p>
                                <Link href="/lost-items/new" className="btn btn-primary">Report a Lost Item</Link>
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                                {data.myItems.map((item) => (
                                    <div key={item._id} className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%', borderTop: '4px solid var(--kec-orange)' }}>
                                        <div style={{ padding: '20px', flex: 1 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                                <span className="badge" style={{ background: 'var(--primary-50)', color: 'var(--kec-blue)', fontWeight: '600', padding: '4px 12px', borderRadius: '100px', fontSize: '0.8rem' }}>
                                                    {item.category}
                                                </span>
                                                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{formatDate(item.createdAt)}</span>
                                            </div>
                                            <h4 style={{ fontSize: '1.1rem', marginBottom: '8px', color: 'var(--text-primary)' }}>{item.itemName}</h4>
                                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '16px' }}>
                                                {item.description.length > 80 ? item.description.substring(0, 80) + '...' : item.description}
                                            </p>

                                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Calendar size={14} /> Lost: {formatDate(item.dateLost)}</div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><MapPin size={14} /> {item.lastSeenLocation}</div>
                                            </div>
                                        </div>
                                        <div style={{ padding: '16px', borderTop: '1px solid var(--gray-100)', background: 'var(--gray-50)' }}>
                                            <button
                                                className="btn"
                                                onClick={() => handleDeleteItem(item._id)}
                                                disabled={deleteLoading === item._id}
                                                style={{
                                                    width: '100%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '8px',
                                                    color: 'var(--error)',
                                                    background: 'white',
                                                    border: '1px solid var(--gray-200)',
                                                    padding: '8px',
                                                    borderRadius: '6px',
                                                    fontSize: '0.9rem',
                                                    fontWeight: '600'
                                                }}
                                            >
                                                <Trash2 size={16} /> {deleteLoading === item._id ? 'Removing...' : 'Remove Item'}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                    {/* Section: Found Items & Alerts Sent (Grid 2 cols) */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>

                        {/* Found Items */}
                        <section>
                            <h2 className="section-header" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--kec-green)', fontSize: '1.25rem', margin: 0 }}>
                                <CheckCircle size={20} /> Items That Were Found
                            </h2>
                            {data.foundItems.length === 0 ? (
                                <div className="card" style={{ padding: '30px', textAlign: 'center', background: 'var(--gray-50)' }}>
                                    <p style={{ color: 'var(--text-muted)' }}>No matches found yet.</p>
                                </div>
                            ) : (
                                <div style={{ display: 'grid', gap: '16px' }}>
                                    {data.foundItems.map((alert) => (
                                        <div key={alert._id} className="card" style={{ padding: '16px', borderLeft: '4px solid var(--kec-green)' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                                <h4 style={{ fontSize: '1rem', margin: 0 }}>{alert.itemName}</h4>
                                                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{formatDate(alert.createdAt)}</span>
                                            </div>
                                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                                                <p style={{ display: 'flex', alignItems: 'center', gap: '6px', margin: '4px 0' }}><MapPin size={14} /> Loc: {alert.foundLocation}</p>
                                                <p style={{ display: 'flex', alignItems: 'center', gap: '6px', margin: '4px 0' }}><Mail size={14} /> Finder: <a href={`mailto:${alert.finderEmail}`} style={{ color: 'var(--kec-blue)' }}>{alert.finderEmail}</a></p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>

                        {/* Alerts Sent */}
                        <section>
                            <h2 className="section-header" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--kec-blue)', fontSize: '1.25rem', margin: 0 }}>
                                <Send size={20} /> Alerts You Sent
                            </h2>
                            {data.myAlerts.length === 0 ? (
                                <div className="card" style={{ padding: '30px', textAlign: 'center', background: 'var(--gray-50)' }}>
                                    <p style={{ color: 'var(--text-muted)' }}>No alerts sent yet.</p>
                                </div>
                            ) : (
                                <div style={{ display: 'grid', gap: '16px' }}>
                                    {data.myAlerts.map((alert) => (
                                        <div key={alert._id} className="card" style={{ padding: '16px', borderLeft: '4px solid var(--kec-blue)' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                                <h4 style={{ fontSize: '1rem', margin: 0 }}>{alert.itemName}</h4>
                                                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{formatDate(alert.createdAt)}</span>
                                            </div>
                                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                                <p style={{ display: 'flex', alignItems: 'center', gap: '6px', margin: '4px 0' }}><MapPin size={14} /> Found at: {alert.foundLocation}</p>
                                                <p style={{ display: 'flex', alignItems: 'center', gap: '6px', margin: '4px 0' }}><Mail size={14} /> Owner: {alert.ownerEmail}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>

                    </div>
                </div>
            </main>
        </>
    );
}
