/**
 * AQUAPURE Customer Portal Service Module
 * Handles customer self-registration, business profile creation, and account retrieval
 * Ritz Framework Compliant
 */

import { auth, db, doc, setDoc, getDoc, signInWithEmailAndPassword } from '../../firebase.js';
import { logAuditEvent } from '../audit/audit-service.js';

/**
 * Register a new customer account
 */
export async function registerCustomerAccount(email, password, fullName, contactNumber, address, landmark) {
  try {
    const mockUid = `CUST-${Date.now()}`;
    
    // Normalize contact number for duplicate detection
    const normalizedContact = (contactNumber || '').replace(/\D/g, '');
    const normalizedName = (fullName || '').toLowerCase().trim();

    const customerData = {
      uid: mockUid,
      email,
      fullName,
      normalizedName,
      contactNumber: normalizedContact,
      defaultAddress: {
        address,
        landmark: landmark || ''
      },
      addresses: [
        {
          id: `ADDR-1`,
          address,
          landmark: landmark || '',
          isDefault: true
        }
      ],
      companyJugBalance: 0,
      status: 'ACTIVE',
      createdAt: new Date().toISOString()
    };

    const customerRef = doc(db, 'customers', mockUid);
    await setDoc(customerRef, customerData);

    await logAuditEvent(mockUid, email, 'CUSTOMER', 'CUSTOMER_REGISTERED', mockUid, {
      fullName,
      contactNumber: normalizedContact
    });

    return {
      success: true,
      customer: customerData
    };
  } catch (error) {
    console.error('[CustomerPortalService] Registration failed:', error);
    return {
      success: false,
      error: error.message || 'Failed to create customer account.'
    };
  }
}

/**
 * Get customer profile details
 */
export async function getCustomerProfile(customerUid) {
  try {
    const ref = doc(db, 'customers', customerUid);
    const snap = await getDoc(ref);

    if (snap.exists()) {
      return { success: true, profile: snap.data() };
    } else {
      return { success: false, error: 'Customer profile not found.' };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
}
