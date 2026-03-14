

# Audit Log Fixes: Add Supplier Code & Partner Columns, Remove Item/Document Events

## Summary

Three changes: add **Supplier Code** and **Supplier Partner** columns to the audit log table UI, and remove all item/document-related audit events (ITEM_CREATED, ITEM_UPDATED, ITEM_SUBMITTED, ITEM_APPROVED, ITEM_REJECTED, DOCUMENT_UPLOADED) since those belong to the item module and don't need auditing.

## Changes

### 1. Database — Delete item/document audit rows & update metadata with supplier info

- Delete all rows where `event_type` IN (`ITEM_CREATED`, `ITEM_UPDATED`, `ITEM_SUBMITTED`, `ITEM_APPROVED`, `ITEM_REJECTED`, `DOCUMENT_UPLOADED`)
- Update existing supplier-related rows to include `supplier_codes` (comma-separated if multiple) and `supplier_partner` in metadata where applicable (e.g., SUPPLIER_USER_ASSIGNED, USER_CREATED for external users)

### 2. Hook (`useAuditLogs.ts`)

- Remove `ITEM_*` and `DOCUMENT_UPLOADED` from `AUDIT_EVENT_TYPES`
- Remove `item` and `document` from `ENTITY_TYPES`

### 3. UI (`AuditLogViewer.tsx`)

- Add two new table columns after Email:
  - **Supplier Code** — reads `metadata.supplier_code` (or `metadata.supplier_codes` for comma-separated multiple codes)
  - **Supplier Partner** — reads `metadata.supplier_partner`
- Show "—" when not applicable (e.g., auth events, internal user events)
- Remove all `ITEM_*` and `DOCUMENT_UPLOADED` color mappings and `getDescription` cases
- Add these columns to the detail dialog as well

### 4. Mock data updates

Update metadata for supplier-related events to include realistic supplier codes and partner names:
- `SUPPLIER_USER_ASSIGNED`: add `supplier_codes: "10001"`, `supplier_partner: "Unilever Group"`
- `USER_CREATED` (external): add `supplier_codes: "83790, 34355"`, `supplier_partner: "Unilever Group"`
- `SUPPLIER_USER_REMOVED`: already has `supplier_code`, add `supplier_partner`
- Other supplier-context events get appropriate values

