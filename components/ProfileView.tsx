
import React, { useState, useEffect } from 'react';
import { User, Phone, Briefcase, FileText, Shield, Eye, EyeOff, Save, Loader2, Camera, MapPin } from 'lucide-react';
import { supabase } from '../services/supabaseClient';
import { globalApi } from '../services/apiService';
import { UserProfile } from '../types';

interface Props {
  user: any;
  lang: string;
  onClose: () => void;
}

export const ProfileView: React.FC<Props> = ({ user, lang, onClose }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const isAr = lang === 'ar';

  useEffect(() => {
    const loadProfile = async () => {
      const data = await globalApi.getProfile(user.id);
      if (data) setProfile(data);
      setLoading(false);
    };
    loadProfile();
  }, [user.id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    try {
      await globalApi.updateProfile(user.id, profile);
      alert(isAr ? 'تم حفظ الملف الشخصي' : 'Profile Updated Successfully');
    } catch (err) {
      alert('Error saving profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin w-10 h-10 text-blue-600" /></div>;

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 animate-in fade-in slide-in-from-bottom-5">
      <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100">
        <div className="h-48 bg-gradient-to-r from-blue-600 to-indigo-700 relative">
          <button onClick={onClose} className="absolute top-6 right-6 bg-white/20 backdrop-blur-md text-white p-2 rounded-full hover:bg-white/40">
            <Shield className="w-5 h-5" />
          </button>
        </div>
        
        <div className="px-8 pb-12 -mt-20">
          <div className="relative inline-block mb-8">
            <div className="w-40 h-40 rounded-[2.5rem] border-8 border-white bg-slate-200 overflow-hidden shadow-xl">
              <img src={profile?.avatar_url || `https://ui-avatars.com/api/?name=${user.name}&background=random`} className="w-full h-full object-cover" />
            </div>
            <button className="absolute bottom-2 right-2 bg-blue-600 text-white p-3 rounded-2xl shadow-lg hover:scale-110 transition-transform">
              <Camera className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <User className="w-3 h-3" /> {isAr ? 'الاسم الكامل' : 'Full Identity'}
              </label>
              <input 
                className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                value={profile?.full_name || ''}
                onChange={e => setProfile(p => p ? {...p, full_name: e.target.value} : null)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <Phone className="w-3 h-3" /> {isAr ? 'رقم الهاتف' : 'Contact Phone'}
              </label>
              <input 
                className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                placeholder="+000 000 000"
                value={profile?.phone || ''}
                onChange={e => setProfile(p => p ? {...p, phone: e.target.value} : null)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <Briefcase className="w-3 h-3" /> {isAr ? 'المهنة' : 'Profession'}
              </label>
              <input 
                className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                placeholder="CEO / Developer / Trader"
                value={profile?.profession || ''}
                onChange={e => setProfile(p => p ? {...p, profession: e.target.value} : null)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <MapPin className="w-3 h-3" /> {isAr ? 'البلد (عام دائماً)' : 'Country (Public)'}
              </label>
              <div className="w-full bg-slate-100/50 text-slate-400 rounded-2xl py-4 px-6 font-bold cursor-not-allowed">
                {profile?.country || 'Global'}
              </div>
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <FileText className="w-3 h-3" /> {isAr ? 'رابط السيرة الذاتية (CV)' : 'CV / Portfolio Link'}
              </label>
              <input 
                className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                placeholder="https://linkedin.com/in/..."
                value={profile?.cv_url || ''}
                onChange={e => setProfile(p => p ? {...p, cv_url: e.target.value} : null)}
              />
            </div>

            <div className="md:col-span-2 flex items-center justify-between p-6 bg-slate-50 rounded-[2rem]">
              <div>
                <h4 className="font-black text-slate-900">{isAr ? 'خصوصية الملف' : 'Profile Visibility'}</h4>
                <p className="text-xs text-slate-500">{isAr ? 'اجعل معلوماتك مرئية للمستثمرين والشركاء' : 'Allow others to see your professional identity'}</p>
              </div>
              <button 
                type="button"
                onClick={() => setProfile(p => p ? {...p, is_public: !p.is_public} : null)}
                className={`flex items-center gap-3 px-6 py-3 rounded-xl font-bold transition-all ${profile?.is_public ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}
              >
                {profile?.is_public ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                {profile?.is_public ? (isAr ? 'عام' : 'Public') : (isAr ? 'خاص' : 'Private')}
              </button>
            </div>

            <button 
              type="submit"
              disabled={saving}
              className="md:col-span-2 w-full bg-slate-900 text-white py-6 rounded-3xl font-black text-xl flex items-center justify-center gap-4 hover:bg-blue-600 transition-all shadow-xl active:scale-95 disabled:opacity-50"
            >
              {saving ? <Loader2 className="animate-spin" /> : <Save className="w-6 h-6" />}
              {isAr ? 'حفظ التغييرات النخبوية' : 'Save Elite Identity'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
