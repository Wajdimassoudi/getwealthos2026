
import { supabase } from './supabaseClient';

export class ApiService {
  private static instance: ApiService;

  public static getInstance() {
    if (!ApiService.instance) ApiService.instance = new ApiService();
    return ApiService.instance;
  }

  // جلب أسعار العملات (لا تزال عبر API خارجي لأنها بيانات متغيرة)
  async getExchangeRates(base: string = 'USD') {
    try {
      const response = await fetch(`https://v6.exchangerate-api.com/v6/a06a5496ee0d90cef5bcb62924325393/latest/${base}`);
      const data = await response.json();
      return data.conversion_rates;
    } catch (err) {
      console.error("ExchangeRate API Error:", err);
      return null;
    }
  }

  // جلب أسعار العملات الرقمية
  async getCryptoRates() {
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,tether,binancecoin,solana&vs_currencies=usd&include_24hr_change=true');
      return await response.json();
    } catch (err) {
      console.error("CoinGecko API Error:", err);
      return null;
    }
  }

  // جلب العروض من Supabase
  async getListings(type?: string) {
    try {
      let query = supabase.from('listings').select('*');
      if (type) {
        query = query.eq('type', type);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) {
        // إذا لم يكن الجدول موجوداً بعد، سنعيد مصفوفة فارغة لنتجنب انهيار التطبيق
        console.warn("Supabase Table missing or error:", error);
        return [];
      }
      return data || [];
    } catch (err) {
      console.error("Listings Fetch Error:", err);
      return [];
    }
  }

  // إضافة عرض جديد إلى Supabase
  async createListing(listingData: any) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Unauthorized");

      const { data, error } = await supabase
        .from('listings')
        .insert([{
          ...listingData,
          user_id: user.id,
          created_at: new Date().toISOString()
        }])
        .select();

      if (error) throw error;
      return data[0];
    } catch (err) {
      console.error("Create Listing Error:", err);
      throw err;
    }
  }
}

export const globalApi = ApiService.getInstance();
