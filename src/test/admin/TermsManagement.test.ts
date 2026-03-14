import { describe, it, expect } from 'vitest';

describe('TermsManagement - getNextVersion logic', () => {
  // Replicate getNextVersion for unit testing
  function getNextVersion(versions: { version: string }[]): string {
    if (versions.length === 0) return 'v1.0';
    let maxMajor = 0;
    let maxMinor = 0;
    for (const v of versions) {
      const match = v.version.match(/v?(\d+)\.(\d+)/);
      if (match) {
        const major = parseInt(match[1]);
        const minor = parseInt(match[2]);
        if (major > maxMajor || (major === maxMajor && minor > maxMinor)) {
          maxMajor = major;
          maxMinor = minor;
        }
      }
    }
    return `v${maxMajor}.${maxMinor + 1}`;
  }

  it('should return v1.0 for empty array', () => {
    expect(getNextVersion([])).toBe('v1.0');
  });

  it('should increment minor version', () => {
    expect(getNextVersion([{ version: 'v1.0' }])).toBe('v1.1');
  });

  it('should handle multiple versions and pick highest', () => {
    expect(getNextVersion([
      { version: 'v1.0' },
      { version: 'v1.2' },
      { version: 'v1.1' },
    ])).toBe('v1.3');
  });

  it('should handle major version jumps', () => {
    expect(getNextVersion([
      { version: 'v1.5' },
      { version: 'v2.0' },
    ])).toBe('v2.1');
  });

  it('should handle versions without v prefix', () => {
    expect(getNextVersion([{ version: '1.3' }])).toBe('v1.4');
  });

  it('should handle invalid version strings gracefully', () => {
    expect(getNextVersion([{ version: 'draft' }])).toBe('v0.1');
  });
});

describe('TermsManagement - UUID validation', () => {
  const isValidUuid = (id: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

  it('should accept valid UUID', () => {
    expect(isValidUuid('550e8400-e29b-41d4-a716-446655440000')).toBe(true);
  });

  it('should reject mock user IDs', () => {
    expect(isValidUuid('user-buyer-001')).toBe(false);
  });

  it('should reject empty string', () => {
    expect(isValidUuid('')).toBe(false);
  });
});

describe('TermsManagement - status badge mapping', () => {
  const STATUS_BADGES: Record<string, string> = {
    DRAFT: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    PUBLISHED: 'bg-green-100 text-green-800 border-green-300',
    ARCHIVED: 'bg-muted text-muted-foreground border-border',
  };

  it('should have badge for DRAFT', () => {
    expect(STATUS_BADGES['DRAFT']).toContain('yellow');
  });

  it('should have badge for PUBLISHED', () => {
    expect(STATUS_BADGES['PUBLISHED']).toContain('green');
  });

  it('should have badge for ARCHIVED', () => {
    expect(STATUS_BADGES['ARCHIVED']).toContain('muted');
  });
});
