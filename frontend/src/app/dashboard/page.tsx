'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ScoreEntry from '../../components/ScoreEntry';
import SubscribeButton from '../../components/SubscribeButton';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { setScores } from '../../store/slices/scoreSlice';
import api from '../../lib/api';

export default function Dashboard() {
  const dispatch = useDispatch();
  const { scores } = useSelector((state: RootState) => state.score);
  const router = useRouter();
  
  const [user, setUser] = useState<{ id: string; email: string; role: string } | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [charities, setCharities] = useState<any[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('digital_heroes_user');
    if (!stored) {
      router.push('/login');
      return;
    }
    const parsedUser = JSON.parse(stored);
    setUser(parsedUser);

    const loadData = async () => {
      try {
        const [scoreRes, profRes, charRes] = await Promise.all([
          api.get(`/scores/${parsedUser.id}`),
          api.get(`/profile/${parsedUser.id}`),
          api.get('/charities')
        ]);
        dispatch(setScores(scoreRes.data));
        setProfile(profRes.data);
        setCharities(charRes.data);
      } catch (err) {
        console.error('Error loading dashboard data', err);
      }
    };
    loadData();
  }, [dispatch, router]);

  const handleCharityChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    try {
      const res = await api.put(`/profile/${user!.id}/charity`, { charityId: e.target.value });
      setProfile(res.data);
    } catch (err) {
      alert('Failed to update charity');
    }
  };

  const handlePercentageChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    try {
      const res = await api.put(`/profile/${user!.id}/charity-percentage`, { percentage: parseFloat(e.target.value) });
      setProfile(res.data);
    } catch (err) {
      alert('Failed to update percentage');
    }
  };

  if (!user || !profile) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
      <header style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '0 0 8px 0' }}>Your Dashboard</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', margin: 0 }}>
          Track your performance and see your charitable impact.
        </p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="premium-card" style={{ border: '1px solid var(--accent-primary)' }}>
            <h2 style={{ marginTop: 0, color: 'var(--text-primary)' }}>Subscription Status</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
              Status: <strong style={{ color: profile.subscriptionStatus === 'active' ? '#4CAF50' : 'var(--text-primary)' }}>{profile.subscriptionStatus}</strong>
            </p>
            {profile.subscriptionStatus !== 'active' && (
              <SubscribeButton userId={user.id} planType="monthly" />
            )}
          </div>
          
          <ScoreEntry userId={user.id} />
          
          <div className="premium-card">
            <h2 style={{ marginTop: 0, color: 'var(--accent-primary)' }}>Your Selected Charity</h2>
            
            <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Support a Charity</label>
                <select 
                  value={profile.selectedCharity?.id || ''} 
                  onChange={handleCharityChange}
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
                >
                  <option value="">-- Select a Charity --</option>
                  {charities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Donation Percentage</label>
                <select 
                  value={profile.charityPercentage} 
                  onChange={handlePercentageChange}
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
                >
                  <option value="10.00">10%</option>
                  <option value="15.00">15%</option>
                  <option value="20.00">20%</option>
                  <option value="25.00">25%</option>
                  <option value="30.00">30%</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="premium-card">
          <h2 style={{ marginTop: 0, color: 'var(--accent-primary)' }}>Recent Scores</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Your 5 most recent scores.</p>
          
          {scores.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '40px 0' }}>No scores entered yet.</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {scores.map((score: any) => (
                <li key={score.id} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  padding: '16px 0',
                  borderBottom: '1px solid var(--border-color)'
                }}>
                  <span style={{ fontWeight: 600 }}>{score.score} pts</span>
                  <span style={{ color: 'var(--text-secondary)' }}>{new Date(score.scoreDate).toLocaleDateString()}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
