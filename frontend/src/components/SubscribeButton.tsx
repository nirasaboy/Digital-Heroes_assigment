'use client';

import React, { useState } from 'react';
import api from '../lib/api';

export default function SubscribeButton({ userId, planType = 'monthly' }: { userId: string, planType?: 'monthly' | 'yearly' }) {
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const res = await api.post('/checkout/create-session', { userId, planType });
      if (res.data && res.data.url) {
        window.location.href = res.data.url;
      }
    } catch (error) {
      console.error('Failed to initialize checkout', error);
      alert('Could not connect to payment gateway.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleSubscribe} 
      className="btn-primary" 
      disabled={loading}
      style={{ 
        width: '100%', 
        padding: '16px', 
        fontSize: '1.1rem',
        boxShadow: '0 4px 14px 0 rgba(16, 185, 129, 0.39)'
      }}
    >
      {loading ? 'Connecting to Stripe...' : `Subscribe to Digital Heroes (${planType})`}
    </button>
  );
}
