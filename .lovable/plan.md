

# Terms & Conditions Management Module

## Overview

Full implementation of the T&C module per the functional spec: admin CRUD with version control, supplier acceptance enforcement, acceptance reporting, and audit logging.

## Database Schema

### Table: `terms_versions`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| version | text NOT NULL | e.g. "v1.0" |
| title | text NOT NULL | |
| content | text NOT NULL | Full T&C text |
| status | text NOT NULL | DRAFT / PUBLISHED / ARCHIVED |
| created_by | uuid | Admin who created |
| published_at | timestamptz | Set on publish |
| created_at | timestamptz | Default now() |

### Table: `user_terms_acceptance`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| user_id | uuid NOT NULL | |
| terms_version_id | uuid FK → terms_versions | |
| status | text NOT NULL | ACCEPTED / REJECTED |
| accepted_at | timestamptz | |
| ip_address | text | |
| created_at | timestamptz | Default now() |
| UNIQUE(user_id, terms_version_id) | | One record per user per version |

RLS: Authenticated users can read terms_versions. Only admins can insert/update terms_versions. Users can insert their own acceptance records and read their own.

## New Files

### Hooks
- **`useTermsVersions.ts`** — CRUD for terms versions (admin). Create draft, edit draft, publish (archives previous), list all versions.
- **`useTermsAcceptance.ts`** — Check if current user accepted latest published version. Accept/reject. Used for enforcement gate.

### Admin Components
- **`TermsManagement.tsx`** — Admin page: list all versions with status badges, create new draft, edit draft, publish button, version history table.
- **`TermsAcceptanceReport.tsx`** — Admin report: table of supplier users showing acceptance status per version, with filters (user, supplier, version, status).

### Supplier Components
- **`TermsAcceptancePage.tsx`** — Full-screen gate: shows title, version, published date, scrollable content, Accept/Reject buttons. Shown when supplier hasn't accepted latest version.

## Navigation & Routing Changes

### Admin side (`AuthenticatedWorkflowApp.tsx`)
- Add `'terms'` and `'terms-report'` to the `View` type.
- Add a "Terms" tab under admin navigation (with `FileCheck` icon).
- Render `TermsManagement` and `TermsAcceptanceReport` for those views.

### Supplier side (login gate)
- In `AuthenticatedWorkflowApp`, before rendering the main content for supplier/supplier_admin roles, check `useTermsAcceptance()`. If not accepted, render `TermsAcceptancePage` instead of the normal UI.

## Audit Logging

All actions call `logAuditEvent()` with appropriate event types:
- Admin: `TERMS_CREATED`, `TERMS_UPDATED`, `TERMS_PUBLISHED`, `TERMS_ARCHIVED`
- Supplier: `TERMS_VIEWED`, `TERMS_ACCEPTED`, `TERMS_REJECTED`

Update `AUDIT_EVENT_TYPES` in `useAuditLogs.ts` to include `TERMS_CREATED`, `TERMS_UPDATED`, `TERMS_PUBLISHED`, `TERMS_ARCHIVED`.

## Key Business Rules

1. Only one version can be PUBLISHED at a time — publishing archives the previous.
2. Only DRAFT versions are editable.
3. Supplier users must accept the latest published version to access the portal.
4. Rejecting terms blocks portal access with a message.
5. When a new version is published, all users must re-accept.

## Implementation Order

1. Database migration (2 tables + RLS)
2. Hooks (`useTermsVersions`, `useTermsAcceptance`)
3. Admin UI (TermsManagement + AcceptanceReport)
4. Supplier gate (TermsAcceptancePage)
5. Wire into AuthenticatedWorkflowApp navigation
6. Audit logging integration
7. Seed sample draft/published terms for demo

