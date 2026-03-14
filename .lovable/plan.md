

# Fix Terms Creation — Inline Form, Auto-fill, UUID Fix

## Issues Found

1. **Create fails** — `created_by` column is `uuid` type but receives mock ID `"user-buyer-001"`. Must send `null` when using mock auth.
2. **Form is in a dialog** — needs to be inline on the main screen.
3. **No auto-fill** — should pre-populate with sample T&C content.
4. **Buttons** — need "Save Draft" and "Publish" with status badge.

## Changes

### `src/components/admin/TermsManagement.tsx` — Full rewrite of flow

- Replace dialog-based create/edit with an **inline view** toggled by state (`'list' | 'create' | 'edit'`).
- When `view === 'create'` or `'edit'`, render the form directly on screen with Back button to return to list.
- **Auto-fill**: On create, pre-populate `content` with a sample T&C HTML template (headings, sections, numbered clauses).
- **Fix UUID**: Check if `user?.id` looks like a valid UUID before sending as `created_by`; otherwise send `null`.
- **Buttons at bottom of form**:
  - "Save Draft" — saves with status DRAFT
  - "Publish" — saves then immediately publishes (with confirmation dialog), shows green PUBLISHED badge
- In the version history table, keep Preview and Edit buttons as before.

### Key logic fix (UUID):
```typescript
const isValidUuid = (id: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-/.test(id);
const createdBy = user?.id && isValidUuid(user.id) ? user.id : null;
```

### Auto-fill template content:
Pre-populate with rich HTML including headings, numbered sections (Acceptance, User Accounts, Data Submission, IP, Confidentiality, Data Protection, Liability, Modifications, Governing Law, Contact) — similar to the existing v1.0 seed data but as HTML with `<h2>`, `<ol>`, `<p>` tags.

