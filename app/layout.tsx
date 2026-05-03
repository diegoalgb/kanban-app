import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';

export const metadata: Metadata = {
  title: 'Kanban Board',
  description: 'A simple Kanban board demo',
};

// Both font variables are injected onto <html> so Tailwind's font-sans and
// font-mono utilities (wired to --font-geist-* in tailwind.config.ts) resolve
// to Geist throughout the component tree.
// The `dark` class forces dark mode permanently — there is no light-mode
// variant for this app.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`dark ${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
