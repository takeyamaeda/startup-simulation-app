"use client";

import React from "react";
import { useGameStateStore, EMPLOYEE_PARAMS } from "../store/useGameState";
import { Users, GraduationCap, Star } from "lucide-react";

export default function HRPanel() {
  const player = useGameStateStore((state) => state.player);
  const trainEmployee = useGameStateStore((state) => state.trainEmployee);

  const getRoleLabel = (role: string) => {
    if (role === "engineer") return "ENG";
    if (role === "designer") return "DES";
    if (role === "sales") return "SAL";
    return "";
  };

  const getRoleColor = (role: string) => {
    if (role === "engineer") return "bg-blue-500/10 border-blue-500/20 text-blue-300";
    if (role === "designer") return "bg-pink-500/10 border-pink-500/20 text-pink-300";
    if (role === "sales") return "bg-emerald-500/10 border-emerald-500/20 text-emerald-300";
    return "bg-slate-500/10 border-slate-500/20 text-slate-400";
  };

  const getLevelBadge = (level: string) => {
    if (level === "junior") return "bg-slate-900 border-slate-800 text-slate-400";
    if (level === "middle") return "bg-amber-500/10 border-amber-500/20 text-amber-300";
    if (level === "senior") return "bg-purple-500/10 border-purple-500/20 text-purple-300";
    return "";
  };

  const getLevelLabel = (level: string) => {
    if (level === "junior") return "ジュニア";
    if (level === "middle") return "ミドル";
    if (level === "senior") return "シニア";
    return "";
  };

  return (
    <div className="flex flex-col gap-4 p-5 h-full overflow-hidden">
      <div className="flex-1 overflow-y-auto pr-1">
        {player.employees.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-650 gap-3 py-10">
            <div className="p-3 bg-[#0a0f1d] rounded-2xl border border-slate-800">
              <Users className="w-8 h-8 text-slate-500 stroke-[1.5]" />
            </div>
            <span className="text-[11px] font-bold tracking-wider">メンバーがいません。「採用」から獲得しましょう。</span>
          </div>
        ) : (
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="text-slate-500 border-b border-slate-900/60 text-[9px] font-black uppercase tracking-wider">
                <th className="pb-3 font-semibold">名前</th>
                <th className="pb-3 font-semibold">役割</th>
                <th className="pb-3 font-semibold">レベル</th>
                <th className="pb-3 font-semibold text-right">生産性</th>
                <th className="pb-3 font-semibold text-right">給与 / 月</th>
                <th className="pb-3 font-semibold text-center">育成</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900/40">
              {player.employees.map((emp) => {
                const nextLevel = emp.level === "junior" ? "middle" : emp.level === "middle" ? "senior" : null;
                const trainCost = nextLevel ? EMPLOYEE_PARAMS[emp.level].trainCost : 0;
                const canTrain = nextLevel && !emp.isTraining && player.cash >= trainCost;

                return (
                  <tr key={emp.id} className="hover:bg-white/[0.01] transition-colors">
                    <td className="py-3 font-extrabold text-white text-xs flex items-center gap-1.5 truncate max-w-[80px]">
                      {emp.name}
                      {emp.level === "senior" && <Star className="w-2.5 h-2.5 text-purple-400 fill-purple-400/25" />}
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded border text-[8px] font-extrabold ${getRoleColor(emp.role)}`}>
                        {getRoleLabel(emp.role)}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded border text-[8px] font-extrabold ${getLevelBadge(emp.level)}`}>
                        {getLevelLabel(emp.level)}
                      </span>
                    </td>
                    <td className="py-3 text-right font-mono font-bold text-slate-300">
                      {emp.isTraining ? (
                        <span className="text-[8px] text-amber-400 font-extrabold pulse-indicator bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded">
                          育成中
                        </span>
                      ) : (
                        emp.productivity
                      )}
                    </td>
                    <td className="py-3 text-right font-mono text-slate-400 font-medium">
                      ¥{(emp.salary / 10000).toFixed(0)}万
                    </td>
                    <td className="py-3 text-center">
                      {emp.level !== "senior" ? (
                        <div className="relative inline-block group">
                          <button
                            disabled={!canTrain}
                            onClick={() => trainEmployee(emp.id)}
                            className="p-1 bg-[#0e1628] border border-white/5 text-purple-300 hover:bg-purple-600 hover:text-white rounded transition-all disabled:opacity-20 disabled:pointer-events-none cursor-pointer"
                            title={nextLevel ? `研修費用: ¥${trainCost.toLocaleString()}` : ""}
                          >
                            <GraduationCap className="w-3.5 h-3.5" />
                          </button>
                          {nextLevel && !emp.isTraining && player.cash < trainCost && (
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-32 bg-[#080d19] text-red-400 text-[9px] p-2 rounded-lg border border-red-900/30 opacity-0 group-hover:opacity-100 pointer-events-none transition-all z-20 shadow-xl text-center">
                              資金不足: ¥{trainCost.toLocaleString()}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-650 text-[8px] font-black uppercase tracking-wider">MAX</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
