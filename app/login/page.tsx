"use client";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center p-4 py-10">
      
      <div className="max-w-4xl w-full bg-white/90 backdrop-blur-md rounded-[2rem] shadow-2xl border border-white/50 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-2 bg-emerald-600"></div>
        
        <div className="flex flex-col md:flex-row items-center justify-between p-8 sm:p-12 gap-10">
          
          {/* लेफ्ट: लॉगिन फॉर्म */}
          <div className="w-full md:w-1/2">
            <h2 className="text-3xl font-black text-emerald-800 mb-2">लॉगिन करें</h2>
            <p className="text-sm font-bold text-slate-500 mb-8">अपने वार्ड 54 के अकाउंट में प्रवेश करें</p>
            
            <form className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">मोबाइल नंबर</label>
                <input type="text" className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition" placeholder="अपना 10 अंकों का नंबर डालें" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">पासवर्ड</label>
                <input type="password" className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition" placeholder="••••••••" />
              </div>
              
              <Link href="/dashboard/submit" className="block w-full text-center bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3.5 rounded-xl transition shadow-lg mt-6 hover:-translate-y-1">
                नागरिक लॉगिन
              </Link>
            </form>
          </div>

          {/* राइट: आपकी फोटो और टैगलाइन (लॉगिन पेज के अंदर भी) */}
          <div className="w-full md:w-1/2 flex flex-col items-center justify-center bg-slate-50 p-8 rounded-3xl border border-slate-100">
            <img 
              src="/1000742480.png" 
              alt="Amit Kumar" 
              className="h-32 w-32 sm:h-44 sm:w-44 rounded-full border-4 border-emerald-500 shadow-xl object-cover hover:scale-105 transition"
            />
            <h3 className="mt-4 text-xl font-extrabold text-slate-800">Amit Kumar</h3>
            <p className="text-xs sm:text-sm font-black text-emerald-700 bg-emerald-100/50 px-3 py-1 rounded-full border border-emerald-200 mt-2">
              युवा, शिक्षित और ईमानदार
            </p>
            <p className="text-center text-xs font-semibold text-slate-500 mt-4 leading-relaxed">
              "वार्ड 54 के विकास और आपकी हर समस्या के त्वरित समाधान के लिए मैं सदैव तत्पर हूँ।"
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}