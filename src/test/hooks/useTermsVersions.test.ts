import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock supabase
const mockSelect = vi.fn();
const mockInsert = vi.fn();
const mockUpdate = vi.fn();
const mockEq = vi.fn();
const mockOrder = vi.fn();
const mockSingle = vi.fn();
const mockFrom = vi.fn();

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: (...args: any[]) => mockFrom(...args),
  },
}));

vi.mock('@/hooks/useAuditLogs', () => ({
  logAuditEvent: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

import { renderHook, act, waitFor } from '@testing-library/react';
import { useTermsVersions, TermsVersion } from '@/hooks/useTermsVersions';
import { logAuditEvent } from '@/hooks/useAuditLogs';
import { toast } from 'sonner';

const mockVersions: TermsVersion[] = [
  {
    id: 'tv-001',
    version: 'v1.0',
    title: 'Terms v1',
    content: '<p>Content</p>',
    status: 'PUBLISHED',
    created_by: null,
    published_at: '2026-01-01T00:00:00Z',
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'tv-002',
    version: 'v1.1',
    title: 'Terms v1.1 Draft',
    content: '<p>Updated</p>',
    status: 'DRAFT',
    created_by: null,
    published_at: null,
    created_at: '2026-02-01T00:00:00Z',
  },
];

function setupMockChain(overrides: Record<string, any> = {}) {
  const chain: any = {
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: overrides.singleData ?? null, error: overrides.singleError ?? null }),
  };
  // Default: select returns versions
  chain.order.mockResolvedValue({ data: overrides.selectData ?? mockVersions, error: overrides.selectError ?? null });
  chain.select.mockReturnValue(chain);
  chain.insert.mockReturnValue(chain);
  chain.update.mockReturnValue(chain);
  chain.eq.mockReturnValue(chain);
  return chain;
}

describe('useTermsVersions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch versions on mount', async () => {
    const chain = setupMockChain();
    mockFrom.mockReturnValue(chain);

    const { result } = renderHook(() => useTermsVersions());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(mockFrom).toHaveBeenCalledWith('terms_versions');
    expect(result.current.versions).toEqual(mockVersions);
  });

  it('should handle fetch error gracefully', async () => {
    const chain = setupMockChain({ selectError: { message: 'Network error' }, selectData: null });
    mockFrom.mockReturnValue(chain);

    const { result } = renderHook(() => useTermsVersions());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.versions).toEqual([]);
  });

  it('createVersion should insert and log audit event', async () => {
    const newVersion: TermsVersion = {
      id: 'tv-003', version: 'v2.0', title: 'New Terms', content: '<p>New</p>',
      status: 'DRAFT', created_by: null, published_at: null, created_at: '2026-03-01T00:00:00Z',
    };
    
    const insertChain: any = {
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({ data: mockVersions, error: null }),
      single: vi.fn().mockResolvedValue({ data: newVersion, error: null }),
    };
    insertChain.select.mockReturnValue(insertChain);
    insertChain.insert.mockReturnValue(insertChain);
    mockFrom.mockReturnValue(insertChain);

    const { result } = renderHook(() => useTermsVersions());
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      const created = await result.current.createVersion({
        version: 'v2.0', title: 'New Terms', content: '<p>New</p>',
        createdBy: 'user-1', userName: 'Admin', userEmail: 'admin@test.com',
      });
      expect(created).not.toBeNull();
    });

    expect(logAuditEvent).toHaveBeenCalledWith(expect.objectContaining({
      eventType: 'TERMS_CREATED',
      entityType: 'terms',
    }));
    expect(toast.success).toHaveBeenCalledWith('Terms version created as draft');
  });

  it('updateVersion should reject non-draft versions', async () => {
    const chain = setupMockChain();
    mockFrom.mockReturnValue(chain);

    const { result } = renderHook(() => useTermsVersions());
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      const updated = await result.current.updateVersion('tv-001', { title: 'Changed' });
      expect(updated).toBe(false);
    });

    expect(toast.error).toHaveBeenCalledWith('Only draft versions can be edited');
  });

  it('updateVersion should allow editing draft versions', async () => {
    const chain = setupMockChain();
    chain.eq.mockResolvedValue({ error: null });
    mockFrom.mockReturnValue(chain);

    const { result } = renderHook(() => useTermsVersions());
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      const updated = await result.current.updateVersion('tv-002', { title: 'Updated Draft' }, 'actor-1', 'Admin', 'admin@test.com');
      expect(updated).toBe(true);
    });

    expect(logAuditEvent).toHaveBeenCalledWith(expect.objectContaining({ eventType: 'TERMS_UPDATED' }));
    expect(toast.success).toHaveBeenCalledWith('Terms version updated');
  });

  it('publishVersion should archive current published and publish target', async () => {
    // Track calls to from() to differentiate update calls
    let updateCallCount = 0;
    const chain: any = {
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnValue({
        eq: vi.fn().mockImplementation(() => {
          updateCallCount++;
          return Promise.resolve({ error: null });
        }),
      }),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({ data: mockVersions, error: null }),
      single: vi.fn().mockResolvedValue({ data: null, error: null }),
    };
    chain.select.mockReturnValue(chain);
    mockFrom.mockReturnValue(chain);

    const { result } = renderHook(() => useTermsVersions());
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      const published = await result.current.publishVersion('tv-002', 'actor-1', 'Admin', 'admin@test.com');
      expect(published).toBe(true);
    });

    // Should archive old + publish new = 2 update calls
    expect(updateCallCount).toBe(2);
    expect(logAuditEvent).toHaveBeenCalledWith(expect.objectContaining({ eventType: 'TERMS_ARCHIVED' }));
    expect(logAuditEvent).toHaveBeenCalledWith(expect.objectContaining({ eventType: 'TERMS_PUBLISHED' }));
    expect(toast.success).toHaveBeenCalledWith('Terms version published');
  });
});
