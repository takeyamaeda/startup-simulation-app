"use client";

import React from "react";
import { useGameStateStore } from "../store/useGameState";
import { Coins, AlertTriangle } from "lucide-react";

export default function VCOfferModal() {
  const pendingVCOffer = useGameStateStore((state) => state.pendingVCOffer);
  const player = useGameStateStore((state) => state.player);
  const respondToVCOffer = useGameStateStore((state) => state.respondToVCOffer);

  if (!pendingVCOffer) return null;

  const targetMrr = player.mrr * 3;

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg glass-panel rounded-[32px] p-8 md:p-10 relative overflow-hidden border border-white/5 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* 背景の光 */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="text-center mb-7">
          <div className="inline-flex items-center justify-center p-3.5 bg-gradient-to-br from-amber-500/15 to-yellow-500/5 rounded-2xl mb-4 border border-amber-500/20 glowing-badge">
            <Coins className="w-8 h-8 text-yellow-400 animate-bounce" />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            シリーズA 資金調達オファー
          </h2>
          <p className="text-[11px] text-slate-500 mt-1.5 font-medium leading-relaxed">
            ベンチャーキャピタル (VC) より、会社のスケールを加速させる大規模な投資提案が届きました。
          </p>
        </div>

        <div className="space-y-4 mb-8">
          {/* 条件カード */}
          <div className="bg-[#090e1a]/80 border border-slate-900 rounded-2xl p-5 space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 font-semibold uppercase tracking-wider text-[10px]">調達金額</span>
              <span className="font-mono font-black text-emerald-400 text-sm">¥30,000,000</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 font-semibold uppercase tracking-wider text-[10px]">株式放出（希薄化）</span>
              <span className="font-extrabold text-rose-400 text-xs">-20 % (持ち株比率の低下)</span>
            </div>
            <div className="border-t border-slate-900/60 my-2 pt-3 flex justify-between items-center text-xs">
              <span className="text-slate-500 font-black uppercase tracking-wider text-[10px]">達成ノルマ (24T後)</span>
              <span className="font-mono font-black text-purple-300 text-sm">MRR ¥{targetMrr.toLocaleString()}</span>
            </div>
          </div>

          {/* 警告ペナルティ表示 */}
          <div className="bg-orange-500/5 border border-orange-500/10 rounded-2xl p-4 flex gap-3 text-[11px] leading-relaxed">
            <AlertTriangle className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-black text-orange-400 block mb-1">未達成ペナルティ</span>
              <span className="text-slate-400 font-medium">
                24ターン後に目標MRRに達しない場合、全メンバーの生産性が以降12ターン「0.5倍」に減衰します。
              </span>
            </div>
          </div>
        </div>

        {/* アクションボタン */}
        <div className="flex gap-4">
          <button
            onClick={() => respondToVCOffer(false)}
            className="flex-1 py-3.5 px-4 bg-[#0a0f1d] hover:bg-[#141f38] border border-slate-900 text-slate-400 hover:text-white rounded-xl text-xs font-extrabold transition-all cursor-pointer btn-premium"
          >
            オファーを辞退
          </button>
          <button
            onClick={() => respondToVCOffer(true)}
            className="flex-1 py-3.5 px-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl text-xs font-black shadow-lg shadow-purple-950/40 border border-white/5 transition-all cursor-pointer btn-premium"
          >
            承諾して資金調達
          </button>
        </div>
      </div>
    </div>
  );
}
