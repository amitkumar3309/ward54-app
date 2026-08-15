import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center p-4 sm:p-6 text-slate-800 py-10">
      
      {/* Premium Box */}
      <div className="max-w-6xl w-full px-6 py-12 sm:py-16 bg-white/80 backdrop-blur-xl shadow-[0_20px_50px_rgba(8,_112,_184,_0.1)] rounded-[2.5rem] border border-white relative overflow-hidden">
        
        {/* Decorative background shapes */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 via-emerald-600 to-emerald-800"></div>
        
        {/* === मुख्य 3-हिस्सों वाला लेआउट === */}
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
          
          {/* 1. लेफ्ट (Left): जनसेतु लोगो */}
          <div className="w-full md:w-1/3 flex justify-center md:justify-start">
            <img 
              src="/1000743273.png" 
              alt="JanSetu Logo" 
              className="h-40 sm:h-56 drop-shadow-2xl hover:scale-105 transition duration-500 object-contain" 
            />
          </div>

          {/* 2. सेंटर (Center): टेक्स्ट और बटन */}
          <div className="w-full md:w-1/3 text-center flex flex-col items-center">
            <h2 className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-800 to-slate-800 mb-4 tracking-tight">
              जनसेतु पोर्टल
            </h2>
            <p className="text-lg sm:text-xl text-slate-700 mb-8 font-bold leading-relaxed">
              वार्ड 54 की हर समस्या का त्वरित और पारदर्शी समाधान।
            </p>
            
            <div className="flex flex-col gap-4 w-full px-4 sm:px-0">
              <Link href="/login" className="w-full py-4 bg-emerald-700 text-white text-lg font-bold rounded-2xl hover:bg-emerald-800 transition-all shadow-[0_10px_20px_rgba(4,_120,_87,_0.3)] hover:-translate-y-1">
                लॉगिन करें (Login)
              </Link>
              <Link href="/register" className="w-full py-4 bg-white text-emerald-700 border-2 border-emerald-700 text-lg font-bold rounded-2xl hover:bg-emerald-50 transition-all shadow-sm hover:-translate-y-1">
                नया अकाउंट बनाएं
              </Link>
              <Link href="/admin" className="mt-3 text-sm font-bold text-slate-500 hover:text-emerald-700 underline underline-offset-4">
                एडमिन लॉगिन यहाँ से करें
              </Link>
            </div>
          </div>

          {/* 3. राइट (Right): आपकी फोटो और टैगलाइन */}
          <div className="w-full md:w-1/3 flex flex-col items-center md:justify-end">
            <div className="relative">
              <img 
                src="/1000742480.png" 
                alt="Amit Kumar" 
                className="h-40 w-40 sm:h-52 sm:w-52 rounded-full border-4 sm:border-[6px] border-emerald-500 shadow-2xl object-cover hover:scale-105 transition duration-500"
              />
              <span className="absolute bottom-2 right-4 h-6 w-6 bg-green-500 border-4 border-white rounded-full"></span>
            </div>
            <h3 className="mt-5 text-2xl font-extrabold text-slate-800">Amit Kumar</h3>
            <p className="text-sm font-black text-emerald-700 bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-200 mt-2 shadow-sm uppercase tracking-wide">
              युवा, शिक्षित और ईमानदार
            </p>
          </div>

        </div>
      </div>
      
      <p className="mt-8 text-sm font-bold text-slate-500 text-center">
        © 2026 जनसेतु पोर्टल • अमित कुमार द्वारा संचालित
      </p>
    </div>
  );
}