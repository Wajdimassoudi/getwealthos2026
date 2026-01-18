
import { API_CONFIG } from '../constants';
import { supabase } from './supabaseClient';

export class ApiService {
  private static instance: ApiService;

  public static getInstance() {
    if (!ApiService.instance) ApiService.instance = new ApiService();
    return ApiService.instance;
  }

  private async getAuthHeader() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      return session?.access_token ? { 'Authorization': `Bearer ${session.access_token}` } : {};
    } catch (e) {
      return {};
    }
  }

  async getExchangeRates(base: string = 'USD') {
    try {
      const response = await fetch(`/api/exchange?base=${base}`);
      const data = await response.json();
      return data.conversion_rates;
    } catch (err) {
      console.error("ExchangeRate API Error:", err);
      return null;
    }
  }

  async getCryptoRates() {
    try {
      const response = await fetch('/api/crypto');
      return await response.json();
    } catch (err) {
      console.error("CoinGecko API Error:", err);
      return null;
    }
  }

  async getProfile() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      
      return {
        id: user.id,
        name: user.user_metadata?.full_name || user.email,
        email: user.email,
        country: user.user_metadata?.country,
        balance: 0
      };
    } catch (err) {
      console.error("Profile Fetch Error:", err);
      return null;
    }
  }

  async getListings(type?: string) {
    try {
      const response = await fetch(`/api/listings${type ? `?type=${type}` : ''}`);
      if (!response.ok) return [];
      return await response.json();
    } catch (err) {
      console.error("Listings Fetch Error:", err);
      return [];
    }
  }

  async createListing(listingData: any) {
    try {
      const headers = await this.getAuthHeader();
      const response = await fetch('/api/listings', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...headers
        },
        body: JSON.stringify(listingData)
      });
      return await response.json();
    } catch (err) {
      console.error("Create Listing Error:", err);
      throw err;
    }
  }
}

export const globalApi = ApiService.getInstance();
