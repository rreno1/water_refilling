/**
 * AQUAPURE Hash-Based Client Router & Navigation Controller
 * Ritz Framework Compliant
 */

import { getCurrentUserSession } from './modules/authentication/auth-service.js';

const routes = {};
let currentRoute = null;

/**
 * Register a route with its handler and authorized roles
 */
export function registerRoute(path, handler, allowedRoles = []) {
  routes[path] = { handler, allowedRoles };
}

/**
 * Render dynamic navigation links based on user role
 */
export function renderNavigation(userSession) {
  const navContainer = document.getElementById('main-nav');
  const roleBadge = document.getElementById('user-role-badge');
  const nameDisplay = document.getElementById('user-name-display');
  const logoutBtn = document.getElementById('logout-btn');

  if (!navContainer) return;

  if (!userSession) {
    roleBadge.textContent = 'GUEST';
    nameDisplay.textContent = 'Not Authenticated';
    logoutBtn.style.display = 'none';
    navContainer.innerHTML = `<a href="#/login" class="nav-link">Login</a>`;
    return;
  }

  const role = userSession.role;
  roleBadge.textContent = role;
  nameDisplay.textContent = userSession.displayName || userSession.email;
  logoutBtn.style.display = 'inline-block';

  let navItems = [];

  if (role === 'CUSTOMER') {
    navItems = [
      { path: '#/customer-portal', label: 'My Portal' },
      { path: '#/orders', label: 'My Orders' }
    ];
  } else {
    // Employee Navigation
    navItems.push({ path: '#/dashboard', label: 'Dashboard' });

    if (['OWNER', 'ADMINISTRATOR', 'CASHIER'].includes(role)) {
      navItems.push({ path: '#/pos', label: 'Walk-in POS' });
      navItems.push({ path: '#/orders', label: 'Orders' });
      navItems.push({ path: '#/customers', label: 'Customers' });
    }

    if (['OWNER', 'ADMINISTRATOR', 'DELIVERY_PERSONNEL'].includes(role)) {
      navItems.push({ path: '#/deliveries', label: 'Deliveries' });
    }

    if (['OWNER', 'ADMINISTRATOR', 'INVENTORY_PERSONNEL', 'CASHIER'].includes(role)) {
      navItems.push({ path: '#/inventory', label: 'Inventory' });
      navItems.push({ path: '#/jugs', label: 'Jug Tracking' });
    }

    if (['OWNER', 'ADMINISTRATOR'].includes(role)) {
      navItems.push({ path: '#/reports', label: 'Reports' });
      navItems.push({ path: '#/audit', label: 'Audit Trail' });
      navItems.push({ path: '#/settings', label: 'Settings' });
    }

    if (role === 'OWNER') {
      navItems.push({ path: '#/users', label: 'Staff Accounts' });
    }
  }

  const hash = window.location.hash || (role === 'CUSTOMER' ? '#/customer-portal' : '#/dashboard');

  navContainer.innerHTML = navItems.map(item => `
    <a href="${item.path}" class="nav-link ${hash === item.path ? 'active' : ''}">${item.label}</a>
  `).join('');
}

/**
 * Handle route resolution and permission checking
 */
export async function navigate() {
  const hash = window.location.hash || '#/login';
  const targetRoute = routes[hash] || routes['#/login'];

  const userSession = await getCurrentUserSession();
  renderNavigation(userSession);

  const mainContent = document.getElementById('main-content');

  const publicRoutes = ['#/login', '#/customer-portal'];

  // Check route authentication & authorization
  if (!publicRoutes.includes(hash) && !userSession) {
    window.location.hash = '#/login';
    return;
  }

  if (userSession && hash === '#/login') {
    window.location.hash = userSession.role === 'CUSTOMER' ? '#/customer-portal' : '#/dashboard';
    return;
  }

  if (targetRoute.allowedRoles.length > 0 && userSession) {
    if (!targetRoute.allowedRoles.includes(userSession.role)) {
      mainContent.innerHTML = `
        <div class="card" style="max-width: 500px; margin: 3rem auto; text-align: center;">
          <h2 class="card-title" style="color: var(--danger-color);">Access Denied</h2>
          <p style="margin: 1rem 0; color: var(--text-muted);">
            Your role (${userSession.role}) is not authorized to view this page.
          </p>
          <a href="#/dashboard" class="btn btn-primary">Return to Dashboard</a>
        </div>
      `;
      return;
    }
  }

  if (targetRoute && targetRoute.handler) {
    currentRoute = hash;
    targetRoute.handler(mainContent, userSession);
  }
}

window.addEventListener('hashchange', navigate);
