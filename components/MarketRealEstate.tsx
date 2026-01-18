
import React, { useEffect, useRef, useState } from 'react';
import { Country, MarketType } from '../types';
import { Home, MapPin, Maximize, ShieldCheck, Upload, ArrowUpRight, Loader2, Key, Tag } from 'lucide-react';
import { globalApi } from '../services/apiService';

interface MarketProps {
  country: Country;
  lang: string;
  onAddClick: () => void;
}

export const MarketRealEstate: React.FC<MarketProps> = ({ country, lang, onAddClick }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const isAr = lang === 'ar';

  const formatPrice = (usd: number) => {
    return new Intl.NumberFormat(isAr ? 'ar-SA' : 'en-US', {
      style: 'currency',
      currency: country.currency
    }).format(usd * country.rate);
  };

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const data = await globalApi.getListings('REAL_ESTATE');
      setListings(data.length > 0 ? data : [
        { id: 'd1', title: 'Luxury Penthouse', price: 1200000, location: 'Dubai', sub_type: 'apartment', listing_type: 'sale', images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800'] },
        { id: 'd2', title: 'Modern Retail Shop', price: 5000, location: 'Casablanca', sub_type: 'shop', listing_type: 'rent', images: ['https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800'] }
      ]);
      setLoading(false);
    };
    fetch();
  }, []);

  const filteredListings = filter === 'all' ? listings : listings.filter(l => l.listing_type === filter);

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-5xl font-black text-slate-900 flex items-center gap-4">
            <Home className="text-blue-600 w-12 h-12" />
            {isAr ? 'عقارات ومحلات' : 'Estates & Shops'}
          </h2>
          <div className="flex gap-4 mt-4">
            <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${filter === 'all' ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-100 text-slate-500'}`}>
              {isAr ? 'الكل' : 'All'}
            </button>
            <button onClick={() => setFilter('sale')} className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${filter === 'sale' ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-100 text-slate-500'}`}>
              {isAr ? 'للبيع' : 'For Sale'}
            </button>
            <button onClick={() => setFilter('rent')} className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${filter === 'rent' ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-100 text-slate-500'}`}>
              {isAr ? 'للكراء' : 'For Rent'}
            </button>
          </div>
        </div>
        
        <button onClick={onAddClick} className="bg-slate-900 text-white px-10 py-5 rounded-3xl font-black text-sm flex items-center gap-3 hover:bg-blue-600 transition-all shadow-xl">
          <Upload className="w-5 h-5" />
          {isAr ? 'نشر عقار أو محل' : 'Post Estate/Shop'}
        </button>
      </div>

      {loading ? (
        <div className="h-64 flex justify-center items-center"><Loader2 className="animate-spin text-blue-600 w-12 h-12" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredListings.map((item) => (
            <div key={item.id} className="bg-white rounded-[3rem] overflow-hidden border border-slate-100 hover:shadow-2xl transition-all group">
              <div className="h-64 overflow-hidden relative">
                <img src={item.images?.[0] || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className={`absolute top-6 left-6 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-white ${item.listing_type === 'rent' ? 'bg-emerald-500' : 'bg-blue-600'}`}>
                  {item.listing_type === 'rent' ? (isAr ? 'للكراء' : 'Rent') : (isAr ? 'للبيع' : 'Sale')}
                </div>
              </div>
              <div className="p-8">
                <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase mb-3">
                  <MapPin className="w-3 h-3" /> {item.location}
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-6">{item.title}</h3>
                <div className="flex items-center justify-between border-t pt-6">
                   <div className="text-2xl font-black text-blue-600">
                    {formatPrice(item.price)}
                    {item.listing_type === 'rent' && <span className="text-xs text-slate-400 font-bold ml-1">/{isAr ? 'شهر' : 'mo'}</span>}
                   </div>
                   <div className="bg-slate-50 px-3 py-1 rounded-xl text-[10px] font-black text-slate-500 uppercase">
                     {item.sub_type || 'Property'}
                   </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
