import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TermsAcceptancePage } from '@/components/npd/TermsAcceptancePage';
import { PublishedTerms } from '@/hooks/useTermsAcceptance';

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

import { toast } from 'sonner';

const mockTerms: PublishedTerms = {
  id: 'tv-001',
  version: 'v1.0',
  title: 'Supplier Portal Terms & Conditions',
  content: '<p>You must comply with all rules.</p>',
  published_at: '2026-01-15T00:00:00Z',
};

describe('TermsAcceptancePage', () => {
  let onAccept: ReturnType<typeof vi.fn>;
  let onReject: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    onAccept = vi.fn().mockResolvedValue(true);
    onReject = vi.fn().mockResolvedValue(true);
  });

  it('should render terms title, version, and content', () => {
    render(<TermsAcceptancePage terms={mockTerms} onAccept={onAccept} onReject={onReject} />);

    expect(screen.getByText('Supplier Portal Terms & Conditions')).toBeInTheDocument();
    expect(screen.getByText('Version v1.0')).toBeInTheDocument();
    expect(screen.getByText('You must comply with all rules.')).toBeInTheDocument();
  });

  it('should render Accept and Reject buttons', () => {
    render(<TermsAcceptancePage terms={mockTerms} onAccept={onAccept} onReject={onReject} />);

    expect(screen.getByRole('button', { name: /accept/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reject/i })).toBeInTheDocument();
  });

  it('should call onAccept when Accept is clicked', async () => {
    render(<TermsAcceptancePage terms={mockTerms} onAccept={onAccept} onReject={onReject} />);

    fireEvent.click(screen.getByRole('button', { name: /accept/i }));

    await waitFor(() => {
      expect(onAccept).toHaveBeenCalledTimes(1);
    });
    expect(toast.success).toHaveBeenCalledWith('Terms & Conditions accepted. Welcome to the Supplier Portal.');
  });

  it('should show error toast when accept fails', async () => {
    onAccept.mockResolvedValue(false);
    render(<TermsAcceptancePage terms={mockTerms} onAccept={onAccept} onReject={onReject} />);

    fireEvent.click(screen.getByRole('button', { name: /accept/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to accept terms. Please try again.');
    });
  });

  it('should show confirmation dialog when Reject is clicked', async () => {
    render(<TermsAcceptancePage terms={mockTerms} onAccept={onAccept} onReject={onReject} />);

    fireEvent.click(screen.getByRole('button', { name: /reject/i }));

    await waitFor(() => {
      expect(screen.getByText('Reject Terms & Conditions?')).toBeInTheDocument();
    });
  });

  it('should show Access Denied state after rejection', async () => {
    render(<TermsAcceptancePage terms={mockTerms} onAccept={onAccept} onReject={onReject} />);

    // Open reject dialog
    fireEvent.click(screen.getByRole('button', { name: /reject/i }));
    await waitFor(() => {
      expect(screen.getByText('Reject Terms & Conditions?')).toBeInTheDocument();
    });

    // Confirm rejection
    const confirmBtn = screen.getAllByRole('button').find(btn => btn.textContent === 'Reject' && btn.closest('[role="alertdialog"]'));
    if (confirmBtn) fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(screen.getByText('Access Denied')).toBeInTheDocument();
    });
  });

  it('should allow reviewing terms again after rejection', async () => {
    render(<TermsAcceptancePage terms={mockTerms} onAccept={onAccept} onReject={onReject} />);

    // Reject flow
    fireEvent.click(screen.getByRole('button', { name: /reject/i }));
    await waitFor(() => expect(screen.getByText('Reject Terms & Conditions?')).toBeInTheDocument());
    
    const confirmBtn = screen.getAllByRole('button').find(btn => btn.textContent === 'Reject' && btn.closest('[role="alertdialog"]'));
    if (confirmBtn) fireEvent.click(confirmBtn);

    await waitFor(() => expect(screen.getByText('Access Denied')).toBeInTheDocument());

    // Click review again
    fireEvent.click(screen.getByRole('button', { name: /review terms again/i }));

    await waitFor(() => {
      expect(screen.getByText('Supplier Portal Terms & Conditions')).toBeInTheDocument();
    });
  });

  it('should show published date when available', () => {
    render(<TermsAcceptancePage terms={mockTerms} onAccept={onAccept} onReject={onReject} />);
    expect(screen.getByText(/Published 15 Jan 2026/)).toBeInTheDocument();
  });
});
