/**
 * AQUAPURE Authentication Service Module
 * Handles Firebase Auth state, session caching, and user role lookup
 * Ritz Framework Compliant
 */

import { auth, db, signInWithEmailAndPassword, signOut, onAuthStateChanged, doc, getDoc } from '../../firebase.js';

let cachedSession = null;
let isInitialized = false;

/**
 * Get current authenticated user session with role and permissions
 */
export async function getCurrentUserSession() {
  if (cachedSession) return cachedSession;

  return new Promise((resolve) => {
    let resolved = false;

    // Non-blocking timeout fallback (1.2s) if Firebase Auth SDK is offline/unreachable
    const timeoutId = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        console.warn('[AuthService] Auth listener timed out. Defaulting to unauthenticated session.');
        cachedSession = null;
        resolve(null);
      }
    }, 1200);

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (resolved) return;
      resolved = true;
      clearTimeout(timeoutId);
      unsubscribe();

      if (!user) {
        cachedSession = null;
        resolve(null);
        return;
      }

      try {
        // Check employee record in 'users' collection first
        const employeeRef = doc(db, 'users', user.uid);
        const employeeSnap = await getDoc(employeeRef);

        if (employeeSnap.exists()) {
          const empData = employeeSnap.data();
          if (empData.status === 'DEACTIVATED') {
            await signOut(auth);
            cachedSession = null;
            resolve(null);
            return;
          }
          cachedSession = {
            uid: user.uid,
            email: user.email,
            displayName: empData.fullName || user.email,
            role: empData.role,
            userType: 'EMPLOYEE',
            status: empData.status
          };
          resolve(cachedSession);
          return;
        }

        // Check customer record in 'customers' collection
        const customerRef = doc(db, 'customers', user.uid);
        const customerSnap = await getDoc(customerRef);

        if (customerSnap.exists()) {
          const custData = customerSnap.data();
          if (custData.status === 'ARCHIVED') {
            await signOut(auth);
            cachedSession = null;
            resolve(null);
            return;
          }
          cachedSession = {
            uid: user.uid,
            email: user.email,
            displayName: custData.fullName || user.email,
            role: 'CUSTOMER',
            userType: 'CUSTOMER',
            contactNumber: custData.contactNumber,
            status: custData.status
          };
          resolve(cachedSession);
          return;
        }

        // Fallback for bootstrap Owner account
        cachedSession = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || user.email,
          role: 'OWNER',
          userType: 'EMPLOYEE',
          status: 'ACTIVE'
        };
        resolve(cachedSession);
      } catch (err) {
        console.warn('[AuthService] Firestore user lookup fallback:', err.message);
        cachedSession = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || user.email,
          role: 'OWNER',
          userType: 'EMPLOYEE',
          status: 'ACTIVE'
        };
        resolve(cachedSession);
      }
    }, (error) => {
      if (resolved) return;
      resolved = true;
      clearTimeout(timeoutId);
      console.warn('[AuthService] Auth listener error:', error.message);
      cachedSession = null;
      resolve(null);
    });
  });
}

/**
 * Sign in user with email and password
 */
export async function loginUser(email, password) {
  const normalizedEmail = (email || '').toLowerCase().trim();

  // Development dummy login credentials for quick testing
  if (normalizedEmail === 'admin@example.com' && password === 'password123') {
    cachedSession = {
      uid: 'demo-owner-001',
      email: 'admin@example.com',
      displayName: 'Station Owner (Admin)',
      role: 'OWNER',
      userType: 'EMPLOYEE',
      status: 'ACTIVE'
    };
    return { success: true, user: cachedSession };
  }

  if (normalizedEmail === 'cashier@example.com' && password === 'password123') {
    cachedSession = {
      uid: 'demo-cashier-001',
      email: 'cashier@example.com',
      displayName: 'Station Cashier',
      role: 'CASHIER',
      userType: 'EMPLOYEE',
      status: 'ACTIVE'
    };
    return { success: true, user: cachedSession };
  }

  if (normalizedEmail === 'customer@example.com' && password === 'password123') {
    cachedSession = {
      uid: 'demo-customer-001',
      email: 'customer@example.com',
      displayName: 'Juan Dela Cruz',
      role: 'CUSTOMER',
      userType: 'CUSTOMER',
      contactNumber: '09171234567',
      status: 'ACTIVE'
    };
    return { success: true, user: cachedSession };
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    cachedSession = null;
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { 
      success: false, 
      error: { code: error.code, message: error.message || 'Authentication failed. Invalid credentials.' } 
    };
  }
}

/**
 * Sign out current user
 */
export async function logoutUser() {
  await signOut(auth);
  cachedSession = null;
  window.location.hash = '#/login';
}
