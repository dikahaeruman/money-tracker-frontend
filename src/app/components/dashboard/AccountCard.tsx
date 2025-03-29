import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Account } from '@/types/Account';
// import { formatCurrency, formatDate } from '@/utils/format';  // Assume you have a utility file for formatting functions
import { DeleteAccountModal } from '@/app/components/dashboard/modal/DeleteAccount';  // Import the new DeleteAccountModal

interface AccountCardProps {
  account: Account;
  onDelete: (accountId: string) => Promise<void>;  // Assume onDelete is async
}

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


const AccountCard: React.FC<AccountCardProps> = ({ account, onDelete }) => {
  return (
    <Card className="p-4 shadow hover:shadow-lg transition-shadow">
      {/* Card Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{account.account_name}</h3>
        
        {/* Delete Account Button */}
        <DeleteAccountModal 
          accountName={account.account_name} 
          onDelete={() => onDelete(account.id)} 
        />
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
