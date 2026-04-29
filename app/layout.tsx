// app/layout.tsx
import type { Metadata } from 'next';
import { Playfair_Display, IBM_Plex_Sans, IBM_Plex_Mono } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import './globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});
const ibmPlex = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-ibm-plex',
  display: 'swap',
});
const ibmMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-ibm-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: { default: 'Eimemes', template: '%s | Eimemes' },
  description: 'Independent digital publication covering grassroots football, culture, and original reporting.',
  keywords: ['Eimemes', 'Kuki FC', 'football', 'journalism', 'Mumbai', 'independent media'],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: 'Eimemes',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${ibmPlex.variable} ${ibmMono.variable}`}>
      <body>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              fontFamily: 'var(--font-ibm-plex)',
              fontSize: '0.875rem',
              borderRadius: '3px',
            },
            success: { iconTheme: { primary: '#d97706', secondary: '#fff' } },
          }}
        />
      </body>
    </html>
  );
}
