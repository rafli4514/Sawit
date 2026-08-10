# PRD

## 1. Overview
A web-based expert system that enables oil palm farmers and field officers to diagnose diseases and pests quickly by combining observed symptoms with an auditable rule base using Forward Chaining and Certainty Factor (CF) reasoning. Users pick visible symptoms and specify their confidence; the system computes ranked diagnoses with CF percentages, shows severity color-coding, draws symptom→rule provenance, and provides step-by-step treatment recommendations (including emergency actions and dosing). Admins (agronomists/pakar) curate rules, weights and review system performance.

Key outcomes:
- Faster, more accurate field diagnosis
- Consistent, auditable expert recommendations
- Reduced inappropriate pesticide use
- Continuous improvement via case capture and expert validation

Tech stack:
- Backend: FastAPI (Python)
- Frontend: Next.js (React)
- DB: PostgreSQL
- Deployment: Serverless + Managed BaaS (Vercel/Netlify + Supabase/Firebase)

## 2. Requirements

Functional Requirements
- FR1: Farmer/Officer UI to select visible symptoms and assign personal confidence per symptom (0–100%).
- FR2: Diagnose endpoint that runs Forward Chaining + Certainty Factor (CF) and returns ranked diagnoses with CF scores, severity, treatment steps, and rule trace.
- FR3: Visual dashboard showing diagnosis summary, charts, severity color, and stepwise treatment with dosing.
- FR4: Admin UI to CRUD symptoms, diseases, rules, treatments, and expert CF weights.
- FR5: Audit trail: store each diagnosis run, selected inputs, algorithm trace, expert vs. system comparison.
- FR6: Reporting for accuracy tracking (case validation, expert feedback).
- FR7: Exportable rule-set & case logs for offline review.

Non-functional Requirements
- NFR1: Response time for diagnosis ≤ 2s for typical rulebase (< 500 rules).
- NFR2: Availability 99% (managed hosting + serverless).
- NFR3: Scalable to thousands of concurrent read requests.
- NFR4: Data integrity and traceability for each rule change (versioning).
- NFR5: Secure access control: role-based (Farmer, Officer, Admin/Pakar).
- NFR6: Localization support (text labels, units).

Success Metrics
- Time-to-diagnosis median < 2 minutes from symptom selection.
- Reduction in misdiagnosis metric (tracked via expert validation) over successive months.
- Proportion of cases with recorded expert agreement > target threshold.

## 3. Core Features

1. Symptom Capture UI
   - Symptom catalog with images and severity tags
   - Multi-select with per-symptom user confidence slider (0–100%)

2. Diagnostic Engine
   - Forward Chaining rule engine using an IF(symptoms) → THEN(disease, CF_contrib) model
   - Certainty Factor combination algorithm to compute disease CF%
   - Outputs ranked diseases, CF%, severity color-code

3. Result Presentation
   - Ranked list with CF percentages and confidence intervals
   - Symptom→Rule provenance view (which rules fired, weights used)
   - Visual charts (bar chart of top-N CFs)
   - Treatment plan: emergency steps, recommended chemicals/biologicals, dosing, safety notes

4. Admin Rule Management
   - CRUD for symptoms, rules, diseases, treatments
   - Expert weight editing, rule versioning, rule activation/deactivation
   - Rule testing sandbox (simulate inputs → inspect CF trace)

5. Case Capture & Audit
   - Store full case payload, engine trace, final output, expert validation outcome
   - Case review queue for Pakar to validate and adjust weights

6. Monitoring & Reports
   - Accuracy dashboard, rule usage, frequent misclassifications
   - Export CSV/JSON of cases, rules

7. Security & Roles
   - Role-based access (Farmer, Officer, Admin/Pakar)
   - Audit logs for rule changes and case reviews

## 4. User Flow

1. Farmer/Officer selects language and logs in (or proceeds as guest with limited features).
2. Select palm plot / tree metadata (optional).
3. Select visible symptoms from illustrated catalog; for each selected symptom, set own confidence (0–100%).
4. Submit for diagnosis → backend runs FC + CF.
5. Display: top 3–5 diagnoses with CF%, color-coded severity, provenance, chart, and step-by-step treatment.
6. If emergency flag set (high severity), display emergency actions prominently.
7. Option: Record case (saves inputs, engine trace) and optionally request expert review.
8. Admin/Pakar reviews saved cases, adjusts rule weights, approves rule changes; system logs edits and re-processes archived cases for validation metrics.

## 5. Architecture & Integrations

High-level components:
- Frontend (Next.js) — UI, symptom selection, charts, admin console
- Backend API (FastAPI) — rule engine, CF computations, CRUD, audit
- PostgreSQL (hosted via Supabase) — authoritative storage
- Optional storage (Supabase Storage) for images/media
- Serverless deployment (Vercel for frontend, serverless FastAPI via providers like Fly.io/Render/Supabase Edge Functions)

Core algorithm:
- Forward Chaining: evaluate rules whose antecedents (symptoms) are matched by user inputs (taking symptom user-confidence into account).
- Certainty Factor (CF): each rule has expert-assigned CF weight (−1.0 to 1.0). Combine multiple rules for a disease using standard CF combination formulas (e.g., CFcombine) to compute final disease CF in percentage.

API DOCS (Backend FastAPI endpoints)
Note: All endpoints use JSON. Authentication uses JWT tokens in Authorization: Bearer <token> header. Role-based access enforced server-side.

Authentication & Users
- POST /auth/register
  - Payload: { "name": "string", "email": "string", "password": "string", "role": "farmer|officer|pakar" }
  - Response: { "user_id": int, "email": "string" }
- POST /auth/login
  - Payload: { "email": "string", "password": "string" }
  - Response: { "access_token": "jwt", "token_type": "bearer", "user": { "id": int, "role": "string" } }

Symptoms
- GET /symptoms
  - Query params: ?q=&lang=&active=true
  - Response: [ { "id": int, "code": "string", "label": "string", "description": "string", "image_url": "string", "severity_hint": "low|medium|high", "active": bool } ]
- POST /symptoms  (Admin)
  - Payload: { "code":"SP001", "label":"Leaf spots", "description":"...", "image_url":"...", "severity_hint":"medium" }
  - Response: created symptom object
- PUT /symptoms/{id} (Admin)
  - Payload: partial symptom
  - Response: updated symptom

Diseases & Treatments
- GET /diseases
  - Response: [ { "id": int, "name": "string", "summary":"string", "severity_level":"low|medium|high", "recommended_treatment_id": int } ]
- POST /diseases (Admin)
  - Payload: { "name":"", "summary":"", "severity_level":"medium" }

- GET /treatments/{id}
  - Response: { "id": int, "name": "string", "steps": ["step1","step2"], "emergency_actions": ["..."], "dosage": { "chemical":"X", "rate":"Y per tree/ha" }, "safety": "PPE required" }

Rules & Expert Weights
- GET /rules
  - Response: [ { "id": int, "code":"R001", "antecedents": [ {symptom_id, required:true/optional } ], "consequents": [ { "disease_id": int, "cf": float } ], "meta": { "created_by":int, "version":int, "active":bool } } ]
- POST /rules (Admin/Pakar)
  - Payload:
    {
      "code":"R001",
      "antecedents":[ {"symptom_id": 12, "min_confidence": 0.2}, {"symptom_id": 7, "min_confidence": 0.0} ],
      "consequents":[ {"disease_id": 3, "cf": 0.8} ],
      "notes":"rule deriving disease X from leaf spots and frass",
      "active": true
    }
  - Response: created rule object (with version)
- PUT /rules/{id} (Admin/Pakar)
  - Payload: partial update; updates create new version and store audit entry.

Rule Test Sandbox
- POST /rules/{id}/simulate
  - Payload: { "inputs": [ {"symptom_id":int, "user_confidence": 0.0-1.0} ] }
  - Response: { "rule_fired": true/false, "antecedent_matches":[...], "cf_contribution": 0.0-1.0, "explanation":"..." }

