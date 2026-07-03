/**
 * Re-exports from the standalone Database Service.
 *
 * All database operations are now handled by src/services/database.js.
 * To switch from Firestore to Supabase (or another provider),
 * edit src/services/database.js — no other file needs to change.
 */
export {
  createUserProfile,
  getUserProfile,
  getAllProfiles,
  updateUserProfile,
  updateUserRole,
  createAccount,
  getAccounts,
  getAccountsByUser,
  updateAccount,
  deleteAccount,
  createTransaction,
  getTransactionsByAccount,
  getAllTransactions,
  updateTransaction,
  deleteTransaction,
  getWithdrawalStatus,
  setWithdrawalStatus,
} from './services/database';
