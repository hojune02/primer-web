"use client";

import { AuthResponse } from "./api";

export function saveSession(res: AuthResponse) {
  localStorage.setItem("primer_token", res.token);
  localStorage.setItem("primer_user", JSON.stringify(res.user));
  localStorage.setItem("primer_org", JSON.stringify(res.org));
}

export function clearSession() {
  localStorage.removeItem("primer_token");
  localStorage.removeItem("primer_user");
  localStorage.removeItem("primer_org");
}

export function getStoredUser() {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("primer_user");
  return raw ? JSON.parse(raw) : null;
}

export function isLoggedIn(): boolean {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem("primer_token");
}
