import './style.css';
import { onAuthChange } from './auth';
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
registerRoute('#/super', () => showApp(renderAdmin));

// Override the login buttons in the original header
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

  document.querySelectorAll('#oblPopup .obLogin form').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      e.stopPropagation();
      navigate('#/login');
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

// Initialize the SPA once the DOM is fully parsed
document.addEventListener('DOMContentLoaded', () => {
  // Set initial state: site visible, app hidden
  siteRoot.style.display = 'block';
  app.style.display = 'none';

  initRouter(app);
  patchLoginButtons();
});
