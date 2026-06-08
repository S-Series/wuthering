export type LocaleSchema = {
  common: {
    open: string;
    close: string;
    select: string;
  };
  navbar: {
    title: string;
    characters: string;
    generator: string;
    login: string;
    menu: string;
  };
  home: {
    title1: string;
    title2: string;
    title3: string;
    video1: string;
    video2: string;
    video3: string;
    click: string;
    latestNotices: string;
    noticePrefix: string;
    moreNotices: string;
    officialVideos: string;
    loadingVideos: string;
    inGameInfo: string;
    reset: string;
    seasonWaiting: string;
    showcase: string;
  };
  characters: {
    search: string;
    sortScore: string;
    sortRelease: string;
    configured: string;
    filterWeapon: string;
    filterElement: string;
    noResults: string;
  };
  card: {
    help: string;
    request: string;
    download: string;
    plate1: string;
    plate2: string;
    image1: string;
    image2: string;
    scoreboard: string;
    cMenu: string;
    wMenu: string;
    characterWeaponData: string;
    eMenu: string;
    oMenu: string;
    imageInput: string;
    resetEchoData: string;
    resetEchoDataTitle: string;
    resetEchoDataMessage: string;
    resetEchoDataConfirm: string;
    resetEchoDataCancel: string;
    echoSearch: string;
    applyData: string;
  };
  cardDetail: {
    sections: {
      party: string;
      skill: string;
      weapon: string;
      echo: string;
      main: string;
      sub: string;
      target: string;
    };
    skills: {
      basic: string;
      skill: string;
      liberation: string;
      forte: string;
      outro: string;
    };
    subStats: {
      priority: string;
      secondary: string;
    };
    parties: {
      temporary: string;
      harmonyBreak: string;
      fusionAnomaly: string;
      budgetAlternatives: string;
    };
  };
  ocr: {
    status: string;
    request: string;
    loading: string;
    result: string;
    description1: string,
    description2: string,
    description3: string,
    healthCheck: string,
    healthFalse: string,
    echoList: string;
    echoData: string;
    inspectData: string;
  }
};

export type CardDetailPartyKey = keyof LocaleSchema["cardDetail"]["parties"];