Diagnosis Engine
- POST /diagnose
  - Payload:
    {
      "user_id": int|null,
      "metadata": { "plot_id": "string", "timestamp": "ISO8601", "notes":"string" },
      "symptoms": [ { "symptom_id": int, "user_confidence": 0.0-1.0 } ],
      "max_results": int (optional, default 5)
    }
  - Processing:
    - Forward chain: select rules whose antecedents’ min_confidence thresholds are satisfied by provided symptoms and confidences.
    - For each fired rule, compute rule CF contribution: CF_rule = user_confidence * rule.cf (both as 0..1 floats, rule.cf can be neg for exclusion).
    - Combine contributions per disease using CF combination algorithm (e.g., CFcombined = CF1 + CF2*(1- CF1) for positive; analogous for negatives).
  - Response:
    {
      "case_id": int,
      "diagnoses": [
        {
          "disease_id": int,
          "name":"string",
          "cf_score": 0.0-1.0,
          "cf_percent": 0-100,
          "severity":"low|medium|high",
          "treatment_id": int,
          "rules_traced":[ { "rule_id": int, "rule_cf_contribution": float, "antecedent_matches":[ {"symptom_id":int,"user_confidence":float} ] } ]
        }
      ],
      "charts": { "top_n": [ {"disease":"", "cf": float} ] },
      "emergency_flag": bool,
      "diagnosis_time_ms": int
    }
  - Side effects: Creates diagnosis_case record (see DB schema).

Cases & Audit
- GET /cases
  - Query params: ?user_id=&status=&validated=
  - Response: list of saved diagnosis cases with metadata and outcome
- GET /cases/{case_id}
  - Response: full case payload including engine trace and stored inputs
- POST /cases/{case_id}/validate (Pakar)
  - Payload: { "validated_disease_id": int, "agreement": true/false, "note": "string" }
  - Effect: attach expert validation record and (optionally) trigger weight-adjustment review

Reports
- GET /reports/accuracy
  - Query params: ?from=&to=&rule_id=
  - Response: aggregated metrics: agreement_rate, rule_hit_counts, top_incorrect_diseases

Media
- POST /media/upload
  - Payload: multipart/form-data { file: image }
  - Response: { "url": "https://..." }

Webhooks (optional)
- POST /webhooks/case_created
  - Payload: case summary for integrations (email, slack)

Integrations
- Supabase for DB + Auth + Storage (optional). If using Supabase Auth, map roles to app roles.
- Frontend connects to FastAPI via REST over HTTPS. FastAPI handles auth verification and role enforcement.

Failure & Retry
- Diagnosis endpoint is idempotent (stores case with generated case_id). Client can re-run using same inputs.
- If rulebase is updated, preserved cases keep their engine_trace and a reference to rule versions used.

## 6. Database Schema

Tables summary (core fields only)

- users
  - id (PK, serial)
  - name (text)
  - email (text, unique)
  - password_hash (text)
  - role (enum: farmer, officer, pakar, admin)
  - created_at (timestamptz)
  - active (bool)

- symptoms
  - id (PK)
  - code (text, unique)
  - label (text)
  - description (text)
  - image_url (text)
  - severity_hint (enum: low, medium, high)
  - active (bool)
  - created_by (FK users.id)
  - created_at (timestamptz)

- diseases
  - id (PK)
  - name (text, unique)
  - summary (text)
  - severity_level (enum: low, medium, high)
  - recommended_treatment_id (FK treatments.id)
  - created_at

- treatments
  - id (PK)
  - name (text)
  - steps (jsonb) -- ordered list of steps
  - emergency_actions (jsonb)
  - dosage (jsonb) -- structured {chemical, rate, unit, per:"tree|ha"}
  - safety_notes (text)
  - created_by

- rules
  - id (PK)
  - code (text, unique)
  - antecedents (jsonb) -- [ {symptom_id:int, min_confidence:float} ]
  - consequents (jsonb) -- [ {disease_id:int, cf:float} ]
  - notes (text)
  - active (bool)
  - version (int)
  - created_by (FK users.id)
  - created_at
  - previous_rule_id (FK rules.id) -- for versioning/audit

- rule_changes (audit)
  - id (PK)
  - rule_id (FK)
  - changed_by (FK users.id)
  - diff (jsonb)
  - timestamp

- diagnosis_cases
  - id (PK)
  - user_id (FK users.id) nullable
  - metadata (jsonb) -- plot_id, geolocation, images list
  - inputs (jsonb) -- [ {symptom_id, user_confidence} ]
  - engine_trace (jsonb) -- fired rules, per-rule CF contributions, rule versions used
  - diagnoses (jsonb) -- final ranked diagnoses with CFs
  - emergency_flag (bool)
  - created_at
  - validated (bool)
  - validated_by (FK users.id)
  - validation_note (text)

- case_validations
  - id (PK)
  - case_id (FK diagnosis_cases.id)
  - validated_by (FK users.id)
  - validated_disease_id (FK diseases.id)
  - agreement (bool)
  - note (text)
  - timestamp

- media
  - id
  - case_id (FK nullable)
  - url
  - uploaded_by
  - created_at

- metrics_cache (optional)
  - key
  - payload (jsonb)
  - updated_at

Indexes: symptoms.code, diseases.name, rules.code, gin indexes on jsonb fields for queries.

## 7. Constraints

- No external expert AI inference — deterministic rule-based Forward Chaining + CF only.
- Rule CF weights must be provided by Pakar/Admin; no automatic KYC or identity verification is included.
- Rule complexity: Performance target assumes rulebase < 1000 rules; for larger sets, implement rule indexing/sharding.
- Offline/edge: Minimal offline support; diagnosis requires backend compute (lightweight) — an offline-first mobile app is out of Phase 1 scope.
- Data privacy: store minimal personal data; implement role-based access; encryption in transit and at rest (managed by provider).
- Regulatory: Provide chemical dosing and safety as advisory only; include disclaimer and local regulatory compliance check is out of scope.
- Versioning: Rules are versioned; diagnosis cases freeze rule versions used at time of run to ensure auditability.
- UX: For farmers, default to simple mode (select symptoms + confidence) and show top 1–3 results; advanced/professional mode exposes full provenance and rule details.

-- End of PRD --

---

BRD — PHASE 2

Purpose
- Extend the PRD implementation into Phase 2: operationalize scale, analytics, auditability, rule management, and admin workflows for continuous improvement. Deliverables: hardened backend services, enhanced admin features (bulk import, versioned rule workflows), reprocessing pipeline for archived cases, advanced reporting/metrics, secure role-based access, and integrations for export/webhooks.

Scope (in-scope)
- Production-grade FastAPI backend with rule-versioning, reprocess pipeline, background jobs, caching, and metrics.
- Admin console features: bulk rule import/export, rule approval workflow, rule sandbox with batch-simulations, version diffing, and case reprocessing.
- Case management: case reprocess endpoint (re-run with updated rule versions), case review queue, expert validation interface.
- Reporting: accuracy/usage dashboards, scheduled metrics aggregation, CSV/JSON exports.
- Infrastructure: CI/CD, monitoring, observability, backups, automated schema migrations.
- Security: RBAC enforcement, JWT with rotation, audit logs, encryption in transit & at rest.

Out-of-scope
- Offline-first mobile app, automated ML-based weight adjustment, regulatory compliance engine, identity KYC.

Stakeholders
- Farmers / Officers (primary users)
- Pakar (agronomists / admins)
- Product Owners / DevOps / Data Ops
- Regulatory / Compliance advisors (advisory)

Business Objectives & Acceptance Criteria (mapped to PRD)
- Faster diagnosis: median time-to-diagnosis (UI start → first result) < 2 minutes; API /diagnose median latency < 2s for rulebase ≤ 500 rules (NFR1). Acceptance: benchmark report with 95th percentile under threshold.
- Auditability: All rule edits versioned; cases store rule_version_ids used (FR5, NFR4). Acceptance: ability to retrieve any case and its exact rule versions.
- Continuous improvement: Pakar can review queued cases and adjust rule versions; system produces accuracy delta reports monthly (FR6). Acceptance: monthly accuracy report generation and change-tracking.
- Reduced misuse: Provide dosing & safety; emergency action flagged and surfaced within UI (FR3). Acceptance: emergency_flag present in case payload and surfaced via /cases API.
- Scalability & availability: 99% availability via managed hosting and horizontal scaling (NFR2,NFR3). Acceptance: deployment runbook and autoscaling tests.

