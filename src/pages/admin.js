import {
  getAccounts,
  getAllTransactions,
  createAccount,
  updateAccount,
  deleteAccount,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getAllProfiles,
  getUserProfile,
  updateUserProfile,
  updateUserRole,
  createUserProfile,
  getWithdrawalStatus,
  setWithdrawalStatus,
} from '../db';
import { getCurrentUser, adminCreateUser } from '../auth';
import { navigate } from '../router';

let accountsCache = [];
let transactionsCache = [];
let profilesCache = [];

export async function renderAdmin(container) {
  // Check if user is logged in and has admin role
  const user = getCurrentUser();
  if (!user) {
    renderAccessDenied(container, 'You must be signed in to access the admin panel.');
    return;
  }

  try {
    const profile = await getUserProfile(user.uid);
    if (!profile || profile.role !== 'admin') {
      renderAccessDenied(container, 'You do not have admin access. Please contact your administrator.');
      return;
    }
  } catch (err) {
    renderAccessDenied(container, 'Failed to verify admin access: ' + err.message);
    return;
  }

  renderAdminPanel(container);
}

// =================================================================
//  ACCESS DENIED
// =================================================================

function renderAccessDenied(container, message) {
  container.innerHTML = `
    <div class="auth-page">
      <div class="auth-container">
        <div class="auth-card text-center">
          <div class="auth-header">
            <img src="/custom/bankwithfidelity2/image/logo-2x.png" alt="Fidelity Bank" class="auth-logo" />
            <h2>Access Denied</h2>
            <p class="text-muted">${message}</p>
          </div>
          <div class="auth-footer">
            <a href="#" class="auth-back" id="backToHome">← Back to Home</a>
          </div>
        </div>
      </div>
    </div>
  `;

  container.querySelector('#backToHome').addEventListener('click', (e) => {
    e.preventDefault();
    navigate('#/');
  });
}

// =================================================================
//  ADMIN PANEL
// =================================================================

async function renderAdminPanel(container) {
  container.innerHTML = `
    <div class="admin-page">
      <nav class="admin-nav">
        <div class="container d-flex justify-content-between align-items-center py-2">
          <h4 class="text-white mb-0">⚡ Admin Panel</h4>
          <div>
            <button class="btn btn-sm btn-outline-light me-2" id="adminBackBtn">← Home</button>
            <button class="btn btn-sm btn-outline-light" id="adminLogoutBtn">Sign Out</button>
          </div>
        </div>
      </nav>
      <div class="container py-4">
        <ul class="nav nav-tabs mb-4" id="adminTabs">
          <li class="nav-item"><a class="nav-link active" data-tab="accounts" href="#">Accounts</a></li>
          <li class="nav-item"><a class="nav-link" data-tab="transactions" href="#">Transactions</a></li>
          <li class="nav-item"><a class="nav-link" data-tab="withdrawals" href="#">Withdrawals</a></li>
          <li class="nav-item"><a class="nav-link" data-tab="users" href="#">Users</a></li>
        </ul>
        <div id="adminContent">
          <div class="text-center py-5"><div class="spinner-border text-primary" role="status"></div></div>
        </div>
      </div>
    </div>
  `;

  container.querySelector('#adminBackBtn').addEventListener('click', () => navigate('#/'));
  container.querySelector('#adminLogoutBtn').addEventListener('click', async () => {
    const { logOut } = await import('../auth');
    await logOut();
    navigate('#/');
  });

  // Load caches
  [accountsCache, transactionsCache, profilesCache] = await Promise.all([
    getAccounts(),
    getAllTransactions(),
    getAllProfiles(),
  ]);

  renderAccountsTab(container);

  // Tab switching
  container.querySelectorAll('[data-tab]').forEach((tab) => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      container.querySelectorAll('[data-tab]').forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      const tabName = tab.dataset.tab;
      if (tabName === 'accounts') renderAccountsTab(container);
      else if (tabName === 'transactions') renderTransactionsTab(container);
      else if (tabName === 'withdrawals') renderWithdrawalsTab(container);
      else if (tabName === 'users') renderUsersTab(container);
    });
  });
}

