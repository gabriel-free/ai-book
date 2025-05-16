import './globals.css';
import Providers from './providers';

export const metadata = {
  title: 'AI Book Explorer',
  description: 'Chat with AI to explore and add books.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
