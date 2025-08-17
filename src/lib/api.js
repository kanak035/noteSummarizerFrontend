


//  VITE_API_BASE=http://localhost:5000
const BASE = (import.meta.env.VITE_LIVE_URL || "").replace(/\/+$/, "");

async function fetchWithTimeout(url, opts = {}, ms = 30000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), ms);
  try {
    const res = await fetch(url, { ...opts, signal: controller.signal });
    return res;
  } finally {
    clearTimeout(id);
  }
}

/**
 * Call backend to summarize text with OpenAI
 * @param {{ transcript: string, instruction?: string }} body
 * @returns {Promise<string>} summary markdown/text
 */
export async function summarize({ transcript, instruction = "" }) {
  const res = await fetchWithTimeout(`${BASE}/api/summarize`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ transcript, instruction }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Summarize failed (${res.status})`);
  }
  return data.summary || "";
}

/**
 * Send the (possibly edited) summary via email
 * @param {{ to: string, summary: string, subject?: string }} body
 * @returns {Promise<any>} backend response
 */
export async function sendEmail({ to, summary, subject = "Meeting Summary" }) {
  const res = await fetchWithTimeout(`${BASE}/api/send`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ to, summary, subject }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Email send failed (${res.status})`);
  }
  return data; 
}


export default { summarize, sendEmail };
