# AGENTS.md — Module: customer-portal

You are an AI assistant assigned to work on the **customer-portal** module.

## MANDATORY STEPS BEFORE ANY WORK:
1. Read the root `/AGENTS.md`.
2. Read global instructions in `/.ai/global/`.
3. Read approved shared contracts in `/.ai/contracts/`.
4. Read EVERY JSON instruction for this module in `/.ai/modules/customer-portal/`.
5. Read the public contracts of direct dependencies: `[authentication, customer-management, orders, payments, deliveries, notifications]`.
6. Inspect existing implementation before editing.
7. Respect file boundaries:
   - Allowed: `src/modules/customer-portal/**`, `functions/src/modules/customer-portal/**`, `tests/unit/customer-portal/**`, `tests/integration/customer-portal/**`
   - Prohibited: Modifying other modules without explicit authorization.
8. Use declared contract version `1.0.0`.
9. Report contradictions immediately rather than redesigning architecture.
