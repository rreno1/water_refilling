# Business Rules Specification

- Product: Jug of purified water, default PHP 25 (configurable).
- Inventory: Negative inventory is strictly prohibited.
- Company Jugs: Balance = released - returned +/- adjustments. Negative balance prohibited.
- Orders: Confirmed orders CANNOT be cancelled or edited.
- Sales: Finalized sales are IMMUTABLE. No voids or refunds allowed.