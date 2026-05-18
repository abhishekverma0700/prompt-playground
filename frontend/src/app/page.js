'use client';

import { useState, useEffect } from 'react';
import { generateResponse, getTemplates, savePrompt } from '@/lib/api';

const TECHNIQUES = {
  'zero-shot': 'Direct instruction without examples. Best for simple, clear tasks.',
  'few-shot': 'Provide 2-3 examples before the task. Improves accuracy significantly.',
  'chain-of-thought': 'Ask model to think step by step. Great for reasoning & math.',
  'role-based': 'Assign a persona to the AI. Example: "You are a senior developer..."',
  'output-format': 'Specify exact output format like JSON, CSV, bullet points.',
  'negative': 'Tell model what NOT to do. Example: "Do not use technical jargon."',
};

export default function Playground() {
  const [technique, setTechnique] = useState('zero-shot');
  const [systemPrompt, setSystemPrompt] = useState('');
  const [userPrompt, setUserPrompt] = useState('');
  const [temperature, setTemperature] = useState(0.7);
  const [topP, setTopP] = useState(1.0);
  const [maxTokens, setMaxTokens] = useState(1024);
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [metrics, setMetrics] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [historyId, setHistoryId] = useState(null);
  const [rating, setRating] = useState(0);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [promptName, setPromptName] = useState('');
  const [promptDesc, setPromptDesc] = useState('');
  const [promptCategory, setPromptCategory] = useState('General');
  const [toast, setToast] = useState('');

  // Templates load karo
  useEffect(() => {
    getTemplates().then((data) => {
      if (data.success) setTemplates(data.templates);
    });
  }, []);

  // Toast show karo
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  // Template load karo
  const loadTemplate = (e) => {
    const id = parseInt(e.target.value);
    if (!id) return;
    const t = templates.find((t) => t.id === id);
    if (t) {
      setSystemPrompt(t.system_prompt || '');
      setUserPrompt(t.user_prompt || '');
      setTemperature(t.temperature || 0.7);
      setMaxTokens(t.max_tokens || 1024);
      setTechnique(t.technique || 'zero-shot');
      showToast(`✅ Template "${t.name}" loaded!`);
    }
  };

  // Run karo
  const handleRun = async () => {
    if (!userPrompt.trim()) {
      showToast('❌ Please enter a prompt!');
      return;
    }
    setLoading(true);
    setOutput('');
    setMetrics(null);

    const result = await generateResponse({
      user_prompt: userPrompt,
      system_prompt: systemPrompt,
      temperature,
      top_p: topP,
      max_tokens: maxTokens,
      technique,
    });

    setLoading(false);

    if (result.success) {
      setOutput(result.output);
      setMetrics({
        responseTime: result.response_time,
        totalTokens: result.total_tokens,
        inputTokens: result.input_tokens,
        outputTokens: result.output_tokens,
        model: result.model,
      });
      setHistoryId(result.history_id);
      setRating(0);
    } else {
      setOutput(`❌ Error: ${result.error}`);
    }
  };

  // Save karo
  const handleSave = async () => {
    if (!promptName.trim()) {
      showToast('❌ Please enter a name!');
      return;
    }
    const result = await savePrompt({
      name: promptName,
      description: promptDesc,
      system_prompt: systemPrompt,
      user_prompt: userPrompt,
      category: promptCategory,
      technique,
      temperature,
      max_tokens: maxTokens,
      top_p: topP,
    });
    if (result.success) {
      showToast('✅ Prompt saved!');
      setShowSaveModal(false);
      setPromptName('');
    } else {
      showToast('❌ Save failed!');
    }
  };

  // Copy karo
  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    showToast('✅ Copied to clipboard!');
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-white">Playground</h1>
          <span className="bg-yellow-400 text-gray-900 text-xs font-bold px-3 py-1 rounded-full uppercase">
            {technique}
          </span>
        </div>
        <select
          value={technique}
          onChange={(e) => setTechnique(e.target.value)}
          className="bg-gray-800 text-white border border-gray-600 rounded-lg px-3 py-2 text-sm"
        >
          {Object.keys(TECHNIQUES).map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      {/* Technique Info */}
      <div className="bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg p-3 mb-6 text-sm text-blue-700 dark:text-blue-300">
        ℹ️ {TECHNIQUES[technique]}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* LEFT: Editor */}
        <div className="space-y-4">

          {/* Template Selector */}
          <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <label className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold mb-2 block">📋 Load Template</label>
            <select
              onChange={loadTemplate}
              className="w-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm"
            >
              <option value="">-- Select a template --</option>
              {templates.map((t) => (
                <option key={t.id} value={t.id}>{t.name} ({t.category})</option>
              ))}
            </select>
          </div>

          {/* System Prompt */}
          <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <label className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold mb-2 block">🔧 System Prompt</label>
            <textarea
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              placeholder="You are a helpful assistant..."
              rows={3}
              className="w-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:border-yellow-400"
            />
          </div>

          {/* User Prompt */}
          <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <label className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold mb-2 block">💬 User Prompt</label>
            <textarea
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              placeholder="Enter your prompt here..."
              rows={8}
              className="w-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:border-yellow-400"
            />
            <div className="flex gap-4 mt-2 text-xs text-gray-500 dark:text-gray-500">
              <span>Characters: <strong className="text-gray-700 dark:text-gray-300">{userPrompt.length}</strong></span>
              <span>Est. Tokens: <strong className="text-gray-700 dark:text-gray-300">{Math.ceil(userPrompt.length / 4)}</strong></span>
            </div>
          </div>

          {/* Parameters */}
          <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <label className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold mb-3 block">⚙️ Parameters</label>
            <div className="space-y-4">

              {/* Temperature */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-300">Temperature</span>
                  <span className="text-yellow-400 font-bold">{temperature}</span>
                </div>
                <input
                  type="range" min="0" max="2" step="0.1"
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  className="w-full accent-yellow-400"
                />
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Low = focused | High = creative</p>
              </div>

              {/* Top-P */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-300">Top-P</span>
                  <span className="text-yellow-400 font-bold">{topP}</span>
                </div>
                <input
                  type="range" min="0" max="1" step="0.1"
                  value={topP}
                  onChange={(e) => setTopP(parseFloat(e.target.value))}
                  className="w-full accent-yellow-400"
                />
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Nucleus sampling</p>
              </div>

              {/* Max Tokens */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-300">Max Tokens</span>
                  <span className="text-yellow-400 font-bold">{maxTokens}</span>
                </div>
                <input
                  type="range" min="50" max="4096" step="50"
                  value={maxTokens}
                  onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                  className="w-full accent-yellow-400"
                />
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Response length limit</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleRun}
              disabled={loading}
              className="flex-1 bg-yellow-400 text-gray-900 font-bold py-3 rounded-xl hover:bg-yellow-300 transition disabled:opacity-50"
            >
              {loading ? '⏳ Generating...' : '▶ Run'}
            </button>
            <button
              onClick={() => setShowSaveModal(true)}
              className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-bold py-3 px-6 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            >
              💾 Save
            </button>
            <button
              onClick={() => { setUserPrompt(''); setSystemPrompt(''); setOutput(''); setMetrics(null); }}
              className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-bold py-3 px-4 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            >
              🗑️
            </button>
          </div>
        </div>

        {/* RIGHT: Output */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col">

          {/* Output Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <span className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold">🤖 Output</span>
            {output && (
              <button onClick={handleCopy} className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-1 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">
                📋 Copy
              </button>
            )}
          </div>

          {/* Metrics */}
          {metrics && (
            <div className="flex gap-4 px-4 py-2 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400 flex-wrap">
              <span>⏱️ {metrics.responseTime}s</span>
              <span>🪙 {metrics.totalTokens} tokens</span>
              <span>📥 {metrics.inputTokens} in</span>
              <span>📤 {metrics.outputTokens} out</span>
              <span>🤖 {metrics.model}</span>
              {/* Star Rating */}
              <div className="flex gap-1 ml-auto">
                {[1,2,3,4,5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className={`text-lg ${star <= rating ? 'text-yellow-400' : 'text-gray-600'}`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Output Content */}
          <div className="flex-1 p-4 overflow-y-auto min-h-96">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin mb-3"></div>
                <p className="dark:text-gray-300">Generating response...</p>
              </div>
            ) : output ? (
              <pre className="text-gray-800 dark:text-gray-200 text-sm whitespace-pre-wrap font-mono leading-relaxed">{output}</pre>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-600">
                <span className="text-4xl mb-3">🤖</span>
                <p>Run a prompt to see output here</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Save Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">💾 Save Prompt</h2>
              <button onClick={() => setShowSaveModal(false)} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white">✕</button>
            </div>
            <div className="space-y-3">
              <input
                type="text" placeholder="Prompt name *"
                value={promptName}
                onChange={(e) => setPromptName(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-yellow-400"
              />
              <input
                type="text" placeholder="Description"
                value={promptDesc}
                onChange={(e) => setPromptDesc(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-yellow-400"
              />
              <select
                value={promptCategory}
                onChange={(e) => setPromptCategory(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm"
              >
                <option value="General">General</option>
                <option value="Content Writing">Content Writing</option>
                <option value="Code & Technical">Code & Technical</option>
                <option value="Analysis & Reasoning">Analysis & Reasoning</option>
                <option value="Summarization & Extraction">Summarization & Extraction</option>
                <option value="Translation & Language">Translation & Language</option>
              </select>
            </div>
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setShowSaveModal(false)}
                className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 bg-yellow-400 text-gray-900 font-bold py-2 rounded-lg hover:bg-yellow-300"
              >
                Save
              </button>
            </div>
          </div>
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