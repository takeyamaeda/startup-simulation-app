"use client";

import React from "react";
import { useGameStateStore } from "../store/useGameState";
import { ListFilter } from "lucide-react";

export default function GameLogs() {
  const logs = useGameStateStore((state) => state.logs);

  const getLogStyle = (log: string) => {
    if (log.includes("【警告】")) {
      return "text-red-400 font-semibold bg-red-500/5 accent-border-blue border-r border-y border-red-500/10 border-l-3 border-l-red-500";
    }
    if (log.includes("【資金調達】")) {
      return "text-amber-400 font-bold bg-amber-500/5 border-r border-y border-amber-500/10 border-l-3 border-l-amber-500";
    }
    if (log.includes("【祝】") || log.includes("【クリア】")) {
      return "text-emerald-400 font-black bg-emerald-500/5 border-r border-y border-emerald-500/10 border-l-3 border-l-emerald-500";
    }
    if (log.includes("【強奪】")) {
      return "text-pink-400 bg-pink-500/5 border-r border-y border-pink-500/10 border-l-3 border-l-pink-500";
    }
    if (log.includes("【採用】") || log.includes("【HR】") || log.includes("【研修完了】")) {
      return "text-blue-400 bg-blue-500/5 border-r border-y border-blue-500/10 border-l-3 border-l-blue-500";
    }
    if (log.includes("【オフィス】")) {
      return "text-indigo-400 bg-indigo-500/5 border-r border-y border-indigo-500/10 border-l-3 border-l-indigo-500";
    }
    if (log.includes("【ペナルティ】")) {
      return "text-orange-400 font-semibold bg-orange-500/5 border-r border-y border-orange-500/10 border-l-3 border-l-orange-500";
    }
    return "text-slate-400 border-l-3 border-l-slate-800 bg-slate-900/10 border-r border-y border-slate-950/20";
  };

  return (
    <div className="glass-panel rounded-2xl p-6 flex flex-col gap-4 border border-white/5 h-full shrink-0 relative overflow-hidden">
      <h3 className="text-xs font-black uppercase tracking-widest text-slate-300 flex items-center gap-2 border-b border-slate-900/60 pb-3 shrink-0">
        <ListFilter className="w-4 h-4 text-purple-400" />
        経営ログ・オペレーション履歴
      </h3>

      <div className="flex-1 overflow-y-auto pr-1 space-y-2 flex flex-col">
        {logs.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-650 text-[11px] font-bold tracking-wider">
            経営アクションを実行するとここにログが出力されます。
          </div>
        ) : (
          logs.map((log, index) => (
            <div
              key={index}
              className={`text-[11px] py-2.5 px-3.5 rounded-xl border border-transparent transition-all leading-relaxed ${getLogStyle(log)}`}
            >
              {log}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
