import './style.css';
import { onAuthChange, signIn } from './auth';
import { initRouter, registerRoute, navigate } from './router';
import { renderLoginPage } from './pages/login.js';
import { renderDashboard } from './pages/dashboard.js';
import { renderAdmin } from './pages/admin.js';

const app = document.getElementById('app');
const siteRoot = document.getElementById('site-root');

function showSite() {
  siteRoot.style.display = 'block';
  app.style.display = 'none';
}

function showApp(renderFn) {
  siteRoot.style.display = 'none';
  app.style.display = 'block';
  app.innerHTML = '';
  renderFn(app);
}

// Register routes
registerRoute('#/', () => showSite());
registerRoute('#/login', () => showApp(renderLoginPage));
registerRoute('#/dashboard', () => showApp(renderDashboard));
registerRoute('#/edit', () => showApp(renderAdmin));

// Override the login buttons and forms in the original site HTML
function patchLoginButtons() {
  document.querySelectorAll('.oblPopupTrigger').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      navigate('#/login');
    });
  });

  document.querySelectorAll('.openAccount').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      navigate('#/login');
    });
  });

  // Intercept the original site login forms and actually authenticate
  document.querySelectorAll('.obLogin form').forEach((form) => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      e.stopPropagation();

      const useridInput = form.querySelector('input[name="userid"]');
      const passwordInput = form.querySelector('input[name="password"]');
      const submitBtn = form.querySelector('input[type="submit"], button[type="submit"]');
      const email = useridInput?.value?.trim();
      const password = passwordInput?.value;

      if (!email || !password) {
        navigate('#/login');
        return;
      }

      // Disable button while authenticating
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.value = 'Signing in...';
      }

      try {
        await signIn(email, password);
        // Close any open Bootstrap modal
        document.querySelectorAll('.modal.show').forEach((modal) => {
          const bsModal = window.bootstrap?.Modal?.getInstance(modal);
          if (bsModal) bsModal.hide();
        });
        document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
        document.body.classList.remove('modal-open');
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';

        navigate('#/dashboard');
      } catch (err) {
        // On error, navigate to the dedicated login page
        navigate('#/login');
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.value = 'Log In';
        }
      }
    });
  });
}

// Auth state listener — modifies login button appearance
onAuthChange((user) => {
  const loginBtns = document.querySelectorAll('.oblPopupTrigger, [href="#oblPopup"]');

  if (user) {
    loginBtns.forEach((btn) => {
      btn.innerHTML = '<i class="fa fa-user" aria-hidden="true"></i> Account';
      btn.href = '#/dashboard';
      btn.classList.remove('oblPopupTrigger');
      btn.removeAttribute('data-bs-toggle');
      btn.removeAttribute('data-bs-target');
    });
  } else {
    loginBtns.forEach((btn) => {
      btn.innerHTML = '<i class="fa fa-lock" aria-hidden="true"></i> Login';
      btn.href = '#/login';
    });
  }
});

function initApp() {
  // Set initial state: site visible, app hidden
  siteRoot.style.display = 'block';
  app.style.display = 'none';

  initRouter(app);
  patchLoginButtons();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
