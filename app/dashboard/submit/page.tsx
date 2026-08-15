"use client";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function SubmitComplaintPage() {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState(""); 
  const [category, setCategory] = useState("सफाई और कचरा प्रबंधन");
  const [title, setTitle] = useState(""); 
  const [landmark, setLandmark] = useState(""); 
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // 1. सबसे पहले नागरिक को 'jan_users' टेबल में रजिस्टर (सेव) करेंगे
    await supabase
      .from("jan_users")
      .upsert([{ name: name, mobile: mobile }], { onConflict: 'mobile' });

    // 2. फिर उसकी शिकायत 'jan_complaints' टेबल में डालेंगे
    const { error } = await supabase
      .from("jan_complaints") 
      .insert([{ 
        name: name, 
        mobile: mobile, 
        category: category, 
        title: title, 
        landmark: landmark, 
        status: "Pending" 
      }]);

    if (error) {
      alert("एरर: " + error.message);
    } else {
      alert("✅ आपकी शिकायत और रजिस्ट्रेशन सफलता पूर्वक दर्ज हो गया है!");
      setName(""); setMobile(""); setTitle(""); setLandmark("");
      router.refresh();
    }
    setLoading(false);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("citizen_auth"); 
    router.push("/"); 
  };

  return (
    <div className="min-h-[calc(100vh-120px)] p-4 sm:p-8 flex justify-center items-start">
      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 bg-white/90 backdrop-blur-xl rounded-[2rem] shadow-xl border border-white overflow-hidden">
          <div className="bg-emerald-800 p-6 text-white flex justify-between items-center border-b-4 border-emerald-600">
            <h2 className="text-xl sm:text-2xl font-black flex items-center gap-2">📝 नई शिकायत दर्ज करें</h2>
            <button onClick={handleLogout} className="text-sm bg-red-600 border border-red-500 px-5 py-2.5 rounded-xl hover:bg-red-700 transition font-bold shadow-md">
              लॉगआउट
            </button>
          </div>
          
          <div className="p-6 sm:p-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-bold text-slate-800 mb-2">आपका पूरा नाम</label>
                  <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full px-5 py-4 bg-slate-50 border border-slate-300 rounded-2xl focus:ring-4 focus:ring-emerald-500/20 outline-none transition text-lg" placeholder="AMIT KUMAR" />
                </div>
                <div>
                  <label className="block font-bold text-slate-800 mb-2">मोबाइल नंबर</label>
                  <input type="tel" required pattern="[6789][0-9]{9}" maxLength={10} title="कृपया 10 अंकों का सही मोबाइल नंबर डालें" value={mobile} onChange={(e) => setMobile(e.target.value)} className="w-full px-5 py-4 bg-slate-50 border border-slate-300 rounded-2xl focus:ring-4 focus:ring-emerald-500/20 outline-none transition text-lg" placeholder="10 अंकों का नंबर" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-bold text-slate-800 mb-2">समस्या की श्रेणी</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-5 py-4 bg-slate-50 border border-slate-300 rounded-2xl focus:ring-4 focus:ring-emerald-500/20 outline-none transition text-lg">
                    <option>सफाई और कचरा प्रबंधन</option>
                    <option>स्ट्रीट लाइट और बिजली</option>
                    <option>पेयजल व सीवरेज</option>
                    <option>सड़क और गड्ढे</option>
                    <option>अन्य समस्या</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-800 mb-2">वार्ड/गली का पता (Landmark)</label>
                  <input type="text" required value={landmark} onChange={(e) => setLandmark(e.target.value)} className="w-full px-5 py-4 bg-slate-50 border border-slate-300 rounded-2xl focus:ring-4 focus:ring-emerald-500/20 outline-none transition text-lg" placeholder="मकान नंबर, गली नंबर..." />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-2">समस्या का पूरा विवरण</label>
                <textarea rows={4} required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-5 py-4 bg-slate-50 border border-slate-300 rounded-2xl focus:ring-4 focus:ring-emerald-500/20 outline-none transition text-lg resize-none" placeholder="अपनी समस्या के बारे में विस्तार से बताएं..."></textarea>
              </div>

              <button type="submit" disabled={loading} className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-black py-4 text-xl rounded-2xl transition-all shadow-[0_10px_20px_rgba(4,_120,_87,_0.3)] disabled:opacity-50">
                {loading ? "दर्ज हो रही है..." : "शिकायत सबमिट करें"}
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="bg-white/90 backdrop-blur-xl p-8 rounded-[2rem] shadow-xl border border-white flex flex-col items-center text-center sticky top-24">
            <div className="relative">
              <img src="/1000742480.png" alt="Amit Kumar" className="h-44 w-44 rounded-full border-[6px] border-emerald-500 shadow-2xl object-cover" />
            </div>
            <h3 className="mt-6 text-3xl font-black text-slate-800">Amit Kumar</h3>
            <p className="text-sm font-black text-emerald-700 bg-emerald-50 px-5 py-2 rounded-full border-2 border-emerald-200 mt-3 shadow-sm uppercase tracking-wider">
              युवा, शिक्षित और ईमानदार
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}