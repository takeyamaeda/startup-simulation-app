"use client";

import React, { useState } from "react";
import { useGameStateStore } from "../store/useGameState";
import { IndustryType } from "../store/types";
import { Sparkles, Briefcase, HeartPulse, Video, MessageSquare, ArrowRight } from "lucide-react";

interface IndustryUI {
  id: IndustryType;
  name: string;
  desc: string;
  icon: React.ReactNode;
  color: string;
  activeGlow: string;
  tamPercent: number;
  tamLabel: string;
  arpuPercent: number;
  arpuLabel: string;
}

export default function GameSetup() {
  const initGame = useGameStateStore((state) => state.initGame);
  const [founderName, setFounderName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [productName, setProductName] = useState("");
  const [industry, setIndustry] = useState<IndustryType>("hr");
  const [difficulty, setDifficulty] = useState<"easy" | "normal" | "hard">("normal");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!founderName.trim() || !companyName.trim() || !productName.trim()) {
      alert("すべての項目を入力してください。");
      return;
    }
    initGame({
      founderName,
      companyName,
      productName,
      industry,
      difficulty,
    });
  };

  const industries: IndustryUI[] = [
    {
      id: "hr",
      name: "HR / 求人",
      desc: "マッチング・人材獲得",
      icon: <Briefcase className="w-4 h-4 text-purple-400" />,
      color: "from-purple-500/20 to-indigo-500/5",
      activeGlow: "active-glow-purple",
      tamPercent: 50,
      tamLabel: "普通",
      arpuPercent: 50,
      arpuLabel: "普通",
    },
    {
      id: "telehealth",
      name: "オンライン診療",
      desc: "診察・処方の医療デジタル",
      icon: <HeartPulse className="w-4 h-4 text-rose-400" />,
      color: "from-rose-500/20 to-red-500/5",
      activeGlow: "active-glow-blue",
      tamPercent: 20,
      tamLabel: "小",
      arpuPercent: 90,
      arpuLabel: "高",
    },
    {
      id: "video_streaming",
      name: "動画配信",
      desc: "エンタメ動画配信",
      icon: <Video className="w-4 h-4 text-blue-400" />,
      color: "from-blue-500/20 to-cyan-500/5",
      activeGlow: "active-glow-blue",
      tamPercent: 80,
      tamLabel: "大",
      arpuPercent: 35,
      arpuLabel: "やや低",
    },
    {
      id: "sns",
      name: "SNS / メディア",
      desc: "広告・コミュニティ",
      icon: <MessageSquare className="w-4 h-4 text-emerald-400" />,
      color: "from-emerald-500/20 to-teal-500/5",
      activeGlow: "active-glow-green",
      tamPercent: 100,
      tamLabel: "極大",
      arpuPercent: 10,
      arpuLabel: "低",
    },
  ];

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-8 bg-[#040612] relative overflow-y-auto">
      {/* 背景ネオンライト */}
      <div className="absolute -top-40 right-[15%] w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 left-[15%] w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-2xl glass-panel rounded-2xl p-6 md:p-8 relative z-10 border border-white/5 shadow-2xl">
        <div className="text-center mb-5">
          <div className="inline-flex items-center justify-center p-2 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-lg mb-2 border border-purple-500/20 glowing-badge">
            <Sparkles className="w-4.5 h-4.5 text-purple-300" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white mb-1 bg-gradient-to-r from-purple-300 via-pink-300 to-blue-300 bg-clip-text text-transparent">
            STARTUP SIMULATION
          </h1>
          <p className="text-slate-400 text-[10px] max-w-md mx-auto leading-normal font-medium">
            ITスタートアップの創業者となり、競合を凌駕して市場1位（Tier 1超え）を目指す経営シミュレーション。
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* テキスト入力: 3列並びにして高さを劇的に削減 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="relative group">
              <label className="block text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1 transition-colors group-focus-within:text-purple-400">
                創業者名 (CEO)
              </label>
              <input
                type="text"
                value={founderName}
                onChange={(e) => setFounderName(e.target.value)}
                placeholder="例: 氷熊 大輝"
                required
                className="w-full bg-[#0a0f1d]/85 border border-slate-900 focus:border-purple-500/80 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-700 outline-none transition-all focus:ring-1 focus:ring-purple-500/20"
              />
            </div>
            <div className="relative group">
              <label className="block text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1 transition-colors group-focus-within:text-purple-400">
                会社名
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="例: Unicorn Tech"
                required
                className="w-full bg-[#0a0f1d]/85 border border-slate-900 focus:border-purple-500/80 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-700 outline-none transition-all focus:ring-1 focus:ring-purple-500/20"
              />
            </div>
            <div className="relative group">
              <label className="block text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1 transition-colors group-focus-within:text-purple-400">
                プロダクト名
              </label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="例: Bloom SaaS"
                required
                className="w-full bg-[#0a0f1d]/85 border border-slate-900 focus:border-purple-500/80 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-700 outline-none transition-all focus:ring-1 focus:ring-purple-500/20"
              />
            </div>
          </div>

          {/* 参入業界の選択: 高さをコンパクトに */}
          <div>
            <label className="block text-[9px] font-black uppercase tracking-widest text-slate-500 mb-2">
              参入業界の選択
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {industries.map((ind) => {
                const isSelected = industry === ind.id;
                return (
                  <button
                    key={ind.id}
                    type="button"
                    onClick={() => setIndustry(ind.id)}
                    className={`flex flex-col p-3 rounded-xl border text-left transition-all duration-300 relative group overflow-hidden cursor-pointer ${
                      isSelected
                        ? `${ind.activeGlow}`
                        : "bg-[#070b15]/40 border-slate-900/60 hover:border-slate-800"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1.5 shrink-0">
                      <div className="p-1 bg-[#0a0f1d] rounded-lg border border-slate-800/80 group-hover:border-slate-700 transition-colors shrink-0">
                        {ind.icon}
                      </div>
                      <span className="font-extrabold text-[10px] text-white">{ind.name}</span>
                    </div>
                    <span className="text-[9px] text-slate-500 leading-normal font-medium block mb-2 truncate" title={ind.desc}>
                      {ind.desc}
                    </span>

                    {/* ビジュアルインジケータ（TAM/ARPU） */}
                    <div className="w-full space-y-1 pt-1.5 border-t border-slate-900/60 mt-auto">
                      <div className="flex items-center justify-between text-[8px] font-black tracking-wider text-slate-500 uppercase">
                        <span>市場規模 (TAM)</span>
                        <span className="text-slate-300 font-extrabold">{ind.tamLabel}</span>
                      </div>
                      <div className="w-full h-0.5 bg-[#090e1a] rounded-full overflow-hidden border border-white/5">
                        <div
                          className="h-full bg-purple-500 rounded-full"
                          style={{ width: `${ind.tamPercent}%` }}
                        ></div>
                      </div>

                      <div className="flex items-center justify-between text-[8px] font-black tracking-wider text-slate-500 uppercase pt-0.5">
                        <span>顧客単価 (ARPU)</span>
                        <span className="text-slate-300 font-extrabold">{ind.arpuLabel}</span>
                      </div>
                      <div className="w-full h-0.5 bg-[#090e1a] rounded-full overflow-hidden border border-white/5">
                        <div
                          className="h-full bg-blue-400 rounded-full"
                          style={{ width: `${ind.arpuPercent}%` }}
                        ></div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 難易度設定 */}
          <div>
            <label className="block text-[9px] font-black uppercase tracking-widest text-slate-500 mb-2">
              難易度設定
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: "easy", name: "EASY", cash: "¥1,500万", activeGlow: "active-glow-green" },
                { id: "normal", name: "NORMAL", cash: "¥1,000万", activeGlow: "active-glow-blue" },
                { id: "hard", name: "HARD", cash: "¥500万", activeGlow: "active-glow-purple" },
              ].map((diff) => {
                const isSelected = difficulty === diff.id;
                return (
                  <button
                    key={diff.id}
                    type="button"
                    onClick={() => setDifficulty(diff.id as any)}
                    className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                      isSelected
                        ? `${diff.activeGlow} font-black`
                        : "bg-[#070b15]/40 border-slate-900/60 text-slate-400 hover:border-slate-800"
                    }`}
                  >
                    <span className="block text-[9px] font-black tracking-wider">{diff.name}</span>
                    <span className="text-[8px] text-slate-500 font-bold mt-0.5 block">資金: {diff.cash}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 送信ボタン */}
          <div className="pt-1">
            <button
              type="submit"
              className="w-full btn-premium bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-500 hover:via-pink-500 hover:to-blue-500 text-white font-black text-xs uppercase tracking-widest py-3 px-6 rounded-xl shadow-lg shadow-purple-950/20 hover:shadow-purple-950/40 transition-all flex items-center justify-center gap-2 group cursor-pointer border border-white/5"
            >
              会社を設立してスタートする
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
