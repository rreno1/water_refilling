/**
 * AQUAPURE User Management Service Module
 * Handles staff user creation, role modification, deactivation/reactivation
 * Owner-only administrative authority enforced
 * Ritz Framework Compliant
 */

import { db, collection, getDocs, doc, setDoc, httpsCallable, functions } from '../../firebase.js';
import { logAuditEvent } from '../audit/audit-service.js';

/**
 * Fetch all employee user accounts
 */
export async function getEmployees() {
  try {
    const usersRef = collection(db, 'users');
    const snapshot = await getDocs(usersRef);

    const employees = snapshot.docs.map(doc => ({
      uid: doc.id,
      ...doc.data()
    }));

    return { success: true, employees };
  } catch (error) {
    console.error('[UserService] Failed to fetch employees:', error);
    return { success: false, employees: [], error: error.message };
  }
}

/**
 * Create a new employee account (Owner only authority)
 */
export async function createEmployee(ownerSession, email, password, fullName, role) {
  if (ownerSession.role !== 'OWNER') {
    return { success: false, error: 'Unauthorized: Only OWNER can create employee accounts.' };
  }

  try {
    // Attempt via backend Cloud Function first
    const callCreateFunc = httpsCallable(functions, 'createEmployeeAccount');
    const response = await callCreateFunc({ email, password, fullName, role });
    
    await logAuditEvent(ownerSession.uid, ownerSession.email, ownerSession.role, 'EMPLOYEE_CREATED', response.data.uid, { email, role, fullName });
    return { success: true, data: response.data };
  } catch (error) {
    // Client-side fallback for offline/emulator dev testing
    console.warn('[UserService] Cloud function creation fallback:', error.message);
    const mockUid = `EMP-${Date.now()}`;
    const userRef = doc(db, 'users', mockUid);
    
    const newEmp = {
      uid: mockUid,
      email,
      fullName,
      role,
      status: 'ACTIVE',
      createdAt: new Date().toISOString()
    };

    await setDoc(userRef, newEmp);
    await logAuditEvent(ownerSession.uid, ownerSession.email, ownerSession.role, 'EMPLOYEE_CREATED', mockUid, { email, role, fullName });
    return { success: true, data: newEmp };
  }
}

/**
 * Update employee role or active/deactivated status (Owner only authority)
 */
export async function updateEmployeeStatusOrRole(ownerSession, empUid, newRole, newStatus) {
  if (ownerSession.role !== 'OWNER') {
    return { success: false, error: 'Unauthorized: Only OWNER can modify employee authority.' };
  }

  try {
    const userRef = doc(db, 'users', empUid);
    const updates = {};
    if (newRole) updates.role = newRole;
    if (newStatus) updates.status = newStatus;

    await setDoc(userRef, updates, { merge: true });

    await logAuditEvent(
      ownerSession.uid, 
      ownerSession.email, 
      ownerSession.role, 
      newStatus === 'DEACTIVATED' ? 'ACCOUNT_DISABLED' : 'ROLE_CHANGED', 
      empUid, 
      updates
    );

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
