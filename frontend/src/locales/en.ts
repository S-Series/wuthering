import type { LocaleSchema } from "./locale.schema";

export const en = {
  common: {
    open: "",
    close: "",
    select: "",
  },
  navbar: {
    title: "WuWa DEV",
    characters: "Chracter List",
    generator: "SpecCard Generator",
    login: "Log-in",
  },
  home: {
    title1: "Announcements",
    title2: "In-Game Information",
    title3: "Character Showcase",
    video1: "Version Trailer",
    video2: "Character Trailer",
    video3: "Resonator Combat Motion",
    click: "Click to Play Video",
  },
  card: {
    help: "ⓘ Help",
    request: "Image File Generate",
    download: "Download Image File",
    plate1: "Reset Plate Image",
    plate2: "Idle",
    image1: "Reset Character Image",
    image2: "Idle",
    scoreboard: "§Echo Scoreboard ↗",
    cMenu: "Character Select",
    wMenu: "Weapon Select",
    eMenu: "Echo Select",
    oMenu: "Manage Echo Data",
  },
  ocr: {
    status: "Status",
    request: "OCR Request",
    loading: "OCR Loading...",
    result: "OCR Result",
    description1: "Click to Start",
    description2: `Click to select an image file\nor\nPaste an image with "Ctrl+V"`,
    description3: `Waking up the server...\nThe first request may take\nabout 20–30 seconds\nThank you for your patience :)`,
    healthCheck: `Checking OCR server status`,
    healthFalse: `Failed to connect to the OCR server.\nIf the problem persists, please contact the administrator`,
  },
} satisfies LocaleSchema;
