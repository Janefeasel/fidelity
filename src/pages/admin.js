import { getAccounts, getAllTransactions, createAccount, updateAccount, deleteAccount, createTransaction, updateTransaction, deleteTransaction, getAllProfiles, getUserProfile, updateUserProfile, updateUserRole, createUserProfile, getWithdrawalStatus, setWithdrawalStatus, getAddFundsStatus, setAddFundsStatus } from '../db';
import { getCurrentUser, adminCreateUser } from '../auth';
import { navigate } from '../router';

const ADMIN_PASS = 'Password2026';
let accountsCache = [], transactionsCache = [], profilesCache = [];
let withdrawEnabled = true, addFundsEnabled = false;
let currentTab = 'users';
let searchQuery = '';

export async function renderAdmin(container) {
  // Check if already authenticated this session
  if (sessionStorage.getItem('fide_admin_auth') === 'true') {
    renderPanel(container);
    return;
  }
  renderPasswordPrompt(container);
}

function renderPasswordPrompt(container) {
  container.innerHTML = `<div class="auth-page"><div class="auth-container"><div class="auth-card"><div class="auth-header"><img src="/custom/bankwithfidelity2/image/logo-2x.png" alt="Fidelity Bank" class="auth-logo"/><h2>Admin Access</h2><p class="text-muted">Enter the admin password to continue</p></div><form id="adminPassForm" class="auth-form"><div id="passError" class="auth-error" style="display:none"></div><div class="form-floating mb-3" style="position:relative"><input type="password" class="form-control" id="adminPassInput" placeholder="Password" required style="padding-right:44px"/><label for="adminPassInput">Password</label><button type="button" class="pw-toggle" id="toggleAdminPw" tabindex="-1">👁</button></div><button type="submit" class="btn btn-primary auth-submit">Enter</button></form><div class="auth-footer"><a href="#" class="auth-back" id="bth">← Back to Home</a></div></div></div></div>`;
  container.querySelector('#bth').addEventListener('click', e => { e.preventDefault(); navigate('#/'); });
  container.querySelector('#adminPassForm').addEventListener('submit', e => {
    e.preventDefault();
    const val = container.querySelector('#adminPassInput').value;
    if (val === ADMIN_PASS) {
      sessionStorage.setItem('fide_admin_auth', 'true');
      renderPanel(container);
    } else {
      const err = container.querySelector('#passError');
      err.textContent = 'Incorrect password';
      err.style.display = 'block';
    }
  });
  // Password toggle for admin prompt
  const tBtn = container.querySelector('#toggleAdminPw');
  const pIn = container.querySelector('#adminPassInput');
  if (tBtn && pIn) { tBtn.addEventListener('click', () => { const h = pIn.type === 'password'; pIn.type = h ? 'text' : 'password'; tBtn.textContent = h ? '👁‍🗨' : '👁'; }); }
}

async function renderPanel(container) {
  container.innerHTML = `<div class="admin-page"><div class="ap-wrap"><div class="ap-header"><div style="display:flex;justify-content:space-between;align-items:flex-start"><div><h1><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/></svg>Admin Panel</h1><p>Manage users, account balances, and transaction history</p></div><div class="ap-nav-btns"><button class="ap-nav-btn" id="navHome">← Home</button><button class="ap-nav-btn" id="navOut">Sign Out</button></div></div></div><div class="ap-tabs" id="apTabs"><button class="ap-tab active" data-tab="users"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>Users &amp; Accounts</button><button class="ap-tab" data-tab="transactions"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>All Transactions</button></div><div id="adminContent"><div class="ap-empty">Loading...</div></div></div></div>`;
  container.querySelector('#navHome').onclick = () => navigate('#/');
  container.querySelector('#navOut').onclick = async () => { const { logOut } = await import('../auth'); await logOut(); navigate('#/'); };
  const [accts, txns, profs, wStat, aStat] = await Promise.all([
    getAccounts(),
    getAllTransactions(),
    getAllProfiles(),
    getWithdrawalStatus(),
    getAddFundsStatus()
  ]);
  accountsCache = accts;
  transactionsCache = txns;
  profilesCache = profs;
  withdrawEnabled = wStat;
  addFundsEnabled = aStat;
  renderUsersTab(container);
  container.querySelectorAll('[data-tab]').forEach(t => t.addEventListener('click', () => {
    container.querySelectorAll('[data-tab]').forEach(x => x.classList.remove('active'));
    t.classList.add('active');
    currentTab = t.dataset.tab;
    if (currentTab === 'users') renderUsersTab(container);
    else renderTxnTab(container);
  }));
}

