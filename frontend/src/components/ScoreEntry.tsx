'use client';

import React, { useState } from 'react';
import api from '../lib/api';
import { useDispatch } from 'react-redux';
import { setScores } from '../store/slices/scoreSlice';

export default function ScoreEntry({ userId }: { userId: string }) {
  const [score, setScore] = useState<number | ''>('');
  const [date, setDate] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!score || !date) return;

    setLoading(true);
    try {
      await api.post(`/scores/${userId}`, {
        score: Number(score),
        scoreDate: date,
      });
      // Re-fetch scores after adding
      const res = await api.get(`/scores/${userId}`);
      dispatch(setScores(res.data));
      setScore('');
      setDate('');
    } catch (error: any) {
      console.error('Failed to submit score', error);
      const message =
        error?.response?.data?.error ||
        (error?.response?.status === 409
          ? 'A score for this date already exists. Please choose a different date.'
          : 'Failed to submit score. Please try again.');
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="premium-card">
      <h2 style={{ marginTop: 0, color: 'var(--accent-primary)' }}>Enter New Score</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
        Enter your latest Stableford score (1-45). Only your most recent 5 scores are kept.
      </p>
      
      <form onSubmit={handleSubmit}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>Score (Stableford)</label>
          <input
            type="number"
            min="1"
            max="45"
            value={score}
            onChange={(e) => setScore(Number(e.target.value))}
            className="input-field"
            required
          />
        </div>
        
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="input-field"
            required
          />
        </div>
        
        <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%' }}>
          {loading ? 'Submitting...' : 'Submit Score'}
        </button>
      </form>
    </div>
  );
}
