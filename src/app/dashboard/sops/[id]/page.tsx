"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { api, SopDetail, SopStep } from "@/lib/api";

function EditableText({
  value,
  onSave,
  multiline = false,
  className = "",
}: {
  value: string;
  onSave: (v: string) => Promise<void>;
  multiline?: boolean;
  className?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [saving, setSaving] = useState(false);

  async function commit() {
    if (draft === value) {
      setEditing(false);
      return;
    }
    setSaving(true);
    await onSave(draft);
    setSaving(false);
    setEditing(false);
  }

  if (editing) {
    const props = {
      value: draft,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setDraft(e.target.value),
      onBlur: commit,
      onKeyDown: (e: React.KeyboardEvent) => {
        if (e.key === "Escape") { setDraft(value); setEditing(false); }
        if (!multiline && e.key === "Enter") commit();
      },
      disabled: saving,
      autoFocus: true,
      className: `w-full bg-purple-50 border border-purple-300 rounded px-2 py-1 text-sm focus:outline-none ${className}`,
    };
    return multiline ? (
      <textarea rows={3} {...props} />
    ) : (
      <input type="text" {...props} />
    );
  }

  return (
    <span
      className={`cursor-text hover:bg-gray-100 rounded px-1 -mx-1 transition-colors ${className}`}
      onClick={() => setEditing(true)}
      title="Click to edit"
    >
      {value}
    </span>
  );
}

export default function SopDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [sop, setSop] = useState<SopDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    api.sops
      .get(id)
      .then(setSop)
      .catch(() => router.push("/dashboard"))
      .finally(() => setLoading(false));
  }, [id, router]);

  async function updateTitle(title: string) {
    await api.sops.update(id, { title });
    setSop((s) => s && { ...s, title });
  }

  async function updateDescription(description: string) {
    await api.sops.update(id, { description });
    setSop((s) => s && { ...s, description });
  }

  async function updateStepField(
    step: SopStep,
    field: "title" | "content" | "safetyNote",
    value: string
  ) {
    await api.sops.updateStep(id, step.id, { [field]: value });
    setSop((s) =>
      s && {
        ...s,
        steps: s.steps.map((st) =>
          st.id === step.id ? { ...st, [field]: value } : st
        ),
      }
    );
  }

  async function togglePublish() {
    if (!sop) return;
    setPublishing(true);
    const newStatus = sop.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    await api.sops.update(id, { status: newStatus });
    setSop((s) => s && { ...s, status: newStatus });
    setPublishing(false);
  }

  if (loading || !sop) {
    return (
      <div className="flex items-center justify-center py-20">
        <div
          className="w-6 h-6 rounded-full border-2 animate-spin"
          style={{ borderColor: "#7F77DD", borderTopColor: "transparent" }}
        />
      </div>
    );
  }

  return (
    <div className="px-8 py-8 max-w-3xl">
      {/* Back */}
      <button
        onClick={() => router.push("/dashboard")}
        className="text-sm text-gray-400 hover:text-gray-700 mb-6 flex items-center gap-1"
      >
        ← SOPs
      </button>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-2">
        <h1 className="text-2xl font-bold text-gray-900 flex-1">
          <EditableText value={sop.title} onSave={updateTitle} className="font-bold text-2xl" />
        </h1>
        <button
          onClick={togglePublish}
          disabled={publishing}
          className={`shrink-0 px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-60 ${
            sop.status === "PUBLISHED"
              ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
              : "text-white"
          }`}
          style={sop.status !== "PUBLISHED" ? { backgroundColor: "#7F77DD" } : {}}
        >
          {publishing
            ? "..."
            : sop.status === "PUBLISHED"
            ? "Unpublish"
            : "Publish"}
        </button>
      </div>

      {/* Description */}
      <p className="text-gray-500 text-sm mb-8">
        <EditableText
          value={sop.description ?? "Add a description..."}
          onSave={updateDescription}
          multiline
        />
      </p>

      {/* Meta */}
      <div className="flex items-center gap-4 text-xs text-gray-400 mb-8">
        <span>{sop.steps.length} steps</span>
        <span>Created by {sop.createdBy.name}</span>
        <span>{new Date(sop.createdAt).toLocaleDateString()}</span>
        <span
          className={`px-2 py-0.5 rounded-full font-medium ${
            sop.status === "PUBLISHED"
              ? "bg-green-50 text-green-700"
              : sop.status === "DRAFT"
              ? "bg-yellow-50 text-yellow-700"
              : "bg-gray-100 text-gray-500"
          }`}
        >
          {sop.status.charAt(0) + sop.status.slice(1).toLowerCase()}
        </span>
      </div>

      {/* Steps */}
      <div className="flex flex-col gap-4">
        {sop.steps.map((step) => (
          <div
            key={step.id}
            className="bg-white rounded-xl border border-gray-100 p-5 flex gap-4"
          >
            {/* Step number */}
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5"
              style={{ backgroundColor: "#7F77DD" }}
            >
              {step.stepNumber}
            </div>

            <div className="flex-1 flex flex-col gap-2">
              {/* Step title */}
              <h3 className="font-semibold text-gray-900 text-sm">
                <EditableText
                  value={step.title}
                  onSave={(v) => updateStepField(step, "title", v)}
                  className="font-semibold"
                />
              </h3>

              {/* Step content */}
              <p className="text-gray-600 text-sm leading-relaxed">
                <EditableText
                  value={step.content}
                  onSave={(v) => updateStepField(step, "content", v)}
                  multiline
                />
              </p>

              {/* Safety note */}
              {step.safetyNote && (
                <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-xs text-amber-800">
                  <span className="shrink-0">⚠️</span>
                  <EditableText
                    value={step.safetyNote}
                    onSave={(v) => updateStepField(step, "safetyNote", v)}
                  />
                </div>
              )}

              {step.timestampRef != null && (
                <span className="text-xs text-gray-400">
                  ~{Math.floor(step.timestampRef / 60)}:{String(step.timestampRef % 60).padStart(2, "0")} in video
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Quiz preview */}
      {sop.quizzes.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Quiz ({sop.quizzes.length} questions)
          </h2>
          <div className="flex flex-col gap-3">
            {sop.quizzes.map((q, i) => (
              <div key={q.id} className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm font-medium text-gray-900 mb-2">
                  {i + 1}. {q.question}
                </p>
                <ul className="flex flex-col gap-1">
                  {(q.options as string[]).map((opt, j) => (
                    <li
                      key={j}
                      className={`text-xs px-2 py-1 rounded ${
                        j === q.correctAnswer
                          ? "bg-green-100 text-green-800 font-medium"
                          : "text-gray-500"
                      }`}
                    >
                      {String.fromCharCode(65 + j)}. {opt}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
