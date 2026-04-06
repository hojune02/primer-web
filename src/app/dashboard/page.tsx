"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api, SopSummary } from "@/lib/api";

const STATUS_STYLES = {
  DRAFT: "bg-yellow-50 text-yellow-700",
  PUBLISHED: "bg-green-50 text-green-700",
  ARCHIVED: "bg-gray-100 text-gray-500",
};

export default function DashboardPage() {
  const [sops, setSops] = useState<SopSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.sops
      .list()
      .then(setSops)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">SOP Library</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {sops.length} procedure{sops.length !== 1 ? "s" : ""} in your library
          </p>
        </div>
        <Link
          href="/dashboard/record"
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-white text-sm font-semibold"
          style={{ backgroundColor: "#7F77DD" }}
        >
          <span>🎥</span>
          Record new SOP
        </Link>
      </div>

      {/* Content */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <div
            className="w-6 h-6 rounded-full border-2 animate-spin"
            style={{ borderColor: "#7F77DD", borderTopColor: "transparent" }}
          />
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && sops.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="text-5xl mb-4">📋</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No SOPs yet</h2>
          <p className="text-gray-500 text-sm mb-6 max-w-sm">
            Record a 2-minute video of any job procedure and Primer will generate your first SOP automatically.
          </p>
          <Link
            href="/dashboard/record"
            className="px-5 py-2.5 rounded-lg text-white text-sm font-semibold"
            style={{ backgroundColor: "#7F77DD" }}
          >
            Record your first SOP
          </Link>
        </div>
      )}

      {!loading && sops.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sops.map((sop) => (
            <Link
              key={sop.id}
              href={`/dashboard/sops/${sop.id}`}
              className="bg-white rounded-xl border border-gray-100 p-5 hover:border-purple-200 hover:shadow-sm transition-all flex flex-col gap-3"
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-gray-900 text-sm leading-snug">{sop.title}</h3>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${
                    STATUS_STYLES[sop.status]
                  }`}
                >
                  {sop.status.charAt(0) + sop.status.slice(1).toLowerCase()}
                </span>
              </div>
              {sop.description && (
                <p className="text-xs text-gray-500 line-clamp-2">{sop.description}</p>
              )}
              <div className="flex items-center gap-4 text-xs text-gray-400 pt-1 border-t border-gray-50">
                <span>{sop._count.steps} steps</span>
                <span>{sop._count.assignments} assigned</span>
                <span>{new Date(sop.createdAt).toLocaleDateString()}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
