import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  IndustryType,
  RoleType,
  SkillLevel,
  GameStatus,
  DevMode,
  OfficeLevel,
  Employee,
  Company,
  PlayerFinancials,
  GameState,
} from "./types";

// オフィス定数
export const OFFICE_LEVELS: OfficeLevel[] = [
  { level: 1, name: "レンタルガレージ / 自宅", maxEmployees: 3, rent: 50000, upgradeCost: 0 },
  { level: 2, name: "コワーキング・シェアオフィス", maxEmployees: 6, rent: 200000, upgradeCost: 1000000 },
  { level: 3, name: "渋谷スクエアオフィス", maxEmployees: 15, rent: 1000000, upgradeCost: 5000000 },
  { level: 4, name: "プレミアムミッドタウンビル", maxEmployees: 50, rent: 4000000, upgradeCost: 20000000 },
];

export const OFFICE_MAP = OFFICE_LEVELS.reduce((acc, curr) => {
  acc[curr.level] = curr;
  return acc;
}, {} as Record<number, OfficeLevel>);

// 従業員パラメータ設定
export const EMPLOYEE_PARAMS = {
  junior: { productivity: 5, salary: 250000, trainCost: 300000 },
  middle: { productivity: 12, salary: 500000, trainCost: 600000 },
  senior: { productivity: 25, salary: 800000, trainCost: 0 }, // シニアはこれ以上研修できない
};

// 業界データ定義
export const INDUSTRY_DATA = {
  hr: {
    tam: 2000000,
    standardArpu: 1200,
    competitors: [
      {
        id: "comp_1",
        name: "株式会社リクルート",
        ceoName: "出木場 久征",
        productName: "Airビジネスツールズ",
        tier: 1,
        isPlayer: false,
        cash: 500000000,
        mrr: 1320000000,
        officeLevel: 4,
        users: 1100000,
        techDebt: 15,
        features: 95,
        marketing: 120,
        employees: [],
      },
      {
        id: "comp_2",
        name: "パーソルキャリア",
        ceoName: "瀬野尾 裕",
        productName: "doda",
        tier: 2,
        isPlayer: false,
        cash: 200000000,
        mrr: 480000000,
        officeLevel: 3,
        users: 400000,
        techDebt: 10,
        features: 70,
        marketing: 80,
        employees: [],
      },
      {
        id: "comp_3",
        name: "株式会社タイミー",
        ceoName: "小川 嶺",
        productName: "タイミー",
        tier: 3,
        isPlayer: false,
        cash: 80000000,
        mrr: 180000000,
        officeLevel: 2,
        users: 150000,
        techDebt: 5,
        features: 40,
        marketing: 55,
        employees: [],
      },
    ],
  },
  telehealth: {
    tam: 8000000, // 仕様書のTAM: 800,000人（単位調整）だが、テキストのTAM: 800,000人に従う
    standardArpu: 1500,
    competitors: [
      {
        id: "comp_1",
        name: "エムスリー株式会社",
        ceoName: "谷村 格",
        productName: "エムスリー",
        tier: 1,
        isPlayer: false,
        cash: 300000000,
        mrr: 450000000,
        officeLevel: 4,
        users: 300000,
        techDebt: 8,
        features: 85,
        marketing: 90,
        employees: [],
      },
      {
        id: "comp_2",
        name: "株式会社メドレー",
        ceoName: "瀧口 浩平",
        productName: "CLINICS",
        tier: 2,
        isPlayer: false,
        cash: 100000000,
        mrr: 180000000,
        officeLevel: 3,
        users: 120000,
        techDebt: 5,
        features: 60,
        marketing: 65,
        employees: [],
      },
      {
        id: "comp_3",
        name: "株式会社Linc’well",
        ceoName: "氷熊 大輝",
        productName: "CLINIC FOR",
        tier: 3,
        isPlayer: false,
        cash: 40000000,
        mrr: 67500000,
        officeLevel: 2,
        users: 450000, // 仕様書の194行目 `users: 45,000` だが、30万、12万、に対して 45,000人
        techDebt: 3,
        features: 38,
        marketing: 45,
        employees: [],
      },
    ],
  },
  video_streaming: {
    tam: 5000000,
    standardArpu: 800,
    competitors: [
      {
        id: "comp_1",
        name: "Netflix",
        ceoName: "グレッグ・ピーターズ",
        productName: "Netflix",
        tier: 1,
        isPlayer: false,
        cash: 1000000000,
        mrr: 2000000000,
        officeLevel: 4,
        users: 2500000,
        techDebt: 0,
        features: 99,
        marketing: 150,
        employees: [],
      },
      {
        id: "comp_2",
        name: "U-NEXT",
        ceoName: "堤 天心",
        productName: "U-NEXT",
        tier: 2,
        isPlayer: false,
        cash: 300000000,
        mrr: 800000000,
        officeLevel: 3,
        users: 1000000,
        techDebt: 12,
        features: 80,
        marketing: 90,
        employees: [],
      },
      {
        id: "comp_3",
        name: "ABEMA",
        ceoName: "藤田 晋",
        productName: "ABEMA",
        tier: 3,
        isPlayer: false,
        cash: 150000000,
        mrr: 320000000,
        officeLevel: 2,
        users: 400000,
        techDebt: 18,
        features: 55,
        marketing: 75,
        employees: [],
      },
    ],
  },
  sns: {
    tam: 10000000,
    standardArpu: 200,
    competitors: [
      {
        id: "comp_1",
        name: "LINEヤフー株式会社",
        ceoName: "出澤 剛",
        productName: "LINE",
        tier: 1,
        isPlayer: false,
        cash: 2000000000,
        mrr: 1200000000,
        officeLevel: 4,
        users: 6000000,
        techDebt: 20,
        features: 90,
        marketing: 110,
        employees: [],
      },
      {
        id: "comp_2",
        name: "株式会社note",
        ceoName: "加藤 貞顕",
        productName: "note",
        tier: 2,
        isPlayer: false,
        cash: 150000000,
        mrr: 300000000,
        officeLevel: 3,
        users: 1500000,
        techDebt: 5,
        features: 50,
        marketing: 60,
        employees: [],
      },
      {
        id: "comp_3",
        name: "タイツー",
        ceoName: "新興 太郎",
        productName: "Thready",
        tier: 3,
        isPlayer: false,
        cash: 30000000,
        mrr: 40000000,
        officeLevel: 2,
        users: 200000,
        techDebt: 2,
        features: 20,
        marketing: 30,
        employees: [],
      },
    ],
  },
};

