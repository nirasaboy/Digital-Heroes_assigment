'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

export default function AuthNav() {
  const [user, setUser] = useState<{ id: string; email: string; role: string } | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const loadUser = () => {
      const stored = localStorage.getItem('digital_heroes_user');
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch (e) {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    loadUser();
    window.addEventListener('auth-change', loadUser);
    return () => window.removeEventListener('auth-change', loadUser);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('digital_heroes_user');
    setUser(null);
    window.dispatchEvent(new Event('auth-change'));
    router.push('/login');
  };

  if (!user) {
    return (
      <>
        <Link href="/login" style={{ color: 'var(--text-primary)', textDecoration: 'none' }}>Login</Link>
        <Link href="/register" style={{ color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: 'bold' }}>Sign Up</Link>
      </>
    );
  }

  return (
    <>
      <Link href="/winners" style={{ color: 'var(--text-primary)', textDecoration: 'none', marginRight: '16px' }}>Winners</Link>
      <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginRight: '8px' }}>{user.email}</span>
      {user.role === 'admin' ? (
        <Link href="/admin" style={{ color: 'var(--text-primary)', textDecoration: 'none' }}>Admin</Link>
      ) : (
        <Link href="/dashboard" style={{ color: 'var(--text-primary)', textDecoration: 'none' }}>Dashboard</Link>
      )}
      <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: '#ff4444', cursor: 'pointer', fontSize: '1rem', padding: 0, marginLeft: '16px' }}>Logout</button>
    </>
  );
}
