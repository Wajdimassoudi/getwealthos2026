
import React, { useState, useEffect } from 'react';
import { Country } from '../types';
import { Car, Fuel, Gauge, Calendar, ShieldCheck, Zap, Loader2, MapPin } from 'lucide-react';
import { globalApi } from '../services/apiService';

interface Props {
  country: Country;
  lang: string;
  onAddClick: () => void;
}

export const MarketCars: React.FC<Props> = ({ country, lang, onAddClick }) => {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const isAr = lang === 'ar';

  useEffect(() => {
    const fetch = async () => {
      const data = await globalApi.getListings('CARS');
      setListings(data.length > 0 ? data : [
        { id: 'c1', title: 'Tesla Model S Plaid', price: 89000, year: 2024, mileage: '0 km', fuel: 'Electric', image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800', location: 'Dubai' },
        { id: 'c2', title: 'Porsche 911 Carrera', price: 125000, year: 2023, mileage: '5,000 km', fuel: 'Petrol', image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800', location: 'London' }
      ]);
      setLoading(false);
    };
    fetch();
  }, []);

  const formatPrice = (usd: number) => {
    return new Intl.NumberFormat(isAr ? 'ar-SA' : 'en-US', {
      style: 'currency', currency: country.currency
    }).format(usd * country.rate);
  };

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-5xl font-black text-slate-900 flex items-center gap-4">
            <Car className="text-blue-600 w-12 h-12" />
            {isAr ? 'محرك الثراء' : 'Wealth Motors'}
          </h2>
          <p className="text-slate-400 font-black uppercase tracking-widest text-[10px] mt-2">Certified Global Automotive Exchange</p>
        </div>
        <button onClick={onAddClick} className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-sm hover:scale-105 transition-all shadow-xl shadow-blue-500/20">
          {isAr ? 'بيع سيارتك' : 'Sell Your Car'}
        </button>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center"><Loader2 className="animate-spin text-blue-600 w-10" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {listings.map((car, i) => (
            <div key={car.id} className="bg-white rounded-[3rem] overflow-hidden border border-slate-100 hover:shadow-2xl transition-all group">
              <div className="h-64 overflow-hidden relative">
                <img src={car.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-6 left-6 bg-slate-900 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                  Premium
                </div>
              </div>
              <div className="p-8">
                <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase mb-4">
                  <MapPin className="w-3 h-3" /> {car.location}
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-6">{car.title}</h3>
                
                <div className="grid grid-cols-3 gap-2 mb-8">
                  <div className="bg-slate-50 p-3 rounded-2xl text-center">
                    <Calendar className="w-4 h-4 mx-auto text-blue-500 mb-1" />
                    <span className="text-[10px] font-bold text-slate-600">{car.year}</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-2xl text-center">
                    <Gauge className="w-4 h-4 mx-auto text-blue-500 mb-1" />
                    <span className="text-[10px] font-bold text-slate-600">{car.mileage}</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-2xl text-center">
                    <Fuel className="w-4 h-4 mx-auto text-blue-500 mb-1" />
                    <span className="text-[10px] font-bold text-slate-600">{car.fuel}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t pt-6">
                  <div className="text-2xl font-black text-blue-600">{formatPrice(car.price)}</div>
                  <button className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold text-xs hover:bg-blue-600 transition-colors">
                    {isAr ? 'تفاصيل' : 'Details'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
