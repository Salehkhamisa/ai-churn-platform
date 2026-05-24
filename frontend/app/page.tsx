import Link from 'next/link';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gray-950 flex flex-col">
      <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex justify-between items-center">
        <span className="text-xl font-bold text-blue-400">🤖 AI Platform</span>
        <div className="flex gap-4">
          <Link href="/login" className="text-gray-300 hover:text-white transition">Login</Link>
          <Link href="/register" className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm transition">
            Get Started
          </Link>
        </div>
      </nav>

      <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <div className="mb-6 text-6xl">🧠</div>
        <h1 className="text-5xl font-bold text-white mb-4">
          AI-Powered <span className="text-blue-400">Churn Prediction</span>
        </h1>
        <p className="text-gray-400 text-xl max-w-2xl mb-8">
          Enterprise-grade machine learning platform to predict customer churn
          with real-time AI inference, analytics, and beautiful dashboards.
        </p>
        <div className="flex gap-4">
          <Link href="/register"
            className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg text-lg font-semibold transition">
            Start Free →
          </Link>
          <Link href="/login"
            className="border border-gray-600 hover:border-gray-400 px-8 py-3 rounded-lg text-lg transition">
            Login
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-3 gap-8 max-w-3xl">
          <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="font-semibold text-white mb-2">Real-time AI</h3>
            <p className="text-gray-400 text-sm">Instant predictions powered by Random Forest ML model</p>
          </div>
          <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
            <div className="text-3xl mb-3">🔒</div>
            <h3 className="font-semibold text-white mb-2">Secure & Private</h3>
            <p className="text-gray-400 text-sm">JWT authentication with encrypted passwords</p>
          </div>
          <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="font-semibold text-white mb-2">Rich Analytics</h3>
            <p className="text-gray-400 text-sm">Beautiful charts showing model accuracy and metrics</p>
          </div>
        </div>
      </div>
    </main>
  );
}