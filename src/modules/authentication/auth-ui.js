/**
 * AQUAPURE Authentication UI Module
 * Renders Login View and handles user sign-in interactions
 * Ritz Framework Compliant
 */

import { loginUser } from './auth-service.js';

export function renderLoginView(container) {
  container.innerHTML = `
    <div class="auth-wrapper">
      <div class="card">
        <div class="card-header" style="justify-content: center; text-align: center; flex-direction: column; border: none; padding-bottom: 0;">
          <h1 class="card-title" style="font-size: 1.6rem; color: var(--primary-color);">AQUAPURE PORTAL</h1>
          <p style="color: var(--text-muted); font-size: 0.85rem; margin-top: 0.25rem;">Sign in to access your station or customer account</p>
        </div>

        <div id="auth-error-alert" class="toast toast-error" style="display: none; margin-bottom: 1rem; position: static; animation: none;"></div>

        <form id="login-form" style="margin-top: 1rem;">
          <div class="form-group">
            <label class="form-label" for="login-email">Email Address</label>
            <input type="email" id="login-email" class="form-control" placeholder="user@example.com" required autocomplete="username">
          </div>

          <div class="form-group">
            <label class="form-label" for="login-password">Password</label>
            <input type="password" id="login-password" class="form-control" placeholder="••••••••" required autocomplete="current-password">
          </div>

          <button type="submit" id="login-btn" class="btn btn-primary" style="width: 100%; margin-top: 0.5rem;">
            Sign In
          </button>
        </form>

        <div style="margin-top: 1.5rem; background: var(--bg-surface-elevated); padding: 0.85rem; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
          <p style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-bottom: 0.5rem;">Development Credentials</p>
          <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
            <button type="button" class="btn btn-secondary btn-sm demo-cred-btn" data-email="admin@example.com" data-pwd="password123">Owner (Admin)</button>
            <button type="button" class="btn btn-secondary btn-sm demo-cred-btn" data-email="cashier@example.com" data-pwd="password123">Cashier</button>
            <button type="button" class="btn btn-secondary btn-sm demo-cred-btn" data-email="customer@example.com" data-pwd="password123">Customer</button>
          </div>
        </div>

        <div style="margin-top: 1rem; text-align: center; padding-top: 1rem; border-top: 1px solid var(--border-subtle);">
          <p style="font-size: 0.85rem; color: var(--text-muted);">
            New customer? <a href="#/customer-portal" style="color: var(--primary-color); text-decoration: none; font-weight: 600;">Create Account</a>
          </p>
        </div>
      </div>
    </div>
  `;

  const form = document.getElementById('login-form');
  const emailInput = document.getElementById('login-email');
  const passwordInput = document.getElementById('login-password');
  const submitBtn = document.getElementById('login-btn');
  const errorAlert = document.getElementById('auth-error-alert');

  document.querySelectorAll('.demo-cred-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      emailInput.value = e.target.dataset.email;
      passwordInput.value = e.target.dataset.pwd;
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorAlert.style.display = 'none';
    submitBtn.disabled = true;
    submitBtn.textContent = 'Signing in...';

    const result = await loginUser(emailInput.value, passwordInput.value);

    if (result.success) {
      window.location.hash = '#/dashboard';
    } else {
      errorAlert.textContent = result.error.message || 'Authentication failed. Please check your credentials.';
      errorAlert.style.display = 'block';
      submitBtn.disabled = false;
      submitBtn.textContent = 'Sign In';
    }
  });
}
