import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "JanSetu - Ward 54 | Amit Kumar",
  description: "नागरिक सेवा एवं शिकायत निवारण पोर्टल",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hi">
      <body
        className={`${inter.className} bg-slate-50 relative min-h-screen flex flex-col`}
      >
        {/* === 100% पक्का वाटरमार्क बैकग्राउंड === */}
        <div
          style={{
            backgroundImage: "url('/1000743273.png')",
            backgroundSize: "contain",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            opacity: 0.05,
            position: "fixed",
            top: "10%",
            left: "5%",
            width: "90%",
            height: "80%",
            zIndex: -1,
            pointerEvents: "none",
          }}
        ></div>

        {/* === टॉप हेडर (अब राइट साइड से फोटो हटा दी गई है) === */}
        <header className="bg-white/95 backdrop-blur-lg shadow-sm border-b-2 border-emerald-100 z-50">
          <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
            
            {/* Left Side: Logo & App Name */}
            <div className="flex items-center gap-3">
              <div className="bg-emerald-50 p-1.5 rounded-full shadow-sm border border-emerald-100">
                <img
                  src="/1000743273.png"
                  alt="JanSetu Logo"
                  className="h-10 w-10 sm:h-12 sm:w-12 object-contain"
                />
              </div>

              <div>
                <h1 className="text-xl sm:text-2xl font-black text-emerald-800 tracking-tight">
                  जनसेतु
                </h1>

                <p className="text-[10px] sm:text-xs font-bold text-slate-500 tracking-wide">
                  वार्ड 54 - त्वरित समाधान
                </p>
              </div>
            </div>

            {/* Right Side: सिर्फ एक सिंपल होम बटन */}
            <div>
              <Link
                href="/"
                className="text-sm font-bold text-emerald-700 bg-emerald-50 px-4 py-2 rounded-lg border border-emerald-200 hover:bg-emerald-100 transition"
              >
                होम पेज
              </Link>
            </div>
          </div>
        </header>

        {/* === रनिंग टेक्स्ट (Professional News Ticker) === */}
        <div className="bg-emerald-800 text-white py-2 shadow-md border-b-4 border-amber-400 z-40">
          <div className="overflow-hidden whitespace-nowrap">
            <div
              className="font-extrabold text-sm sm:text-base tracking-wide"
              style={{
                display: "inline-block",
                paddingLeft: "100%",
                animation: "janSetuMarquee 22s linear infinite",
              }}
            >
              🏛️ जनसेतु — वार्ड 54 के नागरिकों की समस्याओं को समाधान तक पहुँचाने की एक पहल
              &nbsp;&nbsp;&nbsp; | &nbsp;&nbsp;&nbsp;
              📢 अपनी समस्या दर्ज करें और उसके समाधान की प्रगति से जुड़े रहें
            </div>

            <style>{`
              @keyframes janSetuMarquee {
                0% {
                  transform: translateX(0);
                }
                100% {
                  transform: translateX(-100%);
                }
              }
            `}</style>
          </div>
        </div>

        {/* === Main Content === */}
        <main className="relative z-10 flex-grow">
          {children}
        </main>
      </body>
    </html>
  );
}