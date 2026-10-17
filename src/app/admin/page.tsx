"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AppHeader } from "@/components/app/app-header";
import { useVoupleStore } from "@/lib/store/vouple-store";
import { ResolutionAction } from "@/types/app";
import {
  ShieldAlert,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  UserX,
  UserCheck,
  Clock,
  Filter,
  FileText,
} from "lucide-react";

export default function AdminDashboardPage() {
  const { isLoaded, currentUser, reports, resolveReport } = useVoupleStore();

  const [activeTab, setActiveTab] = useState<"pending" | "resolved">("pending");
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [moderatorNotes, setModeratorNotes] = useState("");

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#0B0B0F] flex items-center justify-center text-white">
        <div className="w-8 h-8 rounded-full border-2 border-[#FF4458] border-t-transparent animate-spin"></div>
      </div>
    );
  }

  // Access Control: Must have moderator or admin role
  if (currentUser.role !== "admin" && currentUser.role !== "moderator") {
    return (
      <div className="min-h-screen bg-[#0B0B0F] text-white flex flex-col justify-center items-center px-6 text-center">
        <div className="w-16 h-16 rounded-3xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mb-4">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Access Denied</h2>
        <p className="text-xs text-gray-400 max-w-xs mb-6">
          This portal is strictly restricted to authorized Vouple moderators and trust & safety operators.
        </p>
        <Link
          href="/app"
          className="px-6 py-2.5 rounded-full bg-white/10 text-white text-xs font-bold"
        >
          Return to Member App
        </Link>
      </div>
    );
  }

  const pendingReports = reports.filter((r) => r.status === "pending");
  const resolvedReports = reports.filter((r) => r.status !== "pending");
  const displayedReports = activeTab === "pending" ? pendingReports : resolvedReports;

  const selectedReport = reports.find((r) => r.id === selectedReportId) || displayedReports[0];

  const handleAction = (action: ResolutionAction) => {
    if (!selectedReport) return;
    resolveReport(selectedReport.id, action, moderatorNotes);
    setModeratorNotes("");
  };

  return (
    <div className="min-h-screen bg-[#09090D] text-white flex flex-col">
      {/* Top Admin Header */}
      <header className="sticky top-0 z-40 bg-[#12121A]/95 backdrop-blur-md border-b border-white/10 px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/app"
            className="p-1.5 rounded-lg bg-white/5 text-gray-300 hover:text-white"
            title="Return to Member App"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-red-500/20 border border-red-500/30 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4 text-red-400" />
            </div>
            <span className="font-bold text-sm tracking-tight text-white">
              Vouple Trust & Safety Console
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
            Jabalpur Pilot Moderator
          </span>
          <span className="text-xs text-gray-400 font-medium">
            {currentUser.email}
          </span>
        </div>
      </header>

      {/* Main Layout */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Report Queue */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Tabs */}
          <div className="flex items-center gap-2 p-1 bg-[#14141E] border border-white/5 rounded-2xl">
            <button
              onClick={() => setActiveTab("pending")}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === "pending"
                  ? "bg-[#FF4458] text-white shadow-md"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <span>Pending Queue</span>
              <span className="px-1.5 py-0.2 rounded-full bg-black/30 text-[10px]">
                {pendingReports.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("resolved")}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === "resolved"
                  ? "bg-white/10 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <span>Resolved Audit</span>
              <span className="px-1.5 py-0.2 rounded-full bg-black/30 text-[10px]">
                {resolvedReports.length}
              </span>
            </button>
          </div>

          {/* List of reports */}
          <div className="space-y-2.5">
            {displayedReports.length > 0 ? (
              displayedReports.map((report) => {
                const isSelected = selectedReport?.id === report.id;
                return (
                  <div
                    key={report.id}
                    onClick={() => setSelectedReportId(report.id)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? "bg-[#1E1B28] border-[#FF4458]/40 shadow-lg"
                        : "bg-[#14141E] border-white/5 hover:border-white/15"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#FFA034] bg-[#FFA034]/10 px-2 py-0.5 rounded-md">
                        {report.category.replace(/_/g, " ")}
                      </span>
                      <span className="text-[10px] text-gray-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                      </span>
                    </div>

                    <p className="text-xs font-bold text-white mb-1">
                      Target: {report.reportedProfile?.displayName || report.reportedId}
                    </p>

                    <p className="text-[11px] text-gray-400 truncate">
                      {report.details || "No additional text provided"}
                    </p>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12 px-4 rounded-2xl bg-[#14141E] border border-white/5 text-gray-400 text-xs">
                No {activeTab} reports in the queue.
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Incident Evidence & Action Panel */}
        <div className="lg:col-span-7">
          {selectedReport ? (
            <div className="p-6 rounded-3xl bg-[#14141E] border border-white/10 space-y-6">
              
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <span className="text-[10px] font-bold uppercase text-red-400 tracking-wider">
                    Incident Case #{selectedReport.id.slice(-6)}
                  </span>
                  <h3 className="text-lg font-bold text-white">
                    {selectedReport.category.replace(/_/g, " ").toUpperCase()}
                  </h3>
                </div>

                <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                  selectedReport.status === "pending"
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                    : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                }`}>
                  {selectedReport.status}
                </span>
              </div>

              {/* Reported User Profile Card */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  Target Account Under Review
                </span>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-800 shrink-0">
                    {selectedReport.reportedProfile?.photos[0] && (
                      <img
                        src={selectedReport.reportedProfile.photos[0]}
                        alt="Evidence"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      {selectedReport.reportedProfile?.displayName || selectedReport.reportedId}
                    </h4>
                    <p className="text-xs text-gray-400">
                      {selectedReport.reportedProfile?.neighborhood}, Jabalpur · {selectedReport.reportedProfile?.intentTimeline}
                    </p>
                  </div>
                </div>
              </div>

              {/* Reporter details & statement */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  Report Evidence & Statement
                </span>
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 text-xs text-gray-200 leading-relaxed italic">
                  &ldquo;{selectedReport.details || "Member initiated report without additional written statement."}&rdquo;
                </div>
              </div>

              {/* Moderation Actions */}
              {selectedReport.status === "pending" ? (
                <div className="space-y-4 pt-2 border-t border-white/10">
                  <div>
                    <label className="text-xs font-bold text-gray-300 mb-1.5 block">
                      Moderator Audit Notes
                    </label>
                    <textarea
                      value={moderatorNotes}
                      onChange={(e) => setModeratorNotes(e.target.value)}
                      placeholder="Add case justification notes for the safety record..."
                      rows={2}
                      className="w-full p-3 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-gray-500 outline-none focus:border-[#FF5E62]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <button
                      onClick={() => handleAction("none")}
                      className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-gray-300"
                    >
                      Dismiss (No Violation)
                    </button>

                    <button
                      onClick={() => handleAction("suspended")}
                      className="py-2.5 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-xs font-bold text-amber-300"
                    >
                      Suspend 7 Days
                    </button>

                    <button
                      onClick={() => handleAction("banned")}
                      className="py-2.5 px-3 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-lg shadow-red-500/25"
                    >
                      Permanent Ban
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 space-y-1">
                  <p><strong>Resolved Status:</strong> {selectedReport.resolutionAction}</p>
                  <p><strong>Notes:</strong> {selectedReport.moderatorNotes || "No notes logged."}</p>
                  <p><strong>Timestamp:</strong> {selectedReport.resolvedAt}</p>
                </div>
              )}

            </div>
          ) : (
            <div className="p-12 text-center text-gray-500 text-xs rounded-3xl bg-[#14141E] border border-white/5">
              Select an incident from the queue to review evidence.
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