// =================================================================
//  ACCOUNTS TAB
// =================================================================

function renderAccountsTab(container) {
  const el = container.querySelector('#adminContent');
  el.innerHTML = `
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h3>All Accounts</h3>
      <button class="btn btn-primary" id="addAccountBtn">+ Add Account</button>
    </div>
    <div class="table-responsive">
      <table class="table table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Balance</th>
            <th>User</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${accountsCache.map((a) => `
            <tr>
              <td>${escHtml(a.name)}</td>
              <td>${escHtml(a.type || 'Checking')}</td>
              <td class="${a.balance < 0 ? 'text-danger' : ''}">$${fmt(a.balance)}</td>
              <td style="font-size:0.8em">${resolveUserName(a.userId)}</td>
              <td>
                <button class="btn btn-sm btn-outline-primary edit-account-btn" data-id="${a.id}">Edit</button>
                <button class="btn btn-sm btn-warning edit-balance-btn" data-id="${a.id}">Balance</button>
                <button class="btn btn-sm btn-danger delete-account-btn" data-id="${a.id}">Delete</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;

  el.querySelector('#addAccountBtn').addEventListener('click', () => showAccountModal(container, null));
  el.querySelectorAll('.edit-account-btn').forEach((b) =>
    b.addEventListener('click', () => showAccountModal(container, b.dataset.id))
  );
  el.querySelectorAll('.edit-balance-btn').forEach((b) =>
    b.addEventListener('click', () => showBalanceModal(container, b.dataset.id))
  );
  el.querySelectorAll('.delete-account-btn').forEach((b) =>
    b.addEventListener('click', () => deleteAccountHandler(container, b.dataset.id))
  );
}

// =================================================================
//  TRANSACTIONS TAB
// =================================================================

function renderTransactionsTab(container) {
  const el = container.querySelector('#adminContent');
  el.innerHTML = `
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h3>All Transactions</h3>
      <button class="btn btn-primary" id="addTxnBtn">+ Add Transaction</button>
    </div>
    <div class="table-responsive">
      <table class="table table-striped">
        <thead>
          <tr>
            <th>Account</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${transactionsCache.map((t) => `
            <tr>
              <td style="font-size:0.8em">${resolveAccountName(t.accountId)}</td>
              <td>${escHtml(t.type)}</td>
              <td class="${t.type === 'deposit' || t.type === 'credit' ? 'text-success' : 'text-danger'}">$${fmt(Math.abs(t.amount))}</td>
              <td>${t.date || ''}</td>
              <td>${escHtml(t.description || '')}</td>
              <td>
                <button class="btn btn-sm btn-outline-primary edit-txn-btn" data-id="${t.id}">Edit</button>
                <button class="btn btn-sm btn-danger delete-txn-btn" data-id="${t.id}">Delete</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
  el.querySelector('#addTxnBtn').addEventListener('click', () => showTxnModal(container, null));
  el.querySelectorAll('.edit-txn-btn').forEach((b) =>
    b.addEventListener('click', () => showTxnModal(container, b.dataset.id))
  );
  el.querySelectorAll('.delete-txn-btn').forEach((b) =>
    b.addEventListener('click', () => deleteTxnHandler(container, b.dataset.id))
  );
}

// =================================================================
//  USERS TAB
// =================================================================

