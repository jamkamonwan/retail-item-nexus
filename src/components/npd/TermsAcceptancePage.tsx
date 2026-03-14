import { useState } from 'react';
import { PublishedTerms } from '@/hooks/useTermsAcceptance';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { FileCheck, XCircle, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface TermsAcceptancePageProps {
  terms: PublishedTerms;
  onAccept: () => Promise<boolean>;
  onReject: () => Promise<boolean>;
}

export function TermsAcceptancePage({ terms, onAccept, onReject }: TermsAcceptancePageProps) {
  const [submitting, setSubmitting] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejected, setRejected] = useState(false);

  const handleAccept = async () => {
    setSubmitting(true);
    const success = await onAccept();
    setSubmitting(false);
    if (success) {
      toast.success('Terms & Conditions accepted. Welcome to the Supplier Portal.');
    } else {
      toast.error('Failed to accept terms. Please try again.');
    }
  };

  const handleReject = async () => {
    setSubmitting(true);
    const success = await onReject();
    setSubmitting(false);
    setRejectDialogOpen(false);
    if (success) {
      setRejected(true);
    }
  };

  if (rejected) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-lg w-full text-center">
          <CardHeader>
            <XCircle className="w-12 h-12 text-destructive mx-auto mb-2" />
            <CardTitle className="text-destructive">Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              You must accept the Terms & Conditions to access the Supplier Portal. 
              Please contact your administrator if you have questions.
            </p>
          </CardContent>
          <CardFooter className="justify-center">
            <Button variant="outline" onClick={() => setRejected(false)}>
              Review Terms Again
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full">
        <CardHeader className="text-center border-b border-border">
          <FileCheck className="w-10 h-10 text-primary mx-auto mb-2" />
          <CardTitle className="text-xl">{terms.title}</CardTitle>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Badge variant="outline">Version {terms.version}</Badge>
            {terms.published_at && (
              <span>Published {format(new Date(terms.published_at), 'dd MMM yyyy')}</span>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <ScrollArea className="h-[400px] border border-border rounded-md p-4">
            <div className="whitespace-pre-wrap text-sm text-foreground leading-relaxed">
              {terms.content}
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter className="flex justify-end gap-3 border-t border-border pt-4">
          <Button
            variant="outline"
            onClick={() => setRejectDialogOpen(true)}
            disabled={submitting}
            className="gap-2"
          >
            <XCircle className="w-4 h-4" /> Reject
          </Button>
          <Button
            onClick={handleAccept}
            disabled={submitting}
            className="gap-2"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileCheck className="w-4 h-4" />}
            Accept
          </Button>
        </CardFooter>
      </Card>

      {/* Reject Confirmation */}
      <AlertDialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Terms & Conditions?</AlertDialogTitle>
            <AlertDialogDescription>
              If you reject the Terms & Conditions, you will not be able to access the Supplier Portal. Are you sure?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={submitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleReject} disabled={submitting} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {submitting ? 'Processing...' : 'Reject'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
