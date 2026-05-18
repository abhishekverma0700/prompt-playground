// Backend ka base URL
const BASE_URL = 'https://prompt-playground-1-ubh7.onrender.com/api/templates';

// =====================
// GENERATE
// =====================
export async function generateResponse(data) {
  const res = await fetch(`${BASE_URL}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

// =====================
// COMPARE
// =====================
export async function comparePrompts(data) {
  const res = await fetch(`${BASE_URL}/api/compare`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

// =====================
// SWEEP
// =====================
export async function sweepPrompt(data) {
  const res = await fetch(`${BASE_URL}/api/sweep`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

// =====================
// TEMPLATES
// =====================
export async function getTemplates() {
  const res = await fetch(`${BASE_URL}/api/templates`);
  return res.json();
}

export async function getTemplate(id) {
  const res = await fetch(`${BASE_URL}/api/templates/${id}`);
  return res.json();
}

// =====================
// PROMPTS (Library)
// =====================
export async function getPrompts(search = '', category = '') {
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (category) params.append('category', category);
  const res = await fetch(`${BASE_URL}/api/prompts?${params}`);
  return res.json();
}

export async function savePrompt(data) {
  const res = await fetch(`${BASE_URL}/api/prompts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updatePrompt(id, data) {
  const res = await fetch(`${BASE_URL}/api/prompts/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deletePrompt(id) {
  const res = await fetch(`${BASE_URL}/api/prompts/${id}`, {
    method: 'DELETE',
  });
  return res.json();
}

// =====================
// HISTORY
// =====================
export async function getHistory() {
  const res = await fetch(`${BASE_URL}/api/history`);
  return res.json();
}

export async function rateHistory(id, rating) {
  const res = await fetch(`${BASE_URL}/api/history/${id}/rate`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rating }),
  });
  return res.json();
}

export async function clearHistory() {
  const res = await fetch(`${BASE_URL}/api/history`, {
    method: 'DELETE',
  });
  return res.json();
}

// =====================
// EXPORT / IMPORT
// =====================
export async function exportPrompts() {
  const res = await fetch(`${BASE_URL}/api/export`, {
    method: 'POST',
  });
  return res.json();
}

export async function importPrompts(prompts) {
  const res = await fetch(`${BASE_URL}/api/import`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompts }),
  });
  return res.json();
}