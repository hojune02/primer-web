const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("primer_token");
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error ?? "Request failed");
  }

  return res.json() as Promise<T>;
}

export const api = {
  auth: {
    signup: (data: { name: string; email: string; password: string; orgName: string }) =>
      request<AuthResponse>("/api/auth/signup", { method: "POST", body: JSON.stringify(data) }),
    login: (data: { email: string; password: string }) =>
      request<AuthResponse>("/api/auth/login", { method: "POST", body: JSON.stringify(data) }),
    me: () => request<MeResponse>("/api/auth/me"),
  },
  sops: {
    list: () => request<SopSummary[]>("/api/sops"),
    get: (id: string) => request<SopDetail>(`/api/sops/${id}`),
    update: (id: string, data: Partial<{ title: string; description: string; status: string }>) =>
      request(`/api/sops/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
    updateStep: (sopId: string, stepId: string, data: Partial<{ title: string; content: string; safetyNote: string | null }>) =>
      request(`/api/sops/${sopId}/steps/${stepId}`, { method: "PATCH", body: JSON.stringify(data) }),
    assign: (sopId: string, userId: string) =>
      request(`/api/sops/${sopId}/assign`, { method: "POST", body: JSON.stringify({ userId }) }),
    complete: (sopId: string, quizScore?: number) =>
      request(`/api/sops/${sopId}/complete`, { method: "POST", body: JSON.stringify({ quizScore }) }),
  },
  recordings: {
    upload: (file: File, onProgress?: (pct: number) => void) => {
      return new Promise<{ recordingId: string; sopId: string }>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        const formData = new FormData();
        formData.append("file", file);

        xhr.upload.addEventListener("progress", (e) => {
          if (e.lengthComputable && onProgress) {
            onProgress(Math.round((e.loaded / e.total) * 100));
          }
        });

        xhr.addEventListener("load", () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(JSON.parse(xhr.responseText));
          } else {
            reject(new Error("Upload failed"));
          }
        });

        xhr.addEventListener("error", () => reject(new Error("Upload failed")));

        xhr.open("POST", `${API_URL}/api/recordings/upload`);
        const token = getToken();
        if (token) xhr.setRequestHeader("Authorization", `Bearer ${token}`);
        xhr.send(formData);
      });
    },
    status: (id: string) =>
      request<RecordingStatus>(`/api/recordings/${id}/status`),
  },
  users: {
    list: () => request<TeamMember[]>("/api/users"),
    invite: (data: { email: string; name: string; roleId?: string; userPermission?: string }) =>
      request("/api/users/invite", { method: "POST", body: JSON.stringify(data) }),
  },
};

// Types
export interface AuthResponse {
  token: string;
  user: { id: string; name: string; email: string; permission: string };
  org: { id: string; name: string; plan: string; trialEndsAt: string | null };
}

export interface MeResponse {
  id: string;
  name: string;
  email: string;
  permission: string;
  org: { id: string; name: string; plan: string; trialEndsAt: string | null };
  role: { id: string; name: string } | null;
}

export interface SopSummary {
  id: string;
  title: string;
  description: string | null;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  createdAt: string;
  _count: { steps: number; assignments: number };
}

export interface SopStep {
  id: string;
  stepNumber: number;
  title: string;
  content: string;
  safetyNote: string | null;
  screenshotUrl: string | null;
  timestampRef: number | null;
}

export interface SopDetail {
  id: string;
  title: string;
  description: string | null;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  steps: SopStep[];
  quizzes: Array<{ id: string; question: string; options: string[]; correctAnswer: number }>;
  createdBy: { id: string; name: string };
  createdAt: string;
}

export interface RecordingStatus {
  status: "UPLOADING" | "TRANSCRIBING" | "GENERATING" | "COMPLETED" | "FAILED";
  sopId: string | null;
  stepsCount: number;
  error: string | null;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  permission: string;
  role: { id: string; name: string } | null;
  assignments: Array<{ sopId: string; completedAt: string | null; quizScore: number | null }>;
}
