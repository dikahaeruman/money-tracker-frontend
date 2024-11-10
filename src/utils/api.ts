import { Account } from '@/types/Account';

export const fetchAccounts = async (): Promise<Account[]> => {
  const response = await fetch('/api/accounts', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export const createAccount = async (accountData: any): Promise<Account> => {
  const response = await fetch('/api/accounts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(accountData),
    credentials: 'include',
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export const deleteAccount = async (accountId: string): Promise<void> => {
  await fetch(`/api/accounts/${accountId}`, {
    method: 'DELETE',
    credentials: 'include',
  });
}