Phase 2 Functional Enhancements (prioritized)
- F2.1: Rule Versioning & Approval Workflow — create rule_versions; drafts → review → approved/published. Audit diff stored.
- F2.2: Bulk Import/Export — CSV/JSON for symptoms, diseases, rules, cases. Validation report on import.
- F2.3: Case Reprocessing — re-run archived cases against specified rule_version (reprocess pipeline; background job).
- F2.4: Advanced Reporting — scheduled aggregations (agreement rates, rule hit counts, false-positive lists).
- F2.5: Rule Sandbox Batch Simulation — simulate many synthetic cases, return aggregated CF distributions.
- F2.6: Metrics & Alerts — usage, latency, error budgets; support Prometheus/Grafana and alerting.
- F2.7: RBAC enhancements — Admin roles: pakar_reviewer, pakar_author, ops, read-only; fine-grained RBAC checks.
- F2.8: Exportable immutable CASE bundles (JSON + media) for offline review and submission to regulators.

Non-Functional Requirements (extended)
- NFR-A: Diagnose endpoint under 2s median; 95th percentile < 1s for cached path.
- NFR-B: Reprocessing pipeline throughput: at least 100 cases/hour per worker.
- NFR-C: All rule edits produce diff snapshots; restore to previous published version within UI.
- NFR-D: Data retention & export: retain raw case payloads for 7 years configurable.
- NFR-E: Localization: support i18n keys in DB for label translations.

KPIs & Success Metrics (Phase 2)
- Monthly improvement in agreement_rate (expert vs system) >= 5% in first 3 months.
- Rule churn: number of rule edits reviewed per month — demonstrate review SLA < 72 hours.
- Number of cases reprocessed and accuracy change reported.
- API latency and availability targets met.

Roadmap & Milestones (suggested)
- Sprint 1 (2 weeks): Rule versioning model, DB migration, API endpoints for rule drafts/publish.
- Sprint 2 (2 weeks): Reprocess pipeline + background workers, /cases/reprocess API.
- Sprint 3 (2 weeks): Bulk import/export & sandbox batch simulation endpoints.
- Sprint 4 (2 weeks): Reporting endpoints, metrics aggregation, dashboards.
- Sprint 5 (2 weeks): Security hardening, CI/CD, monitoring, SLA runbook.

DETAILED TECH STACK — PHASE 2

Core Platform
- Frontend: Next.js (React) — incremental static rendering for catalog pages; client-side for symptom selection, charts (Recharts/D3), admin consoles.
- Backend: FastAPI (Python 3.11) — pydantic models, dependency injection, OpenAPI.
- DB: PostgreSQL (managed, Supabase) — primary store, JSONB fields, GIN indexes, transactional integrity.
- Storage: Supabase Storage or S3-compatible for media.
- Auth: Supabase Auth (JWT) or custom Auth via Keycloak/Auth0 with RS256 JWTs; tokens validated by FastAPI middleware.
- Background Jobs: Redis + RQ or Celery (with Redis broker) — job queue for reprocessing, bulk imports, metrics aggregation. Hosted via managed Redis (Upstash, Redis Cloud).
- Caching: Redis for short-term cache (diagnosis rule index) and rate-limiting counters.
- Connection Pooling: PgBouncer or PgPool recommended on serverless connectors.
- Migrations: Alembic for schema migrations + SQLModel/SQLAlchemy for ORM.
- CI/CD: GitHub Actions pipelines — tests, lint, alembic migrations, Docker image build, deploy to Fly.io/Render/Vercel.
- Observability: Sentry for errors, Prometheus + Grafana for metrics, OpenTelemetry traces with Jaeger/Tempo.
- Secrets Management: Vault or environment secrets in provider.
- Backups: Managed Postgres backups + periodic export to object storage.
- Security: TLS everywhere, DB row-level security for multi-tenant, encryption at rest by managed provider, audit logging to append-only store.
- Rate limiting & WAF: Cloudflare + API gateway (Traefik/Cloudflare Workers) for DDoS protection.
- Export & Webhooks: Async webhooks via queue with retry/backoff, webhook management endpoints.
- Documentation: OpenAPI spec auto-generated; API versioned (v1/v2).
- Monitoring/Alerting: PagerDuty integration for P1s.

Key Libraries & Tools
- FastAPI, pydantic, SQLModel / SQLAlchemy, Alembic
- redis, rq or celery, uvicorn/gunicorn
- psycopg2-binary or asyncpg
- pytest, tox, black, mypy
- boto3 (if S3), supabase-py
- OpenTelemetry SDK, Sentry SDK

Deployment Pattern
- Frontend: Vercel (Next.js) with environment-based feature flags.
- Backend: Containerized FastAPI deployed to Fly.io or Render (auto-scale) or serverless FastAPI on Supabase Edge Functions (evaluate cold-starts).
- Worker: Dedicated worker dynos for reprocessing & batch jobs.
- DB & Storage: Supabase Postgres + Storage.

API DOCUMENTATION — INTERNAL ENDPOINTS, METHODS, EXACT JSON PAYLOADS

Notes
- All endpoints accept/return application/json unless otherwise noted.
- Authorization: Authorization: Bearer <JWT>. Roles enforced via middleware: farmer, officer, pakar_author, pakar_reviewer, admin, ops.
- Timestamps: ISO8601 UTC.
- Confidence values are 0.0–1.0 floats in backend payloads; UI uses 0–100% sliders converted by client.

1) AUTHENTICATION & USER MANAGEMENT
- POST /auth/register
  - Roles allowed: public (self-register only farmer/officer); admin creates pakar.
  - Request:
    {
      "name": "string",
      "email": "string",
      "password": "string",
      "role": "farmer" | "officer" | "pakar"
    }
  - Response 201:
    {
      "user_id": 123,
      "email": "user@example.com",
      "role": "farmer",
      "created_at": "2026-05-01T12:00:00Z"
    }

- POST /auth/login
  - Request:
    { "email": "string", "password": "string" }
  - Response 200:
    {
      "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
      "token_type": "bearer",
      "user": { "id": 123, "email": "x", "role": "farmer" }
    }

- POST /auth/refresh
  - Request:
    { "refresh_token": "string" }
  - Response:
    { "access_token": "jwt", "refresh_token": "jwt", "expires_in": 3600 }

- GET /admin/users
  - Roles: admin, ops
  - Query params: ?role=&active=
  - Response: [ { id, name, email, role, active, created_at } ]

2) SYMPTOMS
- GET /symptoms
  - Query params: ?q=&lang=&active=true
  - Response 200: Array of
    {
      "id": 12,
      "code": "SP001",
      "label": { "en":"Leaf spots", "id":"Bercak daun" },    // i18n object (phase2)
      "description": { "en":"...", "id":"..." },
      "image_url": "https://..",
      "severity_hint": "low" | "medium" | "high",
      "active": true,
      "created_by": 5,
      "created_at": "2026-05-01T..."
    }

- POST /symptoms
  - Roles: pakar_author, admin
  - Request:
    {
      "code": "SP010",
      "label": { "en":"Frass", "id":"Kotoran serangga" },
      "description": { "en":"...","id":"..." },
      "image_url": "string",
      "severity_hint": "low"|"medium"|"high",
      "active": true
    }
  - Response 201: created symptom object (as above)

- PUT /symptoms/{id}
  - Roles: pakar_author, admin
  - Request: partial fields (same schema)
  - Response 200: updated object

3) DISEASES & TREATMENTS
- GET /diseases
  - Response: [ { "id":1, "name":"Bud Rot", "summary": {i18n}, "severity_level":"high", "recommended_treatment_id": 3 } ]

