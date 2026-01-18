
import { supabase } from './supabaseClient';
import { UserProfile } from '../types';

export class ApiService {
  private static instance: ApiService;

  public static getInstance() {
    if (!ApiService.instance) ApiService.instance = new ApiService();
    return ApiService.instance;
  }

  // --- Profile Logic ---
  async getProfile(userId: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (error) return null;
    return data;
  }

  async updateProfile(userId: string, updates: Partial<UserProfile>) {
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId);
    if (error) throw error;
  }

  // --- Listings Logic ---
  async getListings(type?: string, subType?: string) {
    try {
      let query = supabase.from('listings').select('*, profiles(full_name, avatar_url, country)');
      if (type) query = query.eq('type', type);
      if (subType) query = query.eq('sub_type', subType);
      
      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) return [];
      return data || [];
    } catch (err) {
      return [];
    }
  }

  async createListing(listingData: any) {
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
    return data ? data[0] : null;
  }

  // --- External APIs ---
  async getExchangeRates(base: string = 'USD') {
    try {
      const response = await fetch(`https://v6.exchangerate-api.com/v6/a06a5496ee0d90cef5bcb62924325393/latest/${base}`);
      const data = await response.json();
      return data.conversion_rates;
    } catch { return null; }
  }

  async getCryptoRates() {
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,tether,binancecoin,solana&vs_currencies=usd&include_24hr_change=true');
      return await response.json();
    } catch { return null; }
  }
}

export const globalApi = ApiService.getInstance();
