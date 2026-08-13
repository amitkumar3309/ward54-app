'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function HistoryPage() {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('complaints')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setComplaints(data || []);
    } catch (err) {
      console.error('Error fetching complaints:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-blue-900 mb-6">मेरी शिकायतें (Complaint History)</h1>
      
      {loading ? (
        <p>लोड हो रहा है...</p>
      ) : complaints.length === 0 ? (
        <p>अभी तक कोई शिकायत दर्ज नहीं की गई है।</p>
      ) : (
        <div className="space-y-4">
          {complaints.map((c) => (
            <div key={c.id} className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-900">
              <div className="flex justify-between items-start">
                <h2 className="font-bold text-lg">{c.title}</h2>
                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                  c.status === 'Resolved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {c.status}
                </span>
              </div>
              <p className="text-sm text-slate-600 mt-1">ID: {c.complaint_code} | {c.category}</p>
              <p className="text-sm mt-2">{c.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}