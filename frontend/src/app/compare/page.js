'use client';

import { useState } from 'react';
import { comparePrompts } from '@/lib/api';

export default function Compare() {
  const [sysA, setSysA] = useState('');
  const [promptA, setPromptA] = useState('');
  const [tempA, setTempA] = useState(0.7);
  const [maxA, setMaxA] = useState(1024);

  const [sysB, setSysB] = useState('');
  const [promptB, setPromptB] = useState('');
  const [tempB, setTempB] = useState(0.7);
  const [maxB, setMaxB] = useState(1024);

  const [outputA, setOutputA] = useState('');
  const [outputB, setOutputB] = useState('');
  const [metricsA, setMetricsA] = useState(null);
  const [metricsB, setMetricsB] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleRunBoth = async () => {
    if (!promptA.trim() || !promptB.trim()) {
      showToast('❌ Both prompts are required!');
      return;
    }
    setLoading(true);
    setOutputA('');
    setOutputB('');

    const result = await comparePrompts({
      prompt_a: {
        user_prompt: promptA,
        system_prompt: sysA,
        temperature: tempA,
        max_tokens: maxA,
      },
      prompt_b: {
        user_prompt: promptB,
        system_prompt: sysB,
        temperature: tempB,
        max_tokens: maxB,
      },
    });

    setLoading(false);

    if (result.success) {
      setOutputA(result.result_a.output || result.result_a.error);
      setOutputB(result.result_b.output || result.result_b.error);
      setMetricsA(result.result_a);
      setMetricsB(result.result_b);
    } else {
      showToast('❌ Compare failed!');
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Compare</h1>
          <span className="bg-yellow-400 text-gray-900 text-xs font-bold px-3 py-1 rounded-full">A vs B</span>
        </div>
        <button
          onClick={handleRunBoth}
          disabled={loading}
          className="bg-yellow-400 text-gray-900 font-bold px-6 py-2 rounded-xl hover:bg-yellow-300 transition disabled:opacity-50"
        >
          {loading ? '⏳ Running...' : '▶ Run Both'}
        </button>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* PROMPT A */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-blue-300 dark:border-blue-700 p-4 space-y-3">
          <div className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full w-fit">
            PROMPT A
          </div>
          <textarea
            value={sysA}
            onChange={(e) => setSysA(e.target.value)}
            placeholder="System prompt A..."
            rows={2}
            className="w-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:border-blue-400"
          />
          <textarea
            value={promptA}
            onChange={(e) => setPromptA(e.target.value)}
            placeholder="Enter prompt A..."
            rows={5}
            className="w-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:border-blue-400"
          />

          {/* Params */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-600 dark:text-gray-400">Temperature</span>
                <span className="text-blue-400 font-bold">{tempA}</span>
              </div>
              <input type="range" min="0" max="2" step="0.1" value={tempA}
                onChange={(e) => setTempA(parseFloat(e.target.value))}
                className="w-full accent-blue-400" />
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-600 dark:text-gray-400">Max Tokens</span>
                <span className="text-blue-400 font-bold">{maxA}</span>
              </div>
              <input type="range" min="50" max="4096" step="50" value={maxA}
                onChange={(e) => setMaxA(parseInt(e.target.value))}
                className="w-full accent-blue-400" />
            </div>
          </div>

          {/* Output A */}
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 min-h-40">
            {loading ? (
              <div className="flex items-center justify-center h-32 text-gray-400">
                <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mr-2"></div>
                Generating...
              </div>
            ) : outputA ? (
              <>
                {metricsA && (
                  <div className="flex gap-3 text-xs text-gray-600 dark:text-gray-400 mb-2 flex-wrap">
                    <span>⏱️ {metricsA.response_time}s</span>
                    <span>🪙 {metricsA.total_tokens} tokens</span>
                  </div>
                )}
                <pre className="text-gray-800 dark:text-gray-200 text-sm whitespace-pre-wrap font-mono">{outputA}</pre>
              </>
            ) : (
              <div className="flex items-center justify-center h-32 text-gray-600">
                <p>Output A will appear here</p>
              </div>
            )}
          </div>
        </div>

        {/* PROMPT B */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-green-300 dark:border-green-700 p-4 space-y-3">
          <div className="bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full w-fit">
            PROMPT B
          </div>
          <textarea
            value={sysB}
            onChange={(e) => setSysB(e.target.value)}
            placeholder="System prompt B..."
            rows={2}
            className="w-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:border-green-400"
          />
          <textarea
            value={promptB}
            onChange={(e) => setPromptB(e.target.value)}
            placeholder="Enter prompt B..."
            rows={5}
            className="w-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:border-green-400"
          />

          {/* Params */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-600 dark:text-gray-400">Temperature</span>
                <span className="text-green-400 font-bold">{tempB}</span>
              </div>
              <input type="range" min="0" max="2" step="0.1" value={tempB}
                onChange={(e) => setTempB(parseFloat(e.target.value))}
                className="w-full accent-green-400" />
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-600 dark:text-gray-400">Max Tokens</span>
                <span className="text-green-400 font-bold">{maxB}</span>
              </div>
              <input type="range" min="50" max="4096" step="50" value={maxB}
                onChange={(e) => setMaxB(parseInt(e.target.value))}
                className="w-full accent-green-400" />
            </div>
          </div>

          {/* Output B */}
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 min-h-40">
            {loading ? (
              <div className="flex items-center justify-center h-32 text-gray-400">
                <div className="w-6 h-6 border-2 border-green-400 border-t-transparent rounded-full animate-spin mr-2"></div>
                Generating...
              </div>
            ) : outputB ? (
              <>
                {metricsB && (
                  <div className="flex gap-3 text-xs text-gray-600 dark:text-gray-400 mb-2 flex-wrap">
                    <span>⏱️ {metricsB.response_time}s</span>
                    <span>🪙 {metricsB.total_tokens} tokens</span>
                  </div>
                )}
                <pre className="text-gray-800 dark:text-gray-200 text-sm whitespace-pre-wrap font-mono">{outputB}</pre>
              </>
            ) : (
              <div className="flex items-center justify-center h-32 text-gray-600">
                <p>Output B will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-gray-900 dark:bg-gray-800 text-white px-4 py-3 rounded-xl shadow-lg border border-gray-700 dark:border-gray-600 z-50">
          {toast}
        </div>
      )}
    </div>
  );
}