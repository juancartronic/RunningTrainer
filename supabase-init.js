// ===========================================
// CONFIGURACIÓN DE SUPABASE
// ===========================================
// Las claves "anon/public" son seguras en el frontend (diseñadas para eso).
// Ve a: supabase.com → Tu Proyecto → Settings → API y pega los valores.
//
// IMPORTANTE: en el dashboard de Supabase desactiva "Enable email confirmations"
// (Authentication → Settings → Email Auth) para que los usuarios entren al instante.

const SUPABASE_URL      = 'https://ldsmrjtmeqvkktidmpus.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_uPaXJAiMjvsqj3xiP1ku1w_0_kVunZ5';

let supabaseClient = null;
try {
  if (typeof supabase === 'undefined') {
    throw new Error('Supabase SDK no cargó. Revisa tu conexión a internet.');
  }
  supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false
    }
  });
  console.log('[Supabase] Cliente inicializado OK');
} catch (err) {
  console.error('[Supabase] Error al inicializar:', err);
  document.addEventListener('DOMContentLoaded', () => {
    const toast = document.getElementById('toast');
    if (toast) {
      toast.textContent = 'Error Supabase: ' + err.message;
      toast.className = 'toast error show';
      setTimeout(() => toast.classList.remove('show'), 8000);
    }
  });
}
