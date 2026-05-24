'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { predictChurn } from '@/services/api';
import Navbar from '@/components/Navbar';
import { useRouter } from 'next/navigation';

export default function PredictPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    age: 30,
    tenure: 12,
    monthly_charges: 50,
    total_charges: 600,
    num_products: 2,
    has_internet: 1,
    is_senior: 0,
  });
  const [result, setResult] = useState(null);
  const [predicting, setPredicting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPredicting(true);
    setError('');
    setResult(null);
    try {
      const data = await predictChurn({
        age: parseInt(form.age),
        tenure: parseInt(form.tenure),
        monthly_charges: parseFloat(form.monthly_charges),
        total_charges: parseFloat(form.total_charges),
        num_products: parseInt(form.num_products),
        has_internet: parseInt(form.has_internet),
        is_senior: parseInt(form.is_senior),
      });
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Prediction failed');
    }
    setPredicting(false);
  };

  if (loading || !user) return null;

  const fields = [
    { key: 'age', label: 'Age', min: 18, max: 100 },
    { key: 'tenure', label: 'Tenure (months)', min: 0, max: 72 },
    { key: 'monthly_charges', label: 'Monthly Charges ($)', min: 0, max: 200 },
    { key: 'total_charges', label: 'Total Charges ($)', min: 0, max: 10000 },
    { key: 'num_products', label: 'Number of Products', min: 1, max: 10 },
  ];

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">🔮 AI Prediction</h1>
          <p className="text-gray-400 mt-1">Enter customer data to predict churn probability</p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Customer Data</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {fields.map((field) => (
                <div key={field.key}>
                  <label className="text-gray-400 text-sm mb-1 block">{field.label}</label>
                  <input
                    type="number"
                    min={field.min}
                    max={field.max}
                    value={form[field.key]}
                    onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              ))}

              <div>
                <label className="text-gray-400 text-sm mb-1 block">Has Internet Service</label>
                <select
                  value={form.has_internet}
                  onChange={(e) => setForm({ ...form, has_internet: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500">
                  <option value={1}>Yes</option>
                  <option value={0}>No</option>
                </select>
              </div>

              <div>
                <label className="text-gray-400 text-sm mb-1 block">Senior Citizen</label>
                <select
                  value={form.is_senior}
                  onChange={(e) => setForm({ ...form, is_senior: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500">
                  <option value={0}>No</option>
                  <option value={1}>Yes</option>
                </select>
              </div>

              {error && <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg">{error}</div>}

              <button
                type="submit"
                disabled={predicting}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 py-3 rounded-lg font-semibold transition">
                {predicting ? '🤖 Analyzing...' : '🔮 Predict Churn'}
              </button>
            </form>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 flex flex-col items-center justify-center">
            {!result && !predicting && (
              <div className="text-center text-gray-500">
                <div className="text-6xl mb-4">🤖</div>
                <p>Fill in customer data and click Predict to see AI results</p>
              </div>
            )}
            {predicting && (
              <div className="text-center">
                <div className="text-6xl mb-4 animate-pulse">⚡</div>
                <p className="text-blue-400">AI is analyzing...</p>
              </div>
            )}
            {result && (
              <div className="text-center w-full">
                <div className={`text-6xl mb-4`}>
                  {result.prediction === 1 ? '⚠️' : '✅'}
                </div>
                <h2 className={`text-3xl font-bold mb-2 ${result.prediction === 1 ? 'text-red-400' : 'text-green-400'}`}>
                  {result.label}
                </h2>
                <div className="mt-6 space-y-4">
                  <div className="bg-gray-800 rounded-lg p-4">
                    <p className="text-gray-400 text-sm">Churn Probability</p>
                    <p className="text-red-400 text-2xl font-bold">{result.churn_probability}%</p>
                    <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                      <div
                        className="bg-red-500 h-2 rounded-full"
                        style={{ width: `${result.churn_probability}%` }}>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-4">
                    <p className="text-gray-400 text-sm">Stay Probability</p>
                    <p className="text-green-400 text-2xl font-bold">{result.stay_probability}%</p>
                    <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${result.stay_probability}%` }}>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}