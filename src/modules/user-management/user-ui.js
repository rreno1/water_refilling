/**
 * AQUAPURE User Management UI Module
 * Renders Employee Accounts & Role Management Interface for Owner
 * Ritz Framework Compliant
 */

import { getEmployees, createEmployee, updateEmployeeStatusOrRole } from './user-service.js';

export async function renderUserManagementView(container, userSession) {
  if (userSession.role !== 'OWNER') {
    container.innerHTML = `
      <div class="card" style="max-width: 500px; margin: 3rem auto; text-align: center;">
        <h2 class="card-title" style="color: var(--danger-color);">Access Restricted</h2>
        <p style="color: var(--text-muted); margin-top: 0.5rem;">Only the station OWNER can manage employee accounts.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div style="display: grid; grid-template-columns: 1fr 340px; gap: 1.5rem;">
      <div class="card">
        <div class="card-header">
          <div>
            <h2 class="card-title">Employee Accounts</h2>
            <p style="font-size: 0.85rem; color: var(--text-muted);">Manage station staff accounts, roles, and status</p>
          </div>
          <button id="refresh-staff-btn" class="btn btn-secondary btn-sm">Refresh List</button>
        </div>

        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody id="staff-table-body">
              <tr>
                <td colspan="5" style="text-align: center; color: var(--text-muted);">Loading staff accounts...</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Add Staff Account</h3>
        </div>

        <form id="create-staff-form">
          <div class="form-group">
            <label class="form-label" for="staff-name">Full Name</label>
            <input type="text" id="staff-name" class="form-control" required placeholder="Juan Dela Cruz">
          </div>

          <div class="form-group">
            <label class="form-label" for="staff-email">Email Address</label>
            <input type="email" id="staff-email" class="form-control" required placeholder="staff@aquapure.ph">
          </div>

          <div class="form-group">
            <label class="form-label" for="staff-password">Initial Password</label>
            <input type="password" id="staff-password" class="form-control" required minlength="6" placeholder="••••••••">
          </div>

          <div class="form-group">
            <label class="form-label" for="staff-role">Assigned Role</label>
            <select id="staff-role" class="form-control" required>
              <option value="ADMINISTRATOR">ADMINISTRATOR</option>
              <option value="CASHIER">CASHIER</option>
              <option value="INVENTORY_PERSONNEL">INVENTORY_PERSONNEL</option>
              <option value="DELIVERY_PERSONNEL">DELIVERY_PERSONNEL</option>
            </select>
          </div>

          <button type="submit" id="add-staff-btn" class="btn btn-primary" style="width: 100%;">Create Account</button>
        </form>
      </div>
    </div>
  `;

  async function loadStaff() {
    const tableBody = document.getElementById('staff-table-body');
    const result = await getEmployees();

    if (!result.success || result.employees.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align: center; color: var(--text-muted);">No staff records found.</td>
        </tr>
      `;
      return;
    }

    tableBody.innerHTML = result.employees.map(emp => `
      <tr>
        <td><strong>${emp.fullName || 'N/A'}</strong></td>
        <td>${emp.email}</td>
        <td><span class="user-role-badge">${emp.role}</span></td>
        <td>
          <span class="badge ${emp.status === 'DEACTIVATED' ? 'badge-danger' : 'badge-success'}">
            ${emp.status || 'ACTIVE'}
          </span>
        </td>
        <td>
          ${emp.role === 'OWNER' ? '<span style="font-size: 0.8rem; color: var(--text-muted);">Protected</span>' : `
            <button class="btn btn-secondary btn-sm toggle-status-btn" data-uid="${emp.uid}" data-status="${emp.status}">
              ${emp.status === 'DEACTIVATED' ? 'Reactivate' : 'Deactivate'}
            </button>
          `}
        </td>
      </tr>
    `).join('');

    document.querySelectorAll('.toggle-status-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const uid = e.target.dataset.uid;
        const currentStatus = e.target.dataset.status;
        const newStatus = currentStatus === 'DEACTIVATED' ? 'ACTIVE' : 'DEACTIVATED';

        if (confirm(`Are you sure you want to change account status to ${newStatus}?`)) {
          await updateEmployeeStatusOrRole(userSession, uid, null, newStatus);
          await loadStaff();
        }
      });
    });
  }

  document.getElementById('create-staff-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('add-staff-btn');
    btn.disabled = true;
    btn.textContent = 'Creating...';

    const name = document.getElementById('staff-name').value;
    const email = document.getElementById('staff-email').value;
    const pwd = document.getElementById('staff-password').value;
    const role = document.getElementById('staff-role').value;

    const res = await createEmployee(userSession, email, pwd, name, role);

    if (res.success) {
      alert(`Staff account for ${name} created successfully!`);
      e.target.reset();
      await loadStaff();
    } else {
      alert(`Error: ${res.error}`);
    }

    btn.disabled = false;
    btn.textContent = 'Create Account';
  });

  document.getElementById('refresh-staff-btn').addEventListener('click', loadStaff);
  await loadStaff();
}