function getFiltered() {
  if (!searchQuery) return profilesCache;
  const q = searchQuery.toLowerCase();
  return profilesCache.filter(p => (p.name || '').toLowerCase().includes(q) || (p.email || '').toLowerCase().includes(q));
}

function renderUsersTab(container) {
  const el = container.querySelector('#adminContent');
  const filtered = getFiltered();
  el.innerHTML = `
    <div class="ap-settings-bar" style="display:flex; gap: 24px; align-items: center; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px 16px; margin-bottom: 16px;">
      <div style="font-weight:600; color:#334155; font-size:13px; text-transform: uppercase; letter-spacing:0.5px;">Global Features</div>
      <label style="display:flex; align-items:center; gap:8px; font-size:13px; font-weight:500; color:#475569; cursor:pointer; user-select:none;">
        <input type="checkbox" id="toggleWithdrawalCheck" ${withdrawEnabled ? 'checked' : ''} style="width:16px; height:16px; accent-color:#16a34a; cursor:pointer;" />
        Enable Withdrawals
      </label>
      <label style="display:flex; align-items:center; gap:8px; font-size:13px; font-weight:500; color:#475569; cursor:pointer; user-select:none;">
        <input type="checkbox" id="toggleAddFundsCheck" ${addFundsEnabled ? 'checked' : ''} style="width:16px; height:16px; accent-color:#16a34a; cursor:pointer;" />
        Enable Add Funds
      </label>
    </div>
    <div class="ap-toolbar">
      <input class="ap-search" id="apSearch" placeholder="Search by name or email..." value="${esc(searchQuery)}"/>
      <button class="ap-btn-create" id="createUserBtn">+ Create User</button>
    </div>
    <table class="ap-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Role</th>
          <th>Accounts</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${filtered.length === 0 ? '<tr><td colspan="5" class="ap-empty">No users found</td></tr>' : filtered.map(p => {
          const accts = accountsCache.filter(a => a.userId === p.id);
          return `<tr><td class="ap-user-name">${esc(p.name || '—')}</td><td>${esc(p.email)}</td><td><span class="ap-role-badge ${p.role === 'admin' ? 'admin' : ''}">${p.role === 'admin' ? 'Admin' : 'User'}</span></td><td>${accts.length === 0 ? '<span style="color:#94a3b8">No accounts</span>' : accts.map(a => `<div class="ap-acct-row"><span class="ap-acct-type">${esc(a.type || 'Checking')}</span><span class="ap-acct-bal">$${fmt(a.balance)}</span><span class="ap-acct-actions"><button title="Edit" class="eab" data-id="${a.id}">✎</button><button title="Delete" class="dab" data-id="${a.id}">🗑</button></span></div>`).join('')}</td><td><div class="ap-actions"><button class="ap-btn epb" data-uid="${p.id}">Edit Profile</button><button class="ap-btn aab" data-uid="${p.id}">Add Account</button>${p.role !== 'admin' ? `<button class="ap-btn mab" data-uid="${p.id}">Make Admin</button>` : `<button class="ap-btn rab" data-uid="${p.id}">Remove Admin</button>`}<button class="ap-btn ap-btn-danger dub" data-uid="${p.id}">Delete User</button></div></td></tr>`;
        }).join('')}
      </tbody>
    </table>
  `;

  el.querySelector('#toggleWithdrawalCheck').addEventListener('change', async (e) => {
    const checked = e.target.checked;
    e.target.disabled = true;
    try {
      await setWithdrawalStatus(checked);
      withdrawEnabled = checked;
    } catch (err) {
      alert('Error updating withdrawal status: ' + err.message);
      e.target.checked = !checked;
    } finally {
      e.target.disabled = false;
    }
  });

  el.querySelector('#toggleAddFundsCheck').addEventListener('change', async (e) => {
    const checked = e.target.checked;
    e.target.disabled = true;
    try {
      await setAddFundsStatus(checked);
      addFundsEnabled = checked;
    } catch (err) {
      alert('Error updating add funds status: ' + err.message);
      e.target.checked = !checked;
    } finally {
      e.target.disabled = false;
    }
  });

  el.querySelector('#apSearch').addEventListener('input', e => { searchQuery = e.target.value; renderUsersTab(container); });
  el.querySelector('#createUserBtn').addEventListener('click', () => showCreateUserModal(container));
  el.querySelectorAll('.epb').forEach(b => b.addEventListener('click', () => showEditProfileModal(container, b.dataset.uid)));
  el.querySelectorAll('.aab').forEach(b => b.addEventListener('click', () => showAddAccountModal(container, b.dataset.uid)));
  el.querySelectorAll('.mab').forEach(b => b.addEventListener('click', async () => { await updateUserRole(b.dataset.uid, 'admin'); profilesCache = await getAllProfiles(); renderUsersTab(container); }));
  el.querySelectorAll('.rab').forEach(b => b.addEventListener('click', async () => { await updateUserRole(b.dataset.uid, 'user'); profilesCache = await getAllProfiles(); renderUsersTab(container); }));
  el.querySelectorAll('.dub').forEach(b => b.addEventListener('click', () => deleteUserHandler(container, b.dataset.uid)));
  el.querySelectorAll('.eab').forEach(b => b.addEventListener('click', () => showEditAccountModal(container, b.dataset.id)));
  el.querySelectorAll('.dab').forEach(b => b.addEventListener('click', () => { if (!confirm('Delete this account?')) return; (async () => { await deleteAccount(b.dataset.id); accountsCache = await getAccounts(); renderUsersTab(container); })(); }));
}

