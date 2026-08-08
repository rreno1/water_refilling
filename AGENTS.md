# AGENTS.md — water_refilling Architecture Guidance

Welcome to the **water_refilling** project repository. This project is governed strictly by the **Ritz Structured Multi-Model AI Development Framework**.

## Core Rule
**PLAN BEFORE CODING.**
Do not create operational application features without explicit task assignment and verified, locked instructions.

## Source of Truth Hierarchy
1. Human-Approved Architectural / Change Decisions (`/.ai/decisions/architecture-decisions.json`)
2. Approved Versioned Contracts (`/.ai/contracts/`)
3. Global Project Instructions (`/.ai/global/`)
4. Module Instructions (`/.ai/modules/<module>/`)
5. Approved Project Requirements
6. Existing Implementation

Existing code NEVER overrides an approved contract.

## Primary Instruction Entry Points
- Global specifications: `/.ai/global/*.json`
- API and Interface Contracts: `/.ai/contracts/*.json`
- Architecture Decision Records: `/.ai/decisions/*.json`
- Module specifications: `/.ai/modules/<module>/*.json`
- Module AI instruction guidelines: `src/modules/<module>/AGENTS.md`

## Mandatory Task Protocol for AI Assistance
For every assigned task, you MUST:
1. Inspect this `/AGENTS.md` file.
2. Inspect the assigned module's localized `src/modules/<module>/AGENTS.md` file.
3. Read the relevant global instructions in `/.ai/global/`.
4. Read all module specification JSON files in `/.ai/modules/<module>/`.
5. Inspect the public contracts of direct dependency modules in `/.ai/contracts/`.
6. Inspect existing implementation before making edits.
7. Explicitly state authorized file boundaries (e.g. `src/modules/<module>/**`).
8. Implement ONLY approved behavior.
9. Create/update corresponding unit and integration tests.
10. Report files modified, contract versions used, tests executed, and any unresolved issues.

## Strictly Prohibited Actions
- DO NOT invent missing requirements or bypass contracts.
- DO NOT edit files outside assigned module boundaries without explicit authorization.
- DO NOT expose PayMongo or Firebase secrets to the client.
- DO NOT allow order cancellations or sale voids/refunds.
- DO NOT use non-approved frameworks (React, Vue, Angular, etc.).
- DO NOT commit without running JSON validation and tests.
