// ===========================================
// CONFIGURACIÓN DE SUPABASE
// ===========================================
// Las claves "anon/public" son seguras en el frontend (diseñadas para eso).
// Ve a: supabase.com → Tu Proyecto → Settings → API y pega los valores.
//
// IMPORTANTE: en el dashboard de Supabase desactiva "Enable email confirmations"
// (Authentication → Settings → Email Auth) para que los usuarios entren al instante.

const SUPABASE_URL      = 'https://TU-PROYECTO.supabase.co';
const SUPABASE_ANON_KEY = 'TU-ANON-KEY';

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
  }
});