function renderTxnTab(container) {
  const el = container.querySelector('#adminContent');
  el.innerHTML = `<div class="ap-toolbar"><input class="ap-search" id="txnSearch" placeholder="Search transactions..."/><button class="ap-btn-create" id="addTxnBtn">+ Add Transaction</button></div><table class="ap-txn-table"><thead><tr><th>User</th><th>Account</th><th>Type</th><th>Amount</th><th>Date</th><th>Description</th><th>Actions</th></tr></thead><tbody>${transactionsCache.length === 0 ? '<tr><td colspan="7" class="ap-empty">No transactions</td></tr>' : transactionsCache.map(t => {
    const acc = accountsCache.find(a => a.id === t.accountId);
    const usr = acc ? profilesCache.find(p => p.id === acc.userId) : null;
    return `<tr><td>${esc(usr?.name || usr?.email || '—')}</td><td>${esc(acc?.name || '—')}</td><td>${esc(t.type)}</td><td class="${t.type === 'deposit' || t.type === 'credit' ? 'text-success' : 'text-danger'}">$${fmt(Math.abs(t.amount))}</td><td>${t.date || ''}</td><td>${esc(t.description || '')}</td><td><div class="ap-actions"><button class="ap-btn etb" data-id="${t.id}">Edit</button><button class="ap-btn ap-btn-danger dtb" data-id="${t.id}">Delete</button></div></td></tr>`;
  }).join('')}</tbody></table>`;
  el.querySelector('#addTxnBtn').addEventListener('click', () => showTxnModal(container, null));
  el.querySelectorAll('.etb').forEach(b => b.addEventListener('click', () => showTxnModal(container, b.dataset.id)));
  el.querySelectorAll('.dtb').forEach(b => b.addEventListener('click', () => deleteTxnHandler(container, b.dataset.id)));
}

// ---- MODALS ----

function showModal(container, title, bodyHtml, onSave) {
  const ov = document.createElement('div');
  ov.className = 'modal-overlay';
  ov.innerHTML = `<div class="modal-content-admin"><div class="modal-header"><h5>${title}</h5><button class="btn-close modal-close"></button></div><div class="modal-body">${bodyHtml}</div><div class="modal-footer"><button class="btn btn-secondary modal-close">Cancel</button><button class="btn btn-primary" id="modalSaveBtn">Save</button></div></div>`;
  document.body.appendChild(ov);
  ov.querySelectorAll('.modal-close').forEach(b => b.addEventListener('click', () => ov.remove()));
  ov.querySelector('#modalSaveBtn').addEventListener('click', async () => {
    const btn = ov.querySelector('#modalSaveBtn');
    btn.disabled = true; btn.textContent = 'Saving...';
    try { await onSave(); ov.remove(); } catch (err) { alert('Error: ' + err.message); btn.disabled = false; btn.textContent = 'Save'; }
  });
}

