'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

const CATEGORIES = ['सड़क', 'नाली', 'सफाई', 'पानी', 'स्ट्रीट लाइट', 'पार्क', 'आवारा पशु', 'सीवर', 'कचरा', 'अन्य'];

export default function SubmitComplaintPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [priority, setPriority] = useState<'Normal' | 'High'>('Normal');
  const [landmark, setLandmark] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [locationStatus, setLocationStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // फोटो को 1MB से कम में कंप्रेस करने का फंक्शन
  const compressImage = (imageFile: File): Promise<File> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(imageFile);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // डाइमेंशन थोड़ा छोटा करें ताकि साइज 1MB के अंदर आए
          const MAX_WIDTH = 1024;
          const MAX_HEIGHT = 1024;
          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                const compressedFile = new File([blob], imageFile.name, {
                  type: 'image/jpeg',
                  lastModified: Date.now(),
                });
                resolve(compressedFile);
              } else {
                resolve(imageFile);
              }
            },
            'image/jpeg',
            0.7 // 70% क्वालिटी ताकि साइज 1MB से कम रहे
          );
        };
      };
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setErrorMessage('');

      try {
        // ऑटोमैटिक 1MB के अंदर कंप्रेस करें
        const compressed = await compressImage(selectedFile);
        if (compressed.size > 1 * 1024 * 1024) {
          setErrorMessage('फोटो का आकार 1MB से कम नहीं हो पाया। कृपया छोटी फोटो चुनें।');
          return;
        }
        setFile(compressed);
        setPreviewUrl(URL.createObjectURL(compressed));
      } catch (err) {
        setFile(selectedFile);
        setPreviewUrl(URL.createObjectURL(selectedFile));
      }
    }
  };

  const captureGPS = () => {
    if (!navigator.geolocation) {
      setLocationStatus('आपका ब्राउज़र GPS सपोर्ट नहीं करता है।');
      return;
    }
    setLocationStatus('लोकेशन प्राप्त की जा रही है...');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        setLocationStatus('📍 लोकेशन सफलतापूर्वक कैप्चर हो गई है।');
      },
      () => {
        setLocationStatus('लोकेशन प्राप्त करने में विफल। कृपया अनुमति दें।');
      },
      { enableHighAccuracy: true }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('कृपया पहले लॉगिन करें।');

      let photoPath = null;
      if (file) {
        const fileExt = file.name.split('.').pop() || 'jpg';
        const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
        const filePath = `complaints/${fileName}`;
        const { error: uploadError } = await supabase.storage.from('complaint-photos').upload(filePath, file);
        if (uploadError) throw uploadError;
        photoPath = filePath;
      }

      const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
      const complaintCode = `W54-${dateStr}-${randomSuffix}`;

      const { data: complaintData, error: insertError } = await supabase
        .from('complaints')
        .insert([{
          complaint_code: complaintCode,
          user_id: user.id,
          title,
          category,
          priority,
          landmark,
          description,
          latitude,
          longitude,
          photo_path: photoPath,
          status: 'Pending'
        }])
        .select()
        .single();

      if (insertError) throw insertError;

      await supabase.from('complaint_updates').insert([{
        complaint_id: complaintData.id,
        actor_id: user.id,
        update_type: 'SUBMITTED',
        message: 'शिकायत सफलतापूर्वक दर्ज की गई।'
      }]);

      alert(`शिकायत सफलतापूर्वक दर्ज हो गई है!\nशिकायत आईडी: ${complaintCode}`);
      router.push('/dashboard/history');
    } catch (err: any) {
      setErrorMessage(err.message || 'कुछ समस्या आ गई है। कृपया दोबारा प्रयास करें।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 bg-white shadow-md rounded-lg my-8">
      <h1 className="text-2xl font-bold text-blue-900 mb-2">नई समस्या दर्ज करें</h1>
      <p className="text-slate-600 mb-6">वार्ड नं. 54 जनसेवा साथी पोर्टल</p>

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 text-sm">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">समस्या का शीर्षक (Problem Title)*</label>
          <input
            type="text"
            required
            placeholder="उदा. सड़क टूटी हुई है"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-slate-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">श्रेणी (Category)*</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-slate-300 rounded-md p-2 bg-white text-slate-800"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">प्राथमिकता (Priority)</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as 'Normal' | 'High')}
              className="w-full border border-slate-300 rounded-md p-2 bg-white text-slate-800"
            >
              <option value="Normal">सामान्य (Normal)</option>
              <option value="High">उच्च (High)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">स्थान / लैंडमार्क (Location / Landmark)*</label>
          <input
            type="text"
            required
            placeholder="उदा. XYZ स्कूल के पास"
            value={landmark}
            onChange={(e) => setLandmark(e.target.value)}
            className="w-full border border-slate-300 rounded-md p-2"
          />
        </div>

        <div>
          <button
            type="button"
            onClick={captureGPS}
            className="bg-emerald-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-emerald-700 transition"
          >
            📍 वर्तमान लोकेशन प्राप्त करें (Use GPS)
          </button>
          {locationStatus && <p className="text-sm text-slate-600 mt-1">{locationStatus}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">विस्तृत विवरण (Detailed Remark)*</label>
          <textarea
            required
            rows={4}
            placeholder="समस्या के बारे में विस्तार से बताएं..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-slate-300 rounded-md p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">फोटो अपलोड करें (Photo Upload - Max 1MB)</label>
          <input
            type="file"
            accept="image/png, image/jpeg, image/webp"
            onChange={handleFileChange}
            className="w-full border border-slate-300 rounded-md p-1 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-750 hover:file:bg-blue-100"
          />
          {previewUrl && (
            <div className="mt-3">
              <img src={previewUrl} alt="Preview" className="h-32 w-auto rounded border object-cover" />
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-900 text-white py-3 rounded-md font-semibold hover:bg-blue-800 transition disabled:opacity-50"
        >
          {loading ? 'शिकायत दर्ज हो रही है...' : 'शिकायत दर्ज करें'}
        </button>
      </form>
    </div>
  );
}