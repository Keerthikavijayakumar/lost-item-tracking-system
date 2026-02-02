'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton, SignedIn, SignedOut } from '@clerk/nextjs';
import { Package, Search, Plus } from 'lucide-react';

export default function Navbar() {
    const pathname = usePathname();
    const isDashboard = pathname === '/Dashboard';

    return (
        <header style={{ position: 'sticky', top: 0, zIndex: 100 }}>
            {/* Main Navbar - White with Blue Border */}
            <nav className="navbar" style={{
                background: 'white',
                borderBottom: '4px solid var(--kec-blue)',
                padding: '0',
                boxShadow: 'var(--shadow-sm)'
            }}>
                <div className="container navbar-content" style={{ height: '80px' }}>
                    {/* Logo Section */}
                    <Link href="/" className="navbar-logo" style={{ color: 'var(--kec-blue)', textDecoration: 'none' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.2' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Package size={32} color="var(--kec-blue)" strokeWidth={2.5} />
                                <span style={{ fontSize: '1.5rem', fontWeight: '800', letterSpacing: '-0.5px' }}>KEC CAMPUS</span>
                            </div>
                            <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--kec-orange)', letterSpacing: '1px', marginLeft: '40px' }}>LOST & FOUND</span>
                        </div>
                    </Link>

                    {/* Action Buttons */}
                    <div className="navbar-actions" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <SignedIn>
                            {isDashboard ? (
                                <span style={{
                                    color: 'var(--text-muted)',
                                    fontWeight: '700',
                                    fontSize: '0.9rem',
                                    padding: '8px 16px',
                                    borderRadius: '4px',
                                    border: '1px solid var(--gray-300)',
                                    background: 'var(--gray-50)',
                                    cursor: 'default'
                                }}>
                                    DASHBOARD
                                </span>
                            ) : (
                                <Link href="/Dashboard" style={{
                                    color: 'var(--kec-blue)',
                                    textDecoration: 'none',
                                    fontWeight: '700',
                                    fontSize: '0.9rem',
                                    padding: '8px 16px',
                                    borderRadius: '4px',
                                    border: '1px solid var(--kec-blue)',
                                    transition: 'all 0.2s'
                                }}>
                                    DASHBOARD
                                </Link>
                            )}
                            <UserButton />
                        </SignedIn>
                        <SignedOut>
                            <Link href="/SignIn" className="btn" style={{
                                background: 'var(--kec-blue)',
                                color: 'white',
                                borderRadius: '4px',
                                fontWeight: '600',
                                padding: '10px 24px'
                            }}>
                                Login
                            </Link>
                        </SignedOut>
                    </div>
                </div>
            </nav>
        </header>
    );
}
