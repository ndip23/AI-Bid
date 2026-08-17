import React from 'react';
import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'Bidora – Win More Government & Enterprise Contracts',
  description:
    'AI-powered procurement intelligence platform. Discover, score and track RFPs automatically. Used by 500+ enterprise bid management teams.',
  keywords: 'procurement software, RFP automation, bid management, government contracts, AI tender matching',
  icons: {
    icon: '/logo-icon.jpg',
    shortcut: '/logo-icon.jpg',
    apple: '/logo-icon.jpg',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.addEventListener('error', function(e) {
                if (e && e.message && (e.message.indexOf('Loading chunk') !== -1 || e.message.indexOf('ChunkLoadError') !== -1)) {
                  console.warn('ChunkLoadError detected, performing silent reload...');
                  window.location.reload();
                }
              });
            `,
          }}
        />
      </head>
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
