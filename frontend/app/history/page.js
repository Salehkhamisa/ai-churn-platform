'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getHistory } from '@/services/api';
import Navbar from '@/components/Navbar';
import { useRouter } from 'next/navigation';

export default function HistoryPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [history, setHistory] = useState([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading]);

  useEffect(() => {
    if (user) {
      getHistory()
        .then(setHistory)
        .catch(console.error)
        .finally(() => setFetching(false));
    }
  }, [user]);

  if (loading || !user) return null;

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">📜 Prediction History</h1>
          <p className="text-gray-400 mt-1">Your last 10 AI predictions</p>
        </div>

        {fetching && (
          <div className="text-center text-gray-400 py-12">Loading history...</div>
        )}

        {!fetching && history.length === 0 && (
          <div className="text-center py-12 bg-gray-900 border border-gray-800 rounded-xl">
            <div className="text-5xl mb-4">📭</div>
            <p className="text-gray-400">No predictions yet. Go make your first one!</p>
            <button
              onClick={() => router.push('/predict')}
              className="mt-4 bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg transition">
              Make Prediction
            </button>
          </div>
        )}

        <div className="space-y-4">
          {history.map((item, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{item.result.prediction === 1 ? '⚠️' : '✅'}</span>
                  <div>
                    <p className={`font-bold text-lg ${item.result.prediction === 1 ? 'text-red-400' : 'text-green-400'}`}>
                      {item.result.label}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {new Date(item.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-red-400 font-semibold">Churn: {item.result.churn_probability}%</p>
                  <p className="text-green-400 font-semibold">Stay: {item.result.stay_probability}%</p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-4 gap-3">
                {Object.entries(item.input).map(([key, val]) => (
                  <div key={key} className="bg-gray-800 rounded-lg p-2 text-center">
                    <p className="text-gray-400 text-xs">{key.replace(/_/g, ' ')}</p>
                    <p className="text-white font-semibold text-sm">{val}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}