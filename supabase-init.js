// ===========================================
// CONFIGURACIÓN DE SUPABASE
// ===========================================
// Las claves "anon/public" son seguras en el frontend (diseñadas para eso).
// Ve a: supabase.com → Tu Proyecto → Settings → API y pega los valores.
//
// IMPORTANTE: en el dashboard de Supabase desactiva "Enable email confirmations"
// (Authentication → Settings → Email Auth) para que los usuarios entren al instante.

const SUPABASE_URL      = 'https://ldsmrjtmeqvkktidmpus.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_Ni7BCc_8RR5wGi_eKgOWTg_1Lee66rR';

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
  }
});