function showCreateUserModal(container) {
  showModal(container, 'Create New User', `
    <div class="mb-3"><label>Email <span class="text-danger">*</span></label><input class="form-control" id="mUE" type="email" placeholder="user@example.com"/></div>
    <div class="mb-3"><label>Password <span class="text-danger">*</span></label><div style="position:relative"><input class="form-control" id="mUP" type="password" placeholder="Min 6 characters" style="padding-right:44px"/><button type="button" class="pw-toggle" onclick="var i=this.previousElementSibling;var h=i.type==='password';i.type=h?'text':'password';this.textContent=h?'👁‍🗨':'👁'" tabindex="-1">👁</button></div></div>
    <div class="mb-3"><label>Full Name</label><input class="form-control" id="mUN" placeholder="John Doe"/></div>
    <hr/><h6>Bank Account (optional)</h6>
    <div class="mb-3"><label>Account Name</label><input class="form-control" id="mUA" value="Checking Account"/></div>
    <div class="mb-3"><label>Type</label><select class="form-control" id="mUT"><option>Checking</option><option>Savings</option><option>Credit Card</option></select></div>
    <div class="mb-3"><label>Initial Balance</label><input class="form-control" id="mUB" type="number" step="0.01" value="0"/></div>`,
    async () => {
      const email = document.querySelector('#mUE').value.trim();
      const password = document.querySelector('#mUP').value;
      const name = document.querySelector('#mUN').value.trim();
      if (!email) return alert('Email required');
      if (!password || password.length < 6) return alert('Password must be 6+ chars');
      const nu = await adminCreateUser(email, password);
      await createUserProfile(nu.uid, email, name, nu.passwordHash);
      const accName = document.querySelector('#mUA').value.trim();
      if (accName) { await createAccount({ name: accName, type: document.querySelector('#mUT').value, balance: parseFloat(document.querySelector('#mUB').value) || 0, userId: nu.uid }); accountsCache = await getAccounts(); }
      profilesCache = await getAllProfiles();
      renderUsersTab(container);
    });
}

function showEditProfileModal(container, uid) {
  const p = profilesCache.find(x => x.id === uid);
  if (!p) return;
  showModal(container, 'Edit Profile', `
    <div class="mb-3"><label>Full Name</label><input class="form-control" id="mEN" value="${esc(p.name || '')}"/></div>
    <div class="mb-3"><label>Email</label><input class="form-control" id="mEE" value="${esc(p.email || '')}"/></div>`,
    async () => {
      const name = document.querySelector('#mEN').value.trim();
      const email = document.querySelector('#mEE').value.trim();
      await updateUserProfile(uid, { name, email });
      profilesCache = await getAllProfiles();
      renderUsersTab(container);
    });
}

function showAddAccountModal(container, uid) {
  showModal(container, 'Add Account', `
    <div class="mb-3"><label>Account Name</label><input class="form-control" id="mAN" value="Checking Account"/></div>
    <div class="mb-3"><label>Type</label><select class="form-control" id="mAT"><option>Checking</option><option>Savings</option><option>Credit Card</option></select></div>
    <div class="mb-3"><label>Balance</label><input class="form-control" id="mAB" type="number" step="0.01" value="0"/></div>`,
    async () => {
      const name = document.querySelector('#mAN').value.trim();
      if (!name) return alert('Name required');
      await createAccount({ name, type: document.querySelector('#mAT').value, balance: parseFloat(document.querySelector('#mAB').value) || 0, userId: uid });
      accountsCache = await getAccounts();
      renderUsersTab(container);
    });
}

function showEditAccountModal(container, accId) {
  const a = accountsCache.find(x => x.id === accId);
  if (!a) return;
  showModal(container, `Edit: ${esc(a.name)}`, `
    <div class="mb-3"><label>Account Name</label><input class="form-control" id="mAN" value="${esc(a.name)}"/></div>
    <div class="mb-3"><label>Type</label><select class="form-control" id="mAT"><option ${a.type==='Checking'?'selected':''}>Checking</option><option ${a.type==='Savings'?'selected':''}>Savings</option><option ${a.type==='Credit Card'?'selected':''}>Credit Card</option><option ${a.type==='Credit'?'selected':''}>Credit</option></select></div>
    <div class="mb-3"><label>Balance</label><input class="form-control" id="mAB" type="number" step="0.01" value="${a.balance}"/></div>`,
    async () => {
      await updateAccount(accId, { name: document.querySelector('#mAN').value.trim(), type: document.querySelector('#mAT').value, balance: parseFloat(document.querySelector('#mAB').value) || 0 });
      accountsCache = await getAccounts();
      renderUsersTab(container);
    });
}

