/**
 * AQUAPURE Audit Trail Service Module
 * Handles creation and retrieval of immutable audit log records
 * Ritz Framework Compliant
 */

import { db, collection, getDocs, query, serverTimestamp, doc, setDoc } from '../../firebase.js';

/**
 * Record an immutable audit log entry
 */
export async function logAuditEvent(actorUid, actorEmail, actorRole, eventType, resourceId, details = {}) {
  try {
    const logId = `AUD-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    const logRef = doc(db, 'audit_logs', logId);

    const logEntry = {
      logId,
      actor: {
        uid: actorUid,
        email: actorEmail,
        role: actorRole
      },
      eventType,
      resourceId,
      details,
      timestamp: new Date().toISOString(),
      createdAt: serverTimestamp()
    };

    await setDoc(logRef, logEntry);
    return { success: true, logId };
  } catch (error) {
    console.error('[AuditService] Failed to record audit log:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Fetch historical audit trail logs for Owner & Administrator
 */
export async function getAuditLogs(limitCount = 50) {
  try {
    const logsRef = collection(db, 'audit_logs');
    const q = query(logsRef);
    const snapshot = await getDocs(q);

    const logs = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return { success: true, logs: logs.slice(0, limitCount) };
  } catch (error) {
    console.error('[AuditService] Failed to fetch audit logs:', error);
    return { success: false, logs: [], error: error.message };
  }
}
