"use client";

import { useState } from "react";

export function EmailCapture() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    try {
      // Store in localStorage for now; replace with API call in Phase 2
      const waitlist = JSON.parse(localStorage.getItem("primer_waitlist") ?? "[]");
      waitlist.push({ email, ts: Date.now() });
      localStorage.setItem("primer_waitlist", JSON.stringify(waitlist));
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium"
        style={{ backgroundColor: "#f0effe", color: "#7F77DD" }}
      >
        <span>✓</span>
        <span>You&apos;re on the list! We&apos;ll be in touch soon.</span>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row gap-3 justify-center w-full max-w-md mx-auto"
    >
      <input
        type="email"
        required
        placeholder="your@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2"
        style={{ "--tw-ring-color": "#7F77DD" } as React.CSSProperties}
        disabled={status === "loading"}
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="px-6 py-3 rounded-xl text-white text-sm font-semibold whitespace-nowrap disabled:opacity-60"
        style={{ backgroundColor: "#7F77DD" }}
      >
        {status === "loading" ? "Saving..." : "Start free trial"}
      </button>
      {status === "error" && (
        <p className="text-red-500 text-xs mt-1">Something went wrong. Try again.</p>
      )}
    </form>
  );
}