function showTxnModal(container, txnId) {
  const txn = txnId ? transactionsCache.find(t => t.id === txnId) : null;
  showModal(container, txn ? 'Edit Transaction' : 'Add Transaction', `
    <div class="mb-3"><label>Account</label><select class="form-control" id="mTA"><option value="">— Select —</option>${accountsCache.map(a => `<option value="${a.id}" ${txn?.accountId===a.id?'selected':''}>${esc(a.name)} ($${fmt(a.balance)})</option>`).join('')}</select></div>
    <div class="mb-3"><label>Type</label><select class="form-control" id="mTT"><option value="deposit" ${txn?.type==='deposit'?'selected':''}>Deposit</option><option value="withdrawal" ${txn?.type==='withdrawal'?'selected':''}>Withdrawal</option><option value="transfer" ${txn?.type==='transfer'?'selected':''}>Transfer</option></select></div>
    <div class="mb-3"><label>Amount</label><input class="form-control" id="mTAm" type="number" step="0.01" value="${txn?txn.amount:''}"/></div>
    <div class="mb-3"><label>Description</label><input class="form-control" id="mTD" value="${txn?esc(txn.description||''):''}"/></div>
    <div class="mb-3"><label>Date</label><input class="form-control" id="mTDt" type="date" value="${txn?txn.date:new Date().toISOString().split('T')[0]}"/></div>`,
    async () => {
      const accountId = document.querySelector('#mTA').value;
      const type = document.querySelector('#mTT').value;
      const amount = parseFloat(document.querySelector('#mTAm').value);
      const description = document.querySelector('#mTD').value.trim();
      const date = document.querySelector('#mTDt').value;
      if (!accountId) return alert('Select an account');
      if (!amount || amount <= 0) return alert('Amount must be positive');
      if (txn) {
        const oldAcc = accountsCache.find(a => a.id === txn.accountId);
        if (oldAcc) { const d = txn.type==='deposit'?-txn.amount:txn.amount; await updateAccount(txn.accountId,{balance:oldAcc.balance+d}); }
        await updateTransaction(txnId, { accountId, type, amount, description, date });
        const newAcc = accountsCache.find(a => a.id === accountId);
        if (newAcc) { const eB = oldAcc?.id===newAcc.id ? oldAcc.balance+(txn.type==='deposit'?-txn.amount:txn.amount) : newAcc.balance; await updateAccount(accountId,{balance:eB+(type==='deposit'?amount:-amount)}); }
      } else {
        await createTransaction({ accountId, type, amount, description, date });
        const acc = accountsCache.find(a => a.id === accountId);
        if (acc) await updateAccount(accountId, { balance: acc.balance + (type==='deposit'?amount:-amount) });
      }
      [accountsCache, transactionsCache] = await Promise.all([getAccounts(), getAllTransactions()]);
      renderTxnTab(container);
    });
}

async function deleteUserHandler(container, uid) {
  if (!confirm('Delete this user and all their accounts? This cannot be undone.')) return;
  const userAccounts = accountsCache.filter(a => a.userId === uid);
  for (const acc of userAccounts) {
    const txns = transactionsCache.filter(t => t.accountId === acc.id);
    for (const t of txns) await deleteTransaction(t.id);
    await deleteAccount(acc.id);
  }
  try { await updateUserProfile(uid, { email: null, name: 'DELETED', role: 'user' }); } catch (_) {}
  [accountsCache, transactionsCache, profilesCache] = await Promise.all([getAccounts(), getAllTransactions(), getAllProfiles()]);
  renderUsersTab(container);
}

function deleteTxnHandler(container, txnId) {
  if (!confirm('Delete this transaction?')) return;
  (async () => {
    const txn = transactionsCache.find(t => t.id === txnId);
    if (txn) { const acc = accountsCache.find(a => a.id === txn.accountId); if (acc) { await updateAccount(txn.accountId, { balance: acc.balance + (txn.type==='deposit'?-txn.amount:txn.amount) }); } }
    await deleteTransaction(txnId);
    [accountsCache, transactionsCache] = await Promise.all([getAccounts(), getAllTransactions()]);
    renderTxnTab(container);
  })();
}

function esc(s) { if (!s) return ''; const d = document.createElement('div'); d.textContent = s; return d.innerHTML; }
function fmt(n) { return Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
