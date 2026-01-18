
import { createClient } from '@supabase/supabase-js';

// البيانات التي قدمتها للربط
const supabaseUrl = 'https://icmnlkwoyehexxfsthze.supabase.co';
const supabaseAnonKey = 'sb_publishable_8fNeei9vdwAJLt4LcolaDg_BhAUuXlv';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
