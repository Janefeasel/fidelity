const routes = {};
let appEl = null;

export function registerRoute(hash, renderFn) {
  routes[hash] = renderFn;
}

export function navigate(hash) {
  window.location.hash = hash;
}

export function initRouter(containerEl) {
  appEl = containerEl;

  // Support direct URL access like /super -> /#/super (dynamically matches any registered route)
  // Skip if already on a hash route or at the root path
  const path = window.location.pathname.replace(/\/$/, '') || '/';
  const hashKey = '#' + path;
  if (routes[hashKey] && path !== '/' && !window.location.hash) {
    window.location.replace('/' + hashKey);
    return;
  }

  window.addEventListener('hashchange', renderRoute);
  // Initial render
  if (!window.location.hash) {
    window.location.hash = '#/';
  }
  renderRoute();
}

function renderRoute() {
  if (!appEl) return;
  const hash = window.location.hash || '#/';
  const route = routes[hash];

  // Clean up any residual Bootstrap modal backdrop or body classes
  document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
  document.body.classList.remove('modal-open');
  document.body.style.overflow = '';
  document.body.style.paddingRight = '';

  if (route) {
    appEl.innerHTML = '';
    route(appEl);
  } else {
    // Default to home
    appEl.innerHTML = '';
    if (routes['#/']) {
      routes['#/'](appEl);
    }
  }
}
