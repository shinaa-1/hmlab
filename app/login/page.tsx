'use client';

import { useState } from 'react';
import Link from 'next/link';
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs'
export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    setLoading(false);

    if (data.token) {
      localStorage.setItem('token', data.token);
      window.location.href = '/dashboard';
    } else {
      alert(data.error || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4">
      <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center">Welcome to H+M Lab</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 focus:border-indigo-500 outline-none" required />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 focus:border-indigo-500 outline-none" required />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-indigo-600 py-2 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="mt-4 text-center text-slate-400 text-sm">
          No account? <Link href="/register" className="text-indigo-400 hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
}