function renderUsersTab(container) {
  const el = container.querySelector('#adminContent');

  el.innerHTML = `
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h3>Users</h3>
      <button class="btn btn-primary" id="createUserBtn">+ Create User</button>
    </div>
    <div class="table-responsive">
      <table class="table table-striped">
        <thead>
          <tr>
            <th>Email</th>
            <th>Name</th>
            <th>Role</th>
            <th>User ID</th>
            <th>Joined</th>
            <th>Accounts</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${profilesCache.map((p) => {
            const userAccounts = accountsCache.filter((a) => a.userId === p.id);
            const totalBalance = userAccounts.reduce((sum, a) => sum + (a.balance || 0), 0);
            return `
              <tr>
                <td>${escHtml(p.email)}</td>
                <td>
                  <span class="user-name-text" id="userNameText-${p.id}">${escHtml(p.name || '—')}</span>
                  <input class="form-control form-control-sm d-none user-name-input" id="userNameInput-${p.id}" value="${escHtml(p.name || '')}" style="width:140px" />
                </td>
                <td>
                  <span class="badge ${p.role === 'admin' ? 'bg-danger' : 'bg-secondary'}">${p.role || 'user'}</span>
                </td>
                <td style="font-size:0.75em;max-width:100px;overflow:hidden;text-overflow:ellipsis">${p.id}</td>
                <td style="font-size:0.85em">${p.createdAt ? new Date(p.createdAt).toLocaleDateString() : '—'}</td>
                <td>${userAccounts.length} accts / $${fmt(totalBalance)}</td>
                <td>
                  <button class="btn btn-sm btn-outline-success edit-user-name-btn" data-uid="${p.id}">Rename</button>
                  ${p.role !== 'admin'
                    ? `<button class="btn btn-sm btn-outline-danger make-admin-btn" data-uid="${p.id}">Make Admin</button>`
                    : `<button class="btn btn-sm btn-outline-warning remove-admin-btn" data-uid="${p.id}">Remove Admin</button>`}
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>
  `;

  // Inline rename
  el.querySelectorAll('.edit-user-name-btn').forEach((b) => {
    b.addEventListener('click', async () => {
      const uid = b.dataset.uid;
      const textEl = el.querySelector(`#userNameText-${uid}`);
      const inputEl = el.querySelector(`#userNameInput-${uid}`);
      const isEditing = !inputEl.classList.contains('d-none');

      if (isEditing) {
        // Save
        const newName = inputEl.value.trim();
        if (newName) {
          try {
            await updateUserProfile(uid, { name: newName });
            const profile = profilesCache.find((p) => p.id === uid);
            if (profile) profile.name = newName;
            textEl.textContent = newName;
          } catch (err) {
            alert('Failed to rename: ' + err.message);
            textEl.classList.remove('d-none');
            inputEl.classList.add('d-none');
            b.textContent = 'Rename';
            return;
          }
        }
        textEl.classList.remove('d-none');
        inputEl.classList.add('d-none');
        b.textContent = 'Rename';
      } else {
        textEl.classList.add('d-none');
        inputEl.classList.remove('d-none');
        inputEl.focus();
        b.textContent = 'Save';
      }
    });
  });

  el.querySelectorAll('.make-admin-btn').forEach((b) => {
    b.addEventListener('click', async () => {
      await updateUserRole(b.dataset.uid, 'admin');
      profilesCache = await getAllProfiles();
      renderUsersTab(container);
    });
  });

  el.querySelector('#createUserBtn').addEventListener('click', () => showCreateUserModal(container));

  el.querySelectorAll('.remove-admin-btn').forEach((b) => {
    b.addEventListener('click', async () => {
      await updateUserRole(b.dataset.uid, 'user');
      profilesCache = await getAllProfiles();
      renderUsersTab(container);
    });
  });
}

// =================================================================
//  MODALS — Accounts
// =================================================================

function showAccountModal(container, accountId) {
  const account = accountId ? accountsCache.find((a) => a.id === accountId) : null;

  showModal(
    container,
    account ? `Edit Account: ${escHtml(account.name)}` : 'Add Account',
    `
      <div class="mb-3">
        <label>Account Name</label>
        <input class="form-control" id="modalAccName"
               value="${account ? escHtml(account.name) : ''}" />
      </div>
      <div class="mb-3">
        <label>Type</label>
        <select class="form-control" id="modalAccType">
          <option ${account?.type === 'Checking' ? 'selected' : ''}>Checking</option>
          <option ${account?.type === 'Savings' ? 'selected' : ''}>Savings</option>
          <option ${account?.type === 'Credit' ? 'selected' : ''}>Credit</option>
        </select>
      </div>
      <div class="mb-3">
        <label>Balance</label>
        <input class="form-control" id="modalAccBalance" type="number"
               value="${account ? account.balance : '0'}" />
      </div>
      <div class="mb-3">
        <label>User ID</label>
        <input class="form-control" id="modalAccUser"
               value="${account ? escHtml(account.userId || '') : ''}"
               placeholder="User UUID" />
        ${accountId ? '' : '<small class="text-muted">Leave empty to create an unassigned account</small>'}
      </div>
    `,
    async () => {
      const name = document.querySelector('#modalAccName').value.trim();
      const type = document.querySelector('#modalAccType').value;
      const balance = parseFloat(document.querySelector('#modalAccBalance').value) || 0;
      const userId = document.querySelector('#modalAccUser').value.trim() || null;
      if (!name) return alert('Account name is required');

      if (account) {
        await updateAccount(account.id, { name, type, balance, userId });
      } else {
        await createAccount({ name, type, balance, userId });
      }

      accountsCache = await getAccounts();
      renderAccountsTab(container);
    }
  );
}

