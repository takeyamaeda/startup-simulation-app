"use client";

import React, { useEffect, useState } from "react";
import { useGameStateStore } from "../store/useGameState";
import GameSetup from "../components/GameSetup";
import Header from "../components/Header";
import DashboardCharts from "../components/DashboardCharts";
import Leaderboard from "../components/Leaderboard";
import CommandPanel from "../components/CommandPanel";
import HRPanel from "../components/HRPanel";
import GameLogs from "../components/GameLogs";
import VCOfferModal from "../components/VCOfferModal";
import GameOverModal from "../components/GameOverModal";
import { RefreshCw, Trophy, Wrench, Users } from "lucide-react";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const gameStatus = useGameStateStore((state) => state.gameStatus);
  const resetGame = useGameStateStore((state) => state.resetGame);

  // コントロールパネルのタブ選択
  const [controlTab, setControlTab] = useState<"commands" | "hr" | "leaderboard">("commands");

  // ハイドレーションエラーを防止するため、クライアントマウント完了まで待機
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-slate-500 gap-4 bg-[#040612]">
        <RefreshCw className="w-8 h-8 animate-spin text-purple-500" />
        <span className="text-xs font-black tracking-widest text-slate-400">LOADING CORE ENGINE...</span>
      </div>
    );
  }

  // 初期セットアップ画面
  if (gameStatus === "setup") {
    return <GameSetup />;
  }

  return (
    <main className="h-screen w-screen p-4 md:p-6 bg-[#040612] relative overflow-hidden flex flex-col gap-4 select-none">
      {/* 背景のグラデーションスポットライト効果 */}
      <div className="bg-glow-spot-1"></div>
      <div className="bg-glow-spot-2"></div>

      {/* モーダルダイアログ群 */}
      <VCOfferModal />
      <GameOverModal />

      {/* 1. ヘッダー情報（高さ固定） */}
      <Header />

      {/* 2. メインスプリットレイアウト（残りの高さを100%活用し、スクロールを完全排除） */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch relative z-10">
        
        {/* 左側カラム (モニター表示領域): 12列中 7列 */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-4 min-h-0">
          {/* チャート（高さをフレキシブルに拡張） */}
          <div className="flex-1 min-h-0">
            <DashboardCharts />
          </div>
          {/* 経営ログ（高さを170pxに制限） */}
          <div className="h-[170px] shrink-0">
            <GameLogs />
          </div>
        </div>

        {/* 右側カラム (意思決定・タブ制御領域): 12列中 5列 */}
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col glass-panel rounded-2xl border border-white/5 min-h-0 overflow-hidden">
          
          {/* タブナビゲーション（上部固定） */}
          <div className="flex bg-[#070b15] p-1 border-b border-slate-900/60 shrink-0">
            <button
              onClick={() => setControlTab("commands")}
              className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                controlTab === "commands"
                  ? "bg-purple-600/10 border-b-2 border-purple-500 text-purple-300 font-bold"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              <Wrench className="w-3.5 h-3.5" />
              経営コマンド
            </button>
            <button
              onClick={() => setControlTab("hr")}
              className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                controlTab === "hr"
                  ? "bg-purple-600/10 border-b-2 border-purple-500 text-purple-300 font-bold"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              メンバー・HR
            </button>
            <button
              onClick={() => setControlTab("leaderboard")}
              className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                controlTab === "leaderboard"
                  ? "bg-purple-600/10 border-b-2 border-purple-500 text-purple-300 font-bold"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              リーダーボード
            </button>
          </div>

          {/* タブコンテンツ（残りの高さを一杯に使用し、必要に応じてパネル内でスクロール） */}
          <div className="flex-1 min-h-0 overflow-hidden">
            {controlTab === "commands" && <CommandPanel />}
            {controlTab === "hr" && <HRPanel />}
            {controlTab === "leaderboard" && <Leaderboard />}
          </div>
        </div>

      </div>

      {/* 3. デバッグフッター（高さ固定） */}
      <footer className="flex justify-between items-center text-[9px] text-slate-600 shrink-0 relative z-10 pt-1">
        <span>© 2026 Startup Simulation Engine.</span>
        <button
          onClick={resetGame}
          className="text-slate-500 hover:text-red-400 font-extrabold transition-colors flex items-center gap-1 cursor-pointer"
        >
          <RefreshCw className="w-2.5 h-2.5" />
          データクリア
        </button>
      </footer>
    </main>
  );
}
