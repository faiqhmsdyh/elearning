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

    syncModule: async (moduleType, moduleData) => {
        const tableMap = { lkpd: 'lkpd', exercise: 'exercises', remedial: 'remedial', evaluasi: 'evaluations' };
        const table = tableMap[moduleType];
        if (!table) return { success: false, error: 'Jenis modul tidak dikenal.' };
        const payload = moduleType === 'lkpd' ? {
            id: moduleData.id, subject_id: moduleData.subjectId, title: moduleData.title,
            description: moduleData.description, questions: moduleData.questions || []
        } : moduleType === 'exercise' ? {
            id: moduleData.id, subject_id: moduleData.subjectId, title: moduleData.title,
            description: moduleData.description, kkm: moduleData.kkm, questions: moduleData.questions || []
        } : moduleType === 'remedial' ? {
            id: moduleData.id, exercise_id: moduleData.exerciseId, subject_id: moduleData.subjectId,
            title: moduleData.title, description: moduleData.description, questions: moduleData.questions || []
        } : {
            id: moduleData.id, subject_id: moduleData.subjectId, title: moduleData.title,
            description: moduleData.description, duration: moduleData.duration, questions: moduleData.questions || []
        };
        try {
            if (!supabaseClient) return { success: false, error: 'Supabase belum terhubung.' };
            const { error } = await supabaseClient.from(table).upsert([payload]);
            if (!error) return { success: true };
            return { success: false, error: error.message };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    fetchModules: async (moduleType) => {
        const tableMap = { lkpd: 'lkpd', exercise: 'exercises', remedial: 'remedial', evaluasi: 'evaluations' };
        const table = tableMap[moduleType];
        if (!table || !supabaseClient) return null;
        try {
            const { data, error } = await supabaseClient.from(table).select('*');
            if (error) throw error;
            return data;
        } catch (error) {
            console.warn(`Could not fetch ${moduleType} modules:`, error.message);
            return null;
        }
    },

    // Sync submissions to Supabase if connected
    syncSubmission: async (submissionData) => {
        const activeKey = getActiveSupabaseKey();
        const payload = {
            id: submissionData.id,
            module_type: submissionData.moduleType,
            module_id: submissionData.moduleId,
            student_id: submissionData.studentId,
            student_name: submissionData.studentName,
            overall_score: submissionData.overallScore,
            teacher_score: submissionData.teacherScore,
            kkm: submissionData.kkm,
            is_below_kkm: submissionData.isBelowKKM,
            answers: submissionData.answers || [],
            per_question_reviews: submissionData.perQuestionReviews || [],
            status: submissionData.status,
            teacher_notes: submissionData.teacherNotes || '',
            completed_at: submissionData.completedAt
        };
        
        // 1. Try SDK if active
        if (supabaseClient && activeKey && !activeKey.includes('placeholder')) {
            try {
                const { data, error } = await supabaseClient
                    .from('submissions')
                    .upsert([payload]);
                if (!error) return { success: true, data };
                if (error.message?.includes('teacher_score')) {
                    const legacyPayload = { ...payload };
                    delete legacyPayload.teacher_score;
                    const retry = await supabaseClient.from('submissions').upsert([legacyPayload]);
                    if (!retry.error) return { success: true, data: retry.data };
                }
            } catch (err) {
                console.warn('Supabase SDK submission error:', err.message);
            }
        }

        // 2. Direct REST API Fallback Call
        try {
            const restHeaders = {
                'Content-Type': 'application/json',
                'apikey': activeKey,
                'Authorization': `Bearer ${activeKey}`,
                'Prefer': 'resolution=merge-duplicates'
            };
            const res = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/submissions`, {
                method: 'POST',
                headers: restHeaders,
                body: JSON.stringify(payload)
            });
            if (res.ok) return { success: true };
            if (res.status === 400) {
                const legacyPayload = { ...payload };
                delete legacyPayload.teacher_score;
                const retry = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/submissions`, {
                    method: 'POST',
                    headers: restHeaders,
                    body: JSON.stringify(legacyPayload)
                });
                if (retry.ok) return { success: true };
            }
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
            subject_id: userData.subjectId || null,
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
                if (error.message?.includes('subject_id')) {
                    const legacyPayload = { ...payload };
                    delete legacyPayload.subject_id;
                    const retry = await supabaseClient.from('users').upsert([legacyPayload]);
                    if (!retry.error) return { success: true, data: retry.data };
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
                if (res.status === 400) {
                    const legacyPayload = { ...payload };
                    delete legacyPayload.subject_id;
                    const retry = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/users`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', apikey: activeKey, Authorization: `Bearer ${activeKey}`, Prefer: 'resolution=merge-duplicates' },
                        body: JSON.stringify(legacyPayload)
                    });
                    if (retry.ok) return { success: true };
                }
                return { success: false, error: errJson.message || 'REST error' };
            }
        } catch (err) {
            console.warn('⚠️ Could not connect to Supabase REST API:', err.message);
            return { success: false, fallback: true, error: err.message };
        }
    },

    // Fetch users so login works on every device, not only from localStorage.
    fetchUsers: async () => {
        if (supabaseClient) {
            try {
                const { data, error } = await supabaseClient
                    .from('users')
                    .select('id, username, name, role, subject_id, password');
                if (!error && Array.isArray(data)) return data.map(user => ({ ...user, subjectId: user.subject_id }));
                if (error) console.warn('Could not fetch users from Supabase:', error.message);
            } catch (err) {
                console.warn('Supabase users fetch error:', err.message);
            }
        }

        const activeKey = getActiveSupabaseKey();
        try {
            let res = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/users?select=id,username,name,role,subject_id,password`, {
                headers: {
                    apikey: activeKey,
                    Authorization: `Bearer ${activeKey}`
                }
            });
            if (!res.ok) {
                res = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/users?select=id,username,name,role,password`, {
                    headers: { apikey: activeKey, Authorization: `Bearer ${activeKey}` }
                });
            }
            if (res.ok) {
                const data = await res.json();
                return data.map(user => ({ ...user, subjectId: user.subject_id }));
            }
        } catch (err) {
            console.warn('Supabase REST users fetch error:', err.message);
        }
        return null;
    },

    // Fetch submissions from Supabase
    fetchSubmissions: async () => {
        if (!supabaseClient) return null;
        try {
            const { data, error } = await supabaseClient
                .from('submissions')
                .select('*');
            if (error) throw error;
            return data.map(submission => ({
                ...submission,
                moduleType: submission.module_type,
                moduleId: submission.module_id,
                studentId: submission.student_id,
                studentName: submission.student_name,
                overallScore: submission.overall_score,
                teacherScore: submission.teacher_score,
                isBelowKKM: submission.is_below_kkm,
                perQuestionReviews: submission.per_question_reviews,
                teacherNotes: submission.teacher_notes,
                completedAt: submission.completed_at
            }));
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