function showBalanceModal(container, accountId) {
  const account = accountsCache.find((a) => a.id === accountId);
  if (!account) return;

  showModal(
    container,
    `Adjust Balance: ${escHtml(account.name)}`,
    `
      <div class="mb-3">
        <label>Current Balance: <strong>$${fmt(account.balance)}</strong></label>
      </div>
      <div class="mb-3">
        <label>New Balance</label>
        <input class="form-control" id="modalNewBalance" type="number"
               value="${account.balance}" />
      </div>
    `,
    async () => {
      const newBalance = parseFloat(document.querySelector('#modalNewBalance').value);
      if (isNaN(newBalance)) return alert('Enter a valid number');
      await updateAccount(accountId, { balance: newBalance });
      accountsCache = await getAccounts();
      renderAccountsTab(container);
    }
  );
}

function deleteAccountHandler(container, accountId) {
  if (!confirm('Delete this account permanently? This cannot be undone.')) return;
  (async () => {
    await deleteAccount(accountId);
    accountsCache = await getAccounts();
    transactionsCache = await getAllTransactions();
    renderAccountsTab(container);
  })();
}

// =================================================================
//  MODALS — Transactions
// =================================================================

function showTxnModal(container, txnId) {
  const txn = txnId ? transactionsCache.find((t) => t.id === txnId) : null;
  const isEdit = !!txn;

  showModal(
    container,
    isEdit ? 'Edit Transaction' : 'Add Transaction',
    `
      <div class="mb-3">
        <label>Account</label>
        <select class="form-control" id="modalTxnAccount">
          <option value="">— Select Account —</option>
          ${accountsCache
            .map(
              (a) =>
                `<option value="${a.id}" ${txn?.accountId === a.id ? 'selected' : ''}>
                  ${escHtml(a.name)} ($${fmt(a.balance)})
                </option>`
            )
            .join('')}
        </select>
      </div>
      <div class="mb-3">
        <label>Type</label>
        <select class="form-control" id="modalTxnType">
          <option value="deposit" ${txn?.type === 'deposit' ? 'selected' : ''}>Deposit</option>
          <option value="withdrawal" ${txn?.type === 'withdrawal' ? 'selected' : ''}>Withdrawal</option>
          <option value="transfer" ${txn?.type === 'transfer' ? 'selected' : ''}>Transfer</option>
        </select>
      </div>
      <div class="mb-3">
        <label>Amount</label>
        <input class="form-control" id="modalTxnAmount" type="number" step="0.01"
               value="${txn ? txn.amount : ''}" />
      </div>
      <div class="mb-3">
        <label>Description</label>
        <input class="form-control" id="modalTxnDesc"
               value="${txn ? escHtml(txn.description || '') : ''}" />
      </div>
      <div class="mb-3">
        <label>Date</label>
        <input class="form-control" id="modalTxnDate" type="date"
               value="${txn ? txn.date : new Date().toISOString().split('T')[0]}" />
      </div>
    `,
    async () => {
      const accountId = document.querySelector('#modalTxnAccount').value;
      const type = document.querySelector('#modalTxnType').value;
      const amount = parseFloat(document.querySelector('#modalTxnAmount').value);
      const description = document.querySelector('#modalTxnDesc').value.trim();
      const date = document.querySelector('#modalTxnDate').value;

      if (!accountId) return alert('Please select an account');
      if (!amount || amount <= 0) return alert('Amount must be positive');

      if (isEdit) {
        // Update transaction + recalculate account balance
        const oldAcc = accountsCache.find((a) => a.id === txn.accountId);
        const newAcc = accountsCache.find((a) => a.id === accountId);

        // Reverse old txn effect on old account
        if (oldAcc) {
          const oldDelta = txn.type === 'deposit' ? -txn.amount : txn.amount;
          await updateAccount(txn.accountId, { balance: oldAcc.balance + oldDelta });
        }

        await updateTransaction(txnId, { accountId, type, amount, description, date });  // Apply new txn effect on new account
          if (newAcc) {
            const newDelta = type === 'deposit' ? amount : -amount;
            // effectiveBalance = balance after reversing the old txn
            const effectiveBalance =
              oldAcc?.id === newAcc.id
                ? oldAcc.balance + (txn.type === 'deposit' ? -txn.amount : txn.amount)
                : newAcc.balance;
            await updateAccount(accountId, { balance: effectiveBalance + newDelta });
          }
      } else {
        await createTransaction({ accountId, type, amount, description, date });

        // Update account balance
        const acc = accountsCache.find((a) => a.id === accountId);
        if (acc) {
          const delta = type === 'deposit' ? amount : -amount;
          await updateAccount(accountId, { balance: acc.balance + delta });
        }
      }

      [accountsCache, transactionsCache] = await Promise.all([
        getAccounts(),
        getAllTransactions(),
      ]);
      renderAccountsTab(container);
    }
  );
}

