'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function AdminDashboard() {
  const router = useRouter();
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    checkAdminAndFetch();
  }, []);

  const checkAdminAndFetch = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      // डेटाबेस से चेक करें कि क्या इस यूजर का रोल SUPER_ADMIN है
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profileError || profile?.role !== 'SUPER_ADMIN') {
        alert('अस्वीकृत: यह पेज केवल एडमिन के लिए है!');
        router.push('/dashboard/submit');
        return;
      }

      // अगर एडमिन है, तो ऑथराइज्ड करें और डेटा लोड करें
      setAuthorized(true);
      await fetchAdminComplaints();
    } catch (err) {
      console.error('Error checking admin role:', err);
      router.push('/dashboard/submit');
    }
  };

  const fetchAdminComplaints = async () => {
    try {
      const { data, error } = await supabase
        .from('complaints')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setComplaints(data || []);
    } catch (err) {
      console.error('Error fetching admin complaints:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('complaints')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      fetchAdminComplaints(); // लिस्ट रिफ्रेश करें
    } catch (err: any) {
      alert('स्टेटस अपडेट करने में त्रुटि: ' + err.message);
    }
  };

  if (!authorized) {
    return <div className="p-6 text-center text-slate-600">सुरक्षा जाँच की जा रही है...</div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-blue-900 mb-6">एडमिन डैशबोर्ड (वार्ड 54)</h1>
      
      {loading ? (
        <p className="text-slate-600">लोड हो रहा है...</p>
      ) : complaints.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow text-center text-slate-600">
          पोर्टल पर अभी तक कोई शिकायत दर्ज नहीं की गई है।
        </div>
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="w-full text-left border-collapse">
            <thead className="bg-blue-900 text-white">
              <tr>
                <th className="p-3">कोड</th>
                <th className="p-3">समस्या और विवरण</th>
                <th className="p-3">श्रेणी / लैंडमार्क</th>
                <th className="p-3">स्टेटस</th>
                <th className="p-3">कार्रवाई</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((c) => (
                <tr key={c.id} className="border-b hover:bg-slate-50">
                  <td className="p-3 font-mono text-sm font-semibold text-blue-900">{c.complaint_code}</td>
                  <td className="p-3">
                    <p className="font-bold text-slate-800">{c.title}</p>
                    <p className="text-sm text-slate-600">{c.description}</p>
                  </td>
                  <td className="p-3 text-sm text-slate-700">
                    <span className="bg-slate-100 px-2 py-0.5 rounded font-medium">{c.category}</span>
                    <p className="text-xs text-slate-500 mt-1">स्थान: {c.landmark}</p>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      c.status === 'Resolved' ? 'bg-green-100 text-green-700' : 
                      c.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="p-3 space-x-3 text-sm">
                    <button 
                      onClick={() => updateStatus(c.id, 'In Progress')} 
                      className="text-blue-600 font-medium hover:underline"
                    >
                      प्रगति पर
                    </button>
                    <button 
                      onClick={() => updateStatus(c.id, 'Resolved')} 
                      className="text-green-600 font-medium hover:underline"
                    >
                      समाधान
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}