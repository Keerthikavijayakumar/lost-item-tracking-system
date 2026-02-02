import { ClerkProvider } from '@clerk/nextjs';
import UserSync from '@/Frontend/Components/UserSync';
import './globals.css';

export const metadata = {
  title: 'Campus Lost & Found',
  description: 'Connect finders with owners - A secure campus lost and found system',
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        </head>
        <body>
          <UserSync />
          <div className="main-layout-wrapper">
            <div className="content-flex">
              {children}
            </div>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
