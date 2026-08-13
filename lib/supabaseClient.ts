import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://svltsjicueuugpqrnuen.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_Knv2X7pPA_khyhCkobMr2g_0ovYeJJ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);