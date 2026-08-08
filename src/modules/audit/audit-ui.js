/**
 * AQUAPURE Audit UI Module
 * Displays immutable system activity and security log viewer for Owner & Administrator
 * Ritz Framework Compliant
 */

import { getAuditLogs } from './audit-service.js';

export async function renderAuditView(container, userSession) {
  container.innerHTML = `
    <div class="card">
      <div class="card-header">
        <div>
          <h2 class="card-title">System Audit Trail</h2>
          <p style="font-size: 0.85rem; color: var(--text-muted);">Immutable history of security-sensitive and business operations</p>
        </div>
        <button id="refresh-audit-btn" class="btn btn-secondary btn-sm">Refresh Logs</button>
      </div>

      <div class="table-responsive">
        <table class="table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Event</th>
              <th>Actor</th>
              <th>Role</th>
              <th>Target Resource</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody id="audit-table-body">
            <tr>
              <td colspan="6" style="text-align: center; color: var(--text-muted);">Loading audit logs...</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `;

  async function loadLogs() {
    const tableBody = document.getElementById('audit-table-body');
    const result = await getAuditLogs(100);

    if (!result.success || result.logs.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center; color: var(--text-muted); padding: 2rem;">
            No audit records found or permission restricted.
          </td>
        </tr>
      `;
      return;
    }

    tableBody.innerHTML = result.logs.map(log => `
      <tr>
        <td style="font-size: 0.8rem; white-space: nowrap;">${new Date(log.timestamp).toLocaleString()}</td>
        <td><span class="badge badge-warning">${log.eventType || 'SYSTEM'}</span></td>
        <td>${log.actor ? log.actor.email : 'System'}</td>
        <td><span class="user-role-badge">${log.actor ? log.actor.role : 'SYSTEM'}</span></td>
        <td style="font-family: monospace; font-size: 0.8rem;">${log.resourceId || 'N/A'}</td>
        <td style="font-size: 0.85rem; color: var(--text-muted);">${JSON.stringify(log.details || {})}</td>
      </tr>
    `).join('');
  }

  document.getElementById('refresh-audit-btn').addEventListener('click', loadLogs);
  await loadLogs();
}
