'use client';

import { UserProvider } from '@/contexts/UserContext';
import React from 'react';

type ProvidersProps = Readonly<{
  children: React.ReactNode;
}>;

export function Providers({ children }: ProvidersProps) {
  return <UserProvider>{children}</UserProvider>;
}