const LAST_NAMES = [
  "佐藤", "鈴木", "高橋", "田中", "渡辺", "伊藤", "山本", "中村", "小林", "加藤",
  "吉田", "山田", "佐々木", "山口", "松本", "井上", "木村", "林", "斎藤", "清水"
];
const FIRST_NAMES_MALE = ["健太", "翔太", "大輝", "翼", "拓海", "優介", "陽太", "陸", "駿", "海斗"];
const FIRST_NAMES_FEMALE = ["美咲", "葵", "陽菜", "さくら", "結衣", "莉子", "芽依", "心春", "愛菜", "結菜"];

function generateRandomName() {
  const ln = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
  const isMale = Math.random() > 0.5;
  const fnList = isMale ? FIRST_NAMES_MALE : FIRST_NAMES_FEMALE;
  const fn = fnList[Math.floor(Math.random() * fnList.length)];
  return `${ln} ${fn}`;
}

export interface ChartHistoryEntry {
  turn: number;
  playerUsers: number;
  playerMrr: number;
  playerCash: number;
  comp1Users: number;
  comp2Users: number;
  comp3Users: number;
}

export interface ExtendedGameState extends GameState {
  history: ChartHistoryEntry[];
  vcPenaltyRemainingTurns: number; // ノルマ未達ペナルティの残りターン数
}

