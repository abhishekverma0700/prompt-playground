'use client';

import { useState, useEffect } from 'react';
import { getHistory, clearHistory, rateHistory } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [toast, setToast] = useState('');
  const router = useRouter();

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const loadHistory = async () => {
    setLoading(true);
    const data = await getHistory();
    if (data.success) setHistory(data.history);
    setLoading(false);
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleClear = async () => {
    if (!confirm('Clear all history?')) return;
    const result = await clearHistory();
    if (result.success) {
      setHistory([]);
      showToast('✅ History cleared!');
    }
  };

  const handleRate = async (id, rating) => {
    await rateHistory(id, rating);
    loadHistory();
    showToast(`✅ Rated ${rating} stars!`);
  };

  const handleRerun = (entry) => {
    localStorage.setItem('loadPrompt', JSON.stringify({
      user_prompt: entry.user_prompt,
      system_prompt: entry.system_prompt,
      temperature: entry.temperature,
      max_tokens: entry.max_tokens,
      top_p: entry.top_p,
      technique: entry.technique,
    }));
    router.push('/');
    showToast('✅ Loaded in Playground!');
  };

  const techniqueColors = {
    'zero-shot': 'bg-blue-600',
    'few-shot': 'bg-green-600',
    'chain-of-thought': 'bg-purple-600',
    'role-based': 'bg-orange-600',
    'output-format': 'bg-pink-600',
    'negative': 'bg-red-600',
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">History</h1>
          <span className="bg-yellow-400 text-gray-900 text-xs font-bold px-3 py-1 rounded-full">
            {history.length}
          </span>
        </div>
        {history.length > 0 && (
          <button
            onClick={handleClear}
            className="bg-red-200 dark:bg-red-900 text-red-700 dark:text-red-300 text-sm font-bold px-4 py-2 rounded-xl hover:bg-red-300 dark:hover:bg-red-800 transition"
          >
            🗑️ Clear All
          </button>
        )}
      </div>

      {/* History List */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-gray-600 dark:text-gray-400">
          <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin mr-3"></div>
          Loading history...
        </div>
      ) : history.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-600 dark:text-gray-400">
          <span className="text-5xl mb-4">🕐</span>
          <p className="text-lg">No history yet!</p>
          <p className="text-sm mt-2">Run prompts in Playground to see them here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((entry) => (
            <div
              key={entry.id}
              className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-yellow-400 transition"
            >
              {/* Entry Header */}
              <div
                className="p-4 cursor-pointer"
                onClick={() => setExpanded(expanded === entry.id ? null : entry.id)}
              >
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Technique Badge */}
                    <span className={`text-white text-xs font-bold px-2 py-1 rounded-full ${techniqueColors[entry.technique] || 'bg-gray-600'}`}>
                      {entry.technique}
                    </span>
                    {/* Prompt Preview */}
                    <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                      {entry.user_prompt?.substring(0, 60)}
                      {entry.user_prompt?.length > 60 ? '...' : ''}
                    </p>
                  </div>

                  {/* Metrics */}
                  <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400 flex-wrap">
                    <span>⏱️ {entry.response_time}s</span>
                    <span>🪙 {entry.total_tokens || (entry.input_tokens + entry.output_tokens)} tokens</span>
                    <span>🌡️ {entry.temperature}</span>
                    <span className="text-gray-600 dark:text-gray-500">
                      {new Date(entry.created_at).toLocaleString()}
                    </span>
                    <span>{expanded === entry.id ? '▲' : '▼'}</span>
                  </div>
                </div>

                {/* Star Rating */}
                <div className="flex gap-1 mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={(e) => { e.stopPropagation(); handleRate(entry.id, star); }}
                      className={`text-lg ${star <= (entry.rating || 0) ? 'text-yellow-400' : 'text-gray-400 dark:text-gray-700'}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              {/* Expanded Details */}
              {expanded === entry.id && (
                <div className="border-t border-gray-200 dark:border-gray-700 p-4 space-y-3">
                  {/* System Prompt */}
                  {entry.system_prompt && (
                    <div>
                      <label className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold mb-1 block">🔧 System Prompt</label>
                      <p className="text-gray-700 dark:text-gray-300 text-sm bg-gray-100 dark:bg-gray-800 rounded-lg p-3">{entry.system_prompt}</p>
                    </div>
                  )}

                  {/* User Prompt */}
                  <div>
                    <label className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold mb-1 block">💬 User Prompt</label>
                    <p className="text-gray-700 dark:text-gray-300 text-sm bg-gray-100 dark:bg-gray-800 rounded-lg p-3">{entry.user_prompt}</p>
                  </div>

                  {/* Output */}
                  <div>
                    <label className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold mb-1 block">🤖 Output</label>
                    <pre className="text-gray-800 dark:text-gray-200 text-sm bg-gray-100 dark:bg-gray-800 rounded-lg p-3 whitespace-pre-wrap font-mono">
                      {entry.output}
                    </pre>
                  </div>

                  {/* Full Metrics */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { label: 'Response Time', value: `${entry.response_time}s` },
                      { label: 'Input Tokens', value: entry.input_tokens },
                      { label: 'Output Tokens', value: entry.output_tokens },
                      { label: 'Temperature', value: entry.temperature },
                    ].map((m) => (
                      <div key={m.label} className="bg-gray-100 dark:bg-gray-800 rounded-lg p-2 text-center">
                        <p className="text-yellow-400 font-bold text-sm">{m.value}</p>
                        <p className="text-gray-600 dark:text-gray-500 text-xs">{m.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Rerun Button */}
                  <button
                    onClick={() => handleRerun(entry)}
                    className="w-full bg-yellow-400 text-gray-900 font-bold py-2 rounded-xl hover:bg-yellow-300 transition"
                  >
                    🔄 Re-run in Playground
                  </button>
                </div>
              )}
            </div>
          ))}
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