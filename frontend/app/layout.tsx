import { AuthProvider } from '@/context/AuthContext';
import './globals.css';

export const metadata = {
  title: 'AI Churn Prediction Platform',
  description: 'Enterprise AI Platform for Customer Churn Prediction',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-950 text-white min-h-screen">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}