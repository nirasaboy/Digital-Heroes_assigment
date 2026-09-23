'use client';

import React, { useEffect, useState } from 'react';
import api from '../../lib/api';

export default function WinnersPage() {
  const [draws, setDraws] = useState<any[]>([]);
  const [selectedDrawId, setSelectedDrawId] = useState<string>('');
  const [winners, setWinners] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch all draws to let the user select one
    const fetchDraws = async () => {
      try {
        const res = await api.get('/draws');
        const publishedDraws = res.data.filter((d: any) => d.status === 'published' || d.status === 'simulated');
        setDraws(publishedDraws);
        if (publishedDraws.length > 0) {
          setSelectedDrawId(publishedDraws[0].id);
        }
      } catch (err) {
        console.error('Failed to fetch draws', err);
      }
    };
    fetchDraws();
  }, []);

  useEffect(() => {
    if (!selectedDrawId) return;

    const fetchWinners = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/draws/${selectedDrawId}/winners`);
        setWinners(res.data);
      } catch (err) {
        console.error('Failed to fetch winners', err);
        setWinners([]);
      } finally {
        setLoading(false);
      }
    };
    fetchWinners();
  }, [selectedDrawId]);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
      <header style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '0 0 8px 0', color: 'var(--accent-primary)' }}>Draw Winners</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', margin: 0 }}>
          Check out the lucky heroes from our recent draws!
        </p>
      </header>

      <div className="premium-card" style={{ marginBottom: '24px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Select a Draw</label>
        <select 
          value={selectedDrawId} 
          onChange={(e) => setSelectedDrawId(e.target.value)}
          style={{ width: '100%', maxWidth: '400px', padding: '12px', borderRadius: '8px', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
        >
          {draws.length === 0 && <option value="">No draws available</option>}
          {draws.map(d => (
            <option key={d.id} value={d.id}>
              Draw {d.id.substring(0, 8)} - {new Date(d.createdAt || Date.now()).toLocaleDateString()} (${d.totalPoolAmount})
            </option>
          ))}
        </select>
      </div>

      <div className="premium-card">
        <h2 style={{ marginTop: 0, borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>Winners</h2>
        
        {loading ? (
          <p style={{ padding: '20px 0', color: 'var(--text-secondary)' }}>Loading winners...</p>
        ) : winners.length === 0 ? (
          <p style={{ padding: '20px 0', color: 'var(--text-secondary)' }}>No winners have been announced for this draw yet.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {winners.map((winner, index) => (
              <li key={winner.id} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '16px 0',
                borderBottom: index !== winners.length - 1 ? '1px solid var(--border-color)' : 'none'
              }}>
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{winner.user?.email || 'Anonymous Hero'}</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Prize Tier: {winner.matchTier}</div>
                </div>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#4CAF50' }}>
                  ${winner.prizeAmount?.toFixed(2)}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
