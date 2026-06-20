"use client";

import React, { useState } from "react";
import { useGameStateStore } from "../store/useGameState";
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  CartesianGrid,
} from "recharts";
import { TrendingUp, Users, DollarSign } from "lucide-react";

export default function DashboardCharts() {
  const history = useGameStateStore((state) => state.history);
  const competitors = useGameStateStore((state) => state.competitors);
  const player = useGameStateStore((state) => state.player);

  const [activeTab, setActiveTab] = useState<"users" | "mrr">("users");

  // Recharts用のカスタムツールチップ
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#080d19]/95 border border-white/5 backdrop-blur-md p-4.5 rounded-2xl shadow-2xl relative z-50">
          <p className="text-[10px] font-black tracking-widest text-slate-500 uppercase mb-2">Turn {label}</p>
          <div className="space-y-1.5">
            {payload.map((entry: any, index: number) => (
              <div key={index} className="flex items-center gap-3 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: entry.color }}></span>
                <span className="text-slate-400 font-medium truncate max-w-[120px]">{entry.name}:</span>
                <span className="text-white font-mono font-bold ml-auto">
                  {activeTab === "users"
                    ? `${Number(entry.value).toLocaleString()} 名`
                    : `¥${Number(entry.value).toLocaleString()}`}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  // チャートに表示する系列データ
  const chartData = history.map((entry) => {
    if (activeTab === "users") {
      return {
        turn: entry.turn,
        [player.name || "自社"]: entry.playerUsers,
        [competitors[0]?.name || "競合1"]: entry.comp1Users,
        [competitors[1]?.name || "競合2"]: entry.comp2Users,
        [competitors[2]?.name || "競合3"]: entry.comp3Users,
      };
    } else {
      const arpu = player.mrr / (player.users || 1);
      return {
        turn: entry.turn,
        [player.name || "自社"]: entry.playerMrr,
        [competitors[0]?.name || "競合1"]: (entry.comp1Users * arpu),
        [competitors[1]?.name || "競合2"]: (entry.comp2Users * arpu),
        [competitors[2]?.name || "競合3"]: (entry.comp3Users * arpu),
      };
    }
  });

  return (
    <div className="glass-panel rounded-2xl p-6 flex flex-col h-full border border-white/5 relative overflow-hidden">
      {/* タブとヘッダー */}
      <div className="flex items-center justify-between mb-6 shrink-0 relative z-10">
        <h3 className="text-xs font-black uppercase tracking-widest text-slate-300 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-purple-400" />
          市場成長・シェア推移
        </h3>
        <div className="flex bg-[#070b15] p-1 rounded-xl border border-slate-900">
          <button
            onClick={() => setActiveTab("users")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
              activeTab === "users"
                ? "bg-purple-600 text-white shadow-lg shadow-purple-950/40"
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            <Users className="w-3 h-3" />
            ユーザー数
          </button>
          <button
            onClick={() => setActiveTab("mrr")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
              activeTab === "mrr"
                ? "bg-purple-600 text-white shadow-lg shadow-purple-950/40"
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            <DollarSign className="w-3 h-3" />
            MRR
          </button>
        </div>
      </div>

      {/* チャート本体 */}
      <div className="flex-1 w-full text-[10px] relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPlayer" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#c084fc" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#c084fc" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
            <XAxis
              dataKey="turn"
              stroke="rgba(255,255,255,0.15)"
              tickLine={false}
              axisLine={false}
              dy={10}
              tick={{ fill: "#64748b" }}
            />
            <YAxis
              stroke="rgba(255,255,255,0.15)"
              tickLine={false}
              axisLine={false}
              dx={-5}
              tickFormatter={(value) => {
                if (activeTab === "users") {
                  return value >= 10000 ? `${(value / 10000).toFixed(0)}万` : value.toLocaleString();
                } else {
                  return value >= 1000000 ? `${(value / 1000000).toFixed(0)}M` : value.toLocaleString();
                }
              }}
              tick={{ fill: "#64748b" }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.05)', strokeWidth: 1 }} />
            <Legend
              verticalAlign="top"
              height={36}
              iconType="circle"
              iconSize={6}
              wrapperStyle={{ paddingBottom: 10, color: "#94a3b8", fontSize: "10px" }}
            />
            <Area
              type="monotone"
              name={player.name || "自社"}
              dataKey={player.name || "自社"}
              stroke="#c084fc"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorPlayer)"
            />
            {competitors[0] && (
              <Area
                type="monotone"
                name={competitors[0].name}
                dataKey={competitors[0].name}
                stroke="#60a5fa"
                strokeWidth={1.5}
                fillOpacity={0}
                strokeDasharray="4 4"
              />
            )}
            {competitors[1] && (
              <Area
                type="monotone"
                name={competitors[1].name}
                dataKey={competitors[1].name}
                stroke="#34d399"
                strokeWidth={1.5}
                fillOpacity={0}
                strokeDasharray="4 4"
              />
            )}
            {competitors[2] && (
              <Area
                type="monotone"
                name={competitors[2].name}
                dataKey={competitors[2].name}
                stroke="#fbbf24"
                strokeWidth={1.5}
                fillOpacity={0}
                strokeDasharray="4 4"
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
