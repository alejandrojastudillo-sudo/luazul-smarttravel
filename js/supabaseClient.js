/* ============================================================
   LUAZUL SMART TRAVEL — supabaseClient.js
   Conexión real con Supabase — Fase 2
   ============================================================ */

const SUPABASE_URL = 'https://yunvqgaljopirzyjrntc.supabase.co';
const SUPABASE_KEY = 'sb_publishable_MqB2thv0uzVUAY2v2jh-uQ_ul6a2LzB';

const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

/* ── AUTH HELPERS ── */

async function lzSignIn(email, password) {
    const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
}

async function lzSignOut() {
    await supabaseClient.auth.signOut();
}

async function lzGetSession() {
    const { data: { session } } = await supabaseClient.auth.getSession();
    return session;
}

async function lzGetUser() {
    const { data: { user } } = await supabaseClient.auth.getUser();
    return user;
}
