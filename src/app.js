/**
 * AQUAPURE Main Application Entry Point
 * Coordinates routes, services, and authentication initialization
 * Ritz Framework Compliant
 */

import { registerRoute, navigate } from './router.js';
import { renderLoginView } from './modules/authentication/auth-ui.js';
import { renderCustomerPortalView } from './modules/customer-portal/customer-portal-ui.js';
import { renderAuditView } from './modules/audit/audit-ui.js';
import { renderUserManagementView } from './modules/user-management/user-ui.js';
import { logoutUser } from './modules/authentication/auth-service.js';

console.log('[AQUAPURE] System initializing...');

// Helper to render standard placeholder card for modules undergoing implementation
function renderPlaceholderView(title, description, allowedRoles) {
  return (container, session) => {
    container.innerHTML = `
      <div class="card">
        <div class="card-header">
          <div>
            <h2 class="card-title">${title}</h2>
            <p style="font-size: 0.85rem; color: var(--text-muted);">${description}</p>
          </div>
          <span class="user-role-badge">${session ? session.role : ''}</span>
        </div>
        <div style="padding: 2rem; text-align: center; color: var(--text-muted);">
          <p style="margin-bottom: 1rem;">Module architecture and interface contracts locked for <strong>${title}</strong>.</p>
          <a href="#/dashboard" class="btn btn-secondary btn-sm">Return to Dashboard</a>
        </div>
      </div>
    `;
  };
}

// 1. Authentication & Guest Routes
registerRoute('#/login', (container) => renderLoginView(container), []);
registerRoute('#/customer-portal', (container, session) => renderCustomerPortalView(container, session), []);

// 2. Main Staff & Operational Routes
registerRoute('#/dashboard', (container, session) => {
  container.innerHTML = `
    <div class="card">
      <div class="card-header">
        <div>
          <h2 class="card-title">Welcome back, ${session ? session.displayName : 'User'}!</h2>
          <p style="font-size: 0.85rem; color: var(--text-muted);">AQUAPURE Refilling Station Management Dashboard</p>
        </div>
        <span class="user-role-badge">${session ? session.role : ''}</span>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.25rem; margin-top: 1.25rem;">
        <div style="background: var(--bg-surface-elevated); padding: 1.25rem; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
          <span style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Today's Sales</span>
          <h3 style="font-size: 1.8rem; color: var(--primary-color); margin-top: 0.25rem;">₱0.00</h3>
        </div>

        <div style="background: var(--bg-surface-elevated); padding: 1.25rem; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
          <span style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Pending Deliveries</span>
          <h3 style="font-size: 1.8rem; color: var(--warning-color); margin-top: 0.25rem;">0</h3>
        </div>

        <div style="background: var(--bg-surface-elevated); padding: 1.25rem; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
          <span style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Company Jugs Out</span>
          <h3 style="font-size: 1.8rem; color: var(--success-color); margin-top: 0.25rem;">0</h3>
        </div>
      </div>
    </div>
  `;
}, ['OWNER', 'ADMINISTRATOR', 'CASHIER', 'INVENTORY_PERSONNEL', 'DELIVERY_PERSONNEL']);

registerRoute('#/pos', renderPlaceholderView('Walk-in POS', 'Direct point-of-sale transaction processing'), ['OWNER', 'ADMINISTRATOR', 'CASHIER']);
registerRoute('#/orders', renderPlaceholderView('Order Management', 'Delivery and walk-in order tracking'), ['OWNER', 'ADMINISTRATOR', 'CASHIER', 'CUSTOMER']);
registerRoute('#/deliveries', renderPlaceholderView('Delivery Management', 'Fulfillment dispatch and driver updates'), ['OWNER', 'ADMINISTRATOR', 'DELIVERY_PERSONNEL', 'CUSTOMER']);
registerRoute('#/inventory', renderPlaceholderView('Inventory Ledger', 'Item stock tracking and movements'), ['OWNER', 'ADMINISTRATOR', 'INVENTORY_PERSONNEL', 'CASHIER']);
registerRoute('#/jugs', renderPlaceholderView('Company Jug Accountability', 'Quantity-based customer jug balance tracking'), ['OWNER', 'ADMINISTRATOR', 'INVENTORY_PERSONNEL', 'CASHIER']);
registerRoute('#/customers', renderPlaceholderView('Customer Profiles', 'Registered and walk-in customer management'), ['OWNER', 'ADMINISTRATOR', 'CASHIER']);
registerRoute('#/users', (container, session) => renderUserManagementView(container, session), ['OWNER']);
registerRoute('#/reports', renderPlaceholderView('Business Reports', 'Sales, inventory, and delivery analytics'), ['OWNER', 'ADMINISTRATOR']);
registerRoute('#/audit', (container, session) => renderAuditView(container, session), ['OWNER', 'ADMINISTRATOR']);
registerRoute('#/settings', renderPlaceholderView('System Settings', 'Operational configuration'), ['OWNER', 'ADMINISTRATOR']);

// Attach logout handler safely
const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', async () => {
    await logoutUser();
  });
}

// App initialization
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
