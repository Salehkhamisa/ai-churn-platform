'use client';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex justify-between items-center">
      <Link href="/" className="text-xl font-bold text-blue-400">
        🤖 AI Platform
      </Link>
      <div className="flex gap-6 items-center">
        {user ? (
          <>
            <Link href="/dashboard" className="text-gray-300 hover:text-white transition">Dashboard</Link>
            <Link href="/predict" className="text-gray-300 hover:text-white transition">Predict</Link>
            <Link href="/history" className="text-gray-300 hover:text-white transition">History</Link>
            <span className="text-blue-400 text-sm">👤 {user.username}</span>
            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm transition">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="text-gray-300 hover:text-white transition">Login</Link>
            <Link href="/register" className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm transition">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}