function deleteTxnHandler(container, txnId) {
  if (!confirm('Delete this transaction permanently? The account balance will be adjusted.')) return;
  (async () => {
    const txn = transactionsCache.find((t) => t.id === txnId);
    if (txn) {
      // Reverse the transaction's effect on the account balance
      const acc = accountsCache.find((a) => a.id === txn.accountId);
      if (acc) {
        const delta = txn.type === 'deposit' ? -txn.amount : txn.amount;
        await updateAccount(txn.accountId, { balance: acc.balance + delta });
      }
    }
    await deleteTransaction(txnId);
    [accountsCache, transactionsCache] = await Promise.all([
      getAccounts(),
      getAllTransactions(),
    ]);
    renderTransactionsTab(container);
  })();
}

// =================================================================
//  MODAL — Create User
// =================================================================

function showCreateUserModal(container) {
  showModal(
    container,
    'Create New User',
    `
      <div class="mb-3">
        <label>Email <span class="text-danger">*</span></label>
        <input class="form-control" id="modalUserEmail" type="email" placeholder="user@example.com" />
      </div>
      <div class="mb-3">
        <label>Password <span class="text-danger">*</span></label>
        <input class="form-control" id="modalUserPassword" type="password" placeholder="Min 6 characters" />
      </div>
      <div class="mb-3">
        <label>Full Name</label>
        <input class="form-control" id="modalUserName" placeholder="John Doe" />
      </div>
      <hr/>
      <h6>Bank Account (optional)</h6>
      <div class="mb-3">
        <label>Account Name</label>
        <input class="form-control" id="modalUserAccName" value="Checking Account" />
      </div>
      <div class="mb-3">
        <label>Account Type</label>
        <select class="form-control" id="modalUserAccType">
          <option>Checking</option>
          <option>Savings</option>
          <option>Credit</option>
        </select>
      </div>
      <div class="mb-3">
        <label>Initial Balance</label>
        <input class="form-control" id="modalUserAccBalance" type="number" step="0.01" value="0" />
      </div>
    `,
    async () => {
      const email = document.querySelector('#modalUserEmail').value.trim();
      const password = document.querySelector('#modalUserPassword').value;
      const name = document.querySelector('#modalUserName').value.trim();
      const accName = document.querySelector('#modalUserAccName').value.trim();
      const accType = document.querySelector('#modalUserAccType').value;
      const accBalance = parseFloat(document.querySelector('#modalUserAccBalance').value) || 0;

      if (!email) return alert('Email is required');
      if (!password || password.length < 6) return alert('Password must be at least 6 characters');

      // 1. Create auth user (without disrupting admin session)
      const newUser = await adminCreateUser(email, password);

      // 2. Create profile
      await createUserProfile(newUser.uid, email, name, newUser.passwordHash);

      // 3. Create bank account if name provided
      if (accName) {
        await createAccount({ name: accName, type: accType, balance: accBalance, userId: newUser.uid });
        accountsCache = await getAccounts();
      }

      profilesCache = await getAllProfiles();
      renderUsersTab(container);
    }
  );
}

