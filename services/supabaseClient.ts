
import { createClient } from '@supabase/supabase-js';

// بيانات الربط النهائية لـ GetWealthOS
const supabaseUrl = 'https://icmnlkwoyehexxfsthze.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImljbW5sa3dveWVoZXh4ZnN0aHplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2ODUyNzgsImV4cCI6MjA4NDI2MTI3OH0.VHFJav2x2ct0TcF02mfQZ_pjoy9cxx_0pF6BuFaFC_U';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
