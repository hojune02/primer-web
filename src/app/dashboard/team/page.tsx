"use client";

import { useEffect, useState } from "react";
import { api, TeamMember } from "@/lib/api";

export default function TeamPage() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteForm, setInviteForm] = useState({ name: "", email: "" });
  const [inviting, setInviting] = useState(false);
  const [inviteError, setInviteError] = useState("");
  const [inviteSuccess, setInviteSuccess] = useState("");

  useEffect(() => {
    api.users
      .list()
      .then(setTeam)
      .finally(() => setLoading(false));
  }, []);

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    setInviteError("");
    setInviteSuccess("");
    setInviting(true);
    try {
      const res = await api.users.invite(inviteForm) as { user: TeamMember; tempPassword: string };
      setTeam((t) => [...t, res.user]);
      setInviteSuccess(
        `Invited! Temporary password: ${res.tempPassword} — share this with ${inviteForm.name}.`
      );
      setInviteForm({ name: "", email: "" });
      setShowInvite(false);
    } catch (err) {
      setInviteError(err instanceof Error ? err.message : "Invite failed");
    } finally {
      setInviting(false);
    }
  }

  const completionRate = (member: TeamMember) => {
    if (member.assignments.length === 0) return null;
    const done = member.assignments.filter((a) => a.completedAt).length;
    return Math.round((done / member.assignments.length) * 100);
  };

  return (
    <div className="px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team</h1>
          <p className="text-sm text-gray-500 mt-0.5">{team.length} member{team.length !== 1 ? "s" : ""}</p>
        </div>
        <button
          onClick={() => setShowInvite(true)}
          className="px-4 py-2.5 rounded-lg text-white text-sm font-semibold"
          style={{ backgroundColor: "#7F77DD" }}
        >
          + Invite member
        </button>
      </div>

      {/* Success banner */}
      {inviteSuccess && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm text-green-800">
          {inviteSuccess}
        </div>
      )}

      {/* Invite modal */}
      {showInvite && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-xl">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Invite team member</h2>
            <form onSubmit={handleInvite} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  required
                  placeholder="John Smith"
                  value={inviteForm.name}
                  onChange={(e) => setInviteForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  placeholder="john@yourcompany.com"
                  value={inviteForm.email}
                  onChange={(e) => setInviteForm((f) => ({ ...f, email: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>
              {inviteError && (
                <p className="text-sm text-red-600">{inviteError}</p>
              )}
              <div className="flex gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setShowInvite(false)}
                  className="flex-1 py-2.5 rounded-lg bg-gray-100 text-gray-700 text-sm font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={inviting}
                  className="flex-1 py-2.5 rounded-lg text-white text-sm font-semibold disabled:opacity-60"
                  style={{ backgroundColor: "#7F77DD" }}
                >
                  {inviting ? "Inviting..." : "Send invite"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Team list */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div
            className="w-6 h-6 rounded-full border-2 animate-spin"
            style={{ borderColor: "#7F77DD", borderTopColor: "transparent" }}
          />
        </div>
      ) : team.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="text-5xl mb-4">👥</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No team members yet</h2>
          <p className="text-gray-500 text-sm mb-6 max-w-sm">
            Invite your technicians and they&apos;ll be able to access SOPs from their phone.
          </p>
          <button
            onClick={() => setShowInvite(true)}
            className="px-5 py-2.5 rounded-lg text-white text-sm font-semibold"
            style={{ backgroundColor: "#7F77DD" }}
          >
            Invite first member
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-xs text-gray-400 font-medium">
                <th className="text-left px-5 py-3">Name</th>
                <th className="text-left px-5 py-3">Role</th>
                <th className="text-left px-5 py-3">Permission</th>
                <th className="text-left px-5 py-3">Training</th>
              </tr>
            </thead>
            <tbody>
              {team.map((member, i) => {
                const rate = completionRate(member);
                return (
                  <tr
                    key={member.id}
                    className={`${i !== team.length - 1 ? "border-b border-gray-50" : ""}`}
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                          style={{ backgroundColor: "#7F77DD" }}
                        >
                          {member.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{member.name}</p>
                          <p className="text-xs text-gray-400">{member.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-gray-500">
                      {member.role?.name ?? "—"}
                    </td>
                    <td className="px-5 py-3">
                      <span className="capitalize text-gray-600">
                        {member.permission.toLowerCase()}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      {rate === null ? (
                        <span className="text-gray-400">No assignments</span>
                      ) : (
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-20 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${rate}%`,
                                backgroundColor: rate === 100 ? "#16a34a" : "#7F77DD",
                              }}
                            />
                          </div>
                          <span className="text-xs text-gray-500">{rate}%</span>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
