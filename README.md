# startup-simulation-app

## 1. システム概要

本システムは、プレイヤーがITスタートアップの創業者兼プロダクトマネージャー（PM）となり、限定されたリソースの中でプロダクトを成長させ、オフィスを拡張して組織をスケールさせながら、選択した業界の実名競合企業からシェアを奪い取って市場1位（Tier 1超え）を目指すターン制経営シミュレーションゲームである。

外部APIやデータベースを使用せず、すべてのゲームロジック、状態遷移、数理計算をフロントエンド（ブラウザ）で完結させる「ローカル完結型」とし、運用コスト完全0円（Free Tier）でのホスティングを可能にする。

---

## 2. アーキテクチャ・技術スタック

* **フレームワーク:** Next.js (App Router), TypeScript
* **スタイリング:** Tailwind CSS, Lucide React (アイコン)
* **状態管理:** Zustand (永続化: `zustand/middleware` による `localStorage` へのセーブ機能)
* **データ可視化:** Recharts (自社成長率、MRR、ユーザー数の推移ラインチャート)
* **ホスティング環境:** Vercel (Hobby Plan)

---

## 3. データ構造・状態（State）定義

### 3.1 基礎型・列挙型定義

```typescript
export type IndustryType = 'hr' | 'telehealth' | 'video_streaming' | 'sns';
export type RoleType = 'engineer' | 'designer' | 'sales';
export type SkillLevel = 'junior' | 'middle' | 'senior';
export type GameStatus = 'setup' | 'playing' | 'gameover' | 'cleared';
export type DevMode = 'normal' | 'crunch' | 'refactor';

```

### 3.2 オフィス（Office）モデル

```typescript
export interface OfficeLevel {
  level: number;        // オフィスランク (1: ガレージ 〜 4: プレミアムビル)
  name: string;         // オフィス名
  maxEmployees: number; // 最大雇用人数
  rent: number;         // 毎月の家賃コスト（円）
  upgradeCost: number;  // 拡張に必要な一時費用（円）
}

```

### 3.3 従業員（Employee）モデル

```typescript
export interface Employee {
  id: string;          // UUIDまたは一意の文字列
  name: string;        // 従業員名（ランダム生成名）
  role: RoleType;      // 職種
  level: SkillLevel;   // スキルレベル
  productivity: number;// 1ターン（1ヶ月）あたりに処理できるタスク量（機能ポイント）
  salary: number;      // 毎月の給与コスト（円）
  isTraining: boolean; // 現在研修中かどうかのフラグ
}

```

### 3.4 会社（Company）モデル

```typescript
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

```

### 3.5 プレイヤー固有財務（PlayerFinancials）モデル

```typescript
export interface PlayerFinancials {
  shareOwned: number;       // 創業者の持ち株比率 (%) - 初期値 100
  vcTargetMRR: number;      // VCから要求されている目標MRR（0の場合はノルマなし）
  vcDeadlineTurn: number;   // ノルマ達成の期限ターン（絶対ターン数）
  hasTriggeredA: boolean;   // シリーズA調達イベントを消化したか
}

```

### 3.6 ゲームシステム（GameState）ストア全体

```typescript
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

```

---

## 4. 詳細機能要件・数理仕様

### 4.1 オフィス拡張仕様（定数定義）

オフィスレベルに応じた最大雇用枠と家賃コストの定義。プレイヤーは累積在籍人数（創業者含む）が `maxEmployees` に達している場合、オフィスを拡張するまで新規採用を行えない。

| レベル | オフィス名 | 最大雇用枠 (`maxEmployees`) | 毎月の家賃 (`rent`) | 拡張費用 (`upgradeCost`) |
| --- | --- | --- | --- | --- |
| **1** | レンタルガレージ / 自宅 | 3名 | ¥50,000 | ¥0 (初期状態) |
| **2** | コワーキング・シェアオフィス | 6名 | ¥200,000 | ¥1,000,000 |
| **3** | 渋谷スクエアオフィス | 15名 | ¥1,000,000 | ¥5,000,000 |
| **4** | プレミアムミッドタウンビル | 50名 | ¥4,000,000 | ¥20,000,000 |

