import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogCancel } from '@/components/ui/alert-dialog';
import { Trash, Loader2 } from 'lucide-react';
import { Account } from '@/types/Account';
import { Spinner } from "@/components/ui/spinner";

const formatCurrency = (value: number, currency: string): string => {
  if (isNaN(value)) {
    return '0';
  }
  if (value === 0) {
    return '0';
  }

  if (currency === 'IDR') {
    return `Rp ${value.toLocaleString('id-ID')}`;
  }
  return `${value.toFixed(2)} ${currency}`;
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return (
    date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }) +
    ', ' +
    date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
  );
};

interface AccountCardProps {
  account: Account;
  onDelete: (accountId: string) => Promise<void>; // Assume onDelete is async
}

const AccountCard: React.FC<AccountCardProps> = ({ account, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false); // Loading state for delete action

  const handleDelete = async () => {
    setIsDeleting(true); // Set loading state to true
    try {
      await onDelete(account.id); // Call the delete function
    } catch (error) {
      console.error('Failed to delete account:', error);
    } finally {
      setIsDeleting(false); // Reset loading state
    }
  };

  return (
    <Card className="p-4 shadow hover:shadow-lg transition-shadow">
      {/* Card Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{account.account_name}</h3>
        <AlertDialog>
          <AlertDialogTrigger>
            <Button variant="ghost" className="p-2 text-red-500 hover:bg-red-100">
              <Trash className="h-5 w-5" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Account</AlertDialogTitle>
              <p className="text-sm text-muted-foreground">
                Are you sure you want to delete this account? This action cannot be undone.
              </p>
            </AlertDialogHeader>
            <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="outline">Cancel</Button>
          </AlertDialogCancel>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                      <>
                        <Spinner size="sm" className="mr-2" />
                        Deleting...
                      </>
                ) : (
                  'Delete'
                )}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Card Content */}
      <div className="mt-4 space-y-2">
        <p className="text-lg font-bold">{formatCurrency(account.balance, account.currency_code)}</p>
        {account.currency_code !== 'IDR' && (
          <p className="text-sm text-muted-foreground">
            ({formatCurrency(account.converted_balance, 'IDR')})
          </p>
        )}
        <p className="text-xs text-muted-foreground">
          Last Updated: {formatDate(account.updated_at)}
        </p>
      </div>
    </Card>
  );
};

export default AccountCard;
