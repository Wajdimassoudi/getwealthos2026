
import React, { useState } from 'react';
import { X, Mail, Lock, User, Globe, ArrowRight, Loader2 } from 'lucide-react';
import { COUNTRIES } from '../constants';
import { supabase } from '../services/supabaseClient';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: any) => void;
  lang: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess, lang }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    country: COUNTRIES[0].code
  });

  if (!isOpen) return null;

  const isAr = lang === 'ar';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        const { data, error: authError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (authError) throw authError;

        if (data.user) {
          const selectedCountry = COUNTRIES.find(c => c.code === (data.user.user_metadata?.country || formData.country)) || COUNTRIES[0];
          onSuccess({
            id: data.user.id,
            name: data.user.user_metadata?.full_name || data.user.email,
            email: data.user.email,
            country: selectedCountry,
            balance: 0
          });
          onClose();
        }
      } else {
        const { data, error: authError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.name,
              country: formData.country,
            }
          }
        });

        if (authError) throw authError;

        if (data.user) {
          setError(isAr ? 'تم إنشاء الحساب! يرجى التحقق من بريدك لتأكيد الحساب.' : 'Account created! Please check your email.');
        }
      }
    } catch (err: any) {
      setError(err.message || (isAr ? 'فشل الاتصال.' : 'Auth failed.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-md bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
        <div className="p-8 sm:p-10">
          <button onClick={onClose} className="absolute top-6 right-6 p-2 text-white/50 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>

          <div className="text-center mb-8">
            <div className="inline-flex bg-blue-600 w-12 h-12 rounded-2xl items-center justify-center text-white font-black text-2xl shadow-xl shadow-blue-500/20 mb-4 mx-auto">W</div>
            <h2 className="text-3xl font-black text-white">{isLogin ? (isAr ? 'دخول' : 'Sign In') : (isAr ? 'حساب جديد' : 'Sign Up')}</h2>
          </div>

          {error && <div className="mb-4 p-4 rounded-xl bg-red-500/20 border border-red-500/50 text-red-200 text-xs font-bold">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 w-5 h-5" />
                <input type="text" required placeholder={isAr ? 'الاسم' : 'Name'} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:ring-2 focus:ring-blue-500" onChange={(e) => setFormData({...formData, name: e.target.value})} />
              </div>
            )}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 w-5 h-5" />
              <input type="email" required placeholder={isAr ? 'البريد' : 'Email'} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:ring-2 focus:ring-blue-500" onChange={(e) => setFormData({...formData, email: e.target.value})} />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 w-5 h-5" />
              <input type="password" required placeholder={isAr ? 'كلمة المرور' : 'Password'} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:ring-2 focus:ring-blue-500" onChange={(e) => setFormData({...formData, password: e.target.value})} />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 active:scale-95 shadow-xl shadow-blue-500/30">
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (isLogin ? (isAr ? 'دخول' : 'Sign In') : (isAr ? 'إنشاء' : 'Sign Up'))}
            </button>
          </form>

          <button onClick={() => setIsLogin(!isLogin)} className="w-full mt-6 text-white/50 text-sm font-bold uppercase hover:text-blue-400">
            {isLogin ? (isAr ? 'ليس لديك حساب؟' : 'Need an account?') : (isAr ? 'لديك حساب؟' : 'Have an account?')}
          </button>
        </div>
      </div>
    </div>
  );
};
