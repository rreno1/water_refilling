# Architecture Overview

`water_refilling` uses a clean, client-side SPA architecture hosted on GitHub Pages paired with serverless Firebase backend logic.

```
[ Browser SPA (Vanilla JS + ES Modules) ]
              │
              ├── (Read/Direct Subscriptions with Security Rules) ──> [ Cloud Firestore ]
              │
              └── (Transactional Mutations / Payments / Admin) ───> [ Firebase Cloud Functions ] ──> [ PayMongo API ]
```