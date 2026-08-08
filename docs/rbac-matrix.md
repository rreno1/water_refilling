# Role-Based Access Control (RBAC) Matrix

| Permission / Action | OWNER | ADMIN | CASHIER | INVENTORY | DELIVERY | CUSTOMER |
|---|---|---|---|---|---|---|
| Manage Staff Accounts | YES | NO | NO | NO | NO | NO |
| Create Delivery Order | YES | YES | YES | NO | NO | YES (Own) |
| Process Walk-in Sale | YES | YES | YES | NO | NO | NO |
| Adjust Inventory | YES | YES | NO | YES | NO | NO |
| Adjust Jug Balance | YES | YES | NO | YES | NO | NO |
| Record Delivery Cash | NO | NO | NO | NO | YES (Assigned) | NO |
| Record Sale Correction| YES | YES | NO | NO | NO | NO |
| View Full Audit Log | YES | YES | NO | NO | NO | NO |