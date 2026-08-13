'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function Navbar() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <nav className="bg-blue-950 text-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="font-bold text-lg">
          <Link href="/dashboard/submit" className="hover:text-blue-200">
            जनसेवा साथी (वार्ड 54)
          </Link>
        </div>
        <div className="flex items-center space-x-6 text-sm">
          <Link href="/dashboard/submit" className="hover:text-blue-200">शिकायत दर्ज करें</Link>
          <Link href="/dashboard/history" className="hover:text-blue-200">इतिहास (History)</Link>
          <Link href="/admin" className="hover:text-blue-200 font-semibold text-yellow-300">एडमिन पैनल</Link>
          <button 
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded font-medium transition"
          >
            लॉगआउट
          </button>
        </div>
      </div>
    </nav>
  );
}