import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import { Button } from '@mui/material';

import { auth0 } from '@/lib/auth0';

import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Transaction Sorter',
  description: 'by Tripp Shelnutt',
};

async function getTitle() {
  const res = await fetch(`${process.env.APP_BASE_URL}/api/title`, { cache: 'no-store' });
  const data = await res.json();
  return data.title;
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const title = await getTitle();
  const session = await auth0.getSession();
  const user = session?.user;

  if (!session) {
    return (
      <html lang="en">
        <head>
          <link rel="shortcut icon" href="favicon.ico" />
          <title>{title}</title>
        </head>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <div className="app">
            <header className="app-header">
              <p>{title}</p>
              <p>Please log in to continue.</p>
            </header>
            <Button variant="contained" color="primary" href="/auth/login">
              Log in
            </Button>
          </div>
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <head>
        <link rel="shortcut icon" href="favicon.ico" />
        <title>{title}</title>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="app">
          <header className="app-header">
            <p>{title}</p>
            <p>Welcome, {user?.name || 'User'}!</p>
          </header>
          {children}
          <Button variant="contained" color="secondary" href="/auth/logout" sx={{ mt: 2 }}>
            Log out
          </Button>
        </div>
      </body>
    </html>
  );
}
