'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../lib/api';

export default function AdminDashboard() {
  const [draws, setDraws] = useState([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Basic auth check: assuming admin role was saved in localstorage during login
    const userJson = localStorage.getItem('digital_heroes_user');
    let isAdmin = false;
    if (userJson) {
      try {
        const user = JSON.parse(userJson);
        isAdmin = user.role === 'admin';
      } catch (e) {}
    }

    if (!isAdmin) {
      router.replace('/login');
    } else {
      setAuthChecked(true);
      fetchData();
    }
  }, [router]);

  const fetchData = async () => {
    try {
      const [drawsRes, statsRes] = await Promise.all([
        api.get('/draws'),
        api.get('/admin/dashboard')
      ]);
      setDraws(drawsRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Error fetching admin data', error);
    }
  };

  const createDraw = async () => {
    try {
      await api.post('/draws', {
        drawType: 'monthly',
        status: 'pending',
        totalPoolAmount: 500.00,
      });
      fetchData();
    } catch (error) {
      console.error('Failed to create draw', error);
      alert('Failed to create draw.');
    }
  };

  const simulateDraw = async (drawId: string) => {
    setLoading(true);
    try {
      await api.post(`/draws/${drawId}/calculate-prizes`);
      alert('Prize pool simulated and distributed successfully!');
      fetchData();
    } catch (error) {
      console.error('Simulation failed', error);
      alert('Failed to run simulation.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('digital_heroes_user');
    window.dispatchEvent(new Event('auth-change'));
    router.push('/login');
  };

  if (!authChecked) return null;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
      <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '0 0 8px 0', color: 'var(--accent-primary)' }}>
            Admin Control Center
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', margin: 0 }}>
            Manage draws, simulate prize pools, and verify winners.
          </p>
        </div>
        <button
          onClick={handleLogout}
          style={{
            padding: '8px 16px',
            fontSize: '0.85rem',
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: '8px',
            color: '#f87171',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Logout
        </button>
      </header>

      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
          <div className="premium-card" style={{ padding: '20px', textAlign: 'center' }}>
            <h3 style={{ margin: '0 0 8px 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Total Users</h3>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{stats.totalUsers}</div>
          </div>
          <div className="premium-card" style={{ padding: '20px', textAlign: 'center' }}>
            <h3 style={{ margin: '0 0 8px 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Active Subscribers</h3>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{stats.activeSubscribers}</div>
          </div>
          <div className="premium-card" style={{ padding: '20px', textAlign: 'center' }}>
            <h3 style={{ margin: '0 0 8px 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Total Pool</h3>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent-primary)' }}>${stats.totalPoolGenerated?.toFixed(2)}</div>
          </div>
          <div className="premium-card" style={{ padding: '20px', textAlign: 'center' }}>
            <h3 style={{ margin: '0 0 8px 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Charity Raised</h3>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#4CAF50' }}>${stats.totalRaisedForCharity?.toFixed(2)}</div>
          </div>
        </div>
      )}

      <div className="premium-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '4px' }}>
          <h2 style={{ margin: 0 }}>Draw Management</h2>
          <button
            onClick={createDraw}
            className="btn-primary"
            style={{ padding: '8px 18px', fontSize: '0.9rem' }}
          >
            + Create Test Draw
          </button>
        </div>
        
        {draws.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)', padding: '24px 0' }}>No active draws to manage.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '16px' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '12px 8px' }}>Draw ID</th>
                <th style={{ padding: '12px 8px' }}>Type</th>
                <th style={{ padding: '12px 8px' }}>Status</th>
                <th style={{ padding: '12px 8px' }}>Total Pool</th>
                <th style={{ padding: '12px 8px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {draws.map((draw: any) => (
                <tr key={draw.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '16px 8px' }}>{draw.id.substring(0, 8)}...</td>
                  <td style={{ padding: '16px 8px' }}>{draw.drawType}</td>
                  <td style={{ padding: '16px 8px' }}>
                    <span style={{ 
                      padding: '4px 8px', 
                      borderRadius: '12px', 
                      fontSize: '0.85rem',
                      backgroundColor: draw.status === 'published' ? 'rgba(16, 185, 129, 0.2)' : draw.status === 'simulated' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(234, 179, 8, 0.2)',
                      color: draw.status === 'published' ? '#34d399' : draw.status === 'simulated' ? '#60a5fa' : '#facc15'
                    }}>
                      {draw.status}
                    </span>
                  </td>
                  <td style={{ padding: '16px 8px' }}>${draw.totalPoolAmount?.toFixed(2) || '0.00'}</td>
                  <td style={{ padding: '16px 8px' }}>
                    <button 
                      onClick={() => simulateDraw(draw.id)}
                      className="btn-primary" 
                      style={{ padding: '8px 16px', fontSize: '0.9rem' }}
                      disabled={loading || draw.status === 'published' || draw.status === 'simulated'}
                    >
                      {loading ? 'Running...' : 'Simulate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
