"use client";

import React from "react";
import { useGameStateStore, OFFICE_MAP } from "../store/useGameState";
import { IndustryType } from "../store/types";
import { Landmark, Calendar, Percent, Shield, Building, Users } from "lucide-react";

export default function Header() {
  const player = useGameStateStore((state) => state.player);
  const currentTurn = useGameStateStore((state) => state.currentTurn);
  const selectedIndustry = useGameStateStore((state) => state.selectedIndustry);
  const financials = useGameStateStore((state) => state.financials);

  const getIndustryLabel = (ind: IndustryType | null) => {
    if (ind === "hr") return "HR・求人";
    if (ind === "telehealth") return "オンライン診療";
    if (ind === "video_streaming") return "動画配信";
    if (ind === "sns") return "SNS";
    return "";
  };

  const office = OFFICE_MAP[player.officeLevel];
  const employeeCount = player.employees.length + 1; // 従業員数 + 創業者1名

  return (
    <header className="glass-panel rounded-2xl p-6 flex flex-col xl:flex-row gap-6 items-start xl:items-center justify-between border border-white/5 relative overflow-hidden shrink-0">
      {/* 会社名・創業者名 */}
      <div className="relative z-10 shrink-0">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-black text-white tracking-tight">{player.name}</h2>
          <span className="text-[10px] px-2.5 py-0.5 bg-purple-500/10 border border-purple-500/20 text-purple-300 font-extrabold rounded-md uppercase tracking-wider">
            {getIndustryLabel(selectedIndustry)}
          </span>
        </div>
        <p className="text-[11px] text-slate-500 mt-1 font-medium">
          CEO: <span className="text-slate-300 font-bold">{player.ceoName}</span> &nbsp;|&nbsp; Service: <span className="text-slate-300 font-bold">{player.productName}</span>
        </p>
      </div>

      {/* 数値インジケータ */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 w-full xl:w-auto flex-1 justify-end relative z-10">
        {/* ターン */}
        <div className="bg-[#090e1a]/80 border border-slate-900/60 rounded-xl p-3.5 flex items-center gap-3.5 transition-all hover:border-slate-800">
          <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400 border border-blue-500/10 shadow-inner">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <span className="block text-[9px] font-black uppercase tracking-widest text-slate-500">Turn</span>
            <span className="text-sm font-black text-white">
              {currentTurn} <span className="text-slate-600 text-xs font-normal">/ 120</span>
            </span>
          </div>
        </div>

        {/* 手元資金 */}
        <div className="bg-[#090e1a]/80 border border-slate-900/60 rounded-xl p-3.5 flex items-center gap-3.5 transition-all hover:border-slate-800">
          <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400 border border-emerald-500/10 shadow-inner">
            <Landmark className="w-4 h-4" />
          </div>
          <div>
            <span className="block text-[9px] font-black uppercase tracking-widest text-slate-500">手元資金</span>
            <span className={`text-sm font-black tracking-tight ${player.cash < 1000000 ? "text-red-400 animate-pulse" : "text-emerald-400"}`}>
              ¥{player.cash.toLocaleString()}
            </span>
          </div>
        </div>

        {/* MRR */}
        <div className="bg-[#090e1a]/80 border border-slate-900/60 rounded-xl p-3.5 flex items-center gap-3.5 transition-all hover:border-slate-800">
          <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400 border border-purple-500/10 shadow-inner">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <span className="block text-[9px] font-black uppercase tracking-widest text-slate-500">MRR</span>
            <span className="text-sm font-black tracking-tight text-purple-300">
              ¥{player.mrr.toLocaleString()}
            </span>
          </div>
        </div>

        {/* 創業株主比率 */}
        <div className="bg-[#090e1a]/80 border border-slate-900/60 rounded-xl p-3.5 flex items-center gap-3.5 transition-all hover:border-slate-800">
          <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400 border border-amber-500/10 shadow-inner">
            <Percent className="w-4 h-4" />
          </div>
          <div>
            <span className="block text-[9px] font-black uppercase tracking-widest text-slate-500">創業者株式</span>
            <span className="text-sm font-black text-amber-400">
              {financials.shareOwned}%
            </span>
          </div>
        </div>

        {/* オフィス規模 */}
        <div className="bg-[#090e1a]/80 border border-slate-900/60 rounded-xl p-3.5 flex items-center gap-3.5 col-span-2 sm:col-span-1 transition-all hover:border-slate-800">
          <div className="p-2 bg-pink-500/10 rounded-lg text-pink-400 border border-pink-500/10 shadow-inner shrink-0">
            <Building className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="block text-[9px] font-black uppercase tracking-widest text-slate-500 truncate" title={office.name}>
              {office.name}
            </span>
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5 mt-0.5">
              <Users className="w-3.5 h-3.5 text-slate-500" />
              <span className={employeeCount >= office.maxEmployees ? "text-red-400" : "text-slate-300"}>
                {employeeCount}
              </span>
              <span className="text-slate-600 font-normal">/ {office.maxEmployees}名</span>
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