- POST /diseases
  - Roles: pakar_author, admin
  - Request:
    {
      "name": "Bud Rot",
      "summary": { "en":"...", "id":"..." },
      "severity_level": "low"|"medium"|"high",
      "recommended_treatment_id": 5
    }
  - Response 201: created disease

- GET /treatments/{id}
  - Response:
    {
      "id": 5,
      "name": { "en":"Fungicide mix", "id":"Campuran fungisida" },
      "steps": [ { "en":"Step 1: ...", "id":"Langkah 1: ..." }, ... ],
      "emergency_actions": [ { "en":"Evacuate area", "id":"..." } ],
      "dosage": { "chemical":"X", "rate":"2 ml", "unit":"per tree", "per":"tree" },
      "safety_notes": { "en":"Use PPE", "id":"Gunakan APD" },
      "created_by": 10
    }

4) RULES & VERSIONING (Phase 2)
- POST /rules (create draft master)
  - Roles: pakar_author, admin
  - Request:
    {
      "code": "R-2026-001",       // unique
      "title": "Leaf spots + frass -> Disease X",
      "draft_version": {
        "antecedents": [ { "symptom_id": 12, "min_confidence": 0.2 }, { "symptom_id": 7, "min_confidence": 0.0 } ],
        "consequents": [ { "disease_id": 3, "cf": 0.8 } ],
        "notes": "Initial draft",
        "active": false
      }
    }
  - Response 201:
    {
      "rule_id": 100,
      "code": "R-2026-001",
      "current_version_id": null,
      "draft_version_id": 200
    }

- POST /rules/{rule_id}/versions (create new version draft)
  - Roles: pakar_author
  - Request:
    {
      "antecedents": [ { "symptom_id": 12, "min_confidence": 0.2 } ],
      "consequents": [ { "disease_id": 3, "cf": 0.85 } ],
      "notes": "Tuned CF",
      "active": true
    }
  - Response 201:
    {
      "version_id": 201,
      "rule_id": 100,
      "version_number": 3,
      "status": "draft",
      "created_by": 10,
      "created_at": "2026-05-03T..."
    }

- POST /rules/{rule_id}/versions/{version_id}/submit_for_review
  - Roles: pakar_author
  - Request: { "reviewers": [ user_id ], "comment": "Please review" }
  - Response 202: { "review_id": 9001, "status":"pending" }

- POST /rules/{rule_id}/versions/{version_id}/approve
  - Roles: pakar_reviewer, admin
  - Request:
    { "approved": true, "notes": "OK" }
  - Response 200:
    {
      "version_id": 201,
      "status": "published",
      "published_at": "2026-05-04T...",
      "published_by": 12
    }
  - Side effect: rule.master.current_version_id updated; audit entry created in rule_changes.

- GET /rules
  - Query: ?active=true&include_versions=true
  - Response: [ { "id":100, "code":"R-2026-001", "current_version": {version payload}, "draft_version": {...} } ]

- PUT /rules/{rule_id}
  - Roles: pakar_author (creates new version) or admin (can force publish)
  - Request: partial — creates new version; payload same as versions schema.
  - Response: new version metadata (201)

Version payload (rule_version)
  {
    "version_id": 201,
    "rule_id": 100,
    "version_number": 3,
    "antecedents": [ { "symptom_id":12, "min_confidence":0.2 } ],
    "consequents": [ { "disease_id":3, "cf": 0.85 } ],
    "notes": "tuned",
    "active": true,
    "status": "draft" | "published" | "archived",
    "created_by": 10,
    "created_at": "..."
  }

- GET /rules/{rule_id}/versions/{version_id}/diff
  - Roles: pakar_reviewer, admin
  - Response:
    {
      "base_version_id": 200,
      "compare_version_id": 201,
      "diff": {
        "antecedents_added": [...],
        "antecedents_removed": [...],
        "consequents_changed": [...]
      }
    }

5) RULE SANDBOX & SIMULATION
- POST /rules/{version_id}/simulate (single)
  - Roles: pakar_author, pakar_reviewer, admin
  - Request:
    {
      "inputs": [ { "symptom_id": 12, "user_confidence": 0.6 }, { "symptom_id": 7, "user_confidence": 0.2 } ]
    }
  - Response 200:
    {
      "rule_version_id": 201,
      "rule_fired": true,
      "antecedent_matches": [ { "symptom_id":12, "min_confidence":0.2, "user_confidence":0.6 } ],
      "rule_cf_contribution": 0.48,   // user_confidence * rule.cf
      "explanation": "Both antecedents satisfied."
    }

- POST /sandbox/simulate_batch
  - Roles: pakar_author, pakar_reviewer, admin
  - Request:
    {
      "version_id": 201,
      "cases": [
        { "case_label": "sample1", "inputs":[ {"symptom_id":12,"user_confidence":0.6} ] },
        ...
      ],
      "async": true   // if true returns job_id
    }
  - Response 202 (async):
    { "job_id": "job-xxx", "estimated_time_sec": 45 }
  - Poll /jobs/{job_id}/results to get aggregated stats:
    {
      "job_id":"job-xxx",
      "status":"completed",
      "cases_run": 100,
      "aggregate": { "mean_cf":0.32, "median_cf":0.25, "percentiles": { "p90":0.65 } },
      "samples": [ { "case_label":"sample1", "cf":0.48 }, ... ]
    }

6) DIAGNOSIS ENGINE
- POST /diagnose
  - Roles: farmer, officer, pakar, guest (limited)
  - Request:
    {
      "user_id": 123 | null,
      "metadata": { "plot_id": "PLOT-1", "geolocation": { "lat":-1.234, "lon":103.45 }, "timestamp": "2026-05-05T10:00:00Z", "notes":"small necrosis", "images": [ "https://..." ] },
      "symptoms": [ { "symptom_id": 12, "user_confidence": 0.6 }, { "symptom_id": 7, "user_confidence": 0.2 } ],
      "max_results": 5,
      "rule_version_selection": "published" | "latest" | { "rules": [ { "rule_id":100, "version_id":201 } ] }   // optional override
    }
  - Processing:
    - Resolve rule versions: if explicit selection provided, use those; otherwise use current published versions.
    - Forward chaining: select rules whose antecedents matched by inputs and input >= min_confidence.
    - For each rule firing: CF_rule = user_confidence * rule.cf (rule.cf ∈ [-1.0,1.0]).
    - Combine CFs per disease:
      - Combine positives: CFcombined = CF1 + CF2*(1-CF1)
      - Combine negatives/inhibitors handled similarly per standard CF logic.
    - Mark emergency_flag if any disease.severity_level == high AND cf_score >= 0.7 (configurable threshold).
    - Persist diagnosis_case with engine_trace and rule_version_ids.
  - Response 200:
    {
      "case_id": 555,
      "diagnoses": [
        {
          "disease_id": 3,
          "name": { "en":"Bud Rot", "id":"..." },
          "cf_score": 0.82,
          "cf_percent": 82,
          "severity":"high",
          "treatment_id": 5,
          "rules_traced": [
            {
              "rule_id": 100,
              "rule_version_id": 201,
              "rule_cf_contribution": 0.48,
              "antecedent_matches": [ { "symptom_id":12, "user_confidence":0.6 } ]
            }
          ]
        }
      ],
      "charts": { "top_n": [ { "disease":"Bud Rot", "cf":0.82 } ] },
      "emergency_flag": true,
      "diagnosis_time_ms": 280
    }
  - Side effects:
    - Creates diagnosis_cases record (persist inputs, engine_trace snapshot, rule_version references).
    - Emits webhook event case_created (async).
    - Cached rule index hit counters updated.

- POST /diagnose/preview (no persistence)
  - Roles: pakar_author, pakar_reviewer, admin
  - Request: same as /diagnose
  - Response: same as /diagnose but no case_id and engine_trace not stored.

