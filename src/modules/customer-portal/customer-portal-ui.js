/**
 * AQUAPURE Customer Portal UI Module
 * Renders Customer Self-Registration Form and Customer Dashboard View
 * Ritz Framework Compliant
 */

import { registerCustomerAccount } from './customer-portal-service.js';
import { loginUser } from '../authentication/auth-service.js';

export function renderCustomerPortalView(container, userSession) {
  if (!userSession) {
    // Render Self-Registration Form for unauthenticated visitors
    container.innerHTML = `
      <div class="auth-wrapper" style="max-width: 520px;">
        <div class="card">
          <div class="card-header" style="justify-content: center; text-align: center; flex-direction: column; border: none; padding-bottom: 0;">
            <h1 class="card-title" style="font-size: 1.5rem; color: var(--primary-color);">Create Customer Account</h1>
            <p style="color: var(--text-muted); font-size: 0.85rem; margin-top: 0.25rem;">
              Sign up to order water delivery online and track your jug balances
            </p>
          </div>

          <div id="reg-error-alert" class="toast toast-error" style="display: none; margin-bottom: 1rem; position: static; animation: none;"></div>

          <form id="customer-reg-form" style="margin-top: 1rem;">
            <div class="form-group">
              <label class="form-label" for="reg-fullname">Full Name</label>
              <input type="text" id="reg-fullname" class="form-control" placeholder="Juan Dela Cruz" required>
            </div>

            <div class="form-group">
              <label class="form-label" for="reg-contact">Contact Number</label>
              <input type="tel" id="reg-contact" class="form-control" placeholder="09171234567" required>
            </div>

            <div class="form-group">
              <label class="form-label" for="reg-email">Email Address</label>
              <input type="email" id="reg-email" class="form-control" placeholder="juan@example.com" required>
            </div>

            <div class="form-group">
              <label class="form-label" for="reg-password">Password</label>
              <input type="password" id="reg-password" class="form-control" placeholder="••••••••" minlength="6" required>
            </div>

            <div class="form-group">
              <label class="form-label" for="reg-address">Delivery Address</label>
              <input type="text" id="reg-address" class="form-control" placeholder="House/Bldg No., Street, Barangay, City" required>
            </div>

            <div class="form-group">
              <label class="form-label" for="reg-landmark">Landmark (Optional)</label>
              <input type="text" id="reg-landmark" class="form-control" placeholder="Near Barangay Hall / Beside Sari-sari Store">
            </div>

            <button type="submit" id="reg-btn" class="btn btn-primary" style="width: 100%; margin-top: 0.5rem;">
              Create Account & Sign In
            </button>
          </form>

          <div style="margin-top: 1.25rem; text-align: center; padding-top: 1rem; border-top: 1px solid var(--border-subtle);">
            <p style="font-size: 0.85rem; color: var(--text-muted);">
              Already have an account? <a href="#/login" style="color: var(--primary-color); text-decoration: none; font-weight: 600;">Sign In</a>
            </p>
          </div>
        </div>
      </div>
    `;

    const form = document.getElementById('customer-reg-form');
    const alert = document.getElementById('reg-error-alert');
    const submitBtn = document.getElementById('reg-btn');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      alert.style.display = 'none';
      submitBtn.disabled = true;
      submitBtn.textContent = 'Creating Account...';

      const name = document.getElementById('reg-fullname').value;
      const contact = document.getElementById('reg-contact').value;
      const email = document.getElementById('reg-email').value;
      const pwd = document.getElementById('reg-password').value;
      const address = document.getElementById('reg-address').value;
      const landmark = document.getElementById('reg-landmark').value;

      const res = await registerCustomerAccount(email, pwd, name, contact, address, landmark);

      if (res.success) {
        // Auto sign-in demo session
        await loginUser('customer@example.com', 'password123');
        window.location.hash = '#/customer-portal';
      } else {
        alert.textContent = res.error || 'Failed to create account.';
        alert.style.display = 'block';
        submitBtn.disabled = false;
        submitBtn.textContent = 'Create Account & Sign In';
      }
    });

    return;
  }

  // Render Customer Dashboard Portal for authenticated customers
  container.innerHTML = `
    <div style="display: grid; grid-template-columns: 1fr 320px; gap: 1.5rem;">
      <div>
        <div class="card" style="margin-bottom: 1.5rem;">
          <div class="card-header">
            <div>
              <h2 class="card-title">Welcome, ${userSession.displayName}!</h2>
              <p style="font-size: 0.85rem; color: var(--text-muted);">Customer Delivery Ordering Portal</p>
            </div>
            <a href="#/orders" class="btn btn-primary btn-sm">+ Place Delivery Order</a>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-top: 1rem;">
            <div style="background: var(--bg-surface-elevated); padding: 1.25rem; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
              <span style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Company Jugs Held</span>
              <h3 style="font-size: 1.8rem; color: var(--primary-color); margin-top: 0.25rem;">0 <span style="font-size: 0.9rem; font-weight: 400; color: var(--text-muted);">Jugs</span></h3>
            </div>

            <div style="background: var(--bg-surface-elevated); padding: 1.25rem; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
              <span style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Active Orders</span>
              <h3 style="font-size: 1.8rem; color: var(--success-color); margin-top: 0.25rem;">0 <span style="font-size: 0.9rem; font-weight: 400; color: var(--text-muted);">Pending</span></h3>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Recent Delivery Orders</h3>
          </div>
          <div class="table-responsive">
            <table class="table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Date</th>
                  <th>Quantity</th>
                  <th>Container</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colspan="6" style="text-align: center; color: var(--text-muted); padding: 2rem;">
                    No delivery orders placed yet. Click "+ Place Delivery Order" to create one.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h3 class="card-title">My Delivery Profile</h3>
        </div>

        <div style="font-size: 0.9rem; display: flex; flex-direction: column; gap: 0.85rem;">
          <div>
            <span style="color: var(--text-muted); font-size: 0.8rem; display: block;">Full Name</span>
            <strong>${userSession.displayName}</strong>
          </div>

          <div>
            <span style="color: var(--text-muted); font-size: 0.8rem; display: block;">Email Address</span>
            <span>${userSession.email}</span>
          </div>

          <div>
            <span style="color: var(--text-muted); font-size: 0.8rem; display: block;">Contact Number</span>
            <span>${userSession.contactNumber || '09171234567'}</span>
          </div>

          <div style="padding-top: 0.5rem; border-top: 1px solid var(--border-subtle);">
            <span style="color: var(--text-muted); font-size: 0.8rem; display: block;">Default Address</span>
            <span>Brgy. Main Street, House #42</span>
          </div>
        </div>
      </div>
    </div>
  `;
}
