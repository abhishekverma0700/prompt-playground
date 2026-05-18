'use client';

import { useState } from 'react';
import { sweepPrompt } from '@/lib/api';

export default function Sweep() {
  const [prompt, setPrompt] = useState('');
  const [sweepParam, setSweepParam] = useState('temperature');
  const [sweepValues, setSweepValues] = useState('0.1, 0.5, 0.9, 1.3, 1.7');
  const [maxTokens, setMaxTokens] = useState(200);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleSweep = async () => {
    if (!prompt.trim()) {
      showToast('❌ Please enter a prompt!');
      return;
    }

    const values = sweepValues
      .split(',')
      .map((v) => parseFloat(v.trim()))
      .filter((v) => !isNaN(v));

    if (values.length === 0) {
      showToast('❌ Please enter valid values!');
      return;
    }

    setLoading(true);
    setResults([]);

    const result = await sweepPrompt({
      user_prompt: prompt,
      sweep_param: sweepParam,
      sweep_values: values,
      max_tokens: maxTokens,
    });

    setLoading(false);

    if (result.success) {
      setResults(result.results);
    } else {
      showToast('❌ Sweep failed!');
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Parameter Sweep</h1>
          <span className="bg-yellow-400 text-gray-900 text-xs font-bold px-3 py-1 rounded-full">Grid View</span>
        </div>
        <button
          onClick={handleSweep}
          disabled={loading}
          className="bg-yellow-400 text-gray-900 font-bold px-6 py-2 rounded-xl hover:bg-yellow-300 transition disabled:opacity-50"
        >
          {loading ? '⏳ Running...' : '▶ Run Sweep'}
        </button>
      </div>

      {/* Config */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-5 mb-6 space-y-4">
        <div>
          <label className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold mb-2 block">💬 Prompt</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter prompt to test across different parameter values..."
            rows={4}
            className="w-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:border-yellow-400"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold mb-2 block">Sweep Parameter</label>
            <select
              value={sweepParam}
              onChange={(e) => setSweepParam(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm"
            >
              <option value="temperature">Temperature</option>
              <option value="top_p">Top-P</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold mb-2 block">Values (comma separated)</label>
            <input
              type="text"
              value={sweepValues}
              onChange={(e) => setSweepValues(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-yellow-400"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold mb-2 block">Max Tokens</label>
            <input
              type="number"
              value={maxTokens}
              onChange={(e) => setMaxTokens(parseInt(e.target.value))}
              className="w-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-yellow-400"
            />
          </div>
        </div>
      </div>

      {/* Results Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-600 dark:text-gray-400">
          <div className="w-10 h-10 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p>Running sweep across {sweepValues.split(',').length} values...</p>
        </div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.map((item, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:border-yellow-400 transition"
            >
              {/* Param Value Badge */}
              <div className="flex items-center justify-between mb-3">
                <span className="bg-yellow-400 text-gray-900 text-sm font-bold px-3 py-1 rounded-full">
                  {sweepParam} = {item.param_value}
                </span>
                {item.result.success && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    ⏱️ {item.result.response_time}s | 🪙 {item.result.total_tokens} tokens
                  </span>
                )}
              </div>

              {/* Output */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 min-h-32">
                {item.result.success ? (
                  <pre className="text-gray-800 dark:text-gray-200 text-xs whitespace-pre-wrap font-mono leading-relaxed">
                    {item.result.output}
                  </pre>
                ) : (
                  <p className="text-red-400 text-sm">❌ {item.result.error}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-gray-600 dark:text-gray-400">
          <span className="text-5xl mb-4">📊</span>
          <p className="text-lg">Configure and run sweep to see results</p>
          <p className="text-sm mt-2">Each card shows output for a different parameter value</p>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-gray-900 dark:bg-gray-800 text-white px-4 py-3 rounded-xl shadow-lg border border-gray-700 dark:border-gray-600 z-50">
          {toast}
        </div>
      )}
    </div>
  );
}