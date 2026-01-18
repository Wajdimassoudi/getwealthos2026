
import React, { useState } from 'react';
import { X, Upload, DollarSign, Tag, Info, Loader2 } from 'lucide-react';
import { MarketType } from '../types';
import { globalApi } from '../services/apiService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  lang: string;
  type: MarketType;
}

export const AddListingModal: React.FC<Props> = ({ isOpen, onClose, onSuccess, lang, type }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    description: '',
    location: '',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=800',
    type: type
  });

  if (!isOpen) return null;
  const isAr = lang === 'ar';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await globalApi.createListing({
        ...formData,
        price: parseFloat(formData.price)
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error(err);
      alert(isAr ? `خطأ: ${err.message || 'فشل النشر'}` : `Error: ${err.message || 'Failed to post'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl" onClick={onClose}></div>
      <div className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 duration-500">
        <div className="p-8 md:p-12">
          <button onClick={onClose} className="absolute top-8 right-8 p-2 text-slate-400 hover:text-slate-900 transition-colors">
            <X className="w-6 h-6" />
          </button>

          <div className="mb-10">
            <h2 className="text-4xl font-black text-slate-900 mb-2">
              {isAr ? 'نشر أصل جديد' : 'List Global Asset'}
            </h2>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">
              Direct Supabase Protocol v5.0
            </p>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4 md:col-span-2">
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400">{isAr ? 'عنوان العرض' : 'Asset Title'}</label>
              <div className="relative">
                <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                <input 
                  required
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder={isAr ? 'مثال: فيلا فاخرة في دبي' : 'e.g. Luxury Villa in Dubai'}
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400">{isAr ? 'السعر (USD)' : 'Price (USD)'}</label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                <input 
                  type="number" required
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={e => setFormData({...formData, price: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400">{isAr ? 'الموقع' : 'Location'}</label>
              <div className="relative">
                <Info className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                <input 
                  required
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder={isAr ? 'دبي، لندن، إلخ' : 'City, Country'}
                  value={formData.location}
                  onChange={e => setFormData({...formData, location: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-4 md:col-span-2">
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400">{isAr ? 'الوصف' : 'Full Description'}</label>
              <textarea 
                required rows={3}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder={isAr ? 'اشرح تفاصيل العرض...' : 'Describe the asset benefits...'}
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="md:col-span-2 w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-blue-500/30 hover:bg-blue-700 transition-all flex items-center justify-center gap-3 active:scale-95"
            >
              {loading ? <Loader2 className="animate-spin w-6 h-6" /> : (
                <>
                  <Upload className="w-5 h-5" />
                  {isAr ? 'تأكيد ونشر عبر Supabase' : 'Authorize & List on Supabase'}
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
