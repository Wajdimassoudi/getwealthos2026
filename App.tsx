
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
import { aiService } from './services/geminiService';
import { supabase } from './services/supabaseClient';
import { COUNTRIES, TRANSLATIONS } from './constants';
import { MarketType, Country, CartItem } from './types';
import { MessageCircle, X, Send, Home, Bitcoin, Briefcase, ShoppingBag, Code, Plane } from 'lucide-react';
import { AuthChangeEvent, Session } from '@supabase/supabase-js';

const App: React.FC = () => {
  const [lang, setLang] = useState<'en' | 'ar' | 'fr' | 'es'>('en');
  const [currentCountry, setCountry] = useState<Country>(COUNTRIES[0]);
  const [activeMarket, setActiveMarket] = useState<MarketType>(MarketType.REAL_ESTATE);
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
        setUser({
          id: u.id,
          name: u.user_metadata?.full_name || u.email,
          email: u.email,
          country: selectedCountry,
          balance: 0
        });
        setShowWelcome(false);
      }
    };
    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      if (session?.user) {
        const u = session.user;
        const selectedCountry = COUNTRIES.find(c => c.code === u.user_metadata?.country) || COUNTRIES[0];
        setUser({
          id: u.id,
          name: u.user_metadata?.full_name || u.email,
          email: u.email,
          country: selectedCountry,
          balance: 0
        });
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
  };

  const handleSendMessage = async () => {
    if (!chatMessage.trim()) return;
    const userMsg = chatMessage;
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatMessage('');
    setIsTyping(true);

    const context = `User: ${user?.name || 'Guest'}, Market: ${activeMarket}, Location: ${currentCountry.name}`;
    const botResponse = await aiService.getWealthAdvice(userMsg, context);
    
    setChatHistory(prev => [...prev, { role: 'bot', text: botResponse }]);
    setIsTyping(false);
  };

  const renderMarket = () => {
    switch (activeMarket) {
      case MarketType.REAL_ESTATE: return <MarketRealEstate country={currentCountry} lang={lang} onAddClick={() => user ? setShowAddModal(true) : setShowAuth(true)} />;
      case MarketType.CRYPTO: return <MarketCrypto country={currentCountry} lang={lang} />;
      case MarketType.JOBS: return <MarketJobs country={currentCountry} lang={lang} />;
      case MarketType.TRAVEL: return <MarketTravel country={currentCountry} lang={lang} />;
      case MarketType.ECOMMERCE: return <MarketEcommerce country={currentCountry} lang={lang} onAddToCart={(p) => setCart([...cart, {...p, quantity: 1}])} />;
      case MarketType.FREELANCE: return <MarketFreelance country={currentCountry} lang={lang} />;
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
            currentCountry={currentCountry} 
            setCountry={setCountry} 
            lang={lang} 
            setLang={setLang} 
            user={user}
            onAuthClick={() => setShowAuth(true)}
            onLogout={handleLogout}
          />
          <main className="max-w-7xl mx-auto px-4 lg:px-8 pt-36 pb-24 animate-in fade-in duration-1000">
            <div className="flex overflow-x-auto gap-4 mb-16 no-scrollbar pb-4">
              {[
                { id: MarketType.REAL_ESTATE, label: t('realEstate'), icon: <Home className="w-5 h-5" /> },
                { id: MarketType.CRYPTO, label: t('crypto'), icon: <Bitcoin className="w-5 h-5" /> },
                { id: MarketType.JOBS, label: t('jobs'), icon: <Briefcase className="w-5 h-5" /> },
                { id: MarketType.ECOMMERCE, label: t('ecommerce'), icon: <ShoppingBag className="w-5 h-5" /> },
                { id: MarketType.FREELANCE, label: t('freelance'), icon: <Code className="w-5 h-5" /> },
                { id: MarketType.TRAVEL, label: t('travel'), icon: <Plane className="w-5 h-5" /> },
              ].map(tab => (
                <button key={tab.id} onClick={() => setActiveMarket(tab.id)} className={`flex items-center gap-4 px-10 py-6 rounded-3xl font-black text-sm transition-all duration-500 ${activeMarket === tab.id ? 'bg-blue-600 text-white shadow-2xl scale-105' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}>
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
            {renderMarket()}
          </main>
        </>
      )}

      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} onSuccess={(u) => { setUser(u); setShowWelcome(false); }} lang={lang} />
      <AddListingModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} onSuccess={() => alert(isAr ? 'تم النشر!' : 'Posted!')} lang={lang} type={activeMarket} />

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
                {isTyping && <div className="text-xs text-slate-400 font-bold animate-pulse">Thinking...</div>}
              </div>
              <div className="p-4 bg-white border-t flex gap-2">
                <input value={chatMessage} onChange={e => setChatMessage(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSendMessage()} className="flex-1 bg-slate-100 px-4 py-3 rounded-xl focus:outline-none" placeholder="Ask AI..." />
                <button onClick={handleSendMessage} className="bg-blue-600 p-3 rounded-xl text-white"><Send className="w-5 h-5" /></button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
