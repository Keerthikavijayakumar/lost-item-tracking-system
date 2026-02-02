'use client';

import Link from 'next/link';
import { Mail, Phone, MapPin, Github, Linkedin, Twitter, ExternalLink } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="footer-container">
            <div className="container">
                <div className="footer-grid">
                    {/* Brand Section */}
                    <div className="footer-brand">
                        <Link href="/" className="footer-logo">
                            KEC <span>Campus</span>
                        </Link>
                        <p className="footer-description">
                            The official lost and found recovery portal for Kongu Engineering College.
                            Connecting our campus community to recover missing items safely and efficiently.
                        </p>
                        <div className="footer-socials">
                            <a href="#" aria-label="Github"><Github size={20} /></a>
                            <a href="#" aria-label="Twitter"><Twitter size={20} /></a>
                            <a href="#" aria-label="Linkedin"><Linkedin size={20} /></a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="footer-links">
                        <h4>Platform</h4>
                        <ul>
                            <li><Link href="/">Home</Link></li>
                            <li><Link href="/lost-items">Lost Items Feed</Link></li>
                            <li><Link href="/lost-items/new">Report Lost Item</Link></li>
                            <li><Link href="/dashboard">User Dashboard</Link></li>
                        </ul>
                    </div>

                    {/* Resource Links */}
                    <div className="footer-links">
                        <h4>Resources</h4>
                        <ul>
                            <li><a href="https://kongu.ac.in" target="_blank" rel="noopener noreferrer">KEC Official <ExternalLink size={12} /></a></li>
                            <li><Link href="/faq">Help & FAQ</Link></li>
                            <li><Link href="/terms">Privacy Policy</Link></li>
                            <li><Link href="/contact">Support</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="footer-contact">
                        <h4>Contact Us</h4>
                        <ul>
                            <li>
                                <MapPin size={18} />
                                <span>Perundurai, Erode, <br />Tamil Nadu 638060</span>
                            </li>
                            <li>
                                <Phone size={18} />
                                <span>+91 4294 226555</span>
                            </li>
                            <li>
                                <Mail size={18} />
                                <span>support@kec.ac.in</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>© {new Date().getFullYear()} Kongu Engineering College. All rights reserved.</p>
                    <p className="footer-credits">
                        Made with <span style={{ color: '#ef4444' }}>❤</span> by KEC Students
                    </p>
                </div>
            </div>
        </footer>
    );
}
