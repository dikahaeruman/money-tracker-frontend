'use client';

import './globals.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { Providers } from './providers'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react';
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider"

const queryClient = new QueryClient()

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head><title>Money Tracker</title></head>
      <body>
        <QueryClientProvider client={queryClient}>
        <Providers>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
          {children}
          </ThemeProvider>
          </Providers>
        <Toaster />
      </QueryClientProvider>
      </body>
    </html>
  );
}
