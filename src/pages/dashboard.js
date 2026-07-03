import { getCurrentUser } from '../auth';
import { getUserProfile, getAccountsByUser, getTransactionsByAccount, createTransaction, updateAccount, getWithdrawalStatus } from '../db';
import { navigate } from '../router';

let cachedProfile = null;

export async function renderDashboard(container) {
  const user = getCurrentUser();
  if (!user) {
    navigate('#/login');
    return;
  }

  container.innerHTML = `
    <div class="dashboard-page">
      <!-- Premium Online Banking Header -->
      <header class="dashboard-nav-bar">
        <div class="container d-flex justify-content-between align-items-center">
          <div class="nav-brand-section d-flex align-items-center gap-2">
            <img src="/custom/bankwithfidelity2/image/logo-2x.png" alt="Fidelity Bank" class="brand-logo" />
            <span class="brand-divider">|</span>
            <span class="brand-portal-name">Online Banking</span>
          </div>
          <div class="nav-menu-links d-none d-lg-flex gap-4">
            <a href="#/dashboard" class="nav-link active">Overview</a>
            <a href="#" class="nav-link disabled-link" id="navSecurityLink">Security & Support</a>
          </div>
          <div class="nav-user-section d-flex align-items-center gap-3">
            <div class="user-meta text-end d-none d-sm-block">
              <span class="user-fullname" id="navUserFullname">Loading...</span>
              <span class="user-session-id" id="navUserEmail">${user.email}</span>
            </div>
            <button class="btn btn-outline-danger btn-sm" id="logoutBtn">
              <i class="fas fa-sign-out-alt"></i> Sign Out
            </button>
          </div>
        </div>
      </header>

      <!-- Welcome Banner -->
      <div class="dashboard-welcome-banner py-4">
        <div class="container">
          <div class="row align-items-center">
            <div class="col-md-8">
              <h1 class="welcome-text mb-1" id="welcomeText">Welcome back</h1>
              <p class="session-info-text mb-0">
                <i class="fas fa-shield-alt text-success"></i> Secure Session active • Last login: Today
              </p>
            </div>
            <div class="col-md-4 text-md-end mt-3 mt-md-0">
              <button class="btn btn-sm btn-outline-primary" id="goToSuper" style="display:none">
                <i class="fas fa-cog"></i> Admin Control Panel
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Portal Container -->
      <div class="container py-4">
        <div id="accountsContainer">
          <div class="text-center py-5">
            <div class="spinner-border text-primary" role="status"></div>
            <p class="mt-2">Loading secure account data...</p>
          </div>
        </div>
      </div>
    </div>
  `;

  // Standard Header Link Alert
  container.querySelector('#navSecurityLink').addEventListener('click', (e) => {
    e.preventDefault();
    alert('Security preferences are locked. Contact your advisor at (504) 569-3418 for modifications.');
  });

  // Logout Trigger
  container.querySelector('#logoutBtn').addEventListener('click', async () => {
    const { logOut } = await import('../auth');
    await logOut();
    navigate('#/');
  });

  try {
    const profile = await getUserProfile(user.uid);
    cachedProfile = profile;

    const fullName = profile?.name || 'Valued Customer';
    container.querySelector('#welcomeText').textContent = `Welcome back, ${fullName}`;
    container.querySelector('#navUserFullname').textContent = fullName;

    // Admin Access Button
    const superBtn = container.querySelector('#goToSuper');
    if (profile?.role === 'admin') {
      superBtn.style.display = 'inline-block';
      superBtn.addEventListener('click', () => navigate('#/super'));
    }

    const refreshAccounts = async () => {
      try {
        const freshAccounts = await getAccountsByUser(user.uid);
        await renderUserAccounts(container, freshAccounts, fullName, refreshAccounts);
      } catch (err) {
        console.error("Failed to refresh accounts:", err);
      }
    };

    await refreshAccounts();
  } catch (err) {
    container.querySelector('#accountsContainer').innerHTML = `
      <div class="alert alert-danger">Error loading online banking portal: ${err.message}</div>
    `;
  }
}

