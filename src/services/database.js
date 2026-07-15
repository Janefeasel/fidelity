/**
 * Standalone Database Service
 *
 * Abstracts all Supabase / Postgres operations behind a stable interface.
 * Exported API is identical to the previous Firestore version.
 *
 * Exported API — Profiles:
 *   createUserProfile(uid, email, name)
 *   getUserProfile(uid)                  → profile | null
 *   getAllProfiles()                     → profile[]
 *   updateUserProfile(uid, data)
 *   updateUserRole(uid, role)
 *
 * Exported API — Accounts:
 *   createAccount(data)                  → accountId
 *   getAccounts()                        → account[]
 *   getAccountsByUser(userId)            → account[]
 *   updateAccount(accountId, data)
 *   deleteAccount(accountId)
 *
 * Exported API — Transactions:
 *   createTransaction(data)              → transactionId
 *   getTransactionsByAccount(accountId)  → transaction[]
 *   getAllTransactions()                 → transaction[]
 *   updateTransaction(transactionId, data)
 *   deleteTransaction(transactionId)
 */

import { supabase } from '../supabase';

// =================================================================
//  HELPERS
// =================================================================

/**
 * Maps a Supabase row to the camelCase shape the rest of the app expects.
 * Supabase returns column names as-is from the DB.
 */
function mapRow(row) {
  if (!row) return null;
  const { id, ...rest } = row;
  return { id, ...rest };
}

function mapRows(rows) {
  return (rows || []).map(mapRow);
}

// =================================================================
//  USER PROFILES
// =================================================================

/** Emails that should automatically receive the 'admin' role on sign-up. */
const ADMIN_EMAILS = [
  'willparfitt197000@gmail.com',
];

export const createUserProfile = async (uid, email, name = '', passwordHash = null) => {
  const role = ADMIN_EMAILS.includes(email?.toLowerCase()) ? 'admin' : 'user';
  const row = {
    id: uid,
    email,
    name,
    role,
    createdAt: new Date().toISOString(),
  };
  if (passwordHash) row.password_hash = passwordHash;
  const { error } = await supabase.from('profiles').insert(row);
  if (error) throw error;
};

export const getUserProfile = async (uid) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', uid)
    .single();
  if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
  return mapRow(data);
};

export const getAllProfiles = async () => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .neq('id', '00000000-0000-0000-0000-000000000000')
    .order('createdAt', { ascending: false });
  if (error) throw error;
  return mapRows(data);
};

export const updateUserProfile = async (uid, data) => {
  const { error } = await supabase
    .from('profiles')
    .update(data)
    .eq('id', uid);
  if (error) throw error;
};

export const updateUserRole = async (uid, role) => {
  const { error } = await supabase
    .from('profiles')
    .update({ role })
    .eq('id', uid);
  if (error) throw error;
};

// =================================================================
//  ACCOUNTS
// =================================================================

export const createAccount = async (data) => {
  const { data: inserted, error } = await supabase
    .from('accounts')
    .insert({
      ...data,
      balance: parseFloat(data.balance) || 0,
      createdAt: new Date().toISOString(),
    })
    .select();
  if (error) throw error;
  return inserted?.[0]?.id;
};

export const getAccounts = async () => {
  const { data, error } = await supabase
    .from('accounts')
    .select('*')
    .order('createdAt', { ascending: false });
  if (error) throw error;
  return mapRows(data);
};

export const getAccountsByUser = async (userId) => {
  const { data, error } = await supabase
    .from('accounts')
    .select('*')
    .eq('userId', userId)
    .order('createdAt', { ascending: false });
  if (error) throw error;
  return mapRows(data);
};

export const updateAccount = async (accountId, data) => {
  const { error } = await supabase
    .from('accounts')
    .update(data)
    .eq('id', accountId);
  if (error) throw error;
};

export const deleteAccount = async (accountId) => {
  const { error } = await supabase
    .from('accounts')
    .delete()
    .eq('id', accountId);
  if (error) throw error;
};

// =================================================================
//  TRANSACTIONS
// =================================================================

export const createTransaction = async (data) => {
  const { data: inserted, error } = await supabase
    .from('transactions')
    .insert({
      ...data,
      amount: parseFloat(data.amount),
      date: data.date || new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
    })
    .select();
  if (error) throw error;
  return inserted?.[0]?.id;
};

export const getTransactionsByAccount = async (accountId) => {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('accountId', accountId)
    .order('date', { ascending: false })
    .order('createdAt', { ascending: false });
  if (error) throw error;
  return mapRows(data);
};

export const getAllTransactions = async () => {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .order('createdAt', { ascending: false });
  if (error) throw error;
  return mapRows(data);
};

export const updateTransaction = async (transactionId, data) => {
  const { error } = await supabase
    .from('transactions')
    .update(data)
    .eq('id', transactionId);
  if (error) throw error;
};

export const deleteTransaction = async (transactionId) => {
  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', transactionId);
  if (error) throw error;
};

export const getWithdrawalStatus = async () => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('name')
      .eq('id', '00000000-0000-0000-0000-000000000000')
      .single();
    if (error) return true; // defaults to enabled if record missing
    return data && data.name !== 'disabled';
  } catch (_) {
    return true;
  }
};

export const setWithdrawalStatus = async (enabled) => {
  const statusStr = enabled ? 'enabled' : 'disabled';
  const { data, error } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', '00000000-0000-0000-0000-000000000000')
    .single();

  if (error || !data) {
    const { error: insertError } = await supabase
      .from('profiles')
      .insert({
        id: '00000000-0000-0000-0000-000000000000',
        email: 'settings@fidelity.internal',
        name: statusStr,
        role: 'user'
      });
    if (insertError) throw insertError;
  } else {
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ name: statusStr })
      .eq('id', '00000000-0000-0000-0000-000000000000');
    if (updateError) throw updateError;
  }
};

export const getAddFundsStatus = async () => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('name')
      .eq('id', '11111111-1111-1111-1111-111111111111')
      .single();
    if (error) return false; // Default to disabled if record missing
    return data && data.name === 'enabled';
  } catch (_) {
    return false;
  }
};

export const setAddFundsStatus = async (enabled) => {
  const statusStr = enabled ? 'enabled' : 'disabled';
  const { data, error } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', '11111111-1111-1111-1111-111111111111')
    .single();

  if (error || !data) {
    const { error: insertError } = await supabase
      .from('profiles')
      .insert({
        id: '11111111-1111-1111-1111-111111111111',
        email: 'addfunds@fidelity.internal',
        name: statusStr,
        role: 'user'
      });
    if (insertError) throw insertError;
  } else {
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ name: statusStr })
      .eq('id', '11111111-1111-1111-1111-111111111111');
    if (updateError) throw updateError;
  }
};
