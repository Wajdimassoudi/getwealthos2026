
import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { WelcomePage } from './components/WelcomePage';
import { AuthModal } from './components/AuthModal';
import { AddListingModal } from './components/AddListingModal';
import { MarketRealEstate } from './components/MarketRealEstate';
import { MarketCrypto } from './components/MarketCrypto';
import { MarketJobs } from './components/MarketJobs';
import { MarketTravel } from './components/MarketTravel';
import { MarketEcommerce } from './components/MarketEcommerce';
import { MarketFreelance } from './components/MarketFreelance';
import { MarketCars } from './components/MarketCars';
import { ProfileView } from './components/ProfileView';
import { aiService } from './services/geminiService';
import { supabase } from './services/supabaseClient';
import { COUNTRIES, TRANSLATIONS } from './constants';
import { MarketType, Country, CartItem } from './types';
import { MessageCircle, X, Send, Home, Bitcoin, Briefcase, ShoppingBag, Code, Plane, Car, UserCircle } from 'lucide-react';
import { AuthChangeEvent, Session } from '@supabase/supabase-js';

const App: React.FC = () => {
  const [lang, setLang] = useState<'en' | 'ar' | 'fr' | 'es'>('en');
  const [currentCountry, setCountry] = useState<Country>(COUNTRIES[0]);
  const [activeMarket, setActiveMarket] = useState<MarketType>(MarketType.REAL_ESTATE);
  const [view, setView] = useState<'market' | 'profile'>('market');
  const [showWelcome, setShowWelcome] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'bot', text: string}[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const isAr = lang === 'ar';
  const t = (key: string) => TRANSLATIONS[key]?.[lang] || key;

  useEffect(() => {
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const u = session.user;
        const selectedCountry = COUNTRIES.find(c => c.code === u.user_metadata?.country) || COUNTRIES[0];
        setUser({ id: u.id, name: u.user_metadata?.full_name || u.email, email: u.email, country: selectedCountry, balance: 0 });
        setShowWelcome(false);
      }
    };
    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      if (session?.user) {
        const u = session.user;
        const selectedCountry = COUNTRIES.find(c => c.code === u.user_metadata?.country) || COUNTRIES[0];
        setUser({ id: u.id, name: u.user_metadata?.full_name || u.email, email: u.email, country: selectedCountry, balance: 0 });
        setShowWelcome(false);
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setShowWelcome(true);
    setView('market');
  };

  const renderMarket = () => {
    if (view === 'profile') return <ProfileView user={user} lang={lang} onClose={() => setView('market')} />;
    
    switch (activeMarket) {
      case MarketType.REAL_ESTATE: return <MarketRealEstate country={currentCountry} lang={lang} onAddClick={() => user ? setShowAddModal(true) : setShowAuth(true)} />;
      case MarketType.CRYPTO: return <MarketCrypto country={currentCountry} lang={lang} />;
      case MarketType.JOBS: return <MarketJobs country={currentCountry} lang={lang} />;
      case MarketType.TRAVEL: return <MarketTravel country={currentCountry} lang={lang} />;
      case MarketType.ECOMMERCE: return <MarketEcommerce country={currentCountry} lang={lang} onAddToCart={(p) => setCart([...cart, {...p, quantity: 1}])} />;
      case MarketType.FREELANCE: return <MarketFreelance country={currentCountry} lang={lang} />;
      case MarketType.CARS: return <MarketCars country={currentCountry} lang={lang} onAddClick={() => user ? setShowAddModal(true) : setShowAuth(true)} />;
      default: return null;
    }
  };

  return (
    <div className={`min-h-screen bg-[#020617] ${isAr ? 'rtl font-[Noto_Sans_Arabic]' : 'ltr font-inter'}`}>
      {showWelcome ? (
        <WelcomePage lang={lang} onStart={() => user ? setShowWelcome(false) : setShowAuth(true)} />
      ) : (
        <>
          <Navbar 
            currentCountry={currentCountry} setCountry={setCountry} lang={lang} setLang={setLang} user={user}
            onAuthClick={() => setShowAuth(true)} onLogout={handleLogout}
          />
          <main className="max-w-7xl mx-auto px-4 lg:px-8 pt-36 pb-24">
            {view === 'market' && (
              <div className="flex overflow-x-auto gap-4 mb-16 no-scrollbar pb-4 animate-in fade-in slide-in-from-top-4 duration-700">
                {[
                  { id: MarketType.REAL_ESTATE, label: t('realEstate'), icon: <Home /> },
                  { id: MarketType.CRYPTO, label: t('crypto'), icon: <Bitcoin /> },
                  { id: MarketType.CARS, label: t('cars'), icon: <Car /> },
                  { id: MarketType.JOBS, label: t('jobs'), icon: <Briefcase /> },
                  { id: MarketType.ECOMMERCE, label: t('ecommerce'), icon: <ShoppingBag /> },
                  { id: MarketType.FREELANCE, label: t('freelance'), icon: <Code /> },
                  { id: MarketType.TRAVEL, label: t('travel'), icon: <Plane /> },
                ].map(tab => (
                  <button key={tab.id} onClick={() => setActiveMarket(tab.id)} className={`flex items-center gap-4 px-10 py-6 rounded-3xl font-black text-sm transition-all duration-500 whitespace-nowrap ${activeMarket === tab.id ? 'bg-blue-600 text-white shadow-2xl scale-105' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}>
                    <span className="w-5 h-5">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </div>
            )}
            {renderMarket()}
          </main>

          {/* User Side Nav */}
          <div className={`fixed top-1/2 -translate-y-1/2 ${isAr ? 'left-6' : 'right-6'} z-40 hidden xl:flex flex-col gap-4`}>
             <button onClick={() => setView(view === 'profile' ? 'market' : 'profile')} className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${view === 'profile' ? 'bg-blue-600 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}>
                <UserCircle className="w-8 h-8" />
             </button>
             <button onClick={() => setShowAddModal(true)} className="w-16 h-16 rounded-2xl bg-emerald-500 text-white flex items-center justify-center hover:scale-110 transition-all shadow-xl shadow-emerald-500/20">
                <Send className="w-6 h-6" />
             </button>
          </div>
        </>
      )}

      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} onSuccess={(u) => { setUser(u); setShowWelcome(false); }} lang={lang} />
      <AddListingModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} onSuccess={() => alert(isAr ? 'تم بنجاح!' : 'Posted Successfully!')} lang={lang} type={activeMarket} />

      {!showWelcome && (
        <div className={`fixed bottom-8 ${isAr ? 'left-8' : 'right-8'} z-50`}>
          <button onClick={() => setShowChat(!showChat)} className="bg-blue-600 text-white w-20 h-20 rounded-3xl shadow-2xl hover:scale-110 active:scale-95 transition-all flex items-center justify-center">
            {showChat ? <X className="w-8 h-8" /> : <MessageCircle className="w-8 h-8" />}
          </button>
          {showChat && (
            <div className="absolute bottom-24 right-0 w-[400px] bg-white rounded-[2rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-5">
              <div className="bg-slate-900 p-6 text-white flex items-center justify-between">
                <span className="font-black text-sm uppercase tracking-widest">AI Wealth OS</span>
              </div>
              <div className="h-[400px] overflow-y-auto p-6 space-y-4 bg-slate-50">
                {chatHistory.map((m, i) => (
                  <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-4 rounded-2xl text-sm font-medium ${m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white border text-slate-700'}`}>{m.text}</div>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-white border-t flex gap-2">
                <input value={chatMessage} onChange={e => setChatMessage(e.target.value)} onKeyDown={e => e.key === 'Enter'} className="flex-1 bg-slate-100 px-4 py-3 rounded-xl focus:outline-none" placeholder="Ask AI..." />
                <button className="bg-blue-600 p-3 rounded-xl text-white"><Send className="w-5 h-5" /></button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