async function renderUserAccounts(container, accounts, fullName, onRefresh) {
  const el = container.querySelector('#accountsContainer');

  if (accounts.length === 0) {
    el.innerHTML = `
      <div class="text-center py-5">
        <div class="empty-state">
          <i class="fas fa-university mb-3" style="font-size:64px;color:#ccc;"></i>
          <h3>No Active Accounts</h3>
          <p class="text-muted">You do not have any active depository accounts. Please contact customer relations to open one.</p>
        </div>
      </div>
    `;
    return;
  }

  // Gather all transactions across accounts
  const allTxns = [];
  for (const acc of accounts) {
    try {
      const txns = await getTransactionsByAccount(acc.id);
      allTxns.push(...txns.map(t => ({ ...t, _accountName: acc.name })));
    } catch (_) {}
  }
  allTxns.sort((a, b) => (b.date || '').localeCompare(a.date || ''));

  el.innerHTML = `
    <div class="row">
      <!-- Left Column: Accounts & Quick Actions -->
      <div class="col-lg-8">
        
        <!-- Premium Cards List -->
        <div class="mb-4">
          <h5 class="section-heading mb-3">Depository Accounts</h5>
          ${accounts.map(acc => `
            <div class="premium-account-card mb-3">
              <div class="premium-card-body">
                <div class="premium-card-left">
                  <span class="card-type-label">${escHtml(acc.type || 'Checking')} Account</span>
                  <div class="card-holder-info d-flex">
                    <div class="info-block">
                      <span class="info-label">Account Holder</span>
                      <span class="info-value">${escHtml(fullName)}</span>
                    </div>
                  </div>
                </div>
                <div class="premium-card-right d-flex flex-column justify-content-between align-items-end">
                  <div class="chip-logo-container d-flex gap-2 align-items-center">
                    <div class="card-chip"></div>
                    <i class="fas fa-university card-logo-icon"></i>
                  </div>
                  <div class="card-balance-display text-end">
                    <span class="balance-title">Available Balance</span>
                    <h2 class="balance-value-text ${parseFloat(acc.balance) < 0 ? 'negative' : ''}">$${fmt(acc.balance)}</h2>
                  </div>
                </div>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Quick Actions Panel -->
        <div class="quick-actions-panel p-4 mb-4">
          <h5 class="action-panel-title mb-3">Quick Actions</h5>
          <div class="action-grid" style="grid-template-columns: repeat(2, 1fr);">
            <button class="action-item-btn btn-add-funds" disabled>
              <div class="action-icon-circle disabled-circle">
                <i class="fas fa-plus"></i>
              </div>
              <span class="action-label">Add Funds</span>
              <span class="action-badge">Unavailable</span>
            </button>
            <button class="action-item-btn btn-withdraw">
              <div class="action-icon-circle">
                <i class="fas fa-minus"></i>
              </div>
              <span class="action-label">Withdraw</span>
            </button>
          </div>
        </div>

        <!-- Transaction Activity -->
        <div class="txn-history-section p-4">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h5 class="action-panel-title mb-0">Transaction Activity</h5>
            <span class="txn-status-badge"><i class="fas fa-check-circle text-success"></i> Realtime Sync</span>
          </div>
          
          ${allTxns.length === 0
            ? `<div class="text-center py-5 text-muted">
                <i class="fas fa-receipt mb-2" style="font-size:36px; opacity:0.3;"></i>
                <p class="mb-0">No transaction activity recorded yet.</p>
               </div>`
            : `<div class="txn-history-list-premium">
                ${allTxns.map(t => {
                  const isDeposit = t.type === 'deposit' || t.type === 'credit';
                  let iconClass = 'fa-shopping-cart';
                  let categoryName = 'Purchase';
                  
                  const descLower = (t.description || '').toLowerCase();
                  if (descLower.includes('salary') || descLower.includes('payroll') || descLower.includes('direct deposit')) {
                    iconClass = 'fa-wallet';
                    categoryName = 'Direct Deposit';
                  } else if (descLower.includes('atm') || descLower.includes('cash') || descLower.includes('withdraw')) {
                    iconClass = 'fa-money-bill-wave';
                    categoryName = 'Cash Withdrawal';
                  } else if (descLower.includes('transfer')) {
                    iconClass = 'fa-exchange-alt';
                    categoryName = 'Transfer';
                  } else if (descLower.includes('grocery') || descLower.includes('market') || descLower.includes('food')) {
                    iconClass = 'fa-shopping-basket';
                    categoryName = 'Groceries';
                  } else if (descLower.includes('check')) {
                    iconClass = 'fa-money-check-alt';
                    categoryName = 'Check Payment';
                  }
                  
                  // If it's a withdrawal request, show a cleaner description to the user
                  let displayDesc = t.description || t.type;
                  if (displayDesc.includes('[Withdrawal Request]')) {
                    iconClass = 'fa-money-check-alt';
                    categoryName = 'Withdrawal Request';
                    const parts = displayDesc.replace('[Withdrawal Request]', '').split('|');
                    const bankPart = parts.find(p => p.toLowerCase().includes('bank:'));
                    const statusPart = parts.find(p => p.toLowerCase().includes('status:'));
                    
                    const bankVal = bankPart ? bankPart.split(':')[1].trim() : 'External Bank';
                    const statusVal = statusPart ? statusPart.split(':')[1].trim() : 'Pending';
                    
                    displayDesc = `Withdrawal to ${bankVal} (${statusVal})`;
                  }

                  return `
                    <div class="txn-history-item-premium">
                      <div class="txn-icon-container ${isDeposit ? 'deposit-bg' : 'withdraw-bg'}">
                        <i class="fas ${iconClass}"></i>
                      </div>
                      <div class="txn-details-block">
                        <div class="d-flex justify-content-between align-items-center">
                          <span class="txn-desc-title">${escHtml(displayDesc)}</span>
                          <span class="txn-amount-val ${isDeposit ? 'deposit-color' : 'withdraw-color'}">
                            ${isDeposit ? '+' : '-'}$${fmt(Math.abs(t.amount))}
                          </span>
                        </div>
                        <div class="d-flex justify-content-between align-items-center mt-1">
                          <span class="txn-meta-sub">${categoryName} • ${escHtml(t._accountName)}</span>
                          <span class="txn-date-sub">${t.date || ''}</span>
                        </div>
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>`
          }
        </div>
      </div>

      <!-- Right Column: FDIC Info & Help Desk -->
      <div class="col-lg-4 mt-4 mt-lg-0">
        <!-- Help Desk Widget -->
        <div class="support-hotline-widget p-4">
          <div class="support-header d-flex align-items-center gap-2 mb-3">
            <i class="fas fa-headset support-icon"></i>
            <h6 class="sidebar-title mb-0">Help & Support</h6>
          </div>
          <p class="support-text">For questions about your account, loans, or to report a lost or stolen card, contact our customer service team.</p>
          <div class="hotline-number-box py-2 px-3 mb-3 text-center">
            <span class="label">Toll-Free Customer Service</span>
            <a href="tel:5045693418" class="phone-link d-block mt-1 font-weight-bold">(504) 569-3418</a>
          </div>
          <div class="d-flex align-items-center justify-content-center gap-2 security-badge">
            <i class="fas fa-lock text-success"></i>
            <span>FDIC Insured • Equal Housing Lender</span>
          </div>
        </div>
      </div>
    </div>
  `;

  // Withdraw Modal Trigger
  el.querySelectorAll('.btn-withdraw').forEach(btn => {
    btn.addEventListener('click', async () => {
      btn.disabled = true;
      try {
        const enabled = await getWithdrawalStatus();
        if (!enabled) {
          alert('Withdrawal services are temporarily unavailable. Please contact customer relations for assistance.');
          return;
        }
        showWithdrawalMenuModal(accounts, fullName, onRefresh);
      } catch (err) {
        console.error(err);
        showWithdrawalMenuModal(accounts, fullName, onRefresh);
      } finally {
        btn.disabled = false;
      }
    });
  });
}

function showWithdrawalMenuModal(accounts, fullName, onRefresh) {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal-content-admin" style="max-width: 520px;">
      <div class="modal-header">
        <h5 class="modal-title font-weight-bold" style="color:#0d233a;"><i class="fas fa-university me-2 text-primary"></i>Withdrawal Application</h5>
        <button class="btn-close modal-close"></button>
      </div>
      <div class="modal-body">
        <form id="withdrawalApplicationForm">
          <div class="mb-3">
            <label class="form-label font-size-sm">Source Account <span class="text-danger">*</span></label>
            <select class="form-control" id="withdrawSourceSelect" required>
              ${accounts.map(acc => `<option value="${acc.id}" data-balance="${acc.balance}">${escHtml(acc.name)} ($${fmt(acc.balance)})</option>`).join('')}
            </select>
          </div>
          <div class="mb-3">
            <label class="form-label font-size-sm">Amount to Withdraw ($) <span class="text-danger">*</span></label>
            <input class="form-control" id="withdrawAmount" type="number" step="0.01" min="0.01" placeholder="0.00" required />
          </div>
          <div class="mb-3">
            <label class="form-label font-size-sm">Beneficiary Bank Name <span class="text-danger">*</span></label>
            <input class="form-control" id="withdrawBank" type="text" placeholder="e.g. Chase Bank, Wells Fargo" required />
          </div>
          <div class="mb-3">
            <label class="form-label font-size-sm">Routing Transit Number <span class="text-danger">*</span></label>
            <input class="form-control" id="withdrawRoutingNum" type="text" placeholder="9-digit Transit Routing" required />
          </div>
          <div class="mb-3">
            <label class="form-label font-size-sm">Beneficiary Account Number <span class="text-danger">*</span></label>
            <input class="form-control" id="withdrawAccNum" type="text" placeholder="Recipient Account Number" required />
          </div>
          <div class="mb-3">
            <label class="form-label font-size-sm">Beneficiary Account Holder Name <span class="text-danger">*</span></label>
            <input class="form-control" id="withdrawHolderName" type="text" placeholder="Full Name on Receiving Account" required />
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary modal-close">Cancel</button>
        <button class="btn btn-primary" id="btnSubmitWithdrawal" form="withdrawalApplicationForm">Submit Request</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  overlay.querySelectorAll('.modal-close').forEach(btn => btn.addEventListener('click', () => overlay.remove()));

  overlay.querySelector('#withdrawalApplicationForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const saveBtn = overlay.querySelector('#btnSubmitWithdrawal');
    saveBtn.disabled = true;
    saveBtn.textContent = 'Submitting...';

    const sourceSelect = overlay.querySelector('#withdrawSourceSelect');
    const accountId = sourceSelect.value;
    const selectedOpt = sourceSelect.options[sourceSelect.selectedIndex];
    const balance = parseFloat(selectedOpt.dataset.balance);

    const amount = parseFloat(overlay.querySelector('#withdrawAmount').value);
    const bankName = overlay.querySelector('#withdrawBank').value.trim();
    const routing = overlay.querySelector('#withdrawRoutingNum').value.trim();
    const accNum = overlay.querySelector('#withdrawAccNum').value.trim();
    const holder = overlay.querySelector('#withdrawHolderName').value.trim();

    if (amount > balance) {
      alert('Insufficient funds. The entered amount exceeds the selected account available balance.');
      saveBtn.disabled = false;
      saveBtn.textContent = 'Submit Request';
      return;
    }

    try {
      const description = `[Withdrawal Request] Bank: ${bankName} | Acc: ${accNum} | Routing: ${routing} | Holder: ${holder} | Status: Pending`;
      
      // Create the pending transaction
      await createTransaction({
        accountId,
        type: 'withdrawal',
        amount,
        description,
        date: new Date().toISOString().split('T')[0]
      });

      // Deduct balance from the account
      await updateAccount(accountId, { balance: balance - amount });

      alert('Withdrawal request submitted successfully. Our security desk is currently processing your transaction.');
      overlay.remove();
      if (onRefresh) {
        await onRefresh();
      }
    } catch (err) {
      alert('Error: ' + err.message);
      saveBtn.disabled = false;
      saveBtn.textContent = 'Submit Request';
    }
  });
}

function escHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function fmt(num) {
  return Math.abs(num).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
