
import React, { useState, useEffect } from 'react';
import { User, Phone, Briefcase, FileText, Shield, Eye, EyeOff, Save, Loader2, Camera, MapPin, Globe } from 'lucide-react';
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
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (data) setProfile(data);
      else setProfile({ id: user.id, full_name: user.name, is_public: true, country: user.country?.name || 'Global' });
      setLoading(false);
    };
    loadProfile();
  }, [user.id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    try {
      const { error } = await supabase.from('profiles').upsert(profile);
      if (error) throw error;
      alert(isAr ? 'تم حفظ ملفك الشخصي بنجاح' : 'Profile Saved to Wealth Protocol');
    } catch (err) {
      alert('Error updating profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin w-12 text-blue-600" /></div>;

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 animate-in fade-in slide-in-from-bottom-5">
      <div className="bg-white rounded-[4rem] shadow-2xl overflow-hidden border border-slate-100">
        <div className="h-64 bg-slate-900 relative">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
          <button onClick={onClose} className="absolute top-8 right-8 bg-white/10 backdrop-blur-xl text-white p-3 rounded-2xl hover:bg-white/20">
            <Shield className="w-5 h-5" />
          </button>
        </div>

        <div className="px-12 pb-16 -mt-24 relative z-10">
          <div className="flex flex-col md:flex-row items-end gap-8 mb-12">
            <div className="relative group">
              <div className="w-48 h-48 rounded-[3rem] border-8 border-white bg-slate-200 overflow-hidden shadow-2xl">
                <img src={profile?.avatar_url || `https://ui-avatars.com/api/?name=${user.name}&background=random`} className="w-full h-full object-cover" />
              </div>
              <button className="absolute bottom-2 right-2 bg-blue-600 text-white p-4 rounded-2xl shadow-xl hover:scale-110 transition-transform">
                <Camera className="w-6 h-6" />
              </button>
            </div>
            <div className="pb-4">
              <h2 className="text-4xl font-black text-slate-900 mb-2">{profile?.full_name}</h2>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-500" /> {profile?.country} (Always Public)
              </p>
            </div>
          </div>

          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 flex items-center gap-2">
                <User className="w-3 h-3" /> {isAr ? 'الاسم الرسمي' : 'Official Identity'}
              </label>
              <input 
                className="w-full bg-slate-50 border-none rounded-3xl py-5 px-8 focus:ring-2 focus:ring-blue-500 outline-none font-bold text-lg"
                value={profile?.full_name || ''}
                onChange={e => setProfile(p => p ? {...p, full_name: e.target.value} : null)}
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 flex items-center gap-2">
                <Phone className="w-3 h-3" /> {isAr ? 'الاتصال المباشر' : 'Direct Line'}
              </label>
              <input 
                placeholder="+000 000 000"
                className="w-full bg-slate-50 border-none rounded-3xl py-5 px-8 focus:ring-2 focus:ring-blue-500 outline-none font-bold text-lg"
                value={profile?.phone || ''}
                onChange={e => setProfile(p => p ? {...p, phone: e.target.value} : null)}
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 flex items-center gap-2">
                <Briefcase className="w-3 h-3" /> {isAr ? 'الخبرة المهنية' : 'Core Profession'}
              </label>
              <input 
                placeholder="CEO, Senior Dev, Trader..."
                className="w-full bg-slate-50 border-none rounded-3xl py-5 px-8 focus:ring-2 focus:ring-blue-500 outline-none font-bold text-lg"
                value={profile?.profession || ''}
                onChange={e => setProfile(p => p ? {...p, profession: e.target.value} : null)}
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 flex items-center gap-2">
                <FileText className="w-3 h-3" /> {isAr ? 'رابط السيرة الذاتية' : 'CV / Portfolio Link'}
              </label>
              <input 
                placeholder="https://linkedin.com/in/..."
                className="w-full bg-slate-50 border-none rounded-3xl py-5 px-8 focus:ring-2 focus:ring-blue-500 outline-none font-bold text-lg"
                value={profile?.cv_url || ''}
                onChange={e => setProfile(p => p ? {...p, cv_url: e.target.value} : null)}
              />
            </div>

            <div className="md:col-span-2 space-y-3">
               <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">{isAr ? 'نبذة مختصرة' : 'Professional Bio'}</label>
               <textarea 
                rows={4}
                className="w-full bg-slate-50 border-none rounded-[2rem] py-6 px-8 focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                value={profile?.bio || ''}
                onChange={e => setProfile(p => p ? {...p, bio: e.target.value} : null)}
               />
            </div>

            <div className="md:col-span-2 flex items-center justify-between p-8 bg-slate-900 rounded-[3rem] text-white">
              <div>
                <h4 className="font-black text-xl mb-1">{isAr ? 'خصوصية البيانات' : 'Data Privacy'}</h4>
                <p className="text-xs text-slate-400">{isAr ? 'اختر من يمكنه رؤية معلوماتك المهنية' : 'Decide who can view your professional identity'}</p>
              </div>
              <button 
                type="button"
                onClick={() => setProfile(p => p ? {...p, is_public: !p.is_public} : null)}
                className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black transition-all ${profile?.is_public ? 'bg-emerald-500' : 'bg-white/10'}`}
              >
                {profile?.is_public ? <Eye /> : <EyeOff />}
                {profile?.is_public ? (isAr ? 'عام للجميع' : 'Public Access') : (isAr ? 'ملف خاص' : 'Private Mode')}
              </button>
            </div>

            <button 
              type="submit"
              disabled={saving}
              className="md:col-span-2 w-full bg-blue-600 text-white py-8 rounded-[2.5rem] font-black text-2xl flex items-center justify-center gap-4 hover:bg-blue-500 transition-all shadow-[0_20px_50px_rgba(37,99,235,0.3)] active:scale-95 disabled:opacity-50"
            >
              {saving ? <Loader2 className="animate-spin" /> : <Save />}
              {isAr ? 'حفظ الهوية الرقمية' : 'Save Digital Identity'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
