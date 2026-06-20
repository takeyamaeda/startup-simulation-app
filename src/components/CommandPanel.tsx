"use client";

import React from "react";
import { useGameStateStore, OFFICE_MAP } from "../store/useGameState";
import { DevMode, RoleType } from "../store/types";
import {
  Code,
  Flame,
  Wrench,
  Megaphone,
  UserPlus,
  ArrowUpCircle,
  Play,
  Plus,
  Minus,
} from "lucide-react";

export default function CommandPanel() {
  const player = useGameStateStore((state) => state.player);
  const currentDevMode = useGameStateStore((state) => state.currentDevMode);
  const marketingInvestment = useGameStateStore((state) => state.marketingInvestment);
  const setDevMode = useGameStateStore((state) => state.setDevMode);
  const adjustMarketing = useGameStateStore((state) => state.adjustMarketing);
  const hireEmployee = useGameStateStore((state) => state.hireEmployee);
  const upgradeOffice = useGameStateStore((state) => state.upgradeOffice);
  const executeTurn = useGameStateStore((state) => state.executeTurn);
  const pendingVCOffer = useGameStateStore((state) => state.pendingVCOffer);

  const office = OFFICE_MAP[player.officeLevel];
  const nextOffice = OFFICE_MAP[player.officeLevel + 1];
  const employeeCount = player.employees.length + 1; // 従業員数 + 創業者1名
  const isOfficeFull = employeeCount >= office.maxEmployees;

  const marketingCost = marketingInvestment * 500000;
  const isMarketingDecDisabled = marketingInvestment <= 0;
  const isMarketingIncDisabled = player.cash < (marketingInvestment + 1) * 500000;

  const hireCost = 200000;
  const isHireDisabled = isOfficeFull || player.cash < hireCost;

  return (
    <div className="flex flex-col gap-4 p-5 h-full overflow-y-auto">
      {/* 開発モード設定 */}
      <div className="bg-[#070b15]/40 border border-slate-900/60 rounded-xl p-4 flex flex-col gap-2.5">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
          <Code className="w-3.5 h-3.5 text-purple-400" />
          開発モード
        </span>
        <div className="grid grid-cols-1 gap-2">
          {[
            {
              id: "normal" as DevMode,
              name: "通常開発 (Normal)",
              desc: "機能追加と負債抑制を両立。",
              icon: <Code className="w-4 h-4 text-blue-400" />,
              activeStyle: "active-glow-blue",
            },
            {
              id: "crunch" as DevMode,
              name: "突貫工事 (Crunch)",
              desc: "スピード1.5倍。技術負債が増加。",
              icon: <Flame className="w-4 h-4 text-rose-400" />,
              activeStyle: "active-glow-purple",
            },
            {
              id: "refactor" as DevMode,
              name: "システム改善 (Refactor)",
              desc: "開発を止めて技術負債を削減。",
              icon: <Wrench className="w-4 h-4 text-emerald-400" />,
              activeStyle: "active-glow-green",
            },
          ].map((mode) => {
            const isActive = currentDevMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => setDevMode(mode.id)}
                className={`w-full text-left p-2.5 rounded-xl border text-[11px] flex items-start gap-3 transition-all cursor-pointer ${
                  isActive
                    ? `${mode.activeStyle} font-bold`
                    : "bg-[#090e1a]/50 border-slate-900/40 text-slate-400 hover:text-slate-200 hover:border-slate-800"
                }`}
              >
                <div className="mt-0.5 shrink-0">{mode.icon}</div>
                <div>
                  <span className="font-extrabold block text-white">{mode.name}</span>
                  <span className="text-[9px] text-slate-500 leading-normal block mt-0.5 font-medium">{mode.desc}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* マーケティング */}
      <div className="bg-[#070b15]/40 border border-slate-900/60 rounded-xl p-4 flex flex-col gap-2.5">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Megaphone className="w-3.5 h-3.5 text-purple-400" />
            マーケティング投資
          </span>
          <span className="text-[9px] text-slate-650 font-bold">¥50万 / 口</span>
        </span>
        <div className="flex items-center justify-between bg-[#090e1a] p-2.5 rounded-xl border border-slate-900">
          <button
            disabled={isMarketingDecDisabled}
            onClick={() => adjustMarketing(false)}
            className="p-1.5 bg-[#0e1628] hover:bg-[#141f38] text-slate-400 hover:text-white rounded-lg disabled:opacity-20 disabled:pointer-events-none transition-all cursor-pointer border border-white/5"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <div className="text-center">
            <span className="text-xs font-black text-white block">{marketingInvestment} 口</span>
            <span className="block text-[9px] text-slate-500 font-bold mt-0.5">総費用: ¥{marketingCost.toLocaleString()}</span>
          </div>
          <button
            disabled={isMarketingIncDisabled}
            onClick={() => adjustMarketing(true)}
            className="p-1.5 bg-[#0e1628] hover:bg-[#141f38] text-slate-400 hover:text-white rounded-lg disabled:opacity-20 disabled:pointer-events-none transition-all cursor-pointer border border-white/5"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 人材採用 & オフィス拡張 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 人材採用 */}
        <div className="bg-[#070b15]/40 border border-slate-900/60 rounded-xl p-4 flex flex-col gap-2.5 justify-between">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <UserPlus className="w-3.5 h-3.5 text-purple-400" />
              人材採用
            </span>
            <span className="text-[9px] text-slate-600">¥20万</span>
          </span>
          <div className="grid grid-cols-3 gap-2">
            {([
              { id: "engineer" as RoleType, label: "ENG" },
              { id: "designer" as RoleType, label: "DES" },
              { id: "sales" as RoleType, label: "SAL" },
            ]).map((role) => (
              <div key={role.id} className="relative group">
                <button
                  disabled={isHireDisabled}
                  onClick={() => hireEmployee(role.id)}
                  className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-[10px] uppercase tracking-wider shadow-md shadow-purple-950/20 disabled:bg-[#090e1a]/80 disabled:text-slate-600 disabled:shadow-none transition-all cursor-pointer btn-premium"
                >
                  {role.label}
                </button>
                {isOfficeFull && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-32 bg-[#080d19] text-red-400 text-[9px] p-2 rounded-lg border border-red-900/30 opacity-0 group-hover:opacity-100 pointer-events-none transition-all z-20 shadow-xl text-center">
                    オフィスが満員です
                  </div>
                )}
                {!isOfficeFull && player.cash < hireCost && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-32 bg-[#080d19] text-red-400 text-[9px] p-2 rounded-lg border border-red-900/30 opacity-0 group-hover:opacity-100 pointer-events-none transition-all z-20 shadow-xl text-center">
                    手元資金不足
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* オフィス拡張 */}
        <div className="bg-[#070b15]/40 border border-slate-900/60 rounded-xl p-4 flex flex-col gap-2.5 justify-between">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
            <ArrowUpCircle className="w-3.5 h-3.5 text-purple-400" />
            オフィス拡張
          </span>
          {nextOffice ? (
            <button
              disabled={player.cash < nextOffice.upgradeCost}
              onClick={upgradeOffice}
              className="w-full p-2.5 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 disabled:from-slate-950 disabled:to-slate-950 disabled:text-slate-700 disabled:border-transparent text-white text-[10px] font-extrabold rounded-xl shadow-lg border border-white/5 transition-all flex items-center justify-between cursor-pointer btn-premium"
            >
              <div className="min-w-0 flex-1 pr-1.5">
                <span className="block font-black truncate">{nextOffice.name}</span>
                <span className="block text-[8px] text-slate-300 font-medium mt-0.5 truncate">
                  最大: {nextOffice.maxEmployees}名 / 家賃: ¥{(nextOffice.rent / 10000).toFixed(0)}万
                </span>
              </div>
              <span className="font-black text-[9px] bg-black/35 px-1.5 py-0.5 rounded-lg border border-white/5 shrink-0">
                ¥{(nextOffice.upgradeCost / 10000).toFixed(0)}万
              </span>
            </button>
          ) : (
            <div className="w-full p-2.5 bg-[#090e1a]/40 border border-slate-900 text-slate-600 text-[10px] rounded-xl text-center font-bold">
              オフィス最大 (ミッドタウンビル)
            </div>
          )}
        </div>
      </div>

      {/* ターン実行ボタン */}
      <button
        disabled={pendingVCOffer}
        onClick={executeTurn}
        className="w-full min-h-[50px] bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-500 hover:via-pink-500 hover:to-blue-500 text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-xl shadow-purple-950/30 hover:shadow-purple-950/50 border border-white/5 transition-all flex items-center justify-center gap-2 transform active:scale-95 disabled:from-[#090e1a] disabled:to-[#090e1a] disabled:text-slate-700 disabled:shadow-none cursor-pointer btn-premium"
      >
        <Play className="w-3.5 h-3.5 fill-current" />
        次ターンを実行 (Next Turn)
      </button>
    </div>
  );
}
