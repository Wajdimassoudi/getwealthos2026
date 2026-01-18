
import React, { useEffect, useRef, useState } from 'react';
import { Country } from '../types';
import { Home, MapPin, Maximize, ShieldCheck, Upload, ArrowUpRight, Loader2 } from 'lucide-react';
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
  const isAr = lang === 'ar';

  const formatPrice = (usd: number) => {
    return new Intl.NumberFormat(isAr ? 'ar-SA' : 'en-US', {
      style: 'currency',
      currency: country.currency
    }).format(usd * country.rate);
  };

  const fetchListings = async () => {
    setLoading(true);
    const data = await globalApi.getListings('REAL_ESTATE');
    // Fallback to defaults if DB is empty to keep UI beautiful
    const defaults = [
      { id: 'd1', title: 'Luxury Villa Sea View', price: 1200000, location: 'Dubai, UAE', size: '450m²', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800', lat: 25.2, lng: 55.2 },
      { id: 'd2', title: 'Modern Penthouse', price: 850000, location: 'New York, USA', size: '200m²', image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800', lat: 40.7, lng: -74.0 }
    ];
    setListings(data.length > 0 ? data : defaults);
    setLoading(false);
  };

  useEffect(() => {
    fetchListings();
  }, []);

  useEffect(() => {
    if (mapRef.current && (window as any).L && listings.length > 0) {
      const L = (window as any).L;
      const map = L.map(mapRef.current).setView([20, 0], 2);
      L.tileLayer('https://{s}.tile.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png').addTo(map);

      listings.forEach(item => {
        if (item.lat && item.lng) {
          const customIcon = L.divIcon({
            className: 'custom-marker',
            html: `<div style="background-color: #2563eb; width: 14px; height: 14px; border-radius: 50%; border: 3px solid white;"></div>`,
            iconSize: [14, 14]
          });
          L.marker([item.lat, item.lng], { icon: customIcon })
            .addTo(map)
            .bindPopup(`<b style="font-family: Inter;">${item.title}</b><br/><span style="color: #2563eb;">${formatPrice(item.price)}</span>`);
        }
      });
      return () => map.remove();
    }
  }, [listings, country]);

  return (
    <div className="space-y-12 animate-in fade-in duration-1000">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h2 className="text-5xl font-black text-slate-900 flex items-center gap-4">
            <Home className="text-blue-600 w-10 h-10" />
            {isAr ? 'العقارات العالمية' : 'Global Estates'}
          </h2>
          <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px] mt-2">Institutional-Grade Asset Verification Protocol</p>
        </div>
        <button 
          onClick={onAddClick}
          className="bg-slate-900 text-white px-10 py-5 rounded-3xl text-sm font-black flex items-center gap-3 hover:bg-blue-600 transition-all shadow-2xl shadow-slate-900/10 active:scale-95 group"
        >
          <Upload className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
          {isAr ? 'إضافة عقار' : 'List New Asset'}
        </button>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {listings.map((item, idx) => (
            <div 
              key={item._id || item.id} 
              className="bg-white rounded-[3rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.02)] hover:shadow-[0_40px_80px_rgba(37,99,235,0.12)] transition-all duration-700 border border-slate-100 group cursor-pointer animate-in fade-in slide-in-from-bottom-8"
              style={{ animationDelay: `${idx * 150}ms`, animationFillMode: 'both' }}
            >
              <div className="relative h-72 overflow-hidden">
                <img src={item.image || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] shadow-2xl">
                  {item.verified ? 'Verified' : 'New'}
                </div>
              </div>
              <div className="p-10">
                <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                  <MapPin className="w-3.5 h-3.5 text-blue-400" />
                  {item.location}
                </div>
                <h3 className="font-black text-slate-900 text-2xl mb-6 group-hover:text-blue-600 transition-colors line-clamp-1 leading-tight">{item.title}</h3>
                <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                  <div className="text-blue-600 font-black text-2xl tracking-tighter">{formatPrice(item.price)}</div>
                  <div className="bg-slate-50 p-3 rounded-2xl flex items-center gap-2 text-slate-900 font-black text-xs">
                    <Maximize className="w-4 h-4 text-slate-300" />
                    {item.size || 'N/A'}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="relative h-[400px] w-full rounded-[4rem] shadow-2xl border-8 border-white overflow-hidden">
        <div ref={mapRef} className="h-full w-full"></div>
      </div>
    </div>
  );
};
