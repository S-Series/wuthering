import type { LocaleSchema } from "./locale.schema";

export const jp = {
  common: {
    open: "",
    close: "",
    select: "",
  },
  navbar: {
    title: "WuWa ラボ",
    characters: "キャラクター一覧",
    generator: "スペックカード生成",
    login: "ログイン",
  },
  home: {
    title1: "お知らせ",
    title2: "ゲーム内情報",
    title3: "キャラクター展示",
    video1: "バージョントレーラー",
    video2: "キャラクタートレーラー",
    video3: "共鳴者バトルモーション",
    click: "クリックして動画を再生",
  },
  card: {
    help: "ⓘ ヘルプ",
    request: "画像を生成",
    download: "画像をダウンロード",
    plate1: "名刺画像をリセット",
    plate2: "名刺の出典をリセット",
    image1: "キャラクター画像をリセット",
    image2: "キャラクター出典をリセット",
    scoreboard: "§エコースコア表 ↗",
    cMenu: "キャラクター選択",
    wMenu: "武器選択",
    eMenu: "エコー選択",
    oMenu: "エコーデータ管理",
  },
  ocr: {
    status: "ステータス",
    request: "OCRリクエスト",
    loading: "OCR読み取り中...",
    result: "OCR結果",
    description1: "クリックして開始",
    description2: `クリックして画像ファイルを選択\nまたは\n「Ctrl+V」で画像を貼り付け`,
    description3: `サーバーを起動しています...\n最初のリクエストは20〜30秒ほどかかる場合があります\nしばらくお待ちください :)`,
    healthCheck: `OCRサーバーの状態を確認中です`,
    healthFalse: `OCRサーバーへの接続に失敗しました。\n問題が続く場合は、管理者にお問い合わせください`,
  },
} satisfies LocaleSchema;
