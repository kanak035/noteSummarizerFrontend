// src/components/Summarizer.jsx
import React, { useState, useRef, useCallback } from "react";
import { summarize, sendEmail } from "../lib/api";

const PRESETS = [
  "Summarize in 5 bullet points for executives.",
  "Highlight only action items with owners and due dates.",
  "Summarize decisions taken and open risks.",
  "Create next steps with timelines.",
 
];

const EMAIL_REGEX =
  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*)@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}/gi;

const Summarizer = () => {
  const [transcript, setTranscript] = useState("");
  const [instruction, setInstruction] = useState("");
  const [summary, setSummary] = useState("");
  const [emails, setEmails] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const [preview, setPreview] = useState(false); 
  const [previewEditable, setPreviewEditable] = useState(false); 
  const fileRef = useRef(null);

  const clearFlash = () => {
    setError("");
    setOk("");
  };

  // Drag & Drop handlers
  const onDrop = useCallback(async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer?.files?.[0];
    if (!file) return;
    const text = await file.text();
    setTranscript(text);
  }, []);

  const onDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // File picker
  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    setTranscript(text);
  }

  // Generate summary
  async function onGenerate() {
    clearFlash();
    if (!transcript.trim()) {
      setError("Please upload or paste a transcript.");
      return;
    }
    setLoading(true);
    try {
      const s = await summarize({ transcript, instruction });
      setSummary(s);
      setOk("Summary generated.");
      
      setPreview(false);         
      setPreviewEditable(false);  
    } catch (err) {
      setError(err.message || "Failed to generate summary");
    } finally {
      setLoading(false);
    }
  }

  // Send email
  async function onSend() {
    clearFlash();
    if (!summary.trim()) return setError("Summary is empty.");
    if (!emails.trim()) return setError("Add at least one recipient email.");

    const matches = emails.match(EMAIL_REGEX) || [];
    if (matches.length === 0) {
      return setError("Please enter valid recipient emails (comma/space separated).");
    }

    setSending(true);
    try {
      await sendEmail({ to: emails, summary });
      setOk("Email sent successfully!");
    } catch (err) {
      setError(err.message || "Failed to send email");
    } finally {
      setSending(false);
    }
  }

  const transcriptChars = transcript.length;
  const summaryChars = summary.length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">AI Meeting Summarizer</h1>
        <p className="text-sm text-gray-600">
          Upload or paste a transcript, add an instruction, generate a summary, edit, and share via email.
        </p>
      </div>

      {/* flash messages */}
      {error && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-red-800">
          {error}
        </div>
      )}
      {ok && (
        <div className="mb-4 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-800">
          {ok}
        </div>
      )}

      {/* layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT COLUMN */}
        <div className="space-y-6">
          {/* Instruction */}
          <section className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-medium">Instruction</h2>
              <span className="text-xs text-gray-500">optional</span>
            </div>
            <input
              className="w-full border rounded-md p-2"
              type="text"
              placeholder='e.g., "Summarize in bullet points for executives"'
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              onFocus={clearFlash}
            />

            {/* presets */}
            <div className="mt-3 flex flex-wrap gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p}
                  type="button"
                  className="text-xs rounded-full border px-3 py-1 hover:bg-gray-50"
                  onClick={() => setInstruction(p)}
                >
                  {p}
                </button>
              ))}
            </div>

            <div className="mt-4">
              <button
                onClick={onGenerate}
                disabled={loading}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-blue-600 text-white disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="4" fill="none" opacity="0.25" />
                      <path d="M22 12a10 10 0 0 1-10 10" stroke="white" strokeWidth="4" fill="none" />
                    </svg>
                    Generating…
                  </>
                ) : (
                  "Generate Summary"
                )}
              </button>
            </div>
          </section>

          {/* Transcript */}
          <section className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <h2 className="font-medium mb-3">Transcript</h2>
              <span className="text-xs text-gray-500">{transcriptChars.toLocaleString()} chars</span>
            </div>

            {/* drop zone */}
            <div
              onDrop={onDrop}
              onDragOver={onDragOver}
              className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg py-8 text-center hover:bg-gray-50 transition"
            >
              <p className="text-sm text-gray-600">
                Drag & drop a <span className="font-medium">.txt</span> file here
              </p>
              <p className="text-xs text-gray-500 mt-1">or</p>
              <label className="mt-2 inline-block cursor-pointer">
                <span className="px-3 py-1 rounded-md bg-gray-800 text-white text-sm">Choose file</span>
                <input
                  ref={fileRef}
                  type="file"
                  accept=".txt"
                  onChange={handleFile}
                  className="hidden"
                />
              </label>
            </div>

            <textarea
              className="w-full mt-3 h-48 border rounded-md p-3"
              placeholder="Or paste transcript here…"
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              onFocus={clearFlash}
            />

            <div className="mt-2 flex gap-2">
              <button
                type="button"
                className="px-3 py-1 rounded-md border"
                onClick={() => {
                  if (fileRef.current) fileRef.current.value = "";
                  setTranscript("");
                }}
              >
                Clear
              </button>
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          {/* Summary */}
          <section className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <h2 className="font-medium mb-3">Summary</h2>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-500">{summaryChars.toLocaleString()} chars</span>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    className="h-4 w-4"
                    checked={preview}
                    onChange={(e) => setPreview(e.target.checked)}
                  />
                  Preview
                </label>
                {preview && (
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      className="h-4 w-4"
                      checked={previewEditable}
                      onChange={(e) => setPreviewEditable(e.target.checked)}
                    />
                    Editable preview
                  </label>
                )}
              </div>
            </div>

            {!preview ? (
              // Editable textarea (default)
              <textarea
                className="w-full h-72 border rounded-md p-3"
                placeholder="Summary will appear here…"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                onFocus={clearFlash}
              />
            ) : (
              // Preview look; optionally contentEditable
              <div
                className="border rounded-md p-3 min-h-[18rem] bg-gray-50 text-sm whitespace-pre-wrap"
                contentEditable={previewEditable}
                suppressContentEditableWarning
                onInput={previewEditable ? (e) => setSummary(e.currentTarget.textContent || "") : undefined}
              >
                {summary || "Nothing to preview yet."}
              </div>
            )}

            <div className="mt-2 flex gap-2">
              <button
                type="button"
                className="px-3 py-1 rounded-md border"
                onClick={() => setSummary("")}
              >
                Clear
              </button>
              <button
                type="button"
                className="px-3 py-1 rounded-md border"
                onClick={() => navigator.clipboard.writeText(summary || "")}
              >
                Copy
              </button>
            </div>
          </section>

          {/* Email */}
          <section className="bg-white p-4 rounded-lg shadow-sm border">
            <h2 className="font-medium mb-3">Share via Email</h2>
            <input
              className="w-full border rounded-md p-2"
              type="text"
              placeholder="Recipient emails (comma or space separated)"
              value={emails}
              onChange={(e) => setEmails(e.target.value)}
              onFocus={clearFlash}
            />
            <div className="mt-3">
              <button
                onClick={onSend}
                disabled={sending}
                className="px-4 py-2 rounded-md bg-emerald-600 text-white disabled:opacity-60"
              >
                {sending ? "Sending…" : "Send Summary"}
              </button>
            </div>
          </section>
        </div>
      </div>

     
    </div>
  );
};

export default Summarizer;
