"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function AdminDashboard() {
  const router = useRouter();
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true); 
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [complaints, setComplaints] = useState<any[]>([]);
  const [registeredUsers, setRegisteredUsers] = useState<any[]>([]); // रजिस्टर्ड यूजर्स का स्टेट
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loggedIn = sessionStorage.getItem("admin_auth");
    if (loggedIn === "true") {
      setIsAuthenticated(true);
      fetchAllData();
    }
    setIsChecking(false);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "admin" && password === "amit54") {
      sessionStorage.setItem("admin_auth", "true"); 
      setIsAuthenticated(true);
      fetchAllData();
    } else {
      alert("❌ गलत यूजरनाम या पासवर्ड!");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_auth"); 
    setIsAuthenticated(false);
    setUsername("");
    setPassword("");
    router.push("/"); 
  };

  const fetchAllData = async () => {
    setLoading(true);
    
    // 1. शिकायतें लाना
    const { data: compData } = await supabase
      .from("jan_complaints")
      .select("*")
      .order('id', { ascending: false }); 
    if (compData) setComplaints(compData);

    // 2. रजिस्टर्ड नागरिक लाना
    const { data: userData } = await supabase
      .from("jan_users")
      .select("*")
      .order('id', { ascending: false });
    if (userData) setRegisteredUsers(userData);

    setLoading(false);
  };

  const updateStatus = async (id: number, newStatus: string) => {
    const { error } = await supabase
      .from("jan_complaints")
      .update({ status: newStatus })
      .eq("id", id);
      
    if (!error) fetchAllData(); 
    else alert("एरर: " + error.message);
  };

  // 1. शिकायतों की Excel
  const downloadComplaintsExcel = () => {
    let csvContent = "data:text/csv;charset=utf-8,\uFEFF"; 
    csvContent += "ID,नाम (Name),मोबाइल (Mobile),श्रेणी (Category),विवरण (Title),पता (Landmark),स्टेटस (Status)\n";
    complaints.forEach(c => {
      const row = [c.id, `"${c.name}"`, `"${c.mobile || 'N/A'}"`, `"${c.category}"`, `"${c.title ? c.title.replace(/\n/g, " ") : ""}"`, `"${c.landmark}"`, `"${c.status}"`].join(",");
      csvContent += row + "\n";
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Ward54_All_Complaints.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 2. सभी रजिस्टर्ड नागरिकों की Excel (असली लिस्ट)
  const downloadRegisteredUsersExcel = () => {
    let csvContent = "data:text/csv;charset=utf-8,\uFEFF";
    csvContent += "रजिस्ट्रेशन ID,नागरिक का नाम,मोबाइल नंबर,पंजीकरण तिथि\n";
    
    registeredUsers.forEach(u => {
      const row = [
        u.id,
        `"${u.name}"`,
        `"${u.mobile}"`,
        `"${new Date(u.created_at).toLocaleDateString('hi-IN')}"`
      ].join(",");
      csvContent += row + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Ward54_All_Registered_Citizens.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadSingleUserExcel = (comp: any) => {
    let csvContent = "data:text/csv;charset=utf-8,\uFEFF";
    csvContent += "शिकायत ID,नागरिक का नाम,मोबाइल नंबर,समस्या की श्रेणी,समस्या का विवरण,पता,वर्तमान स्टेटस\n";
    const row = [comp.id, `"${comp.name}"`, `"${comp.mobile || 'N/A'}"`, `"${comp.category}"`, `"${comp.title ? comp.title.replace(/\n/g, " ") : ""}"`, `"${comp.landmark}"`, `"${comp.status}"`].join(",");
    csvContent += row + "\n";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Citizen_${comp.name}_Data.csv`); 
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadPDF = () => {
    window.print();
  };

  if (isChecking) {
    return <div className="min-h-screen flex items-center justify-center font-bold text-slate-500">सिक्योरिटी चेक हो रही है...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4">
        <div className="bg-white/90 backdrop-blur-xl p-8 sm:p-12 rounded-[2rem] shadow-2xl border border-white max-w-md w-full text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-emerald-600"></div>
          <img src="/1000742480.png" alt="Amit Kumar" className="h-24 w-24 mx-auto rounded-full border-4 border-emerald-500 shadow-lg object-cover mb-6" />
          <h2 className="text-2xl font-black text-emerald-800 mb-2">एडमिन सुरक्षित लॉगिन</h2>
          <form onSubmit={handleLogin} className="space-y-5 text-left mt-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">यूजरनाम</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" required />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">पासवर्ड</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" required />
            </div>
            <button type="submit" className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3.5 rounded-xl transition shadow-lg mt-4 hover:-translate-y-1">
              सिक्योर लॉगिन करें
            </button>
          </form>
        </div>
      </div>
    );
  }

  const totalCount = complaints.length;
  const totalUsersCount = registeredUsers.length; // कुल रजिस्टर्ड नागरिकों की गिनती
  const pendingCount = complaints.filter(c => (c.status || "").toLowerCase() === "pending").length;
  const resolvedCount = complaints.filter(c => (c.status || "").toLowerCase() === "resolved").length;

  return (
    <div className="min-h-[calc(100vh-120px)] p-4 sm:p-8 print:p-0">
      <div className="max-w-7xl mx-auto space-y-8 print:space-y-4">
        
        {/* हेडर */}
        <div className="flex flex-col sm:flex-row justify-between items-center bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-white gap-4 print:hidden">
          <div>
            <h1 className="text-3xl font-black text-emerald-800">वार्ड प्रतिनिधि डैशबोर्ड</h1>
            <p className="text-slate-500 font-bold mt-1">वार्ड 54 - रियल-टाइम शिकायत मॉनिटरिंग सिस्टम</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={fetchAllData} className="bg-emerald-100 text-emerald-800 px-4 py-2.5 rounded-xl font-bold hover:bg-emerald-200 transition shadow-sm text-sm border border-emerald-200">
              🔄 रिफ्रेश
            </button>
            <button onClick={handleLogout} className="bg-red-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-red-700 transition shadow-md text-sm">
              लॉगआउट
            </button>
          </div>
        </div>

        {/* डाउनलोड सेक्शन */}
        <div className="bg-slate-800 p-6 rounded-2xl shadow-lg flex flex-col md:flex-row justify-between items-center gap-4 print:hidden">
          <div className="text-white">
            <h3 className="font-bold text-lg">रिपोर्ट डाउनलोड करें</h3>
            <p className="text-slate-400 text-sm">एक्सेल और PDF फॉर्मेट में डेटा निकालें</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={downloadComplaintsExcel} className="bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-xl font-bold transition shadow-md flex items-center gap-2">
              📊 शिकायतों की Excel
            </button>
            {/* यह रहा नया बटन जो सिर्फ रजिस्टर्ड नागरिकों की लिस्ट डाउनलोड करेगा */}
            <button onClick={downloadRegisteredUsersExcel} className="bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold transition shadow-md flex items-center gap-2">
              👥 रजिस्टर्ड नागरिकों की Excel ({totalUsersCount})
            </button>
            <button onClick={downloadPDF} className="bg-rose-500 hover:bg-rose-600 text-white px-5 py-2.5 rounded-xl font-bold transition shadow-md flex items-center gap-2">
              📄 PDF में सेव करें
            </button>
          </div>
        </div>

        {/* स्टैट्स कार्ड्स */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 print:grid-cols-4">
           <div className="bg-white/90 p-5 rounded-2xl shadow-lg border border-slate-100 border-l-8 border-l-indigo-500">
              <p className="text-slate-500 font-bold mb-1 text-sm sm:text-base">कुल रजिस्टर्ड नागरिक</p>
              <h3 className="text-3xl sm:text-4xl font-black text-indigo-600">{totalUsersCount}</h3>
           </div>
           <div className="bg-white/90 p-5 rounded-2xl shadow-lg border border-slate-100 border-l-8 border-l-slate-600">
              <p className="text-slate-500 font-bold mb-1 text-sm sm:text-base">कुल शिकायतें</p>
              <h3 className="text-3xl sm:text-4xl font-black text-slate-800">{totalCount}</h3>
           </div>
           <div className="bg-white/90 p-5 rounded-2xl shadow-lg border border-slate-100 border-l-8 border-l-amber-500">
              <p className="text-slate-500 font-bold mb-1 text-sm sm:text-base">लंबित (Pending)</p>
              <h3 className="text-3xl sm:text-4xl font-black text-amber-600">{pendingCount}</h3>
           </div>
           <div className="bg-white/90 p-5 rounded-2xl shadow-lg border border-slate-100 border-l-8 border-l-green-500">
              <p className="text-slate-500 font-bold mb-1 text-sm sm:text-base">समाधान हो गया</p>
              <h3 className="text-3xl sm:text-4xl font-black text-green-600">{resolvedCount}</h3>
           </div>
        </div>

        {/* शिकायतों की लिस्ट */}
        <div className="bg-white/90 backdrop-blur-md rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden print:shadow-none print:rounded-none">
          <div className="bg-slate-800 p-5">
             <h2 className="text-xl font-bold text-white">विस्तृत रिपोर्ट (Live Data)</h2>
          </div>
          <div className="overflow-x-auto p-4 sm:p-6 print:p-0">
            {loading ? (
              <p className="p-8 text-center font-bold text-slate-500 text-lg print:hidden">डेटा लोड हो रहा है...</p>
            ) : complaints.length === 0 ? (
              <p className="p-8 text-center font-bold text-slate-500 text-lg">अभी तक कोई शिकायत नहीं आई है।</p>
            ) : (
              <table className="w-full text-left border-collapse min-w-[900px]">
                <thead>
                  <tr className="bg-slate-100 text-slate-600">
                    <th className="p-4 font-bold border-b-2 border-slate-200">शिकायतकर्ता विवरण</th>
                    <th className="p-4 font-bold border-b-2 border-slate-200">समस्या का विवरण</th>
                    <th className="p-4 font-bold border-b-2 border-slate-200">वर्तमान स्टेटस</th>
                    <th className="p-4 font-bold border-b-2 border-slate-200 print:hidden">कार्रवाई (अपडेट करें)</th>
                  </tr>
                </thead>
                <tbody>
                  {complaints.map((comp) => {
                    const status = comp.status || "Pending";
                    let statusColor = "bg-amber-100 text-amber-700 border-amber-200";
                    let statusText = "⏳ Pending";
                    if (status === "Under Progress") {
                      statusColor = "bg-blue-100 text-blue-700 border-blue-200";
                      statusText = "🚧 Under Progress";
                    } else if (status === "Resolved") {
                      statusColor = "bg-green-100 text-green-700 border-green-200";
                      statusText = "✅ Resolved";
                    } else if (status === "Rejected") {
                      statusColor = "bg-red-100 text-red-700 border-red-200";
                      statusText = "❌ Rejected";
                    }

                    return (
                      <tr key={comp.id} className="border-b border-slate-200 hover:bg-slate-50 transition">
                        <td className="p-4 align-top">
                          <span className="font-bold text-slate-800 text-lg block">{comp.name}</span>
                          <span className="text-sm font-bold text-emerald-600 block mt-1">📞 {comp.mobile || "N/A"}</span>
                          <span className="text-xs font-semibold text-slate-400 mt-1 block">ID: #{comp.id}</span>
                        </td>
                        <td className="p-4 align-top">
                          <span className="text-slate-800 font-black block mb-1">{comp.category}</span>
                          <span className="text-sm text-slate-700 font-medium block">{comp.title}</span>
                          <span className="text-xs text-slate-600 mt-2 block bg-slate-100 px-2 py-1.5 rounded-lg inline-block font-semibold">📍 {comp.landmark}</span>
                        </td>
                        <td className="p-4 align-top whitespace-nowrap">
                          <span className={`px-3 py-1.5 rounded-xl text-sm font-black shadow-sm border ${statusColor}`}>
                            {statusText}
                          </span>
                        </td>
                        <td className="p-4 align-top print:hidden">
                          <div className="flex flex-col gap-2">
                            <button onClick={() => downloadSingleUserExcel(comp)} className="bg-slate-100 text-slate-700 border border-slate-300 font-bold px-3 py-1.5 rounded-lg hover:bg-slate-200 transition shadow-sm text-xs w-full text-left">
                              📥 इसका डेटा डाउनलोड करें
                            </button>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {status === "Pending" && (
                                <button onClick={() => updateStatus(comp.id, "Under Progress")} className="bg-blue-50 text-blue-700 border border-blue-200 font-bold px-3 py-1.5 rounded-lg hover:bg-blue-100 transition text-xs flex-1">
                                  🚧 प्रगति पर
                                </button>
                              )}
                              {status !== "Resolved" && status !== "Rejected" && (
                                <button onClick={() => updateStatus(comp.id, "Resolved")} className="bg-green-50 text-green-700 border border-green-200 font-bold px-3 py-1.5 rounded-lg hover:bg-green-100 transition text-xs flex-1">
                                  ✅ समाधान
                                </button>
                              )}
                              {status !== "Rejected" && status !== "Resolved" && (
                                <button onClick={() => updateStatus(comp.id, "Rejected")} className="bg-red-50 text-red-700 border border-red-200 font-bold px-3 py-1.5 rounded-lg hover:bg-red-100 transition text-xs flex-1">
                                  ❌ रद्द
                                </button>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
        
      </div>
    </div>
  );
}