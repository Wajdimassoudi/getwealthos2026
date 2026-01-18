
import React, { useState } from 'react';
import { X, Mail, Lock, User, Globe, ArrowRight, Loader2, RefreshCcw, ChevronLeft } from 'lucide-react';
import { COUNTRIES } from '../constants';
import { supabase } from '../services/supabaseClient';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: any) => void;
  lang: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess, lang }) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
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
    setMessage('');

    try {
      if (mode === 'forgot') {
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(formData.email, {
          redirectTo: window.location.origin,
        });
        if (resetError) throw resetError;
        setMessage(isAr ? 'تم إرسال رابط إعادة التعيين إلى بريدك الإلكتروني.' : 'Password reset link sent to your email.');
      } else if (mode === 'login') {
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
          setMessage(isAr ? 'تم بنجاح! يرجى التحقق من بريدك الإلكتروني لتفعيل الحساب.' : 'Success! Please check your email to verify account.');
        }
      }
    } catch (err: any) {
      console.error("Auth Exception:", err);
      let msg = err.message;
      if (isAr) {
        if (msg.includes('Invalid login credentials')) msg = 'بيانات الدخول غير صحيحة.';
        if (msg.includes('User already registered')) msg = 'هذا البريد مسجل مسبقاً.';
        if (msg.includes('Password should be')) msg = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل.';
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={onClose}></div>
      <div className="relative w-full max-w-md bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
        <div className="p-8 sm:p-10">
          <button onClick={onClose} className="absolute top-6 right-6 p-2 text-white/50 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>

          <div className="text-center mb-8">
            <div className="inline-flex bg-blue-600 w-12 h-12 rounded-2xl items-center justify-center text-white font-black text-2xl shadow-xl shadow-blue-500/20 mb-4 mx-auto">W</div>
            <h2 className="text-3xl font-black text-white tracking-tight">
              {mode === 'login' && (isAr ? 'تسجيل الدخول' : 'Wealth Sign In')}
              {mode === 'signup' && (isAr ? 'حساب ثراء جديد' : 'New Wealth ID')}
              {mode === 'forgot' && (isAr ? 'استعادة الثراء' : 'Recover Wealth')}
            </h2>
          </div>

          {(error || message) && (
            <div className={`mb-6 p-4 rounded-2xl text-xs font-bold border animate-in slide-in-from-top-2 ${message ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-200' : 'bg-red-500/20 border-red-500/50 text-red-200'}`}>
              {error || message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 w-5 h-5" />
                <input 
                  type="text" required
                  placeholder={isAr ? 'الاسم الكامل' : 'Full Name'} 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                  onChange={(e) => setFormData({...formData, name: e.target.value})} 
                />
              </div>
            )}
            
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 w-5 h-5" />
              <input 
                type="email" required
                placeholder={isAr ? 'البريد الإلكتروني' : 'Email Address'} 
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                onChange={(e) => setFormData({...formData, email: e.target.value})} 
              />
            </div>

            {mode !== 'forgot' && (
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 w-5 h-5" />
                <input 
                  type="password" required
                  placeholder={isAr ? 'كلمة المرور' : 'Password'} 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                  onChange={(e) => setFormData({...formData, password: e.target.value})} 
                />
              </div>
            )}

            {mode === 'login' && (
              <div className="flex justify-end">
                <button 
                  type="button" 
                  onClick={() => setMode('forgot')}
                  className="text-[10px] font-black uppercase tracking-widest text-blue-400 hover:text-blue-300 transition-colors"
                >
                  {isAr ? 'نسيت كلمة المرور؟' : 'Forgot Password?'}
                </button>
              </div>
            )}

            {mode === 'signup' && (
              <div className="relative">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 w-5 h-5" />
                <select 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white appearance-none outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.country}
                  onChange={(e) => setFormData({...formData, country: e.target.value})}
                >
                  {COUNTRIES.map(c => (
                    <option key={c.code} value={c.code} className="bg-slate-900">{c.flag} {c.name}</option>
                  ))}
                </select>
              </div>
            )}

            <button 
              type="submit" disabled={loading}
              className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 active:scale-95 shadow-2xl shadow-blue-500/30 hover:bg-blue-500 disabled:opacity-50 transition-all"
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                <>
                  {mode === 'forgot' ? (isAr ? 'إرسال الرابط' : 'Send Reset Link') : (mode === 'login' ? (isAr ? 'دخول' : 'Sign In') : (isAr ? 'إنشاء الحساب' : 'Create ID'))}
                  {!loading && <ArrowRight className={`w-5 h-5 ${isAr ? 'rotate-180' : ''}`} />}
                </>
              )}
            </button>
          </form>

          <div className="mt-6 flex flex-col gap-4 items-center">
            {mode === 'forgot' ? (
              <button 
                onClick={() => setMode('login')} 
                className="text-white/50 text-xs font-bold flex items-center gap-2 hover:text-white transition-colors"
              >
                <ChevronLeft className={`w-4 h-4 ${isAr ? 'rotate-180' : ''}`} />
                {isAr ? 'العودة لتسجيل الدخول' : 'Back to Login'}
              </button>
            ) : (
              <button onClick={() => setMode(mode === 'login' ? 'signup' : 'login')} className="text-white/50 text-xs font-bold uppercase tracking-widest hover:text-blue-400 transition-colors">
                {mode === 'login' ? (isAr ? 'ليس لديك حساب؟ سجل الآن' : 'New to WealthOS? Register') : (isAr ? 'لديك حساب بالفعل؟ دخول' : 'Already a member? Sign In')}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
