import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    fetch: (...args) => {
      return fetch(...args).catch(err => {
        console.error('Supabase fetch error:', err);
        throw err;
      });
    }
  }
});

// Bağlantı durumunu kontrol et
supabase.from('site_settings').select('*', { count: 'exact' })
  .limit(1)
  .then(() => {
    console.log('Supabase connection successful');
  })
  .catch(error => {
    console.error('Supabase connection error:', error);
  });