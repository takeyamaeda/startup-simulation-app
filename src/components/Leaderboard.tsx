"use client";

import React from "react";
import { useGameStateStore } from "../store/useGameState";
import { Company } from "../store/types";
import { Trophy, Building, Star, Crown } from "lucide-react";

export default function Leaderboard() {
  const player = useGameStateStore((state) => state.player);
  const competitors = useGameStateStore((state) => state.competitors);
  const tam = useGameStateStore((state) => state.tam);

  // すべてのプレイヤーと競合をまとめる
  const list: Company[] = [player, ...competitors];

  // ユーザー数でソート
  const sortedList = [...list].sort((a, b) => b.users - a.users);

  const getOfficeBadge = (level: number) => {
    if (level === 1) return { label: "GARAGE", color: "bg-slate-900 border-slate-800 text-slate-500" };
    if (level === 2) return { label: "CO-WORK", color: "bg-blue-500/10 text-blue-300 border-blue-500/20" };
    if (level === 3) return { label: "SHIBUYA", color: "bg-pink-500/10 text-pink-300 border-pink-500/20" };
    if (level === 4) return { label: "MIDTOWN", color: "bg-amber-500/10 text-amber-300 border-amber-500/20" };
    return { label: "UNKNOWN", color: "bg-slate-900 text-slate-500" };
  };

  const getRankStyle = (rank: number) => {
    if (rank === 0) return { bg: "bg-gradient-to-r from-yellow-500 to-amber-600 text-black", icon: <Crown className="w-3.5 h-3.5" /> };
    if (rank === 1) return { bg: "bg-gradient-to-r from-slate-300 to-slate-400 text-black", icon: null };
    if (rank === 2) return { bg: "bg-gradient-to-r from-amber-700 to-amber-800 text-white", icon: null };
    return { bg: "bg-[#0a0f1d] border border-slate-800 text-slate-500", icon: null };
  };

  return (
    <div className="flex flex-col gap-4 p-5 h-full overflow-hidden">
      <div className="flex-1 flex flex-col gap-2.5 overflow-y-auto pr-1">
        {sortedList.map((comp, idx) => {
          const share = ((comp.users / tam) * 100).toFixed(1);
          const office = getOfficeBadge(comp.officeLevel);
          const rank = getRankStyle(idx);

          return (
            <div
              key={comp.id}
              className={`p-3 rounded-xl border flex items-center justify-between gap-4 transition-all ${
                comp.isPlayer
                  ? "bg-purple-950/15 border-purple-500/35 shadow-md shadow-purple-950/20"
                  : "bg-[#070b15]/40 border-slate-900/60 hover:border-slate-800"
              }`}
            >
              {/* 左側: 順位、会社名・プロダクト名 */}
              <div className="flex items-center gap-3 min-w-0">
                <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black shrink-0 ${rank.bg}`}>
                  {rank.icon ? rank.icon : idx + 1}
                </span>
                <div className="min-w-0">
                  <span className="font-extrabold text-xs text-white block truncate flex items-center gap-1.5">
                    {comp.name}
                    {comp.isPlayer && (
                      <Star className="w-3 h-3 fill-purple-400 stroke-purple-400 dot-pulse" />
                    )}
                  </span>
                  <span className="text-[10px] text-slate-500 block truncate font-medium mt-0.5">
                    {comp.productName} ({comp.ceoName})
                  </span>
                </div>
              </div>

              {/* 右側: ユーザー、シェア、オフィス */}
              <div className="flex items-center gap-4 shrink-0 text-right">
                <div className="flex flex-col">
                  <span className="text-xs font-mono font-bold text-white">
                    {comp.users.toLocaleString()} <span className="text-[9px] text-slate-500 font-normal">名</span>
                  </span>
                  <span className="text-[9px] font-mono text-purple-300 font-extrabold mt-0.5 uppercase tracking-wider">
                    SHARE: {share}%
                  </span>
                </div>
                <span className={`px-2 py-0.5 rounded border text-[8px] font-black tracking-widest ${office.color} flex items-center gap-1 shrink-0`}>
                  <Building className="w-2.5 h-2.5" />
                  {office.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