export const useGameStateStore = create<ExtendedGameState>()(
  persist(
    (set, get) => ({
      currentTurn: 0,
      difficulty: "normal",
      gameStatus: "setup",
      selectedIndustry: null,
      tam: 0,
      standardArpu: 0,

      player: {
        id: "player",
        name: "",
        ceoName: "",
        productName: "",
        tier: 3,
        isPlayer: true,
        cash: 0,
        mrr: 0,
        officeLevel: 1,
        users: 100,
        techDebt: 0,
        features: 1,
        marketing: 10,
        employees: [],
      },
      competitors: [],
      financials: {
        shareOwned: 100,
        vcTargetMRR: 0,
        vcDeadlineTurn: 0,
        hasTriggeredA: false,
      },
      logs: [],
      currentDevMode: "normal",
      marketingInvestment: 0,
      pendingVCOffer: false,
      history: [],
      vcPenaltyRemainingTurns: 0,

      initGame: (setup) => {
        const indData = INDUSTRY_DATA[setup.industry];
        let initialCash = 10000000;
        if (setup.difficulty === "easy") initialCash = 15000000;
        if (setup.difficulty === "hard") initialCash = 5000000;

        // 初期チーム: ジュニアエンジニア1名
        const initialEmployees: Employee[] = [
          {
            id: crypto.randomUUID(),
            name: generateRandomName(),
            role: "engineer",
            level: "junior",
            productivity: EMPLOYEE_PARAMS.junior.productivity,
            salary: EMPLOYEE_PARAMS.junior.salary,
            isTraining: false,
          },
        ];

        // 競合データのディープコピー
        const comps = JSON.parse(JSON.stringify(indData.competitors)) as Company[];

        // Linc'wellのユーザー初期値バグ修正 (45,000人)
        if (setup.industry === "telehealth") {
          const lincwell = comps.find((c) => c.id === "comp_3");
          if (lincwell) {
            lincwell.users = 45000;
          }
        }

        const initialPlayer: Company = {
          id: "player",
          name: setup.companyName,
          ceoName: setup.founderName,
          productName: setup.productName,
          tier: 3,
          isPlayer: true,
          cash: initialCash,
          mrr: 100 * indData.standardArpu,
          officeLevel: 1,
          users: 100,
          techDebt: 0,
          features: 1,
          marketing: 10,
          employees: initialEmployees,
        };

        const initialHistory: ChartHistoryEntry[] = [
          {
            turn: 0,
            playerUsers: 100,
            playerMrr: 100 * indData.standardArpu,
            playerCash: initialCash,
            comp1Users: comps[0].users,
            comp2Users: comps[1].users,
            comp3Users: comps[2].users,
          },
        ];

        set({
          currentTurn: 0,
          difficulty: setup.difficulty,
          gameStatus: "playing",
          selectedIndustry: setup.industry,
          tam: indData.tam,
          standardArpu: indData.standardArpu,
          player: initialPlayer,
          competitors: comps,
          financials: {
            shareOwned: 100,
            vcTargetMRR: 0,
            vcDeadlineTurn: 0,
            hasTriggeredA: false,
          },
          logs: [`【創業】${setup.companyName}（CEO: ${setup.founderName}）がレンタルガレージからスタートしました！`],
          currentDevMode: "normal",
          marketingInvestment: 0,
          pendingVCOffer: false,
          history: initialHistory,
          vcPenaltyRemainingTurns: 0,
        });
      },

      setDevMode: (mode) => {
        set({ currentDevMode: mode });
      },

      adjustMarketing: (increment) => {
        set((state) => {
          const current = state.marketingInvestment;
          const next = increment ? current + 1 : Math.max(0, current - 1);
          return { marketingInvestment: next };
        });
      },

      hireEmployee: (role) => {
        const state = get();
        const currentCount = state.player.employees.length + 1; // 従業員 + 創業者1名
        const maxEmployees = OFFICE_MAP[state.player.officeLevel].maxEmployees;

        if (currentCount >= maxEmployees) {
          set((state) => ({
            logs: ["【警告】現在のオフィスが満員です。従業員を採用するにはオフィス拡張が必要です。", ...state.logs],
          }));
          return;
        }

        const hireCost = 200000;
        if (state.player.cash < hireCost) {
          set((state) => ({
            logs: ["【警告】手元資金が不足しているため、求人広告（¥200,000）を出せません。", ...state.logs],
          }));
          return;
        }

        const newEmp: Employee = {
          id: crypto.randomUUID(),
          name: generateRandomName(),
          role,
          level: "junior",
          productivity: EMPLOYEE_PARAMS.junior.productivity,
          salary: EMPLOYEE_PARAMS.junior.salary,
          isTraining: false,
        };

        const roleJa = role === "engineer" ? "エンジニア" : role === "designer" ? "デザイナー" : "セールス";

        set((state) => ({
          player: {
            ...state.player,
            cash: state.player.cash - hireCost,
            employees: [...state.player.employees, newEmp],
          },
          logs: [`【採用】ジュニア${roleJa}の「${newEmp.name}」を採用しました（費用 ¥200,000）。`, ...state.logs],
        }));
      },

      trainEmployee: (employeeId) => {
        const state = get();
        const emp = state.player.employees.find((e) => e.id === employeeId);
        if (!emp || emp.isTraining) return;

        if (emp.level === "senior") {
          set((state) => ({
            logs: ["【警告】シニアスタッフはこれ以上研修できません。", ...state.logs],
          }));
          return;
        }

        const cost = emp.level === "junior" ? EMPLOYEE_PARAMS.junior.trainCost : EMPLOYEE_PARAMS.middle.trainCost;

        if (state.player.cash < cost) {
          set((state) => ({
            logs: ["【警告】手元資金が不足しているため、研修費用を支払えません。", ...state.logs],
          }));
          return;
        }

        set((state) => {
          const nextEmployees = state.player.employees.map((e) => {
            if (e.id === employeeId) {
              return { ...e, isTraining: true };
            }
            return e;
          });
          return {
            player: {
              ...state.player,
              cash: state.player.cash - cost,
              employees: nextEmployees,
            },
            logs: [`【HR】${emp.name} の研修を開始しました（費用 ¥${cost.toLocaleString()}）。次ターン開始時にレベルアップします（今期生産性 0）。`, ...state.logs],
          };
        });
      },

      upgradeOffice: () => {
        const state = get();
        const currentLevel = state.player.officeLevel;
        if (currentLevel >= 4) return;

        const nextOffice = OFFICE_MAP[currentLevel + 1];
        if (state.player.cash < nextOffice.upgradeCost) {
          set((state) => ({
            logs: ["【警告】オフィス拡張に必要な一時費用が不足しています。", ...state.logs],
          }));
          return;
        }

        set((state) => ({
          player: {
            ...state.player,
            cash: state.player.cash - nextOffice.upgradeCost,
            officeLevel: currentLevel + 1,
          },
          logs: [`【オフィス】「${nextOffice.name}」へオフィスを拡張しました！（最大 ${nextOffice.maxEmployees} 名 / 家賃 ¥${nextOffice.rent.toLocaleString()}）`, ...state.logs],
        }));
      },

      respondToVCOffer: (accept) => {
        set((state) => {
          if (!state.pendingVCOffer) return {};

          const logs = [...state.logs];
          let updatedPlayer = { ...state.player };
          let updatedFinancials = { ...state.financials, hasTriggeredA: true };

          if (accept) {
            const addedCash = 30000000;
            const targetMrr = state.player.mrr * 3;
            const deadline = state.currentTurn + 24;

            updatedPlayer.cash += addedCash;
            updatedFinancials = {
              ...updatedFinancials,
              shareOwned: Math.max(0, state.financials.shareOwned - 20),
              vcTargetMRR: targetMrr,
              vcDeadlineTurn: deadline,
            };

            logs.unshift(
              `【資金調達】シリーズA VCオファーを受託！手元資金 +¥30,000,000 (創業者株比率: ${updatedFinancials.shareOwned}%)。` +
              ` ノルマ: ${deadline}ターンまでに MRR ¥${targetMrr.toLocaleString()} を達成せよ。`
            );
          } else {
            logs.unshift("【資金調達】シリーズA VCオファーを拒否しました。自己資金での経営を続行します。");
          }

          return {
            player: updatedPlayer,
            financials: updatedFinancials,
            pendingVCOffer: false,
          };
        });
      },

      executeTurn: () => {
        const state = get();
        if (state.gameStatus !== "playing" || state.pendingVCOffer) return;

        const nextTurn = state.currentTurn + 1;

        // 1. 人材および固定費の集計
        let totalSalary = 0;
        let totalEngProd = 0;
        let totalDesProd = 0;
        let totalSalesProd = 0;

        // 創業者（PM）の貢献: 全職種に +3 のベース貢献
        totalEngProd += 3;
        totalDesProd += 3;
        totalSalesProd += 3;

        state.player.employees.forEach((emp) => {
          totalSalary += emp.salary;
          if (!emp.isTraining) {
            if (emp.role === "engineer") totalEngProd += emp.productivity;
            if (emp.role === "designer") totalDesProd += emp.productivity;
            if (emp.role === "sales") totalSalesProd += emp.productivity;
          }
        });

        // VCペナルティの適用: 生産性半分
        let isPenaltyActive = state.vcPenaltyRemainingTurns > 0;
        const currentPenaltyTurns = isPenaltyActive ? state.vcPenaltyRemainingTurns - 1 : 0;
        if (isPenaltyActive) {
          totalEngProd = Math.floor(totalEngProd * 0.5);
          totalDesProd = Math.floor(totalDesProd * 0.5);
          totalSalesProd = Math.floor(totalSalesProd * 0.5);
        }

        const currentRent = OFFICE_MAP[state.player.officeLevel].rent;

        // 2. 開発モード別計算 (プレイヤー)
        let deltaFeatures = 0;
        let deltaTechDebt = 0;

        if (state.currentDevMode === "normal") {
          deltaFeatures = totalEngProd;
          deltaTechDebt = Math.max(0, 2 - Math.floor(totalDesProd * 0.2));
        } else if (state.currentDevMode === "crunch") {
          deltaFeatures = Math.floor(totalEngProd * 1.5);
          deltaTechDebt = Math.max(1, 5 - Math.floor(totalDesProd * 0.4));
        } else if (state.currentDevMode === "refactor") {
          deltaFeatures = 0;
          const seniorCount = state.player.employees.filter((e) => e.role === "engineer" && e.level === "senior").length;
          deltaTechDebt = -(3 + seniorCount);
        }

        const nextTechDebt = Math.max(0, state.player.techDebt + deltaTechDebt);
        const nextFeatures = state.player.features + deltaFeatures;
        const nextMarketing = state.player.marketing + totalSalesProd + (state.marketingInvestment * 15);

        // 競合企業の簡易成長
        const updatedCompetitors = state.competitors.map((comp) => {
          // Tierに応じて成長度を変化
          const tierGrowth = comp.tier === 1 ? 1.2 : comp.tier === 2 ? 0.8 : 0.4;
          const cFeatures = comp.features + tierGrowth * (0.5 + Math.random() * 0.5);
          const cMarketing = comp.marketing + tierGrowth * (0.6 + Math.random() * 0.4);
          const cTechDebt = Math.max(0, comp.techDebt + (Math.random() > 0.7 ? 1 : 0) - (Math.random() > 0.9 ? 1 : 0));
          return {
            ...comp,
            features: Number(cFeatures.toFixed(2)),
            marketing: Number(cMarketing.toFixed(2)),
            techDebt: cTechDebt,
          };
        });

        // 3. 品質 (Quality) と 競争力 (ProductStrength) の算出
        const getQuality = (debt: number) => Math.exp(-0.02 * debt);
        const getStrength = (debt: number, mkt: number, feat: number) => {
          const qual = getQuality(debt);
          return (0.4 * qual) + (0.3 * Math.min(150, mkt) * 0.01) + (0.3 * Math.min(150, feat) * 0.01);
        };

        const pStrength = getStrength(nextTechDebt, nextMarketing, nextFeatures);
        const compStrengths = updatedCompetitors.map((c) => ({
          id: c.id,
          strength: getStrength(c.techDebt, c.marketing, c.features),
        }));

        // 4. 市場上限（TAM）を考慮した新規顧客・強奪計算
        const playerCurrentUsers = state.player.users;
        const compCurrentUsersTotal = updatedCompetitors.reduce((sum, c) => sum + c.users, 0);
        const activeUsersTotal = playerCurrentUsers + compCurrentUsersTotal;

        const whiteSpace = Math.max(0, state.tam - activeUsersTotal);
        const maxNewPool = 20000;
        const totalNewMarket = maxNewPool * (whiteSpace / state.tam);

        // 分母 (自社と競合の強さの総和)
        const totalStrength = pStrength + compStrengths.reduce((sum, c) => sum + c.strength, 0);
        const newUsersPlayer = Math.floor(totalNewMarket * (pStrength / totalStrength));

        // 競合ごとの新規獲得 (未開拓シェアの配分も計算する)
        updatedCompetitors.forEach((c) => {
          const cs = compStrengths.find((s) => s.id === c.id)?.strength || 0.1;
          const newUsersComp = Math.floor(totalNewMarket * (cs / totalStrength));
          c.users = Math.min(state.tam, c.users + newUsersComp);
        });

        let finalPlayerUsers = playerCurrentUsers + newUsersPlayer;
        let logs: string[] = [];

        if (newUsersPlayer > 0) {
          logs.push(`【成長】オーガニック流入により、新規ユーザー ${newUsersPlayer.toLocaleString()} 名を獲得しました。`);
        }

        // 顧客強奪 (シェア・スナッチ)
        updatedCompetitors.forEach((comp) => {
          const cStrength = compStrengths.find((s) => s.id === comp.id)?.strength || 0.1;
          if (pStrength > cStrength) {
            const snatchRate = 0.05 * Math.tanh(pStrength - cStrength);
            const snatchUsers = Math.floor(comp.users * snatchRate);
            if (snatchUsers > 0) {
              comp.users = Math.max(0, comp.users - snatchUsers);
              finalPlayerUsers += snatchUsers;
              logs.push(`【強奪】${comp.name}（${comp.productName}）から ${snatchUsers.toLocaleString()} 名のシェアを奪いました！`);
            }
          }
        });

        // 5. 財務精算
        const revenue = finalPlayerUsers * state.standardArpu;
        const cost = totalSalary + currentRent + (state.marketingInvestment * 500000) + 200000;
        const nextCash = state.player.cash + revenue - cost;
        const nextMrr = finalPlayerUsers * state.standardArpu;

        // 競合企業の売上と資金更新 (簡易)
        updatedCompetitors.forEach((comp) => {
          const cRent = OFFICE_MAP[comp.officeLevel]?.rent || 100000;
          const cCost = cRent + (comp.employees.length * 500000) + 200000;
          const cRev = comp.users * state.standardArpu;
          comp.cash = Math.max(0, comp.cash + cRev - cCost);
          comp.mrr = comp.users * state.standardArpu;
        });

        // 6. 研修の完了処理＆従業員の更新
        let upgradedLogs: string[] = [];
        const nextEmployees = state.player.employees.map((emp) => {
          if (emp.isTraining) {
            const nextLevel: SkillLevel = emp.level === "junior" ? "middle" : "senior";
            const params = EMPLOYEE_PARAMS[nextLevel];
            upgradedLogs.push(`【研修完了】${emp.name} の研修が完了し、${nextLevel === "middle" ? "ミドル" : "シニア"}に昇格しました（給与: ¥${params.salary.toLocaleString()} / 月）。`);
            return {
              ...emp,
              level: nextLevel,
              productivity: params.productivity,
              salary: params.salary,
              isTraining: false,
            };
          }
          return emp;
        });

        logs.push(...upgradedLogs);

        // キャッシュアウト・クリア判定
        let nextStatus: GameStatus = "playing";
        if (nextCash < 0) {
          nextStatus = "gameover";
          logs.unshift("【破産】手元資金が枯渇しました（黒字倒産）。ゲームオーバーです。");
        } else if (nextTurn > 120) {
          nextStatus = "gameover";
          logs.unshift("【タイムアウト】120ターンが経過しました。目標未達成のためゲームオーバーです。");
        } else {
          // クリア条件: プレイヤーのusersが、その業界の Tier 1 競合企業のusersを上回った瞬間
          const tier1Comp = updatedCompetitors.find((c) => c.tier === 1);
          if (tier1Comp && finalPlayerUsers > tier1Comp.users) {
            nextStatus = "cleared";
            logs.unshift(`【祝】${tier1Comp.name}のユーザー数を突破し、市場トップシェアを獲得しました！ゲームクリア！`);
          }
        }

        // VC調達イベント判定
        let triggerVCOffer = false;
        let updatedFinancials = { ...state.financials };
        let nextPenaltyRemaining = currentPenaltyTurns;

        if (
          nextStatus === "playing" &&
          nextMrr >= 2000000 &&
          !state.financials.hasTriggeredA
        ) {
          triggerVCOffer = true;
          logs.unshift("【イベント】シリーズA VCから資金調達オファーが届きました！");
        }

        // VCノルマ判定 (期限判定)
        if (
          updatedFinancials.vcTargetMRR > 0 &&
          nextTurn === updatedFinancials.vcDeadlineTurn
        ) {
          if (nextMrr < updatedFinancials.vcTargetMRR) {
            nextPenaltyRemaining = 12; // 12ターンペナルティ
            logs.unshift(`【ペナルティ】VC目標MRR（¥${updatedFinancials.vcTargetMRR.toLocaleString()}）を未達成。生産性が12ターン「半分」になります。`);
          } else {
            logs.unshift("【VCノルマクリア】目標MRRを達成しました！投資家から追加の信頼を獲得しました。");
          }
          // ノルマ終了
          updatedFinancials.vcTargetMRR = 0;
          updatedFinancials.vcDeadlineTurn = 0;
        }

        // ログ更新
        const turnReport =
          `【ターン報告】第 ${nextTurn} ターン完了。売上: ¥${revenue.toLocaleString()} / ` +
          `経費: ¥${cost.toLocaleString()} / 収支: ¥${(revenue - cost).toLocaleString()}`;
        logs.unshift(turnReport);

        // 履歴追加
        const tier1 = updatedCompetitors.find((c) => c.tier === 1)?.users || 0;
        const tier2 = updatedCompetitors.find((c) => c.tier === 2)?.users || 0;
        const tier3 = updatedCompetitors.find((c) => c.tier === 3)?.users || 0;

        const newHistoryEntry: ChartHistoryEntry = {
          turn: nextTurn,
          playerUsers: finalPlayerUsers,
          playerMrr: nextMrr,
          playerCash: nextCash,
          comp1Users: tier1,
          comp2Users: tier2,
          comp3Users: tier3,
        };

        const updatedHistory = [...state.history, newHistoryEntry];

        set((state) => ({
          currentTurn: nextTurn,
          gameStatus: nextStatus,
          player: {
            ...state.player,
            cash: nextCash,
            mrr: nextMrr,
            users: finalPlayerUsers,
            techDebt: nextTechDebt,
            features: nextFeatures,
            marketing: nextMarketing,
            employees: nextEmployees,
          },
          competitors: updatedCompetitors,
          financials: updatedFinancials,
          logs: [...logs, ...state.logs].slice(0, 100), // 最大100件保存
          pendingVCOffer: triggerVCOffer,
          history: updatedHistory,
          vcPenaltyRemainingTurns: nextPenaltyRemaining,
        }));
      },

      resetGame: () => {
        set({
          currentTurn: 0,
          difficulty: "normal",
          gameStatus: "setup",
          selectedIndustry: null,
          tam: 0,
          standardArpu: 0,
          player: {
            id: "player",
            name: "",
            ceoName: "",
            productName: "",
            tier: 3,
            isPlayer: true,
            cash: 0,
            mrr: 0,
            officeLevel: 1,
            users: 100,
            techDebt: 0,
            features: 1,
            marketing: 10,
            employees: [],
          },
          competitors: [],
          financials: {
            shareOwned: 100,
            vcTargetMRR: 0,
            vcDeadlineTurn: 0,
            hasTriggeredA: false,
          },
          logs: [],
          currentDevMode: "normal",
          marketingInvestment: 0,
          pendingVCOffer: false,
          history: [],
          vcPenaltyRemainingTurns: 0,
        });
      },
    }),
    {
      name: "startup-simulation-game-save",
      partialize: (state) => ({
        currentTurn: state.currentTurn,
        difficulty: state.difficulty,
        gameStatus: state.gameStatus,
        selectedIndustry: state.selectedIndustry,
        tam: state.tam,
        standardArpu: state.standardArpu,
        player: state.player,
        competitors: state.competitors,
        financials: state.financials,
        logs: state.logs,
        currentDevMode: state.currentDevMode,
        marketingInvestment: state.marketingInvestment,
        pendingVCOffer: state.pendingVCOffer,
        history: state.history,
        vcPenaltyRemainingTurns: state.vcPenaltyRemainingTurns,
      }),
    }
  )
);
