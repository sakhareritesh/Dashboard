import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import StoreProvider from '@/components/StoreProvider';
import ThemeManager from '@/components/ThemeManager';
import { GeistSans } from 'geist/font/sans';
import { AuthProvider } from '@/contexts/AuthContext';

export const metadata: Metadata = {
  title: 'Personalized Content Dashboard',
  description: 'Your daily feed of news, media, and more, all in one place.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={GeistSans.className}>
      <head />
      <body className="antialiased">
        <AuthProvider>
            <StoreProvider>
            <ThemeManager />
            {children}
            <Toaster />
            </StoreProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
