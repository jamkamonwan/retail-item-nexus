import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockFrom = vi.fn();

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: (...args: any[]) => mockFrom(...args),
  },
}));

vi.mock('@/hooks/useAuditLogs', () => ({
  logAuditEvent: vi.fn().mockResolvedValue(undefined),
}));

import { renderHook, act, waitFor } from '@testing-library/react';
import { useTermsAcceptance } from '@/hooks/useTermsAcceptance';
import { logAuditEvent } from '@/hooks/useAuditLogs';

const publishedTerms = {
  id: 'tv-pub-001',
  version: 'v1.0',
  title: 'Supplier Terms',
  content: '<p>Terms content</p>',
  published_at: '2026-01-15T00:00:00Z',
};

function createChain(overrides: Record<string, any> = {}) {
  const chain: any = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: overrides.termsData ?? publishedTerms, error: overrides.termsError ?? null }),
    maybeSingle: vi.fn().mockResolvedValue({ data: overrides.acceptanceData ?? null, error: null }),
    upsert: vi.fn().mockResolvedValue({ error: overrides.upsertError ?? null }),
  };
  chain.select.mockReturnValue(chain);
  return chain;
}

describe('useTermsAcceptance', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return hasAccepted=true when no published terms exist', async () => {
    const chain = createChain({ termsData: null, termsError: { code: 'PGRST116' } });
    mockFrom.mockReturnValue(chain);

    const { result } = renderHook(() => useTermsAcceptance('user-001'));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.hasAccepted).toBe(true);
    expect(result.current.publishedTerms).toBeNull();
  });

  it('should return hasAccepted=false when terms exist but not accepted', async () => {
    const chain = createChain({ acceptanceData: null });
    mockFrom.mockReturnValue(chain);

    const { result } = renderHook(() => useTermsAcceptance('user-001'));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.hasAccepted).toBe(false);
    expect(result.current.publishedTerms).toEqual(publishedTerms);
  });

  it('should return hasAccepted=true when terms already accepted', async () => {
    const chain = createChain({ acceptanceData: { status: 'ACCEPTED' } });
    mockFrom.mockReturnValue(chain);

    const { result } = renderHook(() => useTermsAcceptance('user-001'));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.hasAccepted).toBe(true);
  });

  it('should not load when userId is undefined', async () => {
    const { result } = renderHook(() => useTermsAcceptance(undefined));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(mockFrom).not.toHaveBeenCalled();
  });

  it('acceptTerms should upsert and log audit event', async () => {
    const chain = createChain({ acceptanceData: null });
    mockFrom.mockReturnValue(chain);

    const { result } = renderHook(() => useTermsAcceptance('user-001', 'user@test.com', 'Test User'));

    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      const success = await result.current.acceptTerms();
      expect(success).toBe(true);
    });

    expect(result.current.hasAccepted).toBe(true);
    expect(logAuditEvent).toHaveBeenCalledWith(expect.objectContaining({
      eventType: 'TERMS_ACCEPTED',
      actorId: 'user-001',
      entityType: 'terms',
      entityId: 'tv-pub-001',
    }));
  });

  it('rejectTerms should upsert and log audit event', async () => {
    const chain = createChain({ acceptanceData: null });
    mockFrom.mockReturnValue(chain);

    const { result } = renderHook(() => useTermsAcceptance('user-001', 'user@test.com', 'Test User'));

    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      const success = await result.current.rejectTerms();
      expect(success).toBe(true);
    });

    expect(result.current.hasAccepted).toBe(false);
    expect(logAuditEvent).toHaveBeenCalledWith(expect.objectContaining({
      eventType: 'TERMS_REJECTED',
    }));
  });

  it('acceptTerms should return false on upsert error', async () => {
    const chain = createChain({ acceptanceData: null, upsertError: { message: 'RLS error' } });
    mockFrom.mockReturnValue(chain);

    const { result } = renderHook(() => useTermsAcceptance('user-001'));

    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      const success = await result.current.acceptTerms();
      expect(success).toBe(false);
    });
  });
});