#### 競合企業のオフィス規模設定

実名競合企業は、初期規模の大きさに比例してオフィスレベルが自動固定される（家賃コストが固定費として計算に含まれる）。

* **Tier 1 企業:** オフィスレベル **4** （家賃: ¥4,000,000）
* **Tier 2 企業:** オフィスレベル **3** （家賃: ¥1,000,000）
* **Tier 3 企業:** オフィスレベル **2** （家賃: ¥200,000）

---

### 4.2 ゲームセットアップ（`initGame`）

業界別定数および競合初期値。

#### 業界別定数定義

1. **HR業界 (`hr`)**
* TAM: 2,000,000人 / 標準ARPU: ¥1,200
* 競合1 (Tier 1): 株式会社リクルート (CEO: 出木場 久征 / Prod: Airビジネスツールズ)
* 初期値: `users`: 1,100,000, `features`: 95, `marketing`: 120, `techDebt`: 15, `officeLevel`: 4


* 競合2 (Tier 2): パーソルキャリア (CEO: 瀬野尾 裕 / Prod: doda)
* 初期値: `users`: 400,000, `features`: 70, `marketing`: 80, `techDebt`: 10, `officeLevel`: 3


* 競合3 (Tier 3): 株式会社タイミー (CEO: 小川 嶺 / Prod: タイミー)
* 初期値: `users`: 150,000, `features`: 40, `marketing`: 55, `techDebt`: 5, `officeLevel`: 2




2. **オンライン診療業界 (`telehealth`)**
* TAM: 800,000人 / 標準ARPU: ¥1,500
* 競合1 (Tier 1): エムスリー株式会社 (CEO: 谷村 格 / Prod: エムスリー)
* 初期値: `users`: 300,000, `features`: 85, `marketing`: 90, `techDebt`: 8, `officeLevel`: 4


* 競合2 (Tier 2): 株式会社メドレー (CEO: 瀧口 浩平 / Prod: CLINICS)
* 初期値: `users`: 120,000, `features`: 60, `marketing`: 65, `techDebt`: 5, `officeLevel`: 3


* 競合3 (Tier 3): 株式会社Linc’well (CEO: 林 俊宏 / Prod: CLINIC FOR)
* 初期値: `users`: 45,000, `features`: 38, `marketing`: 45, `techDebt`: 3, `officeLevel`: 2




3. **動画配信業界 (`video_streaming`)**
* TAM: 5,000,000人 / 標準ARPU: ¥800
* 競合1 (Tier 1): Netflix (CEO: グレッグ・ピーターズ / Prod: Netflix)
* 初期値: `users`: 2,500,000, `features`: 99, `marketing`: 150, `techDebt`: 0, `officeLevel`: 4


* 競合2 (Tier 2): U-NEXT (CEO: 堤 天心 / Prod: U-NEXT)
* 初期値: `users`: 1,000,000, `features`: 80, `marketing`: 90, `techDebt`: 12, `officeLevel`: 3


* 競合3 (Tier 3): ABEMA (CEO: 藤田 晋 / Prod: ABEMA)
* 初期値: `users`: 400,000, `features`: 55, `marketing`: 75, `techDebt`: 18, `officeLevel`: 2




4. **SNS業界 (`sns`)**
* TAM: 10,000,000人 / 標準ARPU: ¥200
* 競合1 (Tier 1): LINEヤフー株式会社 (CEO: 出澤 剛 / Prod: LINE)
* 初期値: `users`: 6,000,000, `features`: 90, `marketing`: 110, `techDebt`: 20, `officeLevel`: 4


* 競合2 (Tier 2): 株式会社note (CEO: 加藤 貞顕 / Prod: note)
* 初期値: `users`: 1,500,000, `features`: 50, `marketing`: 60, `techDebt`: 5, `officeLevel`: 3


* 競合3 (Tier 3): タイツー (CEO: 新興 太郎 / Prod: Thready)
* 初期値: `users`: 200,000, `features`: 20, `marketing`: 30, `techDebt`: 2, `officeLevel`: 2





#### プレイヤー初期配置