// =================================================================
//  HELPERS
// =================================================================

function resolveUserName(userId) {
  if (!userId) return '<span class="text-muted">—</span>';
  const p = profilesCache.find((p) => p.id === userId);
  return p
    ? escHtml(p.name || p.email || userId.slice(0, 12) + '...')
    : userId.slice(0, 12) + '...';
}

function resolveAccountName(accountId) {
  if (!accountId) return '<span class="text-muted">—</span>';
  const a = accountsCache.find((a) => a.id === accountId);
  return a ? escHtml(a.name) : accountId.slice(0, 12) + '...';
}

function showModal(container, title, bodyHtml, onSave) {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal-content-admin">
      <div class="modal-header">
        <h5>${title}</h5>
        <button class="btn-close modal-close"></button>
      </div>
      <div class="modal-body">${bodyHtml}</div>
      <div class="modal-footer">
        <button class="btn btn-secondary modal-close">Cancel</button>
        <button class="btn btn-primary" id="modalSaveBtn">Save</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  overlay.querySelectorAll('.modal-close').forEach((b) =>
    b.addEventListener('click', () => overlay.remove())
  );
  overlay.querySelector('#modalSaveBtn').addEventListener('click', async () => {
    const btn = overlay.querySelector('#modalSaveBtn');
    btn.disabled = true;
    btn.textContent = 'Saving...';
    try {
      await onSave();
      overlay.remove();
    } catch (err) {
      alert('Error: ' + err.message);
      btn.disabled = false;
      btn.textContent = 'Save';
    }
  });
}