- POST /cases/{case_id}/reprocess
  - Roles: admin, pakar_reviewer, ops
  - Request:
    {
      "rule_version_map": "latest" | { "rule_id": version_id, ... },   // optional override
      "async": true
    }
  - Response 202:
    { "reprocess_job_id": "rp-1234", "status":"queued" }
  - Job result accessible via GET /jobs/{id}, and results update diagnosis_case.reprocess_history. Original case preserved.

7) CASES & VALIDATION
- GET /cases
  - Query params: ?user_id=&status=&validated=&limit=&offset=
  - Response: [ { "case_id":555, "user_id":123, "created_at":"...", "summary": {top diagnosis}, "validated": false } ]

- GET /cases/{case_id}
  - Response: full case:
    {
      "case_id": 555,
      "user_id": 123,
      "metadata": {...},
      "inputs": [ { "symptom_id":12, "user_confidence":0.6 } ],
      "engine_trace": {
        "timestamp": "2026-05-05T10:00:00Z",
        "rules_fired": [
          { "rule_id":100, "version_id":201, "antecedent_matches":[...], "rule_cf_contribution":0.48 }
        ],
        "rule_version_snapshot": [ { "rule_id":100, "version_id":201, "payload": {...} } ]
      },
      "diagnoses": [...],
      "emergency_flag": true,
      "created_at": "2026-05-05T10:00:01Z",
      "reprocess_history": [ { "job_id":"rp-1","status":"completed","result_summary": {...} } ],
      "validated": false
    }

- POST /cases/{case_id}/validate
  - Roles: pakar_reviewer
  - Request:
    {
      "validated_disease_id": 3,
      "agreement": true,
      "note": "Agrees with diagnosis, adjust rule R-xxx CF to 0.9",
      "adjust_weights": [ { "rule_id":100, "version_id":201, "new_cf":0.9 } ]   // optional suggestion; deferred review
    }
  - Response 200:
    {
      "validation_id": 999,
      "case_id": 555,
      "validated_by": 12,
      "agreement": true,
      "timestamp":"2026-05-05T12:00:00Z"
    }
  - Side effects: creates case_validations record; optionally triggers rule review workflow if adjust_weights present.

8) RULE/BULK IMPORT & EXPORT
- POST /rules/import
  - Roles: pakar_author, admin
  - Request multipart/form-data: file: rules.json or rules.csv, options: { "dry_run": true }
  - Response 200 (dry_run):
    {
      "imported": 0,
      "errors": [ { "row":2, "error":"unknown symptom_id 999" } ]
    }
  - Response 201 (applied):
    { "created_rules_count": 12, "created_versions": 12, "jobs": [ { "job_id":"imp-1" } ] }

- GET /rules/export
  - Roles: pakar_reviewer, admin
  - Query: ?format=json|csv&since_version=
  - Response: application/json or csv file. For async large exports use /jobs pattern.

9) REPORTS & METRICS
- GET /reports/accuracy
  - Roles: pakar_reviewer, admin, ops
  - Query params: ?from=ISO&to=ISO&group_by=disease|rule
  - Response:
    {
      "from":"2026-04-01","to":"2026-04-30",
      "agreement_rate": 0.72,
      "per_disease": [ { "disease_id":3, "agreement":0.81, "cases":120 } ],
      "rule_hit_counts":[ { "rule_id":100, "hits": 45 } ]
    }

- GET /metrics/summary
  - Roles: ops
  - Response: Prometheus-formatted metrics or JSON snapshot:
    { "diagnose_p95_ms": 560, "cases_per_hour": 34, "rule_firing_rate": 1200 }

10) JOBS & ASYNC
- GET /jobs/{job_id}
  - Roles: requester or ops
  - Response: { "job_id":"rp-123","status":"completed","started_at":"...","completed_at":"...", "result_url":"https://..." }

11) MEDIA & WEBHOOKS
- POST /media/upload
  - Roles: authenticated
  - Content-Type: multipart/form-data
  - Response 201:
    { "id": 44, "url": "https://cdn.example.com/media/44.jpg", "created_at":"..." }

- CRUD webhooks
  - POST /webhooks
    Request:
    {
      "url": "https://hooks.example.com/case",
      "events": [ "case_created", "case_validated" ],
      "secret": "optional"
    }
    Response: { "webhook_id": 77, "active": true }

  - Webhook delivery: asynchronous with retry (exponential backoff); deliveries logged.

12) ADMIN / OPERATIONS
- POST /admin/maintenance/reindex_rules
  - Roles: ops
  - Request: { "force": true }
  - Response: { "status": "queued", "job_id": "idx-123" }

- GET /admin/audit_logs
  - Roles: admin, ops
  - Query: ?entity=rules|cases&since=
  - Response: [ { "id": 1, "actor_id": 12, "action":"rule_published","details": {...}, "timestamp":"..." } ]

ENTITY RELATIONSHIP DIAGRAM (Mermaid erDiagram)