* 初期資金: Easy = ¥15M / Normal = ¥10M / Hard = ¥5M
* プロダクト初期値: `mrr`: ¥0, `users`: 100人, `techDebt`: 0, `features`: 1, `marketing`: 10
* 初期オフィス: `officeLevel`: 1
* 初期チーム: 創業者1名、ジュニアエンジニア1名（計2名 / 枠残り1）

---

### 4.3 組織マネジメント・オフィス拡張アクション

* **求人・採用 (`hireEmployee`):** コスト ¥200,000。
* **制限チェック:** 現在の総在籍人数（`player.employees.length` ＋ 創業者1名）が、現在のオフィスレベルの `maxEmployees` 以上の場合はボタンを非活性化し、採用を制限する。


* **オフィス拡張 (`upgradeOffice`):**
* 現在のオフィスレベルが4未満、かつ拡張費用（`upgradeCost`）以上の手元資金がある場合のみ実行可能。
* 実行時、瞬時に `upgradeCost` を手元資金から減算し、`officeLevel` を1増加させる。



---

### 4.4 ターン実行数理モデル（`executeTurn`）

#### 1. 人材および固定費（家賃）の集計

* 在籍中の全従業員の総給与（`totalSalary`）を算出（※研修中のスタッフも給与は満額発生）。
* プレイヤーの現在のオフィスレベルに応じた家賃（`currentRent`）を定数テーブルから取得。
* 各職種の総生産性を算出（※`isTraining === true` の従業員の `productivity` は `0` とする）。

#### 2. プロダクトパラメータの更新

* **開発モード別計算:**
* **`normal` (通常開発):**
* 自社機能数増加: $Features_{t+1} = Features_{t} + TotalProd_{eng}$
* 自社負債増加: $\Delta TechDebt = \max(0, 2 - \lfloor TotalProd_{des} \times 0.2 \rfloor)$


* **`crunch` (突貫工事):**
* 自社機能数増加: $Features_{t+1} = Features_{t} + \lfloor TotalProd_{eng} \times 1.5 \rfloor$
* 自社負債増加: $\Delta TechDebt = \max(1, 5 - \lfloor TotalProd_{des} \times 0.4 \rfloor)$


* **`refactor` (リファクタリング):**
* 自社機能数増加: $Features_{t+1} = Features_{t} + 0$
* 自社負債減少: $\Delta TechDebt = - (3 + \sum SeniorEngineers)$ （最小値0）




* **最終パラメータ反映:**
* 自社の $TechDebt_{t+1} = \max(0, TechDebt_{t} + \Delta TechDebt)$
* 自社の認知度増加: $Marketing_{t+1} = Marketing_{t} + TotalProd_{sales} + (marketingInvestment \times 15)$



#### 3. 品質（$Quality$）と競争力（$ProductStrength$）の算出

$$Quality_{i} = e^{-0.02 \cdot TechDebt_{i}}$$

$$ProductStrength_{i} = (0.4 \cdot Quality_{i}) + (0.3 \cdot \min(150, Marketing_{i}) \times 0.01) + (0.3 \cdot \min(150, Features_{i}) \times 0.01)$$

#### 4. 市場上限（TAM）を考慮した新規顧客・強奪計算

* **未開拓シェアの算出:**

$$ActiveUsers_{総数} = Users_{player} + \sum Users_{competitor}$$


$$WhiteSpace = \max(0, TAM - ActiveUsers_{総数})$$


* **自然流入プール（$TotalNewMarket$）の計算:** 基盤プール $MaxNewPool = 20,000$ 人。

$$TotalNewMarket = MaxNewPool \times \left( \frac{WhiteSpace}{TAM} \right)$$


* **自社のオーガニック新規獲得:**

$$NewUsers_{player} = \lfloor TotalNewMarket \times \frac{ProductStrength_{player}}{ProductStrength_{player} + \sum ProductStrength_{comp}} \rfloor$$


* **顧客強奪（シェア・スナッチ）ロジック:**
自社の $ProductStrength_{player}$ が競合 $i$ の $ProductStrength_{i}$ を上回っている場合のみ実行。

