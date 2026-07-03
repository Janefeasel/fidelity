/**
 * Standalone Auth Service
 *
 * Abstracts authentication behind a stable interface.
 * Supports Supabase Auth AND local auth (for admin-created users).
 *
 * Exported API:
 *   signIn(email, password)         → Promise<{ user: { uid, email, ... } }>
 *   signUp(email, password)         → Promise<{ user: { uid, email, ... } }>
 *   logOut()                        → Promise<void>
 *   onAuthChange(callback)          → unsubscribe function
 *   getCurrentUser()                → { uid, email, ... } | null
 *   adminCreateUser(email, password)→ Promise<{ uid, email, passwordHash }>
 *   hashPassword(password)          → Promise<string>
 */

import { supabase } from '../supabase';

// =================================================================
//  INTERNAL USER CACHE
// =================================================================

let currentUser = null;

// Bootstrap from any existing Supabase session.
supabase.auth.getUser().then(({ data }) => {
  currentUser = data?.user
    ? { uid: data.user.id, ...data.user }
    : null;
});

// Keep in sync with Supabase auth state changes.
supabase.auth.onAuthStateChange((event, session) => {
  currentUser = session?.user
    ? { uid: session.user.id, ...session.user }
    : null;
});

// Also restore local auth user from sessionStorage
(function restoreLocalUser() {
  try {
    const stored = sessionStorage.getItem('fide_local_user');
    if (stored && !currentUser) {
      currentUser = JSON.parse(stored);
    }
  } catch (_) {}
})();

// =================================================================
//  PASSWORD HASHING
// =================================================================

export async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const buf = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

// =================================================================
//  PUBLIC API
// =================================================================

export const signUp = async (email, password) => {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  return { user: { uid: data.user.id, ...data.user } };
};

export const signIn = async (email, password) => {
  // Try Supabase Auth first
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (!error && data?.user) {
      return { user: { uid: data.user.id, ...data.user } };
    }
  } catch (_) {}

  // Fall back to local auth (admin-created users)
  const pwHash = await hashPassword(password);
  const { data: profiles, error: profileErr } = await supabase
    .from('profiles')
    .select('*')
    .eq('email', email)
    .eq('password_hash', pwHash);

  if (profileErr) throw profileErr;
  if (!profiles || profiles.length === 0) {
    throw new Error('Invalid email or password');
  }

  const profile = profiles[0];
  const localUser = { uid: profile.id, email: profile.email, id: profile.id };
  currentUser = localUser;
  sessionStorage.setItem('fide_local_user', JSON.stringify(localUser));

  // Notify listeners
  _authListeners.forEach(cb => cb(localUser));

  return { user: localUser };
};

export const logOut = async () => {
  try {
    await supabase.auth.signOut();
  } catch (_) {}
  currentUser = null;
  sessionStorage.removeItem('fide_local_user');
  _authListeners.forEach(cb => cb(null));
};

// =================================================================
//  AUTH STATE LISTENERS
// =================================================================

const _authListeners = new Set();

export const onAuthChange = (callback) => {
  _authListeners.add(callback);

  // Also subscribe to Supabase auth changes
  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    const user = session?.user
      ? { uid: session.user.id, ...session.user }
      : null;
    if (user) {
      currentUser = user;
      sessionStorage.removeItem('fide_local_user');
    }
    callback(user || currentUser); // use local user if no supabase user
  });

  return () => {
    _authListeners.delete(callback);
    subscription.unsubscribe();
  };
};

export const getCurrentUser = () => currentUser;

/**
 * Creates a local user (bypasses Supabase Auth).
 * Returns uid + passwordHash for inserting into profiles.
 */
export const adminCreateUser = async (email, password) => {
  const uid = crypto.randomUUID();
  const passwordHash = await hashPassword(password);
  return { uid, email, passwordHash };
};
