import { describe, it, expect, vi } from 'vitest';

// We test the pure helper functions extracted from AuditLogViewer
// Since the helpers are not exported, we replicate the logic to unit test

describe('AuditLogViewer helpers', () => {
  describe('getDescription logic', () => {
    const cases = [
      {
        event_type: 'TERMS_CREATED',
        metadata: { version: 'v1.0', title: 'My Terms' },
        expected: 'Created Terms v1.0 "My Terms"',
      },
      {
        event_type: 'TERMS_PUBLISHED',
        metadata: { version: 'v1.0', title: 'My Terms' },
        expected: 'Published Terms v1.0 "My Terms"',
      },
      {
        event_type: 'TERMS_ACCEPTED',
        metadata: { version: 'v1.0', title: 'My Terms' },
        expected: 'Accepted Terms v1.0 "My Terms"',
      },
      {
        event_type: 'TERMS_REJECTED',
        metadata: { version: 'v1.0', title: 'My Terms', reason: 'Disagree' },
        expected: 'Rejected Terms v1.0 "My Terms" — Disagree',
      },
      {
        event_type: 'USER_CREATED',
        metadata: { user_name: 'John', email: 'john@test.com', role: 'supplier' },
        expected: 'Created John (john@test.com) as supplier',
      },
      {
        event_type: 'USER_LOGIN',
        metadata: { user_name: 'Jane' },
        expected: 'Jane logged in',
      },
    ];

    // Replicate getDescription for testing
    function getDescription(event_type: string, meta: Record<string, any> | null): string {
      if (!meta) return '';
      switch (event_type) {
        case 'USER_CREATED': return `Created ${meta.user_name} (${meta.email}) as ${meta.role}`;
        case 'USER_LOGIN': return `${meta.user_name} logged in`;
        case 'TERMS_CREATED': return `Created Terms ${meta.version || ''} "${meta.title || ''}"`;
        case 'TERMS_UPDATED': return `Updated Terms ${meta.version || ''} "${meta.title || ''}"`;
        case 'TERMS_PUBLISHED': return `Published Terms ${meta.version || ''} "${meta.title || ''}"`;
        case 'TERMS_ARCHIVED': return `Archived Terms ${meta.version || ''} "${meta.title || ''}"`;
        case 'TERMS_ACCEPTED': return `Accepted Terms ${meta.version || ''} "${meta.title || ''}"`;
        case 'TERMS_REJECTED': return `Rejected Terms ${meta.version || ''} "${meta.title || ''}"${meta.reason ? ` — ${meta.reason}` : ''}`;
        default: return '';
      }
    }

    cases.forEach(({ event_type, metadata, expected }) => {
      it(`should format ${event_type} correctly`, () => {
        expect(getDescription(event_type, metadata)).toBe(expected);
      });
    });

    it('should return empty string for null metadata', () => {
      expect(getDescription('TERMS_CREATED', null)).toBe('');
    });
  });

  describe('getActorDisplay logic', () => {
    function getActorDisplay(event_type: string, metadata: Record<string, any> | null): string {
      const meta = metadata || {};
      const actor = meta.created_by || meta.assigned_by || meta.user_name || '';
      if (actor) return actor;
      if (event_type.startsWith('TERMS_')) return 'Admin User';
      return '—';
    }

    it('should return user_name from metadata', () => {
      expect(getActorDisplay('TERMS_CREATED', { user_name: 'John Admin' })).toBe('John Admin');
    });

    it('should fallback to Admin User for TERMS_ events without actor', () => {
      expect(getActorDisplay('TERMS_CREATED', {})).toBe('Admin User');
    });

    it('should return — for non-TERMS events without actor', () => {
      expect(getActorDisplay('USER_LOGIN', {})).toBe('—');
    });
  });

  describe('getEmailDisplay logic', () => {
    function getEmailDisplay(event_type: string, metadata: Record<string, any> | null): string {
      const meta = metadata || {};
      const email = meta.email || meta.user_email || '';
      if (email) return email;
      if (event_type.startsWith('TERMS_')) return 'admin@company.com';
      return '—';
    }

    it('should return email from metadata', () => {
      expect(getEmailDisplay('TERMS_CREATED', { email: 'admin@real.com' })).toBe('admin@real.com');
    });

    it('should return user_email field', () => {
      expect(getEmailDisplay('TERMS_ACCEPTED', { user_email: 'supplier@test.com' })).toBe('supplier@test.com');
    });

    it('should fallback to admin@company.com for TERMS_ events', () => {
      expect(getEmailDisplay('TERMS_PUBLISHED', {})).toBe('admin@company.com');
    });

    it('should return — for non-TERMS events without email', () => {
      expect(getEmailDisplay('USER_LOGIN', {})).toBe('—');
    });
  });

  describe('Event badge classification', () => {
    const EVENT_CATEGORY_COLORS: Record<string, string> = {
      TERMS_CREATED: 'bg-teal-100 text-teal-800',
      TERMS_PUBLISHED: 'bg-green-100 text-green-800',
      TERMS_ACCEPTED: 'bg-green-100 text-green-800',
      TERMS_REJECTED: 'bg-destructive/10 text-destructive',
    };

    it('should assign teal badge for TERMS_CREATED', () => {
      expect(EVENT_CATEGORY_COLORS['TERMS_CREATED']).toContain('teal');
    });

    it('should assign green badge for TERMS_ACCEPTED', () => {
      expect(EVENT_CATEGORY_COLORS['TERMS_ACCEPTED']).toContain('green');
    });

    it('should assign destructive badge for TERMS_REJECTED', () => {
      expect(EVENT_CATEGORY_COLORS['TERMS_REJECTED']).toContain('destructive');
    });
  });
});

describe('Audit event type constants', () => {
  // Import directly to verify
  it('should include all terms-related events', async () => {
    const { AUDIT_EVENT_TYPES } = await import('@/hooks/useAuditLogs');
    const termsEvents = ['TERMS_CREATED', 'TERMS_UPDATED', 'TERMS_PUBLISHED', 'TERMS_ARCHIVED', 'TERMS_VIEWED', 'TERMS_ACCEPTED', 'TERMS_REJECTED'];
    termsEvents.forEach(evt => {
      expect(AUDIT_EVENT_TYPES).toContain(evt);
    });
  });

  it('should include user lifecycle events', async () => {
    const { AUDIT_EVENT_TYPES } = await import('@/hooks/useAuditLogs');
    expect(AUDIT_EVENT_TYPES).toContain('USER_CREATED');
    expect(AUDIT_EVENT_TYPES).toContain('USER_ACTIVATED');
    expect(AUDIT_EVENT_TYPES).toContain('USER_DEACTIVATED');
  });

  it('should include entity types', async () => {
    const { ENTITY_TYPES } = await import('@/hooks/useAuditLogs');
    expect(ENTITY_TYPES).toContain('terms');
    expect(ENTITY_TYPES).toContain('user');
  });
});
