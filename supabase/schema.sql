-- ユーザープロフィールテーブル (将来のログイン・ユーザー情報用)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    username TEXT UNIQUE,
    avatar_url TEXT
);

-- ゲームセーブデータテーブル
CREATE TABLE IF NOT EXISTS public.saved_games (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    game_state JSONB NOT NULL, -- Zustand のシリアライズされた State 全体を格納
    current_turn INTEGER NOT NULL,
    cash BIGINT NOT NULL,
    mrr BIGINT NOT NULL,
    industry TEXT NOT NULL,
    difficulty TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- リーダーボード（スコアランキング）テーブル
CREATE TABLE IF NOT EXISTS public.leaderboard (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    player_name TEXT NOT NULL,
    company_name TEXT NOT NULL,
    product_name TEXT NOT NULL,
    industry TEXT NOT NULL,
    difficulty TEXT NOT NULL,
    clear_turn INTEGER NOT NULL,
    final_cash BIGINT NOT NULL,
    final_users INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- RLS (Row Level Security) の設定例
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaderboard ENABLE ROW LEVEL SECURITY;

-- プロフィールのポリシー
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- セーブデータのポリシー
CREATE POLICY "Users can view their own saved games" ON public.saved_games
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own saved games" ON public.saved_games
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own saved games" ON public.saved_games
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved games" ON public.saved_games
    FOR DELETE USING (auth.uid() = user_id);

-- リーダーボードのポリシー
CREATE POLICY "Leaderboard is viewable by everyone" ON public.leaderboard
    FOR SELECT USING (true);

CREATE POLICY "Users can insert leaderboard entries" ON public.leaderboard
    FOR INSERT WITH CHECK (true); -- 誰でもランキングに登録可能（または認証ユーザーのみなど）
