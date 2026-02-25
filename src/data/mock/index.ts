// Central export for all mock data
// Design-first development - no database dependencies

export * from './users';
export * from './suppliers';
export * from './departments';
export * from './submissions';
export * from './tiers';

// Re-export commonly used types
export type { MockUser, MockRole, MockUserType, MockUserStatus } from './users';
export type { MockSupplier } from './suppliers';
export type { MockDepartment } from './departments';
export type { MockSubmission, MockDivision, MockWorkflowStatus, MockHistoryEntry } from './submissions';
export type { MockModule, MockTier } from './tiers';
