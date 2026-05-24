'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getMetrics } from '@/services/api';
import Navbar from '@/components/Navbar';
import { useRouter } from 'next/navigation';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const [metrics, setMetrics] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading]);

  useEffect(() => {
    if (user) {
      getMetrics().then(setMetrics).catch(console.error);
    }
  }, [user]);

  if (loading || !user) return null;

  const barData = metrics ? [
    { name: 'Accuracy', value: Math.round(metrics.accuracy * 100) },
    { name: 'Precision', value: Math.round(metrics.precision * 100) },
    { name: 'Recall', value: Math.round(metrics.recall * 100) },
    { name: 'F1 Score', value: Math.round(metrics.f1_score * 100) },
  ] : [];

  const colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b'];

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Welcome back, <span className="text-blue-400">{user.username}</span> 👋</h1>
          <p className="text-gray-400 mt-1">Here's your AI model performance overview</p>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-8">
          {barData.map((item, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <p className="text-gray-400 text-sm">{item.name}</p>
              <p className="text-3xl font-bold mt-1" style={{ color: colors[i] }}>{item.value}%</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">📊 Model Metrics</h2>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={barData}>
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                  formatter={(value) => [`${value}%`]}
                />
                {barData.map((entry, index) => (
                  <Bar key={index} dataKey="value" fill={colors[index % colors.length]}>
                    {barData.map((_, i) => (
                      <Cell key={i} fill={colors[i % colors.length]} />
                    ))}
                  </Bar>
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">🎯 Radar Overview</h2>
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={barData}>
                <PolarGrid stroke="#374151" />
                <PolarAngleAxis dataKey="name" stroke="#9ca3af" />
                <Radar dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-6">
          <div onClick={() => router.push('/predict')}
            className="bg-gradient-to-r from-blue-900 to-blue-800 border border-blue-700 rounded-xl p-6 cursor-pointer hover:from-blue-800 transition">
            <div className="text-3xl mb-2">🔮</div>
            <h3 className="text-xl font-bold text-white">Make Prediction</h3>
            <p className="text-blue-300 text-sm mt-1">Run AI inference on customer data</p>
          </div>
          <div onClick={() => router.push('/history')}
            className="bg-gradient-to-r from-purple-900 to-purple-800 border border-purple-700 rounded-xl p-6 cursor-pointer hover:from-purple-800 transition">
            <div className="text-3xl mb-2">📜</div>
            <h3 className="text-xl font-bold text-white">View History</h3>
            <p className="text-purple-300 text-sm mt-1">See all past predictions</p>
          </div>
        </div>
      </div>
    </div>
  );
}