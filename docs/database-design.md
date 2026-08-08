# Database Design & Firestore Schemas

Document-oriented Firestore design with master collections, transaction ledgers, and pre-aggregated daily metric summaries.

## Master Collections
- `users`
- `customers`
- `customer_addresses`
- `products`
- `inventory_items`
- `system_settings`

## Ledger Collections
- `inventory_movements`
- `gallon_movements`
- `orders`
- `deliveries`
- `payments`
- `sales`
- `sale_corrections`
- `audit_logs`
- `notifications`
- `daily_metrics`