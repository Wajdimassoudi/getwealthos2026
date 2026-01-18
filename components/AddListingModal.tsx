
import React, { useState, useEffect } from 'react';
import { X, Upload, DollarSign, Tag, Info, Loader2, Image as ImageIcon, Plus, Trash2, MapPin } from 'lucide-react';
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
  const [images, setImages] = useState<string[]>(['']);
  const isAr = lang === 'ar';

  const [formData, setFormData] = useState({
    title: '',
    price: '',
    description: '',
    location: '',
    sub_type: '',
    listing_type: 'sale', // sale or rent
    specs: {} as any
  });

  if (!isOpen) return null;

  const handleAddImageField = () => {
    if (images.length < 6) setImages([...images, '']);
  };

  const handleImageChange = (index: number, val: string) => {
    const newImages = [...images];
    newImages[index] = val;
    setImages(newImages);
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await globalApi.createListing({
        ...formData,
        type: type,
        images: images.filter(img => img.trim() !== ''),
        price: parseFloat(formData.price),
        created_at: new Date().toISOString()
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      alert(isAr ? `خطأ: ${err.message}` : `Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const renderCategorySpecs = () => {
    switch (type) {
      case MarketType.REAL_ESTATE:
        return (
          <>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400">{isAr ? 'نوع العقار' : 'Property Type'}</label>
              <select 
                className="w-full bg-slate-50 border rounded-2xl py-3 px-4 font-bold outline-none"
                onChange={e => setFormData({...formData, sub_type: e.target.value})}
              >
                <option value="apartment">{isAr ? 'شقة' : 'Apartment'}</option>
                <option value="shop">{isAr ? 'محلة / تجاري' : 'Shop / Commercial'}</option>
                <option value="villa">{isAr ? 'فيلا' : 'Villa'}</option>
                <option value="land">{isAr ? 'أرض' : 'Land'}</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400">{isAr ? 'الغرض' : 'Purpose'}</label>
              <select 
                className="w-full bg-slate-50 border rounded-2xl py-3 px-4 font-bold outline-none"
                onChange={e => setFormData({...formData, listing_type: e.target.value})}
              >
                <option value="sale">{isAr ? 'للبيع' : 'For Sale'}</option>
                <option value="rent">{isAr ? 'للكراء (إيجار)' : 'For Rent'}</option>
              </select>
            </div>
          </>
        );
      case MarketType.CARS:
        return (
          <>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400">{isAr ? 'سنة الصنع' : 'Year'}</label>
              <input type="number" placeholder="2024" className="w-full bg-slate-50 border rounded-2xl py-3 px-4" onChange={e => setFormData({...formData, specs: {...formData.specs, year: e.target.value}})} />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400">{isAr ? 'المسافة المقطوعة' : 'Mileage'}</label>
              <input type="text" placeholder="0 km" className="w-full bg-slate-50 border rounded-2xl py-3 px-4" onChange={e => setFormData({...formData, specs: {...formData.specs, mileage: e.target.value}})} />
            </div>
          </>
        );
      default: return null;
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" onClick={onClose}></div>
      <div className="relative w-full max-w-3xl bg-white rounded-[3rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 max-h-[90vh] overflow-y-auto">
        <div className="p-10">
          <button onClick={onClose} className="absolute top-8 right-8 text-slate-400 hover:text-slate-900"><X /></button>
          
          <h2 className="text-4xl font-black text-slate-900 mb-8">
            {isAr ? 'نشر في سوق' : 'List in Market'}: {type}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-black uppercase text-slate-400">{isAr ? 'العنوان' : 'Title'}</label>
                <input required className="w-full bg-slate-50 border rounded-2xl py-4 px-6 font-bold" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400">{isAr ? 'السعر (USD)' : 'Price (USD)'}</label>
                <input type="number" required className="w-full bg-slate-50 border rounded-2xl py-4 px-6 font-bold" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400">{isAr ? 'الموقع' : 'Location'}</label>
                <input required className="w-full bg-slate-50 border rounded-2xl py-4 px-6 font-bold" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
              </div>

              {renderCategorySpecs()}
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-black uppercase text-slate-400">{isAr ? 'صور المنتج (6 كحد أقصى)' : 'Images (Max 6)'}</label>
                <button type="button" onClick={handleAddImageField} disabled={images.length >= 6} className="text-blue-600 font-bold text-xs flex items-center gap-1 disabled:opacity-30">
                  <Plus className="w-4 h-4" /> {isAr ? 'إضافة رابط صورة' : 'Add Image URL'}
                </button>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {images.map((img, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input 
                      placeholder="https://..."
                      className="flex-1 bg-slate-50 border rounded-xl py-3 px-4 text-xs"
                      value={img}
                      onChange={e => handleImageChange(idx, e.target.value)}
                    />
                    {idx > 0 && (
                      <button type="button" onClick={() => handleRemoveImage(idx)} className="text-red-400 hover:text-red-600">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400">{isAr ? 'الوصف الكامل' : 'Full Description'}</label>
              <textarea rows={4} className="w-full bg-slate-50 border rounded-2xl py-4 px-6" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
            </div>

            <button disabled={loading} className="w-full bg-slate-900 text-white py-6 rounded-3xl font-black text-xl hover:bg-blue-600 transition-all flex items-center justify-center gap-4">
              {loading ? <Loader2 className="animate-spin" /> : <Upload />}
              {isAr ? 'نشر العرض الآن' : 'Publish Listing Now'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
