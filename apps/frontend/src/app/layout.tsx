import React from 'react';
import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'AI Bid Copilot – Win More Government & Enterprise Contracts',
  description:
    'AI-powered procurement intelligence platform. Discover, score and track RFPs automatically. Used by 500+ enterprise bid management teams.',
  keywords: 'procurement software, RFP automation, bid management, government contracts, AI tender matching',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