function escHtml(str) {
  if (!str) return '';
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

function fmt(num) {
  return Math.abs(num).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

// =================================================================
//  WITHDRAWALS TAB & HELPERS
// =================================================================

async function renderWithdrawalsTab(container) {
  const el = container.querySelector('#adminContent');
  
  el.innerHTML = `
    <div class="text-center py-5">
      <div class="spinner-border text-primary" role="status"></div>
    </div>
  `;
  
  let withdrawalsEnabled = true;
  try {
    withdrawalsEnabled = await getWithdrawalStatus();
  } catch (err) {
    console.error('Error fetching withdrawal status:', err);
  }
  
  const withdrawals = transactionsCache.filter(t => t.description && t.description.includes('[Withdrawal Request]'));
  
  el.innerHTML = `
    <div class="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
      <h3 class="mb-0">Withdrawal Applications</h3>
      <div class="d-flex align-items-center gap-2 bg-white px-3 py-2 rounded shadow-sm border">
        <label class="form-check-label mb-0 font-weight-bold" for="withdrawToggle" id="withdrawToggleLabel" style="cursor:pointer; font-size: 0.9em; user-select:none;">
          ${withdrawalsEnabled ? '<span class="text-success"><i class="fas fa-check-circle me-1"></i> Withdrawals Enabled</span>' : '<span class="text-danger"><i class="fas fa-times-circle me-1"></i> Withdrawals Disabled</span>'}
        </label>
        <div class="form-check form-switch mb-0">
          <input class="form-check-input" type="checkbox" id="withdrawToggle" ${withdrawalsEnabled ? 'checked' : ''} style="cursor:pointer; width:38px; height:20px;">
        </div>
      </div>
    </div>
    <div class="table-responsive">
      <table class="table table-striped">
        <thead>
          <tr>
            <th>Source Account</th>
            <th>Amount</th>
            <th>Beneficiary Details</th>
            <th>Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${withdrawals.length === 0
            ? `<tr><td colspan="6" class="text-center py-4 text-muted">No withdrawal applications found.</td></tr>`
            : withdrawals.map((t) => {
                const w = parseWithdrawalDesc(t.description);
                let statusBadge = 'bg-secondary';
                if (w.status.toLowerCase() === 'approved') statusBadge = 'bg-success';
                else if (w.status.toLowerCase() === 'declined' || w.status.toLowerCase() === 'rejected') statusBadge = 'bg-danger';
                else if (w.status.toLowerCase() === 'pending') statusBadge = 'bg-warning text-dark';
                
                return `
                  <tr>
                    <td>
                      <strong>${resolveAccountName(t.accountId)}</strong>
                    </td>
                    <td>$${fmt(t.amount)}</td>
                    <td>
                      <div class="small">
                        <strong>Bank:</strong> ${escHtml(w.bank)}<br>
                        <strong>Acc #:</strong> ${escHtml(w.acc)}<br>
                        <strong>Routing:</strong> ${escHtml(w.routing)}<br>
                        <strong>Holder:</strong> ${escHtml(w.holder)}
                      </div>
                    </td>
                    <td>${t.date || ''}</td>
                    <td>
                      <span class="badge ${statusBadge}">${escHtml(w.status)}</span>
                    </td>
                    <td>
                      <button class="btn btn-sm btn-outline-primary edit-withdrawal-btn" data-id="${t.id}">Edit</button>
                      <button class="btn btn-sm btn-danger delete-withdrawal-btn" data-id="${t.id}">Delete</button>
                    </td>
                  </tr>
                `;
              }).join('')}
        </tbody>
      </table>
    </div>
  `;

  const toggleInput = el.querySelector('#withdrawToggle');
  const toggleLabel = el.querySelector('#withdrawToggleLabel');
  if (toggleInput && toggleLabel) {
    toggleInput.addEventListener('change', async (e) => {
      const isChecked = e.target.checked;
      toggleInput.disabled = true;
      try {
        await setWithdrawalStatus(isChecked);
        toggleLabel.innerHTML = isChecked 
          ? '<span class="text-success"><i class="fas fa-check-circle me-1"></i> Withdrawals Enabled</span>' 
          : '<span class="text-danger"><i class="fas fa-times-circle me-1"></i> Withdrawals Disabled</span>';
      } catch (err) {
        alert('Error updating status: ' + err.message);
        toggleInput.checked = !isChecked; // revert
      } finally {
        toggleInput.disabled = false;
      }
    });
  }

  el.querySelectorAll('.edit-withdrawal-btn').forEach((b) =>
    b.addEventListener('click', () => showWithdrawalTxnModal(container, b.dataset.id))
  );
  el.querySelectorAll('.delete-withdrawal-btn').forEach((b) =>
    b.addEventListener('click', () => deleteWithdrawalHandler(container, b.dataset.id))
  );
}

function parseWithdrawalDesc(desc) {
  const defaults = { bank: '', acc: '', routing: '', holder: '', status: 'Pending' };
  if (!desc || !desc.includes('[Withdrawal Request]')) return defaults;
  
  const parts = desc.replace('[Withdrawal Request]', '').split('|');
  const map = {};
  parts.forEach(p => {
    const idx = p.indexOf(':');
    if (idx !== -1) {
      const key = p.substring(0, idx).trim().toLowerCase();
      const val = p.substring(idx + 1).trim();
      map[key] = val;
    }
  });
  return {
    bank: map.bank || '',
    acc: map.acc || '',
    routing: map.routing || '',
    holder: map.holder || '',
    status: map.status || 'Pending'
  };
}

function formatWithdrawalDesc(bank, acc, routing, holder, status) {
  return `[Withdrawal Request] Bank: ${bank} | Acc: ${acc} | Routing: ${routing} | Holder: ${holder} | Status: ${status}`;
}

function showWithdrawalTxnModal(container, txnId) {
  const txn = transactionsCache.find((t) => t.id === txnId);
  if (!txn) return;
  const w = parseWithdrawalDesc(txn.description);

  showModal(
    container,
    'Edit Withdrawal Details & Status',
    `
      <div class="mb-3">
        <label class="form-label">Source Account</label>
        <select class="form-control" id="modalWSource" disabled>
          <option value="${txn.accountId}">${resolveAccountName(txn.accountId)}</option>
        </select>
      </div>
      <div class="mb-3">
        <label class="form-label">Withdrawal Amount ($)</label>
        <input class="form-control" id="modalWAmount" type="number" step="0.01" value="${txn.amount}" required />
      </div>
      <div class="mb-3">
        <label class="form-label">Beneficiary Bank Name</label>
        <input class="form-control" id="modalWBank" type="text" value="${escHtml(w.bank)}" required />
      </div>
      <div class="mb-3">
        <label class="form-label">Routing Transit Number</label>
        <input class="form-control" id="modalWRouting" type="text" value="${escHtml(w.routing)}" required />
      </div>
      <div class="mb-3">
        <label class="form-label">Beneficiary Account Number</label>
        <input class="form-control" id="modalWAccNum" type="text" value="${escHtml(w.acc)}" required />
      </div>
      <div class="mb-3">
        <label class="form-label">Beneficiary Account Holder Name</label>
        <input class="form-control" id="modalWHolder" type="text" value="${escHtml(w.holder)}" required />
      </div>
      <div class="mb-3">
        <label class="form-label">Application Status</label>
        <select class="form-control" id="modalWStatus">
          <option value="Pending" ${w.status === 'Pending' ? 'selected' : ''}>Pending</option>
          <option value="Approved" ${w.status === 'Approved' ? 'selected' : ''}>Approved</option>
          <option value="Declined" ${w.status === 'Declined' ? 'selected' : ''}>Declined</option>
          <option value="Processing" ${w.status === 'Processing' ? 'selected' : ''}>Processing</option>
        </select>
      </div>
      <div class="mb-3">
        <label class="form-label">Request Date</label>
        <input class="form-control" id="modalWDate" type="date" value="${txn.date || ''}" required />
      </div>
    `,
    async () => {
      const newAmount = parseFloat(document.querySelector('#modalWAmount').value);
      const bank = document.querySelector('#modalWBank').value.trim();
      const routing = document.querySelector('#modalWRouting').value.trim();
      const acc = document.querySelector('#modalWAccNum').value.trim();
      const holder = document.querySelector('#modalWHolder').value.trim();
      const status = document.querySelector('#modalWStatus').value;
      const date = document.querySelector('#modalWDate').value;

      if (isNaN(newAmount) || newAmount <= 0) return alert('Amount must be positive');
      if (!bank || !routing || !acc || !holder) return alert('All beneficiary fields are required');

      const oldAmount = txn.amount;
      const amountChanged = oldAmount !== newAmount;

      const newDescription = formatWithdrawalDesc(bank, acc, routing, holder, status);

      await updateTransaction(txnId, {
        amount: newAmount,
        description: newDescription,
        date
      });

      if (amountChanged) {
        const sourceAcc = accountsCache.find(a => a.id === txn.accountId);
        if (sourceAcc) {
          const refundBalance = sourceAcc.balance + oldAmount;
          const finalBalance = refundBalance - newAmount;
          await updateAccount(txn.accountId, { balance: finalBalance });
        }
      }

      [accountsCache, transactionsCache] = await Promise.all([
        getAccounts(),
        getAllTransactions(),
      ]);
      renderWithdrawalsTab(container);
    }
  );
}

function deleteWithdrawalHandler(container, txnId) {
  if (!confirm('Delete this withdrawal application? The account balance will be refunded by the withdrawal amount.')) return;
  (async () => {
    const txn = transactionsCache.find((t) => t.id === txnId);
    if (txn) {
      const acc = accountsCache.find((a) => a.id === txn.accountId);
      if (acc) {
        await updateAccount(txn.accountId, { balance: acc.balance + txn.amount });
      }
      await deleteTransaction(txnId);
      
      [accountsCache, transactionsCache] = await Promise.all([
        getAccounts(),
        getAllTransactions(),
      ]);
      renderWithdrawalsTab(container);
    }
  })();
}
