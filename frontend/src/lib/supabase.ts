import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Cliente de navegador consciente de cookies (@supabase/ssr), para que la
// sesión creada aquí sea legible por middleware.ts en cada request.
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
