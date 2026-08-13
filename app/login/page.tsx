'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // लॉगिन सफल होने पर शिकायत दर्ज करने वाले पेज पर भेजें
      router.push('/dashboard/submit');
    } catch (err: any) {
      setErrorMessage(err.message || 'लॉगिन विफल रहा। कृपया विवरण जांचें।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg my-12">
      <h1 className="text-2xl font-bold text-blue-900 mb-1 text-center">नागरिक लॉगिन</h1>
      <p className="text-sm text-slate-600 mb-6 text-center">WARD 54 – JANSEVA SAATHI</p>

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 text-sm">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">ईमेल (Email)*</label>
          <input
            type="email"
            required
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-slate-300 rounded-md p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">पासवर्ड (Password)*</label>
          <input
            type="password"
            required
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-slate-300 rounded-md p-2"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-900 text-white py-3 rounded-md font-semibold hover:bg-blue-800 transition disabled:opacity-50"
        >
          {loading ? 'लॉगिन हो रहा है...' : 'लॉगिन करें (Login)'}
        </button>
      </form>

      <p className="text-center text-sm text-slate-600 mt-4">
        नया अकाउंट बनाना है?{' '}
        <Link href="/register" className="text-blue-900 font-bold hover:underline">
          पंजीकरण करें
        </Link>
      </p>
    </div>
  );
}