erDiagram
  USERS {
    int id PK
    string name
    string email
    string password_hash
    string role
    timestamptz created_at
    bool active
  }
  SYMPTOMS {
    int id PK
    string code
    jsonb label_i18n
    jsonb description_i18n
    string image_url
    string severity_hint
    bool active
    int created_by FK
    timestamptz created_at
  }
  DISEASES {
    int id PK
    string name
    jsonb summary_i18n
    string severity_level
    int recommended_treatment_id FK
    timestamptz created_at
  }
  TREATMENTS {
    int id PK
    jsonb name_i18n
    jsonb steps
    jsonb emergency_actions
    jsonb dosage
    jsonb safety_notes
    int created_by FK
    timestamptz created_at
  }
  RULES_MASTER {
    int id PK
    string code
    string title
    int current_version_id FK
    int draft_version_id FK
    timestamptz created_at
    int created_by FK
  }
  RULE_VERSIONS {
    int id PK
    int rule_id FK
    int version_number
    jsonb antecedents
    jsonb consequents
    text notes
    bool active
    string status
    int created_by FK
    timestamptz created_at
    int previous_version_id FK
  }
  RULE_CHANGES {
    int id PK
    int rule_version_id FK
    int changed_by FK
    jsonb diff
    timestamptz timestamp
  }
  DIAGNOSIS_CASES {
    int id PK
    int user_id FK
    jsonb metadata
    jsonb inputs
    jsonb engine_trace
    jsonb diagnoses
    bool emergency_flag
    bool validated
    int validated_by FK
    text validation_note
    timestamptz created_at
  }
  CASE_VALIDATIONS {
    int id PK
    int case_id FK
    int validated_by FK
    int validated_disease_id FK
    bool agreement
    text note
    timestamptz timestamp
  }
  MEDIA {
    int id PK
    int case_id FK
    string url
    int uploaded_by FK
    timestamptz created_at
  }
  METRICS_CACHE {
    string key PK
    jsonb payload
    timestamptz updated_at
  }

  USERS ||--o{ SYMPTOMS : created_by
  USERS ||--o{ TREATMENTS : created_by
  USERS ||--o{ RULES_MASTER : created_by
  RULES_MASTER ||--o{ RULE_VERSIONS : rule_id
  RULE_VERSIONS ||--o{ RULE_CHANGES : rule_version_id
  USERS ||--o{ RULE_CHANGES : changed_by
  USERS ||--o{ DIAGNOSIS_CASES : user_id
  DIAGNOSIS_CASES ||--o{ CASE_VALIDATIONS : case_id
  USERS ||--o{ CASE_VALIDATIONS : validated_by
  DISEASES ||--o{ TREATMENTS : recommended_treatment_id
  DIAGNOSIS_CASES ||--o{ MEDIA : case_id
  USERS ||--o{ MEDIA : uploaded_by

DB SCHEMA TABLES (Postgres types, core columns, constraints & indexes)

Table: users
- id SERIAL PRIMARY KEY
- name TEXT NOT NULL
- email TEXT NOT NULL UNIQUE
- password_hash TEXT NOT NULL
- role TEXT NOT NULL CHECK (role IN ('farmer','officer','pakar_author','pakar_reviewer','admin','ops'))
- created_at TIMESTAMPTZ NOT NULL DEFAULT now()
- active BOOLEAN NOT NULL DEFAULT true
Indexes:
- unique(email)

Table: symptoms
- id SERIAL PRIMARY KEY
- code TEXT NOT NULL UNIQUE
- label_i18n JSONB NOT NULL              -- { "en":"", "id":"" }
- description_i18n JSONB
- image_url TEXT
- severity_hint TEXT CHECK (severity_hint IN ('low','medium','high'))
- active BOOLEAN NOT NULL DEFAULT true
- created_by INTEGER REFERENCES users(id) ON DELETE SET NULL
- created_at TIMESTAMPTZ DEFAULT now()
Indexes:
- UNIQUE(code)
- GIN INDEX on label_i18n, description_i18n for i18n search

Table: diseases
- id SERIAL PRIMARY KEY
- name TEXT NOT NULL UNIQUE
- summary_i18n JSONB
- severity_level TEXT CHECK (severity_level IN ('low','medium','high'))
- recommended_treatment_id INTEGER REFERENCES treatments(id) ON DELETE SET NULL
- created_at TIMESTAMPTZ DEFAULT now()
Indexes:
- unique(name)
- GIN on summary_i18n

Table: treatments
- id SERIAL PRIMARY KEY
- name_i18n JSONB NOT NULL
- steps JSONB NOT NULL   -- ordered array of localized step objects
- emergency_actions JSONB
- dosage JSONB           -- { chemical, rate, unit, per }
- safety_notes JSONB
- created_by INTEGER REFERENCES users(id) ON DELETE SET NULL
- created_at TIMESTAMPTZ DEFAULT now()
Indexes:
- GIN on steps, emergency_actions, dosage

Table: rules_master
- id SERIAL PRIMARY KEY
- code TEXT NOT NULL UNIQUE
- title TEXT
- current_version_id INTEGER REFERENCES rule_versions(id) ON DELETE SET NULL
- draft_version_id INTEGER REFERENCES rule_versions(id) ON DELETE SET NULL
- created_by INTEGER REFERENCES users(id)
- created_at TIMESTAMPTZ DEFAULT now()
Indexes:
- unique(code)

Table: rule_versions
- id SERIAL PRIMARY KEY
- rule_id INTEGER NOT NULL REFERENCES rules_master(id) ON DELETE CASCADE
- version_number INTEGER NOT NULL
- antecedents JSONB NOT NULL    -- [ { symptom_id:int, min_confidence:float } ]
- consequents JSONB NOT NULL    -- [ { disease_id:int, cf:float } ]
- notes TEXT
- active BOOLEAN DEFAULT true
- status TEXT CHECK (status IN ('draft','published','archived')) DEFAULT 'draft'
- created_by INTEGER REFERENCES users(id)
- created_at TIMESTAMPTZ DEFAULT now()
- previous_version_id INTEGER REFERENCES rule_versions(id) ON DELETE SET NULL
Indexes:
- (rule_id, version_number) UNIQUE
- GIN on antecedents, consequents for querying symptom/disease usage

Table: rule_changes
- id SERIAL PRIMARY KEY
- rule_version_id INTEGER REFERENCES rule_versions(id)
- changed_by INTEGER REFERENCES users(id)
- diff JSONB NOT NULL
- timestamp TIMESTAMPTZ DEFAULT now()
Indexes:
- index on rule_version_id

Table: diagnosis_cases
- id BIGSERIAL PRIMARY KEY
- user_id INTEGER REFERENCES users(id) NULL
- metadata JSONB    -- plot_id, geolocation, images
- inputs JSONB      -- [ { symptom_id, user_confidence } ]
- engine_trace JSONB -- rules_fired with rule_version snapshots
- diagnoses JSONB   -- final ranked diagnoses
- emergency_flag BOOLEAN DEFAULT false
- validated BOOLEAN DEFAULT false
- validated_by INTEGER REFERENCES users(id) NULL
- validation_note TEXT
- created_at TIMESTAMPTZ DEFAULT now()
Indexes:
- GIN index on inputs, engine_trace, diagnoses for query/filter
- index on user_id, created_at

Table: case_validations
- id SERIAL PRIMARY KEY
- case_id BIGINT REFERENCES diagnosis_cases(id) ON DELETE CASCADE
- validated_by INTEGER REFERENCES users(id)
- validated_disease_id INTEGER REFERENCES diseases(id)
- agreement BOOLEAN
- note TEXT
- timestamp TIMESTAMPTZ DEFAULT now()
Indexes:
- index on case_id

Table: media
- id BIGSERIAL PRIMARY KEY
- case_id BIGINT REFERENCES diagnosis_cases(id) NULL
- url TEXT NOT NULL
- uploaded_by INTEGER REFERENCES users(id)
- created_at TIMESTAMPTZ DEFAULT now()
Indexes:
- index on case_id

Table: metrics_cache
- key TEXT PRIMARY KEY
- payload JSONB
- updated_at TIMESTAMPTZ

Operational/Analytics Tables (optional, denormalized)
- diagnosis_rule_fire (for analytics)
  - id BIGSERIAL PK
  - case_id BIGINT REFERENCES diagnosis_cases(id)
  - rule_id INTEGER
  - rule_version_id INTEGER
  - disease_id INTEGER
  - cf_contribution FLOAT
  - fired_at TIMESTAMPTZ
  - index on rule_version_id, disease_id

Indexes & Performance Notes
- GIN indexes on JSONB fields (antecedents, consequents, inputs, engine_trace) for fast symptom/disease queries.
- Partial indexes on rule_versions WHERE status='published' for fast published-version lookups.
- Use connection pooling (pgbouncer) to handle serverless concurrency.
- Use materialized views for heavy reports (refreshed by scheduled jobs).
- Archive old cases to cheaper storage if size grows beyond limits; keep metadata + engine_trace compressed.

Audit, Versioning & Traceability
- Each rule change produces a rule_version and rule_changes record with diff JSONB.
- diagnosis_cases.engine_trace stores snapshot of rule_version payloads used (rule_id + version_id + payload) to ensure immutable provenance.
- Reprocessing writes entries to diagnosis_cases.reprocess_history with job_id and version_map used.

DATA MIGRATION / BACKWARD COMPATIBILITY
- Existing PRD schema using rules table with version int and previous_rule_id is compatible — implement migration that creates rules_master and moves existing rules into rule_versions preserving version numbers and previous_rule_id relationships.

SECURITY & RBAC
- Enforce RBAC in API middleware; critical endpoints require pakar_reviewer or admin.
- Row-level security policies for multi-tenant scenarios.
- All sensitive action endpoints (publish rule, reprocess case, adjust weight) recorded in audit logs (admin_audit table or external logging).

OPERATIONAL RUNBOOK HIGHLIGHTS
- Rolling deploys with canary for backend.
- Alert thresholds: diagnose_p95_ms > 2s, error rate > 1%, queue backlog > 500 jobs.
- Backup schedule: nightly DB backups + weekly exports.

TIE-BACK TO PRD
- FR1/FR2: Diagnosis endpoint /diagnose implements Forward Chaining + CF contributions; per-symptom confidence in inputs (0.0–1.0). Response returns ranked diagnoses with CF% and provenance (engine_trace.rule_fired entries).
- FR3: Responses include cf_percent, severity string, emergency_flag for UI to color-code and surface emergency actions; treatments are linked by treatment_id.
- FR4: Admin CRUD extended with rule versioning, draft/publish, sandbox endpoints (/rules/{id}/versions, /rules/{version}/simulate).
- FR5: diagnosis_cases stores full inputs, engine_trace and rule_version snapshots; rule_changes store diff and audit (NFR4 satisfied).
- FR6: Reporting endpoints & scheduled metrics implement accuracy tracking and rule usage.
- FR7: Export endpoints and /cases/export & /rules/export provide offline-selectable bundles (JSON/CSV) and webhooks for integrability.

ACCEPTANCE CHECKS FOR DELIVERY
- Automated test coverage for CF combination logic with edge cases (negative CFs, inhibitors).
- Load test report demonstrating /diagnose median < 2s for 500 rules.
- UI integration smoke: sample case flow from symptom selection → diagnose → case saved → pakar validation via /cases/{id}/validate.
- Rule approval workflow: create version → submit → approve publishes current_version_id and logs rule_change diff.

END OF PHASE 2 SPECIFICATION.

---

UI/UX Structure — main screens, components, data flows, and developer notes

1) Primary screens (phase 3 focus)
- Auth / Landing
  - Purpose: language select, quick guest flow, login/register.
  - Key components: Language selector, role-aware CTA (Farmer / Officer / Pakar), Guest Quick-Start.
  - API: POST /auth/login, /auth/register
  - States: offline/guest, auth-expired, role-mismatch.

- Symptom Capture (Simple & Advanced)
  - Purpose: let farmer/officer select visible symptoms, set per-symptom confidence (0–100%), attach images/metadata.
  - Primary components:
    - SymptomCatalogGrid: card per symptom (image, label, severity_hint tag, tag for active/archived).
    - SelectedSymptomsList: compact list with editable confidence slider (0–100%) and note link, reorder for priority.
    - MetadataBar: plot_id, geolocation, timestamp, add images.
    - SubmitBar: Diagnose (preview/persist), Save Case toggle, Guest warning tooltip.
  - API: GET /symptoms?q=&lang=, POST /media/upload, POST /diagnose
  - States: loading catalog, no-symptoms-selected, validation errors (no confidence supplied), offline.
  - Accessibility: large tappable cards, keyboard focus order, aria-labelledby for symptom cards, slider labels with numeric input fallback.
  - Performance: lazy-load symptom images, cache GET /symptoms per locale, debounce search.

- Diagnosis Results
  - Purpose: display ranked diagnoses with CF%, severity color-coding, provenance, safety/treatment, and emergency actions.
  - Primary components:
    - EmergencyBanner (prominent when emergency_flag).
    - TopDiagnosesList: ranked list with progress bars (cf_percent), severity pill, confidence interval.
    - ChartPanel: horizontal bar chart for top-N, export PNG/CSV.
    - RuleProvenancePane: collapsible list/tree showing rules fired, per-rule CF contribution and symptom matches.
    - TreatmentPlanAccordion: steps, emergency actions, dosage card, safety notes.
    - ActionsBar: Save Case (if not saved), Request Expert Review, Share/Export, Re-run with adjusted confidences (opens modal).
  - API: response from POST /diagnose (case_id + diagnoses + engine_trace), GET /treatments/{id}, POST /cases/{id}/validate
  - States: computing (spinner + progress hint), empty-results fallback, backend error.
  - Accessibility: color contrast for severity badges, ARIA expand/collapse for provenance and treatment steps.
  - Performance: render only top 5 by default; load detailed provenance on expand; keep response rendering under 200ms.

- Case Details / Audit (Case Viewer)
  - Purpose: full immutable snapshot for audit; show inputs, rule_version snapshot, timeline (reprocesses, validations).
  - Primary components: CaseHeader (meta, map), InputsTable, EngineTraceViewer (JSON toggle / humanized), ReprocessHistory, ValidationPanel (submit validation, diff suggestions).
  - API: GET /cases/{case_id}, POST /cases/{id}/validate, POST /cases/{id}/reprocess
  - States: read-only archived, editable validation (pakar reviewer), history large (paginate).
  - Notes: provide "View rule versions" link that shows exact rule JSON used.

- Admin / Pakar: Rule List & Rule Versioning
  - Purpose: manage rule masters and versions (create drafts, submit for review, publish), view diffs, search by symptom/disease usage.
  - Primary components: RuleMasterTable (code, title, status, current_version_number), QuickActions (create version, view history), FilterBar (by symptom/disease).
  - API: GET /rules?include_versions, POST /rules, GET /rules/{id}/versions

- Admin / Rule Version Editor & Sandbox
  - Purpose: edit antecedents/consequents, set min_confidence and rule.cf, version controls, simulate against sample inputs or batch.
  - Primary components:
    - VersionHeader (status: draft/pending/published, publish button).
    - AntecedentsEditor: symptom selector, min_conf slider, optional/required toggle, drag reorder.
    - ConsequentsEditor: disease selector, cf input (-1.0…1.0), rationale notes.
    - SandboxPanel: quick simulate button (single case) and batch sandbox (upload CSV or generate synthetic cases), results preview with CF contribution and histograms.
    - VersionHistorySidebar: diff viewer and reviewer comments.
  - API: POST /rules/{id}/versions, POST /rules/{version_id}/simulate, POST /sandbox/simulate_batch
  - States: draft, pending review, published, archived.
  - Notes: edits create new version record; publishing triggers audit diff.

- Reports & Monitoring
  - Purpose: KPIs (agreement_rate, rule_hits, diagnose latency), export and schedule.
  - Primary components: Time-range selector, KPI tiles, interactive per-rule/per-disease charts, export buttons.
  - API: GET /reports/accuracy, GET /metrics/summary

2) Component map (React / Next.js structure)
- Pages
  - / (Landing)
  - /login, /register
  - /symptoms (Symptom Capture)
  - /diagnose/result?case_id= (Diagnosis Results)
  - /cases/[id] (Case Details)
  - /admin/rules (Rule Master list)
  - /admin/rules/[id]/versions/[vid] (Rule Version Editor)
  - /admin/reports

- Key components (props/state highlights)
  - SymptomCard { id, label_i18n, image_url, severity_hint, active } — state: selected:boolean, userConfidence:number
  - SelectedSymptomRow { symptom, userConfidence, note } — emits onConfidenceChange(symptomId, 0..1)
  - DiagnoseForm { userId|null, metadata, symptoms[], max_results, rule_version_selection } — POST /diagnose
  - DiagnosisList { diagnoses[] } — expects diagnoses[].rules_traced[] for provenance
  - RuleEditor { ruleMasterId|null, versionId|null, mode: draft/edit } — uses POST /rules/{id}/versions
  - SandboxRunner { versionId, inputs[] } — POST /rules/{versionId}/simulate

- Data shapes mapping (examples)
  - Symptom selection payload (client -> /diagnose):
    {
      user_id: 123 | null,
      metadata: { plot_id: "P1", geolocation: {lat,lon}, timestamp: ISO, notes, images: [url] },
      symptoms: [ { symptom_id: 12, user_confidence: 0.6 }, ... ],
      max_results: 5
    }
  - Diagnosis response (for UI):
    {
      case_id: 555,
      diagnoses: [
        { disease_id:3, name:{en:"Bud Rot"}, cf_score:0.82, cf_percent:82, severity:"high", treatment_id:5,
          rules_traced: [ { rule_id:100, rule_version_id:201, rule_cf_contribution:0.48, antecedent_matches:[{symptom_id:12,user_confidence:0.6}] } ]
        }
      ],
      charts: { top_n:[{disease:"Bud Rot",cf:0.82}] },
      emergency_flag: true,
      diagnosis_time_ms: 280
    }

3) UX patterns and interactions
- Two modes in symptom capture: Simple Mode (default): image-led symptom catalog, default confidence 80% with easy slider; Advanced Mode: show min_conf thresholds per symptom, allow bulk edit, allow negative indicators.
- Progressive disclosure: show top 1–3 diagnoses at glance; expand for provenance and full treatment.
- Emergency prominence: if emergency_flag true then show modal/banner with emergency actions and Require Acknowledge button before proceeding.
- Undo / re-run: user can adjust per-symptom confidences inline on results page and re-run preview (POST /diagnose with preview flag) — no persist.
- Auditability: every save publishes a case_id and shows rule_version_id links; provide "Download case bundle (JSON + media)" action.
- Admin workflows: drafts require Submit for Review; reviewers see diffs (highlight changed antecedents/consequents) and either Approve (publish) or Request Changes.

4) Accessibility, i18n, security
- i18n: all labels use i18n keys from DB; language selector persisted in user profile/localStorage.
- Accessibility: keyboard-first flows for symptom selection; sliders with numeric input alternative; color-coding combined with icons/text for severity.
- Security: confirm actions for publish/reprocess; role-based UI show/hide but enforce server-side.

--------------------
ASCII wireframes (most critical screens)
- Wireframes are mobile-first, annotated with component names and API hooks.

Symptom Capture (mobile / tablet view)

```text
+──────────────────────────────────────────────────────────+
| Header: [Back]  PalmCare  | Language ▼ | (User Avatar)  |
+──────────────────────────────────────────────────────────+
| Metadata Bar: Plot: [PLOT-12]  [Geo-pin]  Time: 10:34     |
| Notes: [short note...]  [Attach Image +]                 |
+──────────────────────────────────────────────────────────+
| Search [🔍]    Filters: [All][Leaves][Fruit][Stem]       |
+──────────────────────────────────────────────────────────+
| Symptom Catalog (scroll)                                |
|  ┌────────────┐  ┌────────────┐  ┌────────────┐          |
|  | Img        |  | Img        |  | Img        |          |
|  | "Leaf spot"|  | "Frass"    |  | "Yellowing"|          |
|  | severity🔴 |  | severity🟠 |  | severity🟡 |          |
|  └────────────┘  └────────────┘  └────────────┘          |
|  [tap card to select -> pushes to Selected list]         |
+──────────────────────────────────────────────────────────+
| Selected Symptoms (sticky bottom summary)               |
|  ┌────────────────────────────────────────────────────┐  |
|  | Selected: 3 | [Edit] [Clear all]                   |  |
|  | 1) Leaf spot    ○ Confidence: [====== 80% ] (num)   |  |
|  | 2) Frass        ○ Confidence: [===   35% ] (num)   |  |
|  | 3) Yellowing    ○ Confidence: [=     10% ] (num)   |  |
|  | [Diagnose ▶]   [Save Case ☐]  [Preview (no save)]  |  |
|  └────────────────────────────────────────────────────┘  |
+──────────────────────────────────────────────────────────+
Notes:
- SymptomCatalog uses GET /symptoms?lang=
- On Diagnose: build payload and POST /diagnose
- Images uploaded to POST /media/upload before POST /diagnose
```

Diagnosis Results (desktop wide layout; responsive collapse to single column)

```text
+─────────────────────────────────────────────────────────────────────────+
| Header: PalmCare  | Case #555 | [Save Case] [Request Expert] [Export]  |
+─────────────────────────────────────────────────────────────────────────+
| EmergencyBanner (if emergency_flag)                                     |
|  ┌───────────────────────────────────────────────────────────────────┐  |
|  | ⚠ EMERGENCY: High-severity condition likely (82% Bud Rot)        |  |
|  | Quick actions: [Evacuate field] [Apply emergency action] [Call]   |  |
|  └───────────────────────────────────────────────────────────────────┘  |
+─────────────────────────────────────────────────────────────────────────+
| Left column (60%)                         | Right column (40%)         |
| ----------------------------------------- | ------------------------- |
| Top Diagnoses List                        | Chart Panel               |
| ┌───────────────────────────────────────┐| ┌───────────────────────┐ |
| | 1 Bud Rot        82%  [██████████ ]  | | | Bar chart top-5       | |
| |    severity: HIGH  (Treatment ID:5)  | | | - Bud Rot 82%         | |
| |    [View provenance] [Share]         | | | - Leaf Blight 34%     | |
| | 2 Leaf Blight    34%  [████      ]   | | |                       | |
| | 3 Nutrient Def.  12%  [█         ]   | | | ⤓ Export CSV / PNG    | |
| └───────────────────────────────────────┘| └───────────────────────┘ |
|                                           |                          |
| [Expand: Provenance & Rules Fired]        | Treatment Plan (accordion)|
| ┌───────────────────────────────────────┐| ┌───────────────────────┐ |
| | Rule R-100 (v201) → contribution 0.48 | | Step 1: Remove debris  | |
| |  matched symptoms: Leaf spot (0.6)    | | Step 2: Apply fungicide | |
| |  [View rule JSON] [Suggest edit]      | | Dosage: 2ml per tree    | |
| | Rule R-110 (v198) → contribution 0.34 | | Emergency: Evacuate etc | |
| └───────────────────────────────────────┘| └───────────────────────┘ |
|                                                                           |
| Bottom Actions: [Adjust confidences & Re-run (preview)] [Request Review]  |
+─────────────────────────────────────────────────────────────────────────+
Notes:
- Data mapping: use diagnoses[].rules_traced for provenance.
- Provenance expanded loads rule payloads via GET /rules/{id}/versions/{vid}/diff or uses engine_trace snapshot from case.
```

Rule Version Editor + Sandbox (admin/pakar view)

```text
+─────────────────────────────────────────────────────────────────+
| Admin / Rule Editor: R-2026-001   [Status: DRAFT] [Submit] [Save]|
+─────────────────────────────────────────────────────────────────+
| Left: VersionHeader & History      | Right: Edit pane & Sandbox  |
| ---------------------------------- | ---------------------------|
| Rule Info:                         | Antecedents (editable list) |
|  Code: R-2026-001                  | ┌─────────────────────────┐ |
|  Title: Leaf spots + frass -> X    | | 1) [symptom select ▾]   | |
|  Created by: Alice 2026-05-01      | |    min_conf: [0.20]     | |
|  Current version: null             | |    required: [x]        | |
|  Versions:                          | |    [remove] [↑][↓]      | |
|   v2 draft (you) 2026-05-03  Edit  | | 2) [symptom select ▾]   | |
|   v1 published 2026-04-20  View    | └─────────────────────────┘ |
|                                     | Consequents (diseases)   |
|                                     | ┌─────────────────────────┐ |
|                                     | |  Bud Rot  [cf: 0.85]    | |
|                                     | |  [+ add disease] [notes]| |
|                                     | └─────────────────────────┘ |
|                                     | Notes: [long text area]  |
|                                     |                           |
|                                     | Sandbox: [Simulate]       |
|                                     | ┌─────────────────────────┐ |
|                                     | | Inputs: [symptom 12:0.6]| |
|                                     | | [Run] -> result: fired? | |
|                                     | | rule_cf_contribution:0. | |
|                                     | | [Run Batch] [Upload CSV]| |
|                                     | └─────────────────────────┘ |
+─────────────────────────────────────────────────────────────────+
Notes:
- On Save: POST /rules/{rule_id}/versions (creates draft)
- Submit: POST /rules/{id}/versions/{vid}/submit_for_review
- Simulate: POST /rules/{version_id}/simulate (returns rule_fired, contribution) – show inline result.
- Batch: POST /sandbox/simulate_batch (async job model)
```

Implementation guidance & developer checklist (practical)
- Map UI actions to endpoints explicitly:
  - Symptom selection → maintain local state of symptoms[] (id + confidence 0..1) before conversion to backend payload.
  - Before POST /diagnose upload images to POST /media/upload; attach returned URLs to metadata.images.
  - Results page must use engine_trace from response for provenance; do not fetch published rule versions for audit view unless user requests "view canonical rule" (use snapshot from engine_trace).
- Keep components small and pure; e.g., SelectedSymptomRow takes onChangeConfidence and onRemove handlers.
- Use optimistic UI for Save Case but rollback on 4xx/5xx; show toast with case_id on success.
- For Admin rule diffs, use a simple JSON diff util to produce human-readable antecedents/consequents changes; display side-by-side.
- Accessibility: ensure all interactive controls have aria-labels and keyboard operability. For sliders, provide numeric input fallback.
- Caching: cache /symptoms and /diseases per locale; invalidate cache on admin publish events via websocket or polling refresh.
- Error handling UX:
  - Diagnose timeout > 3s: show "still thinking" banner and allow retry; backend should return partial results when possible.
  - If rule_version mismatch on case reprocess, show a detailed compare view and let operator accept changes.

End.

dan buatkan jadi bahasa indonesia