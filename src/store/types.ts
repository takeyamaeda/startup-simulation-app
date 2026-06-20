export type IndustryType = 'hr' | 'telehealth' | 'video_streaming' | 'sns';
export type RoleType = 'engineer' | 'designer' | 'sales';
export type SkillLevel = 'junior' | 'middle' | 'senior';
export type GameStatus = 'setup' | 'playing' | 'gameover' | 'cleared';
export type DevMode = 'normal' | 'crunch' | 'refactor';

export interface OfficeLevel {
  level: number;        // オフィスランク (1: ガレージ 〜 4: プレミアムビル)
  name: string;         // オフィス名
  maxEmployees: number; // 最大雇用人数
  rent: number;         // 毎月の家賃コスト（円）
  upgradeCost: number;  // 拡張に必要な一時費用（円）
}

export interface Employee {
  id: string;          // UUIDまたは一意の文字列
  name: string;        // 従業員名（ランダム生成名）
  role: RoleType;      // 職種
  level: SkillLevel;   // スキルレベル
  productivity: number;// 1ターン（1ヶ月）あたりに処理できるタスク量（機能ポイント）
  salary: number;      // 毎月の給与コスト（円）
  isTraining: boolean; // 現在研修中かどうかのフラグ
}

export interface Company {
  id: string;          // 'player' または 'comp_1'〜'comp_3'
  name: string;        // 会社名
  ceoName: string;     // 代表者名
  productName: string; // サービス・プロダクト名
  tier: number;        // 市場ランク (1: 最高峰 〜 3: 新興)
  isPlayer: boolean;   // プレイヤーフラグ
  
  // 財務インジケータ
  cash: number;        // 手元資金（円）
  mrr: number;         // 月間経常収益（円）
  
  // オフィスステータス（新規追加）
  officeLevel: number; // 現在のオフィスレベル (1〜4)
  
  // プロダクト・市場インジケータ
  users: number;       // アクティブユーザー数（人）
  techDebt: number;    // 技術負債（累積値、品質に負の影響）
  features: number;    // 機能数（累積値、競争力に正の影響）
  marketing: number;   // 認知度（累積値、顧客獲得に正の影響）
  employees: Employee[]; // 在籍従業員リスト
}

export interface PlayerFinancials {
  shareOwned: number;       // 創業者の持ち株比率 (%) - 初期値 100
  vcTargetMRR: number;      // VCから要求されている目標MRR（0の場合はノルマなし）
  vcDeadlineTurn: number;   // ノルマ達成の期限ターン（絶対ターン数）
  hasTriggeredA: boolean;   // シリーズA調達イベントを消化したか
}

export interface GameState {
  currentTurn: number;
  difficulty: 'easy' | 'normal' | 'hard';
  gameStatus: GameStatus;
  selectedIndustry: IndustryType | null;
  tam: number;
  standardArpu: number;
  
  player: Company;
  competitors: Company[];
  financials: PlayerFinancials;
  
  logs: string[];
  currentDevMode: DevMode;
  marketingInvestment: number;
  pendingVCOffer: boolean;
  
  // アクション
  initGame: (setup: { founderName: string; companyName: string; productName: string; industry: IndustryType; difficulty: 'easy' | 'normal' | 'hard' }) => void;
  setDevMode: (mode: DevMode) => void;
  adjustMarketing: (increment: boolean) => void;
  hireEmployee: (role: RoleType) => void;
  trainEmployee: (employeeId: string) => void;
  upgradeOffice: () => void; // 新規追加: オフィス拡張
  respondToVCOffer: (accept: boolean) => void;
  executeTurn: () => void;
  resetGame: () => void;
}
