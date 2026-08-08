/**
 * AQUAPURE Main Application Entry Point
 * Coordinates routes, services, and authentication initialization
 * Ritz Framework Compliant
 */

import { registerRoute, navigate } from './router.js';
import { renderLoginView } from './modules/authentication/auth-ui.js';
import { renderAuditView } from './modules/audit/audit-ui.js';
import { renderUserManagementView } from './modules/user-management/user-ui.js';
import { logoutUser } from './modules/authentication/auth-service.js';

console.log('[AQUAPURE] System initializing...');

// Register App Shell Routes
registerRoute('#/login', (container) => renderLoginView(container), []);
registerRoute('#/audit', (container, session) => renderAuditView(container, session), ['OWNER', 'ADMINISTRATOR']);
registerRoute('#/users', (container, session) => renderUserManagementView(container, session), ['OWNER']);

// Temporary Placeholder Views for Upcoming Modules
registerRoute('#/dashboard', (container, session) => {
  container.innerHTML = `
    <div class="card">
      <div class="card-header">
        <h2 class="card-title">Welcome back, ${session ? session.displayName : 'User'}!</h2>
        <span class="user-role-badge">${session ? session.role : ''}</span>
      </div>
      <p style="color: var(--text-muted); margin-top: 0.5rem;">
        AQUAPURE Refilling Station Management Dashboard. Select a module from the navigation bar above to begin.
      </p>
    </div>
  `;
}, ['OWNER', 'ADMINISTRATOR', 'CASHIER', 'INVENTORY_PERSONNEL', 'DELIVERY_PERSONNEL']);

// Attach logout handler
const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', async () => {
    await logoutUser();
  });
}

async function init() {
  const loader = document.getElementById('global-loader');
  if (loader) loader.style.display = 'none';

  await navigate();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

