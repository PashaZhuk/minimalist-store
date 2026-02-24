import { createClient } from '@supabase/supabase-js';

// Эти переменные мы возьмем из твоего личного кабинета Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Проверка на случай, если забыли добавить ключи в .env
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase URL or Anon Key. Check your .env file!');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);