$$SnatchRate_{i} = 0.05 \times \tanh(ProductStrength_{player} - ProductStrength_{i})$$


$$SnatchUsers_{player \leftarrow i} = \lfloor Users_{i} \times SnatchRate_{i} \rfloor$$


* 競合 $i$ のユーザー数を $SnatchUsers$ 減算し、プレイヤーのユーザー数に加算。



#### 5. 財務精算

* 売上高: $Revenue = Users_{player} \times standardArpu$
* 今期の総コスト: $Cost = totalSalary + currentRent + (marketingInvestment \times ¥500,000) + ¥200,000(\text{インフラ固定費})$
* 資金更新: $Cash_{t+1} = Cash_{t} + Revenue - Cost$
* MRRの更新: $MRR = Users_{player} \times standardArpu$

#### 6. 研修の完了処理

* `isTraining === true` のスタッフのレベルを1段階上げ、`isTraining = false` に変更。

---

### 4.5 資金調達（VCオファー）イベント制御

* **発火条件:** プレイヤー企業の `MRR >= ¥2,000,000` かつ `financials.hasTriggeredA === false` の場合、ターン処理の最後に `pendingVCOffer` を `true` にし、ゲーム進行を一時停止してポップアップ（モーダル）を表示。
* **プレイヤーの選択処理 (`respondToVCOffer`):**
* **承諾 (`true`):** 自社資金 `cash` に **¥30,000,000** を即座に加算。自社持ち株比率 `shareOwned` を **-20%** に変更。ノルマをセット（`vcTargetMRR = 現MRR * 3`、`vcDeadlineTurn = currentTurn + 24`）。
* **拒否 (`false`):** 変動なし。
* 共通で `hasTriggeredA = true`, `pendingVCOffer = false` とする。


* **ノルマ不達成ペナルティ:** 期限ターンに達した時点で `MRR < vcTargetMRR` だった場合、全従業員の総生産性が以降12ターン「半分（0.5倍）」に減衰する。

---

### 4.6 ゲーム終了（クリア / ゲームオーバー）判定

* **黒字倒産（ゲームオーバー）:** プレイヤーの `cash < 0` となった場合。
* **タイムアウト（ゲームオーバー）:** `currentTurn > 120` に達した場合。
* **市場制覇（ゲームクリア）:** プレイヤーの `users` が、その業界の Tier 1 競合企業の `users` を上回った瞬間。

---

## 5. UI/UX・画面レイアウト要件

PC大画面でのプレイを前提とし、スクロールの発生しないシングルビューのグリッドレイアウトを採用。

### 5.1 コンポーネント構成の拡張

1. **Header コンポーネント:** 会社名、創業者名、選択業界、ターン（XX / 120）、手元資金、株主比率のほか、現在の**オフィス名称**と現在の収容人数/上限枠（例: 2 / 3名）をインジケータとして表示。
2. **メインインジケータ（左上・中央）:** Rechartsによる自社ユーザー数とMRRの推移曲線。
3. **意思決定（コマンド）パネル（左下）:**
* 開発モード選択、マーケティング投資口数増減。
* 採用ボタン（現在の総人数がオフィス上限に達している場合は非活性化、ツールチップで「オフィス拡張が必要です」と警告表示）。
* **オフィス拡張ボタン:** 現在のオフィス情報（次のレベル名、最大枠、家賃、拡張費用）を表示。資金不足またはレベル4の場合は非活性化。


4. **組織（HR）管理パネル（右下）:** 在籍従業員の一覧テーブルおよび研修実行ボタン。
5. **競合リーダーボード（右上）:**
* 自社と競合3社の順位、企業名、プロダクト名、ユーザー数、シェア（%）の表示。
* **オフィス規模バッジ:** 各企業のカード内に、オフィスレベルに応じたアイコンやバッジ（例: 「ガレージ」「ミッドタウン」等）を表示し、競合の組織規模を視覚的にアピールする。


6. **システム経営ログ（下部）:** 「〇〇社から 4,500 人の顧客を強奪しました」「オフィスをコワーキングスペースへ拡張しました（家賃¥200,000）」などのタイムライン出力。