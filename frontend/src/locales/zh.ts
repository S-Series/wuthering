import type { LocaleSchema } from "./locale.schema";

export const zh = {
  common: {
    open: "",
    close: "",
    select: "",
  },
  navbar: {
    title: "鸣潮 工具",
    characters: "角色列表",
    generator: "属性卡生成器",
    login: "登录",
  },
  home: {
    title1: "公告",
    title2: "游戏内信息",
    title3: "角色展示",
    video1: "版本预告",
    video2: "角色预告",
    video3: "共鸣者战斗动作",
    click: "点击播放视频",
  },
  card: {
    help: "ⓘ 帮助",
    request: "生成图片",
    download: "下载图片",
    plate1: "重置名片图片",
    plate2: "重置名片来源",
    image1: "重置角色图片",
    image2: "重置角色来源",
    scoreboard: "§回声评分表 ↗",
    cMenu: "选择角色",
    wMenu: "选择武器",
    eMenu: "选择回声",
    oMenu: "回音数据管理",
  },
  ocr: {
    status: "状态",
    request: "OCR请求",
    loading: "OCR识别中...",
    result: "OCR结果",
    description1: "点击开始",
    description2: `点击选择图片文件\n或\n使用“Ctrl+V”粘贴图片`,
    description3: `正在唤醒服务器...\n首次请求可能需要20~30秒\n感谢您的耐心等待 :)`,
  },
}; //satisfies LocaleSchema;
