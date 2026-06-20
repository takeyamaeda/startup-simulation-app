"use client";

import React from "react";
import { useGameStateStore } from "../store/useGameState";
import { Trophy, AlertCircle, RefreshCw, Landmark } from "lucide-react";

export default function GameOverModal() {
  const gameStatus = useGameStateStore((state) => state.gameStatus);
  const player = useGameStateStore((state) => state.player);
  const currentTurn = useGameStateStore((state) => state.currentTurn);
  const resetGame = useGameStateStore((state) => state.resetGame);
  const competitors = useGameStateStore((state) => state.competitors);

  if (gameStatus !== "cleared" && gameStatus !== "gameover") return null;

  const isClear = gameStatus === "cleared";
  const tier1Comp = competitors.find((c) => c.tier === 1);

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-xl glass-panel rounded-[32px] p-8 md:p-12 relative overflow-hidden border border-white/5 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* 背景の光 */}
        {isClear ? (
          <div className="absolute -top-32 -left-32 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"></div>
        ) : (
          <div className="absolute -top-32 -left-32 w-80 h-80 bg-rose-500/15 rounded-full blur-3xl pointer-events-none"></div>
        )}

        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center p-4 rounded-2xl mb-5 border ${
            isClear ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-rose-500/10 border-rose-500/20 text-rose-400"
          } glowing-badge`}>
            {isClear ? (
              <Trophy className="w-10 h-10 animate-bounce" />
            ) : (
              <AlertCircle className="w-10 h-10 animate-pulse" />
            )}
          </div>
          <h2 className="text-3xl font-black tracking-tight text-white uppercase">
            {isClear ? "Market Cleared!" : "Game Over"}
          </h2>
          <p className="text-xs text-slate-400 mt-2 max-w-sm mx-auto leading-relaxed">
            {isClear
              ? `${tier1Comp?.name || "Tier 1競合"} の市場シェアを突破し、業界の覇権を獲得しました！素晴らしい経営手腕です。`
              : player.cash < 0
              ? "キャッシュフロー管理に失敗し、手元資金が枯渇して黒字倒産（キャッシュアウト）しました。"
              : "120ターンが経過しました。目標である市場シェア1位（Tier 1突破）に届きませんでした。"}
          </p>
        </div>

        {/* 経営結果統計 */}
        <div className="bg-[#090e1a]/80 border border-slate-900 rounded-2xl p-6 space-y-4 mb-8">
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-900/60 pb-2">
            経営指標リザルト
          </h3>
          <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
            <div className="text-left">
              <span className="text-[9px] text-slate-500 uppercase block font-black">会社名 / サービス</span>
              <span className="text-sm font-bold text-white block mt-0.5 truncate">{player.name}</span>
              <span className="text-[11px] text-slate-400 truncate block mt-0.5 font-medium">{player.productName}</span>
            </div>
            <div className="text-left">
              <span className="text-[9px] text-slate-500 uppercase block font-black">経過ターン</span>
              <span className="text-sm font-bold text-white block mt-0.5">{currentTurn} ターン</span>
              <span className="text-[11px] text-slate-500 font-medium block mt-0.5">最大 120T</span>
            </div>
            <div className="text-left border-t border-slate-900/60 pt-3">
              <span className="text-[9px] text-slate-500 uppercase block font-black">最終ユーザー数</span>
              <span className="text-sm font-black text-purple-300 block mt-0.5">
                {player.users.toLocaleString()} 名
              </span>
            </div>
            <div className="text-left border-t border-slate-900/60 pt-3">
              <span className="text-[9px] text-slate-500 uppercase block font-black">最終MRR</span>
              <span className="text-sm font-black text-purple-300 block mt-0.5">
                ¥{player.mrr.toLocaleString()}
              </span>
            </div>
            <div className="text-left border-t border-slate-900/60 pt-3 col-span-2">
              <span className="text-[9px] text-slate-500 uppercase block font-black flex items-center gap-1.5">
                <Landmark className="w-3.5 h-3.5 text-slate-500" />
                最終手元資金
              </span>
              <span className={`text-base font-black mt-0.5 block ${player.cash >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                ¥{player.cash.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* やり直しボタン */}
        <button
          onClick={resetGame}
          className="w-full py-4.5 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-500 hover:via-pink-500 hover:to-blue-500 text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-xl shadow-purple-950/40 border border-white/5 transition-all flex items-center justify-center gap-2 transform active:scale-95 cursor-pointer btn-premium"
        >
          <RefreshCw className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '3s' }} />
          新しいゲームを始める
        </button>
      </div>
    </div>
  );
}
