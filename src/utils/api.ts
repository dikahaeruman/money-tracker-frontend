import { Account } from '@/types/Account';

interface Currency {
  id: number;
  code: string;
  name: string;
}

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
    console.log("errorData", errorData)

    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  const data = await response.json()

  return data;
};

export const deleteAccount = async (accountId: string): Promise<void> => {
  await fetch(`/api/accounts/${accountId}`, {
    method: 'DELETE',
    credentials: 'include',
  });
}

export const fetchCurrencies = async (): Promise<Currency[]> => {
  const response = await fetch('/api/currencies', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data.data;
};