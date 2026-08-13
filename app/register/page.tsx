'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [area, setArea] = useState('Ward No. 54, Hanumangarh');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('पंजीकरण विफल रहा।');

      const { error: profileError } = await supabase.from('profiles').insert([{
        id: authData.user.id,
        full_name: fullName,
        mobile_number: mobileNumber,
        email: email,
        area: area,
        role: 'CITIZEN'
      }]);

      if (profileError) throw profileError;

      alert('पंजीकरण सफल रहा! कृपया अब लॉगिन करें।');
      router.push('/login');
    } catch (err: any) {
      setErrorMessage(err.message || 'पंजीकरण के दौरान त्रुटि हुई।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg my-12">
      <h1 className="text-2xl font-bold text-blue-900 mb-1 text-center">नागरिक पंजीकरण</h1>
      <p className="text-sm text-slate-600 mb-6 text-center">WARD 54 – JANSEVA SAATHI</p>

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 text-sm">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">पूरा नाम (Full Name)*</label>
          <input
            type="text"
            required
            placeholder="उदा. अमित कुमार"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full border border-slate-300 rounded-md p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">मोबाइल नंबर (Mobile Number)*</label>
          <input
            type="text"
            required
            placeholder="उदा. 9876543210"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            className="w-full border border-slate-300 rounded-md p-2"
          />
        </div>

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
            placeholder="कम से कम 6 अक्षर"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-slate-300 rounded-md p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">क्षेत्र / इलाका (Area)*</label>
          <input
            type="text"
            required
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className="w-full border border-slate-300 rounded-md p-2"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-900 text-white py-3 rounded-md font-semibold hover:bg-blue-800 transition disabled:opacity-50"
        >
          {loading ? 'पंजीकरण हो रहा है...' : 'पंजीकरण करें (Register)'}
        </button>
      </form>

      <p className="text-center text-sm text-slate-600 mt-4">
        पहले से अकाउंट है?{' '}
        <Link href="/login" className="text-blue-900 font-bold hover:underline">
          लॉगिन करें
        </Link>
      </p>
    </div>
  );
}