"use client";

import React, { useState } from "react";
import Link from "next/link";
import { WaitlistRecord } from "@/types/waitlist";

export default function AdminWaitlistPage() {
  const [accessKey, setAccessKey] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [records, setRecords] = useState<WaitlistRecord[]>([]);

  const handleAuthenticate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessKey.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/admin/waitlist`, {
        headers: {
          Authorization: `Bearer ${accessKey.trim()}`,
        },
      });

      if (res.status === 401) {
        setError("Invalid operator access key. Please verify your credentials.");
        setLoading(false);
        return;
      }

      if (!res.ok) {
        setError("Failed to fetch records from the server.");
        setLoading(false);
        return;
      }

      const data = await res.json();
      setRecords(data.records || []);
      setIsAuthenticated(true);
    } catch {
      setError("Network error while connecting to operator API.");
    } finally {
      setLoading(false);
    }
  };

  const handleExportCsv = () => {
    window.open(`/api/admin/waitlist?format=csv&key=${encodeURIComponent(accessKey.trim())}`, "_blank");
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
                Operator Console
              </span>
            </div>
            <p className="text-xs text-white/50 pt-1">
              Protected waitlist registry for Jabalpur Cohort № 001 · Adults 18+ Only
            </p>
          </div>

          <Link
            href="/"
            className="text-xs text-white/70 hover:text-white underline decoration-white/20 transition-colors self-start sm:self-auto"
          >
            ← Back to Landing Page
          </Link>
        </div>

        {/* Authentication Form if not authenticated */}
        {!isAuthenticated ? (
          <div className="max-w-md mx-auto pt-10">
            <form
              onSubmit={handleAuthenticate}
              className="bg-[#1b191f] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-5 shadow-2xl backdrop-blur-md"
            >
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-white">Operator Authorization</h2>
                <p className="text-xs text-white/60">
                  Enter the operator secret key to inspect the waitlist database.
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
                {loading ? "Authenticating..." : "Unlock Registry"}
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Dashboard */
          <div className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="bg-[#1b191f] border border-white/10 p-5 rounded-xl">
                <span className="text-[10px] uppercase font-semibold text-white/50 tracking-wider block">
                  Total Valid Signups
                </span>
                <span className="text-3xl font-bold text-white pt-1 block">{records.length}</span>
              </div>
              <div className="bg-[#1b191f] border border-white/10 p-5 rounded-xl">
                <span className="text-[10px] uppercase font-semibold text-white/50 tracking-wider block">
                  18+ Adults Confirmed
                </span>
                <span className="text-3xl font-bold text-emerald-400 pt-1 block">
                  {records.filter((r) => r.isAdult).length}
                </span>
              </div>
              <div className="bg-[#1b191f] border border-white/10 p-5 rounded-xl">
                <span className="text-[10px] uppercase font-semibold text-white/50 tracking-wider block">
                  Consent Version
                </span>
                <span className="text-3xl font-bold text-[#ffb2bc] pt-1 block">v1.0</span>
              </div>
              <div className="bg-[#1b191f] border border-white/10 p-5 rounded-xl">
                <span className="text-[10px] uppercase font-semibold text-white/50 tracking-wider block">
                  Emails Delivered
                </span>
                <span className="text-3xl font-bold text-[#ff9d67] pt-1 block">
                  {records.filter((r) => r.emailDeliveryStatus === "sent").length} / {records.length}
                </span>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-white/60 font-mono">
                Showing {records.length} confirmed entries
              </span>
              <button
                type="button"
                onClick={handleExportCsv}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold tracking-wider transition-colors border border-white/10 flex items-center gap-1.5"
              >
                <span>Export CSV</span>
              </button>
            </div>

            {/* Records Table */}
            <div className="bg-[#1b191f] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-white/5 border-b border-white/10 text-white/60 uppercase font-mono tracking-wider text-[10px]">
                    <tr>
                      <th className="px-5 py-3.5">Email</th>
                      <th className="px-5 py-3.5">Eligibility (18+)</th>
                      <th className="px-5 py-3.5">Consent Version</th>
                      <th className="px-5 py-3.5">Signup Date & Time</th>
                      <th className="px-5 py-3.5">Email Delivery</th>
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
                      records.map((r) => (
                        <tr key={r.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="px-5 py-4 font-mono font-medium text-white">{r.email}</td>
                          <td className="px-5 py-4">
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-semibold">
                              18+ Confirmed
                            </span>
                          </td>
                          <td className="px-5 py-4 font-mono text-white/70">
                            {r.consentVersion || "v1.0"}
                          </td>
                          <td className="px-5 py-4 text-white/60 font-mono text-[11px]">
                            {new Date(r.createdAt).toLocaleString()}
                          </td>
                          <td className="px-5 py-4">
                            {r.emailDeliveryStatus === "sent" ? (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-semibold">
                                Sent
                              </span>
                            ) : r.emailDeliveryStatus === "failed" ? (
                              <span
                                title={r.emailError}
                                className="px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 text-[10px] font-semibold cursor-help"
                              >
                                Failed
                              </span>
                            ) : (
                              <span
                                title="Resend API key not configured in environment"
                                className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[10px] font-semibold cursor-help"
                              >
                                Unconfigured
                              </span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
