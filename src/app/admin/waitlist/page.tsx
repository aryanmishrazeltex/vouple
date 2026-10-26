"use client";

import React, { useState } from "react";
import Link from "next/link";
import { WaitlistRecord } from "@/types/waitlist";
import { InvitationRecord } from "@/types/invitation";
import {
  Copy,
  Check,
  Send,
  Ban,
  Clock,
  Sparkles,
  Users,
  KeyRound,
  X,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";

export default function AdminWaitlistPage() {
  const [accessKey, setAccessKey] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"applicants" | "invitations">("applicants");

  // Data
  const [records, setRecords] = useState<WaitlistRecord[]>([]);
  const [invitations, setInvitations] = useState<InvitationRecord[]>([]);

  // Issue Invite Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetEmail, setTargetEmail] = useState("");
  const [targetWaitlistId, setTargetWaitlistId] = useState<string | undefined>(undefined);
  const [expiryHours, setExpiryHours] = useState("168"); // 7 days
  const [isIssuing, setIsIssuing] = useState(false);
  const [issueError, setIssueError] = useState<string | null>(null);
  const [generatedInvite, setGeneratedInvite] = useState<InvitationRecord | null>(null);

  // Copy feedback state
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [copiedLinkId, setCopiedLinkId] = useState<string | null>(null);

  // Revoke state
  const [revokingId, setRevokingId] = useState<string | null>(null);

  const fetchDashboardData = async (key: string) => {
    // 1. Fetch waitlist records
    const resWaitlist = await fetch(`/api/admin/waitlist`, {
      headers: { Authorization: `Bearer ${key.trim()}` },
    });
    if (!resWaitlist.ok) {
      if (resWaitlist.status === 401) throw new Error("Invalid operator access key.");
      throw new Error("Failed to fetch waitlist entries.");
    }
    const dataWaitlist = await resWaitlist.json();
    setRecords(dataWaitlist.records || []);

    // 2. Fetch invitations
    const resInvites = await fetch(`/api/admin/invitations`, {
      headers: { Authorization: `Bearer ${key.trim()}` },
    });
    if (resInvites.ok) {
      const dataInvites = await resInvites.json();
      setInvitations(dataInvites.invitations || []);
    }
  };

  const handleAuthenticate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessKey.trim()) return;

    setLoading(true);
    setError(null);

    try {
      await fetchDashboardData(accessKey);
      setIsAuthenticated(true);
    } catch (err: any) {
      setError(err?.message || "Failed to authenticate.");
    } finally {
      setLoading(false);
    }
  };

  const handleExportCsv = () => {
    window.open(`/api/admin/waitlist?format=csv&key=${encodeURIComponent(accessKey.trim())}`, "_blank");
  };

  const handleOpenIssueModal = (email: string, waitlistId?: string) => {
    setTargetEmail(email);
    setTargetWaitlistId(waitlistId);
    setExpiryHours("168");
    setIssueError(null);
    setGeneratedInvite(null);
    setIsModalOpen(true);
  };

  const handleGenerateInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetEmail.trim()) return;

    setIsIssuing(true);
    setIssueError(null);

    try {
      const res = await fetch(`/api/admin/invitations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessKey.trim()}`,
        },
        body: JSON.stringify({
          email: targetEmail.trim(),
          expiresInHours: Number(expiryHours),
          waitlistSignupId: targetWaitlistId,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setIssueError(data?.message || "Failed to issue invitation.");
        return;
      }

      setGeneratedInvite(data.invitation);
      // Refresh list
      await fetchDashboardData(accessKey);
    } catch {
      setIssueError("Network error while issuing invitation.");
    } finally {
      setIsIssuing(false);
    }
  };

  const handleRevokeInvite = async (invitationId: string) => {
    if (!confirm("Are you sure you want to revoke this invitation? The recipient will no longer be able to use it.")) {
      return;
    }

    setRevokingId(invitationId);
    try {
      const res = await fetch(`/api/admin/invitations/revoke`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessKey.trim()}`,
        },
        body: JSON.stringify({ invitationId }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        alert(data?.message || "Failed to revoke invitation.");
      } else {
        await fetchDashboardData(accessKey);
      }
    } catch {
      alert("Network error while revoking invitation.");
    } finally {
      setRevokingId(null);
    }
  };

  const copyToClipboard = (text: string, id: string, type: "code" | "link") => {
    navigator.clipboard.writeText(text);
    if (type === "code") {
      setCopiedCodeId(id);
      setTimeout(() => setCopiedCodeId(null), 2000);
    } else {
      setCopiedLinkId(id);
      setTimeout(() => setCopiedLinkId(null), 2000);
    }
  };

  const getInviteUrl = (code: string, email: string) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://vouple-xzg9.vercel.app";
    return `${origin}/invite?code=${encodeURIComponent(code)}&email=${encodeURIComponent(email)}`;
  };

  return (
    <div className="min-h-screen bg-[#111014] text-[#ede8e1] font-sans p-6 sm:p-10">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/10 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xl tracking-tight text-white">vouple</span>
              <span className="w-2 h-2 rounded-full bg-[#ff4f78]"></span>
              <span className="px-2 py-0.5 rounded-full bg-[#b91348]/20 border border-[#b91348]/30 text-[#ffb2bc] text-[10px] uppercase font-bold tracking-wider ml-2">
                Operator Console · Phase 2
              </span>
            </div>
            <p className="text-xs text-white/50 pt-1">
              Protected waitlist & invitation registry for Jabalpur Cohort № 001 · Adults 18+ Only
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-xs text-white/70 hover:text-white underline decoration-white/20 transition-colors"
            >
              ← Landing Page
            </Link>
            <Link
              href="/invite"
              target="_blank"
              className="text-xs text-[#ffb2bc] hover:text-white flex items-center gap-1 border border-white/10 px-3 py-1.5 rounded-lg bg-white/5 transition-colors"
            >
              <span>Test /invite</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Authentication Form if not authenticated */}
        {!isAuthenticated ? (
          <div className="max-w-md mx-auto pt-10">
            <form
              onSubmit={handleAuthenticate}
              className="bg-[#1b191f] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-5 shadow-2xl backdrop-blur-md"
            >
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <KeyRound className="w-5 h-5 text-[#ff4f78]" />
                  <span>Operator Authorization</span>
                </h2>
                <p className="text-xs text-white/60">
                  Enter the operator secret key to inspect waitlist records and issue invitation codes.
                </p>
              </div>

              {error && (
                <div className="p-3 rounded-xl border border-red-500/30 bg-red-500/10 text-red-200 text-xs">
                  {error}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-wider text-white/70 font-semibold">
                  Operator Secret Key
                </label>
                <input
                  type="password"
                  value={accessKey}
                  onChange={(e) => setAccessKey(e.target.value)}
                  placeholder="Enter secret key..."
                  className="w-full bg-white/5 border border-white/15 focus:border-[#ff4f78] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#ff4f78]/30"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-full bg-gradient-to-r from-[#ff4f78] to-[#b91348] text-white font-bold text-xs uppercase tracking-wider hover:opacity-95 transition-opacity disabled:opacity-50"
              >
                {loading ? "Authenticating..." : "Unlock Operator Console"}
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Dashboard */
          <div className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-[#1b191f] border border-white/10 p-5 rounded-xl">
                <span className="text-[10px] uppercase font-semibold text-white/50 tracking-wider block">
                  Waitlist Signups
                </span>
                <span className="text-3xl font-bold text-white pt-1 block">{records.length}</span>
              </div>
              <div className="bg-[#1b191f] border border-white/10 p-5 rounded-xl">
                <span className="text-[10px] uppercase font-semibold text-white/50 tracking-wider block">
                  Invites Issued
                </span>
                <span className="text-3xl font-bold text-[#ffb2bc] pt-1 block">{invitations.length}</span>
              </div>
              <div className="bg-[#1b191f] border border-white/10 p-5 rounded-xl">
                <span className="text-[10px] uppercase font-semibold text-white/50 tracking-wider block">
                  Unused / Active
                </span>
                <span className="text-3xl font-bold text-amber-400 pt-1 block">
                  {invitations.filter((i) => i.status === "unused").length}
                </span>
              </div>
              <div className="bg-[#1b191f] border border-white/10 p-5 rounded-xl">
                <span className="text-[10px] uppercase font-semibold text-white/50 tracking-wider block">
                  Redeemed Accounts
                </span>
                <span className="text-3xl font-bold text-emerald-400 pt-1 block">
                  {invitations.filter((i) => i.status === "redeemed").length}
                </span>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("applicants")}
                  className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wider transition-colors flex items-center gap-2 ${
                    activeTab === "applicants"
                      ? "bg-white/15 text-white border border-white/20 shadow-md"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  <Users className="w-3.5 h-3.5 text-[#ff4f78]" />
                  <span>Waitlist Applicants ({records.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("invitations")}
                  className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wider transition-colors flex items-center gap-2 ${
                    activeTab === "invitations"
                      ? "bg-white/15 text-white border border-white/20 shadow-md"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                  <span>Issued Invitations ({invitations.length})</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                {activeTab === "applicants" && (
                  <button
                    type="button"
                    onClick={handleExportCsv}
                    className="px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-semibold tracking-wider transition-colors border border-white/10 flex items-center gap-1.5"
                  >
                    <span>Export CSV</span>
                  </button>
                )}
                {activeTab === "invitations" && (
                  <button
                    type="button"
                    onClick={() => handleOpenIssueModal("")}
                    className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#ff4f78] to-[#b91348] text-white text-xs font-bold tracking-wider hover:opacity-90 transition-opacity flex items-center gap-1.5 shadow-md"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Issue Custom Invite</span>
                  </button>
                )}
              </div>
            </div>

            {/* Tab 1: Waitlist Applicants Table */}
            {activeTab === "applicants" && (
              <div className="bg-[#1b191f] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-white/5 border-b border-white/10 text-white/60 uppercase font-mono tracking-wider text-[10px]">
                      <tr>
                        <th className="px-5 py-3.5">Email</th>
                        <th className="px-5 py-3.5">18+ Eligibility</th>
                        <th className="px-5 py-3.5">Signup Date</th>
                        <th className="px-5 py-3.5">Invite Status</th>
                        <th className="px-5 py-3.5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {records.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-5 py-8 text-center text-white/40">
                            No waitlist signups recorded yet.
                          </td>
                        </tr>
                      ) : (
                        records.map((r) => {
                          const existingInvite = invitations.find(
                            (i) => i.email.toLowerCase() === r.email.toLowerCase()
                          );

                          return (
                            <tr key={r.id} className="hover:bg-white/[0.02] transition-colors">
                              <td className="px-5 py-4 font-mono font-medium text-white">{r.email}</td>
                              <td className="px-5 py-4">
                                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-semibold">
                                  18+ Confirmed
                                </span>
                              </td>
                              <td className="px-5 py-4 text-white/60 font-mono text-[11px]">
                                {new Date(r.createdAt).toLocaleDateString()}
                              </td>
                              <td className="px-5 py-4">
                                {existingInvite ? (
                                  existingInvite.status === "redeemed" ? (
                                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-semibold">
                                      Redeemed
                                    </span>
                                  ) : existingInvite.status === "unused" ? (
                                    <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[10px] font-semibold">
                                      Active Invite
                                    </span>
                                  ) : existingInvite.status === "revoked" ? (
                                    <span className="px-2 py-0.5 rounded-full bg-red-500/10 text-red-300 border border-red-500/20 text-[10px] font-semibold">
                                      Revoked
                                    </span>
                                  ) : (
                                    <span className="px-2 py-0.5 rounded-full bg-gray-500/10 text-gray-300 border border-gray-500/20 text-[10px] font-semibold">
                                      Expired
                                    </span>
                                  )
                                ) : (
                                  <span className="text-white/40 font-mono text-[11px]">Not invited</span>
                                )}
                              </td>
                              <td className="px-5 py-4 text-right">
                                {existingInvite && existingInvite.status === "unused" ? (
                                  <button
                                    type="button"
                                    onClick={() => copyToClipboard(getInviteUrl(existingInvite.code, existingInvite.email), existingInvite.id, "link")}
                                    className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-semibold transition-colors flex items-center gap-1 ml-auto"
                                  >
                                    {copiedLinkId === existingInvite.id ? (
                                      <>
                                        <Check className="w-3 h-3 text-emerald-400" />
                                        <span>Copied!</span>
                                      </>
                                    ) : (
                                      <>
                                        <Copy className="w-3 h-3 text-white/70" />
                                        <span>Copy Link</span>
                                      </>
                                    )}
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => handleOpenIssueModal(r.email, r.id)}
                                    className="px-3 py-1 rounded-lg bg-gradient-to-r from-[#ff4f78] to-[#b91348] text-white text-[11px] font-bold hover:opacity-95 transition-opacity shadow-sm"
                                  >
                                    Issue Invite
                                  </button>
                                )}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tab 2: Issued Invitations Table */}
            {activeTab === "invitations" && (
              <div className="bg-[#1b191f] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-white/5 border-b border-white/10 text-white/60 uppercase font-mono tracking-wider text-[10px]">
                      <tr>
                        <th className="px-5 py-3.5">Recipient Email</th>
                        <th className="px-5 py-3.5">Invitation Code</th>
                        <th className="px-5 py-3.5">Status</th>
                        <th className="px-5 py-3.5">Expires At</th>
                        <th className="px-5 py-3.5">Redeemed At</th>
                        <th className="px-5 py-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {invitations.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-5 py-8 text-center text-white/40">
                            No invitations issued yet. Click "Issue Custom Invite" or select a waitlist applicant.
                          </td>
                        </tr>
                      ) : (
                        invitations.map((inv) => (
                          <tr key={inv.id} className="hover:bg-white/[0.02] transition-colors">
                            <td className="px-5 py-4 font-mono font-medium text-white">{inv.email}</td>
                            <td className="px-5 py-4">
                              <span className="font-mono bg-white/5 border border-white/10 px-2.5 py-1 rounded-md text-[#ffb2bc] text-[11px] font-bold">
                                {inv.code}
                              </span>
                            </td>
                            <td className="px-5 py-4">
                              {inv.status === "unused" ? (
                                <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[10px] font-semibold">
                                  Unused / Active
                                </span>
                              ) : inv.status === "redeemed" ? (
                                <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-semibold">
                                  Redeemed
                                </span>
                              ) : inv.status === "revoked" ? (
                                <span className="px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 border border-red-500/30 text-[10px] font-semibold">
                                  Revoked
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-full bg-gray-500/15 text-gray-300 border border-gray-500/30 text-[10px] font-semibold">
                                  Expired
                                </span>
                              )}
                            </td>
                            <td className="px-5 py-4 text-white/60 font-mono text-[11px]">
                              {new Date(inv.expiresAt).toLocaleString()}
                            </td>
                            <td className="px-5 py-4 text-white/60 font-mono text-[11px]">
                              {inv.redeemedAt ? new Date(inv.redeemedAt).toLocaleString() : "—"}
                            </td>
                            <td className="px-5 py-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                {/* Copy Code */}
                                <button
                                  type="button"
                                  title="Copy Code"
                                  onClick={() => copyToClipboard(inv.code, inv.id, "code")}
                                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-white/70 hover:text-white transition-colors"
                                >
                                  {copiedCodeId === inv.id ? (
                                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                                  ) : (
                                    <Copy className="w-3.5 h-3.5" />
                                  )}
                                </button>

                                {/* Copy Direct Link */}
                                <button
                                  type="button"
                                  title="Copy Direct Invite Link"
                                  onClick={() => copyToClipboard(getInviteUrl(inv.code, inv.email), inv.id, "link")}
                                  className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/15 text-white text-[11px] font-medium transition-colors flex items-center gap-1"
                                >
                                  {copiedLinkId === inv.id ? (
                                    <span className="text-emerald-400 font-semibold">Link Copied!</span>
                                  ) : (
                                    <span>Copy Link</span>
                                  )}
                                </button>

                                {/* Revoke button if unused */}
                                {inv.status === "unused" && (
                                  <button
                                    type="button"
                                    disabled={revokingId === inv.id}
                                    onClick={() => handleRevokeInvite(inv.id)}
                                    className="px-2 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-[11px] font-medium transition-colors border border-red-500/20 disabled:opacity-50"
                                  >
                                    {revokingId === inv.id ? "Revoking..." : "Revoke"}
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Issue Invitation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#1b191f] border border-white/15 rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative space-y-5">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-white/40 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#ff4f78]" />
                <span>Issue Cryptographic Single-Use Invitation</span>
              </h3>
              <p className="text-xs text-white/50 pt-1">
                Generates a unique high-entropy code strictly bound to the recipient's email.
              </p>
            </div>

            {issueError && (
              <div className="p-3 rounded-xl border border-red-500/30 bg-red-500/10 text-red-200 text-xs">
                {issueError}
              </div>
            )}

            {!generatedInvite ? (
              <form onSubmit={handleGenerateInvite} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] uppercase tracking-wider text-white/70 font-semibold">
                    Recipient Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={targetEmail}
                    onChange={(e) => setTargetEmail(e.target.value)}
                    placeholder="applicant@example.com"
                    className="w-full bg-white/5 border border-white/15 focus:border-[#ff4f78] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] uppercase tracking-wider text-white/70 font-semibold">
                    Invitation Expiry Window
                  </label>
                  <select
                    value={expiryHours}
                    onChange={(e) => setExpiryHours(e.target.value)}
                    className="w-full bg-[#1b191f] border border-white/15 focus:border-[#ff4f78] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none"
                  >
                    <option value="48">48 Hours (2 Days)</option>
                    <option value="168">7 Days (Standard Recommendation)</option>
                    <option value="336">14 Days (2 Weeks)</option>
                    <option value="720">30 Days (1 Month)</option>
                  </select>
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isIssuing}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#ff4f78] to-[#b91348] text-white text-xs font-bold uppercase tracking-wider hover:opacity-95 disabled:opacity-50"
                  >
                    {isIssuing ? "Generating..." : "Generate Invitation Code"}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-5">
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>Invitation generated successfully and bound to <strong>{generatedInvite.email}</strong>!</span>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-mono tracking-wider text-white/50 block">
                    Single-Use Invitation Code
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-white/5 border border-white/15 rounded-xl px-4 py-3 font-mono text-base font-bold text-[#ffb2bc] text-center tracking-wider">
                      {generatedInvite.code}
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(generatedInvite.code, "modal_code", "code")}
                      className="px-3.5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      {copiedCodeId === "modal_code" ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-400" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-mono tracking-wider text-white/50 block">
                    Direct Invitation URL (pre-filled)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      readOnly
                      value={getInviteUrl(generatedInvite.code, generatedInvite.email)}
                      className="flex-1 bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-xs font-mono text-white/70 truncate focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => copyToClipboard(getInviteUrl(generatedInvite.code, generatedInvite.email), "modal_link", "link")}
                      className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      {copiedLinkId === "modal_link" ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-400" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Copy Link</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="text-[11px] text-white/50 font-mono">
                  Expires: {new Date(generatedInvite.expiresAt).toLocaleString()}
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
