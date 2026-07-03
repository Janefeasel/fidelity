/**
 * Re-exports from the standalone Auth Service.
 *
 * All auth operations are now handled by src/services/auth.js.
 * To switch from Firebase to Supabase (or another provider),
 * edit src/services/auth.js — no other file needs to change.
 */
export {
  signIn,
  signUp,
  logOut,
  onAuthChange,
  getCurrentUser,
  adminCreateUser,
} from './services/auth';
