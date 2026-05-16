'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
export const dynamic = 'force-dynamic';
export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }

    fetch('/api/user/me', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      } else {
        setUser(data);
      }
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Loading...</div>;
  if (!user) return null;

  const isOwner = user.isOwner;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <nav className="border-b border-slate-800 px-6 py-4 flex justify-between items-center">
        <div className="text-xl font-bold text-indigo-400">H+M Lab</div>
        <div className="flex items-center gap-4">
          <span className="text-slate-400 text-sm">{user.email}</span>
          {isOwner && <span className="bg-indigo-600 px-3 py-1 rounded-full text-xs font-bold">OWNER</span>}
          <button onClick={() => { localStorage.removeItem('token'); window.location.href = '/'; }} className="text-sm text-slate-400 hover:text-white">Logout</button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
            <p className="text-slate-400 text-sm">Plan</p>
            <p className="text-2xl font-bold text-indigo-400">{user.effectiveTier}</p>
          </div>
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
            <p className="text-slate-400 text-sm">Credits Remaining</p>
            <p className="text-2xl font-bold">{user.creditsRemaining === 999999999 ? '∞ Unlimited' : user.creditsRemaining.toLocaleString()}</p>
          </div>
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
            <p className="text-slate-400 text-sm">Custom Voices</p>
            <p className="text-2xl font-bold">{user.maxVoices === 999 ? '∞' : user.maxVoices}</p>
          </div>
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
            <p className="text-slate-400 text-sm">Commercial License</p>
            <p className="text-2xl font-bold">{user.hasCommercialLicense ? '✓ Yes' : '✗ No'}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
            <h3 className="text-xl font-bold mb-4">Text to Speech</h3>
            <p className="text-slate-400 mb-4">Generate AI voice from text instantly.</p>
            <button className="bg-indigo-600 px-6 py-2 rounded-lg hover:bg-indigo-700">New Generation</button>
          </div>
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
            <h3 className="text-xl font-bold mb-4">Voice Cloning</h3>
            <p className="text-slate-400 mb-4">Upload audio to clone your voice.</p>
            <button className="bg-indigo-600 px-6 py-2 rounded-lg hover:bg-indigo-700">Clone Voice</button>
          </div>
        </div>

        {user.effectiveTier === 'FREE' && (
          <div className="mt-8 bg-indigo-900/20 border border-indigo-500/30 p-6 rounded-2xl text-center">
            <p className="mb-4">Upgrade to unlock more features and credits.</p>
            <Link href="/pricing" className="bg-indigo-600 px-8 py-2 rounded-lg font-semibold hover:bg-indigo-700 inline-block">View Plans</Link>
          </div>
        )}
      </div>
    </div>
  );
}