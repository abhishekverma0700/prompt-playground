'use client';

import { useState, useEffect } from 'react';
import { getPrompts, getTemplates, deletePrompt } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function Library() {
  const [prompts, setPrompts] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [showTemplates, setShowTemplates] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');
  const router = useRouter();

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  // Load prompts
  const loadPrompts = async () => {
    setLoading(true);
    const data = await getPrompts(search, category);
    if (data.success) setPrompts(data.prompts);
    setLoading(false);
  };

  // Load templates
  const loadTemplates = async () => {
    const data = await getTemplates();
    if (data.success) setTemplates(data.templates);
  };

  useEffect(() => {
    loadPrompts();
    loadTemplates();
  }, []);

  useEffect(() => {
    loadPrompts();
  }, [search, category]);

  const handleDelete = async (id) => {
    if (!confirm('Delete this prompt?')) return;
    const result = await deletePrompt(id);
    if (result.success) {
      showToast('✅ Prompt deleted!');
      loadPrompts();
    }
  };

  const handleLoadInPlayground = (prompt) => {
    // localStorage mein save karo
    localStorage.setItem('loadPrompt', JSON.stringify(prompt));
    router.push('/');
    showToast('✅ Loaded in Playground!');
  };

  const categoryColors = {
    'Content Writing': 'bg-blue-600',
    'Code & Technical': 'bg-green-600',
    'Analysis & Reasoning': 'bg-purple-600',
    'Summarization & Extraction': 'bg-orange-600',
    'Translation & Language': 'bg-pink-600',
    'General': 'bg-gray-600',
  };

  const displayItems = showTemplates ? templates : prompts;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Prompt Library</h1>
          <span className="bg-yellow-400 text-gray-900 text-xs font-bold px-3 py-1 rounded-full">
            {displayItems.length}
          </span>
        </div>
        <div className="flex gap-3 flex-wrap">
          <input
            type="text"
            placeholder="🔍 Search prompts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-yellow-400 w-full sm:w-48"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm w-full sm:w-auto"
          >
            <option value="">All Categories</option>
            <option value="Content Writing">Content Writing</option>
            <option value="Code & Technical">Code & Technical</option>
            <option value="Analysis & Reasoning">Analysis & Reasoning</option>
            <option value="Summarization & Extraction">Summarization & Extraction</option>
            <option value="Translation & Language">Translation & Language</option>
            <option value="General">General</option>
          </select>
          <button
            onClick={() => setShowTemplates(!showTemplates)}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition ${
              showTemplates
                ? 'bg-yellow-400 text-gray-900'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {showTemplates ? '📚 My Prompts' : '⭐ Templates'}
          </button>
        </div>
      </div>

      {/* Toggle Info */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3 mb-6 text-sm text-gray-600 dark:text-gray-400">
        {showTemplates
          ? '⭐ Showing built-in templates — click Load to use in playground'
          : '📚 Showing your saved prompts — click Load to use in playground'}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-gray-600 dark:text-gray-400">
          <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin mr-3"></div>
          Loading...
        </div>
      ) : displayItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-600 dark:text-gray-400">
          <span className="text-5xl mb-4">📭</span>
          <p className="text-lg">
            {showTemplates ? 'No templates found!' : 'No saved prompts yet!'}
          </p>
          <p className="text-sm mt-2">
            {!showTemplates && 'Save prompts from the Playground to see them here'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {displayItems.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:border-yellow-400 transition flex flex-col"
            >
              {/* Category Badge */}
              <div className="flex items-center justify-between mb-2">
                <span className={`text-white text-xs font-bold px-2 py-1 rounded-full ${categoryColors[item.category] || 'bg-gray-600'}`}>
                  {item.category}
                </span>
                <span className="text-xs text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                  {item.technique}
                </span>
              </div>

              {/* Name */}
              <h3 className="text-gray-900 dark:text-white font-bold text-sm mb-1">{item.name}</h3>

              {/* Description */}
              {item.description && (
                <p className="text-gray-600 dark:text-gray-400 text-xs mb-2">{item.description}</p>
              )}

              {/* Prompt Preview */}
              <p className="text-gray-600 dark:text-gray-500 text-xs bg-gray-100 dark:bg-gray-800 rounded-lg p-2 mb-3 line-clamp-2 flex-1">
                {item.user_prompt?.substring(0, 100)}...
              </p>

              {/* Params */}
              <div className="flex gap-2 text-xs text-gray-600 dark:text-gray-500 mb-3">
                <span>🌡️ {item.temperature}</span>
                <span>🪙 {item.max_tokens} tokens</span>
                {item.version && <span>v{item.version}</span>}
              </div>

              {/* Tags */}
              {item.tags && item.tags.length > 0 && (
                <div className="flex gap-1 flex-wrap mb-3">
                  {(Array.isArray(item.tags) ? item.tags : item.tags.split(',')).slice(0, 3).map((tag, i) => (
                    <span key={i} className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-full">
                      #{tag.trim()}
                    </span>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 mt-auto flex-col sm:flex-row">
                <button
                  onClick={() => handleLoadInPlayground(item)}
                  className="flex-1 bg-yellow-400 text-gray-900 text-xs font-bold py-2 rounded-lg hover:bg-yellow-300 transition"
                >
                  ▶ Load
                </button>
                {!showTemplates && (
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-200 dark:bg-red-900 text-red-700 dark:text-red-300 text-xs font-bold px-3 py-2 rounded-lg hover:bg-red-300 dark:hover:bg-red-800 transition"
                  >
                    🗑️
                  </button>
                )}
              </div>
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