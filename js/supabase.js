/**
 * EduSmart Supabase Database Integration
 * Connects to Supabase backend URL: https://tsuciepqhkdetvqyfkqk.supabase.co
 * Provides online sync for Users, LKPD, Latihan Soal, Remedial, Evaluasi, and Submissions.
 */

const SUPABASE_KEY_STORAGE = 'edusmart_supabase_anon_key';

const SUPABASE_CONFIG = {
    url: 'https://tsuciepqhkdetvqyfkqk.supabase.co',
    // Default Supabase Publishable Key
    anonKey: localStorage.getItem(SUPABASE_KEY_STORAGE) || 'sb_publishable_wuEK4BQdJjq2ptdbnkhRsw_xqViLd7H'
};

let supabaseClient = null;

// Helper to get active key
function getActiveSupabaseKey() {
    return localStorage.getItem(SUPABASE_KEY_STORAGE) || SUPABASE_CONFIG.anonKey;
}

// Save & apply custom Supabase Anon Key
function setCustomSupabaseKey(key) {
    if (key && key.trim()) {
        const cleanKey = key.trim();
        localStorage.setItem(SUPABASE_KEY_STORAGE, cleanKey);
        SUPABASE_CONFIG.anonKey = cleanKey;
        initSupabase();
        return true;
    }
    return false;
}

// Initialize Supabase Client
function initSupabase() {
    const activeKey = getActiveSupabaseKey();
    if (window.supabase && typeof window.supabase.createClient === 'function') {
        try {
            supabaseClient = window.supabase.createClient(SUPABASE_CONFIG.url, activeKey);
            console.log('✅ Connected to Supabase at:', SUPABASE_CONFIG.url);
            return true;
        } catch (err) {
            console.warn('⚠️ Supabase client init warning, using LocalStorage fallback:', err);
            return false;
        }
    } else {
        console.warn('⚠️ Supabase JS SDK not loaded, using LocalStorage fallback.');
        return false;
    }
}

// Database helper functions with fallback
const SupabaseStore = {
    client: () => supabaseClient,
    
    // Check if Supabase client is active
    isConnected: () => !!supabaseClient,
    getApiKey: () => getActiveSupabaseKey(),
    setApiKey: (key) => setCustomSupabaseKey(key),

    // Sync submissions to Supabase if connected
    syncSubmission: async (submissionData) => {
        const activeKey = getActiveSupabaseKey();
        
        // 1. Try SDK if active
        if (supabaseClient && activeKey && !activeKey.includes('placeholder')) {
            try {
                const { data, error } = await supabaseClient
                    .from('submissions')
                    .upsert([submissionData]);
                if (!error) return { success: true, data };
            } catch (err) {
                console.warn('Supabase SDK submission error:', err.message);
            }
        }

        // 2. Direct REST API Fallback Call
        try {
            const res = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/submissions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': activeKey,
                    'Authorization': `Bearer ${activeKey}`,
                    'Prefer': 'resolution=merge-duplicates'
                },
                body: JSON.stringify(submissionData)
            });
            if (res.ok) return { success: true };
            return { success: false, fallback: true };
        } catch (err) {
            console.warn('Supabase REST submission fallback error:', err.message);
            return { success: false, fallback: true };
        }
    },

    // Sync user to Supabase table 'users'
    syncUser: async (userData) => {
        const activeKey = getActiveSupabaseKey();
        
        const payload = {
            id: userData.id,
            username: userData.username,
            name: userData.name,
            role: userData.role,
            password: userData.password
        };

        // 1. Try SDK insert/upsert first
        if (supabaseClient && activeKey && !activeKey.includes('placeholder')) {
            try {
                const { data, error } = await supabaseClient
                    .from('users')
                    .upsert([payload]);
                
                if (!error) {
                    console.log('✅ User registered & synced to Supabase users table:', userData.username);
                    return { success: true, data };
                }
            } catch (err) {
                console.warn('Supabase SDK user sync warning:', err.message);
            }
        }

        // 2. Direct HTTP REST API POST to https://tsuciepqhkdetvqyfkqk.supabase.co/rest/v1/users
        try {
            const res = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': activeKey,
                    'Authorization': `Bearer ${activeKey}`,
                    'Prefer': 'resolution=merge-duplicates'
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                console.log('✅ User registered & synced to Supabase users table via REST API:', userData.username);
                return { success: true };
            } else {
                const errJson = await res.json().catch(() => ({}));
                console.warn('⚠️ Supabase REST API HTTP Status:', res.status, errJson);
                return { success: false, error: errJson.message || 'REST error' };
            }
        } catch (err) {
            console.warn('⚠️ Could not connect to Supabase REST API:', err.message);
            return { success: false, fallback: true, error: err.message };
        }
    },

    // Fetch submissions from Supabase
    fetchSubmissions: async () => {
        if (!supabaseClient) return null;
        try {
            const { data, error } = await supabaseClient
                .from('submissions')
                .select('*');
            if (error) throw error;
            return data;
        } catch (err) {
            console.warn('Could not fetch from Supabase:', err.message);
            return null;
        }
    }
};

// Auto initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initSupabase();
});
