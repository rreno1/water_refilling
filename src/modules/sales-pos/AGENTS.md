# AGENTS.md — Module: sales-pos

You are an AI assistant assigned to work on the **sales-pos** module.

## MANDATORY STEPS BEFORE ANY WORK:
1. Read the root `/AGENTS.md`.
2. Read global instructions in `/.ai/global/`.
3. Read approved shared contracts in `/.ai/contracts/`.
4. Read EVERY JSON instruction for this module in `/.ai/modules/sales-pos/`.
5. Read the public contracts of direct dependencies: `[authentication, customer-management, product-pricing, inventory, jug-accountability, payments, notifications, audit]`.
6. Inspect existing implementation before editing.
7. Respect file boundaries:
   - Allowed: `src/modules/sales-pos/**`, `functions/src/modules/sales-pos/**`, `tests/unit/sales-pos/**`, `tests/integration/sales-pos/**`
   - Prohibited: Modifying other modules without explicit authorization.
8. Use declared contract version `1.0.0`.
9. Report contradictions immediately rather than redesigning architecture.
