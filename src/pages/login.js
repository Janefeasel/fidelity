import { signIn, signUp } from '../auth';
import { createUserProfile } from '../db';
import { navigate } from '../router';

let currentMode = 'login';

function renderForm(container) {
  container.innerHTML = `
    <div class="auth-page">
      <div class="auth-container">
        <div class="auth-card">
          <div class="auth-header">
            <img src="/custom/bankwithfidelity2/image/logo-2x.png" alt="Fidelity Bank" class="auth-logo" />
            <h2 id="authTitle">Online Banking</h2>
          </div>
          <div class="auth-tabs">
            <button class="auth-tab ${currentMode === 'login' ? 'active' : ''}" data-mode="login">Sign In</button>
            <button class="auth-tab ${currentMode === 'register' ? 'active' : ''}" data-mode="register">Register</button>
          </div>
          <form id="authForm" class="auth-form">
            <div id="authError" class="auth-error" style="display:none"></div>
            <div class="form-floating mb-3">
              <input type="email" class="form-control" id="authEmail" placeholder="Email" required />
              <label for="authEmail">Email</label>
            </div>
            <div class="form-floating mb-3">
              <input type="text" class="form-control" id="authName" placeholder="Full Name" style="${currentMode === 'login' ? 'display:none' : ''}" />
              <label for="authName" style="${currentMode === 'login' ? 'display:none' : ''}">Full Name</label>
            </div>
            <div class="form-floating mb-3">
              <input type="password" class="form-control" id="authPassword" placeholder="Password" required />
              <label for="authPassword">Password</label>
            </div>
            <button type="submit" class="btn btn-primary auth-submit" id="authSubmitBtn">
              ${currentMode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>
          <div class="auth-footer">
            <a href="#" class="auth-back" id="backToHome">← Back to Home</a>
          </div>
        </div>
      </div>
    </div>
  `;

  // Tab switching
  container.querySelectorAll('.auth-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      currentMode = tab.dataset.mode;
      renderForm(container);
    });
  });

  // Back to home
  container.querySelector('#backToHome').addEventListener('click', (e) => {
    e.preventDefault();
    navigate('#/');
  });

  // Form submit
  const form = container.querySelector('#authForm');
  const errorEl = container.querySelector('#authError');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorEl.style.display = 'none';

    const emailEl = container.querySelector('#authEmail');
    const passwordEl = container.querySelector('#authPassword');
    if (!emailEl || !passwordEl) return;          // form already torn down
    const email = emailEl.value;
    const password = passwordEl.value;
    const name = container.querySelector('#authName')?.value || '';
    const submitBtn = container.querySelector('#authSubmitBtn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Loading...';

    try {
      if (currentMode === 'login') {
        await signIn(email, password);
        navigate('#/dashboard');
      } else {
        const cred = await signUp(email, password);
        await createUserProfile(cred.user.uid, email, name);
        navigate('#/dashboard');
      }
    } catch (err) {
      errorEl.textContent = err.message.replace('Firebase: ', '');
      errorEl.style.display = 'block';
      submitBtn.disabled = false;
      submitBtn.textContent = currentMode === 'login' ? 'Sign In' : 'Create Account';
    }
  });
}

export function renderLoginPage(container) {
  currentMode = 'login';
  renderForm(container);
}
