'use client';

import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false);
  const [token, setToken] = useState('');

  useEffect(() => {
    const t = localStorage.getItem('token');
    if (t) setToken(t);
  }, []);

  const plans = [
    {
      name: 'Free',
      price: 0,
      description: 'For personal use',
      features: ['10,000 chars/month', '1 custom voice', 'Standard voices', 'Watermarked'],
      priceId: null,
    },
    {
      name: 'Pro',
      price: isYearly ? 99 : 11,
      period: isYearly ? '/year' : '/month',
      badge: isYearly ? 'Save 25%' : null,
      description: 'For creators',
      features: ['100,000 chars/month', '5 custom voices', 'HD audio', 'Commercial license', 'Priority'],
      priceId: isYearly 
        ? process.env.NEXT_PUBLIC_STRIPE_PRO_YEARLY_PRICE_ID 
        : process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID,
    },
    {
      name: 'Studio',
      price: isYearly ? 249 : 29,
      period: isYearly ? '/year' : '/month',
      badge: isYearly ? 'Save 28%' : 'Best Value',
      description: 'For professionals',
      features: ['500,000 chars/month', '20 custom voices', 'API access', 'Team (3 seats)', 'Advanced controls'],
      priceId: isYearly 
        ? process.env.NEXT_PUBLIC_STRIPE_STUDIO_YEARLY_PRICE_ID 
        : process.env.NEXT_PUBLIC_STRIPE_STUDIO_MONTHLY_PRICE_ID,
      highlighted: true,
    },
  ];

  const handleSubscribe = async (priceId: string | null | undefined) => {
    if (!priceId) {
      alert('Free tier selected! Continue to dashboard.');
      window.location.href = '/dashboard';
      return;
    }

    if (!token) {
      alert('Please login first!');
      window.location.href = '/login';
      return;
    }

    const res = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ priceId }),
    });

    const data = await res.json();
    if (data.url) window.location.href = data.url;
    else alert('Error: ' + (data.error || 'Unknown error'));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">H+M Lab Pricing</h1>
          <p className="text-slate-400">Choose your creative power</p>

          <div className="mt-8 inline-flex bg-slate-900 rounded-full p-1">
            <button onClick={() => setIsYearly(false)} className={`px-6 py-2 rounded-full ${!isYearly ? 'bg-indigo-600' : ''}`}>Monthly</button>
            <button onClick={() => setIsYearly(true)} className={`px-6 py-2 rounded-full ${isYearly ? 'bg-indigo-600' : ''}`}>Yearly</button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div key={plan.name} className={`rounded-2xl p-8 ${plan.highlighted ? 'border-2 border-indigo-500 bg-slate-900' : 'bg-slate-900/50'}`}>
              {plan.badge && <span className="inline-block px-3 py-1 bg-indigo-500/20 text-indigo-400 text-sm rounded-full mb-4">{plan.badge}</span>}
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <p className="text-slate-400 mb-4">{plan.description}</p>
              <div className="mb-6"><span className="text-4xl font-bold">${plan.price}</span><span className="text-slate-400">{plan.period}</span></div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center text-sm text-slate-300">
                    <svg className="w-5 h-5 text-indigo-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    {f}
                  </li>
                ))}
              </ul>
              <button onClick={() => handleSubscribe(plan.priceId)} className={`w-full py-3 rounded-xl font-semibold ${plan.highlighted ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-slate-800 hover:bg-slate-700'}`}>
                {plan.price === 0 ? 'Start Free' : 'Subscribe'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}