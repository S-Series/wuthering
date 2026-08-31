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
    board: string;
    login: string;
    menu: string;
  };
  board: {
    eyebrow: string;
    title: string;
    description: string;
    totalPosts: string;
    all: string;
    categories: {
      general: string;
      question: string;
      guide: string;
    };
    searchPlaceholder: string;
    search: string;
    write: string;
    writeComingSoon: string;
    writeLoginRequired: string;
    columnTitle: string;
    columnAuthor: string;
    columnDate: string;
    columnViews: string;
    notice: string;
    comments: string;
    loading: string;
    empty: string;
    emptyHint: string;
    error: string;
    retry: string;
    previous: string;
    next: string;
    editor: {
      eyebrow: string;
      createTitle: string;
      editTitle: string;
      createDescription: string;
      editDescription: string;
      categoryLabel: string;
      titleLabel: string;
      titlePlaceholder: string;
      contentLabel: string;
      contentPlaceholder: string;
      cancel: string;
      createSubmit: string;
      updateSubmit: string;
      submitting: string;
      loading: string;
      loginTitle: string;
      loginDescription: string;
      loginAction: string;
      forbiddenTitle: string;
      forbiddenDescription: string;
      validationTitle: string;
      validationContent: string;
      loadError: string;
      saveError: string;
    };
    detail: {
      loading: string;
      loadError: string;
      notFound: string;
      back: string;
      author: string;
      date: string;
      views: string;
      edit: string;
      delete: string;
      deleteConfirmTitle: string;
      deleteConfirmDescription: string;
      deleteCancel: string;
      deleteConfirm: string;
      deleting: string;
      deleteError: string;
    };
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
    cloudSync: string;
    imageInput: string;
    resetEchoData: string;
    resetEchoDataTitle: string;
    resetEchoDataMessage: string;
    resetEchoDataConfirm: string;
    resetEchoDataCancel: string;
    echoSearch: string;
    applyData: string;
    cloudSyncLoginRequired: string;
    cloudSyncMembershipRequired: string;
    cloudSyncSuccess: string;
    cloudSyncRequestFailed: string;
    cloudSyncDescription: string;
    cloudSyncMembershipNotice: string;
    cloudSyncUpload: string;
    cloudSyncUploadDescription: string;
    cloudSyncDownload: string;
    cloudSyncDownloadDescription: string;
    cloudSyncDownloadSuccess: string;
    cloudSyncNoCloudData: string;
    cloudSyncDataNone: string;
    cloudSyncCurrentData: string;
    cloudSyncCloudData: string;
    cloudSyncUpdatedAt: string;
    cloudSyncDateLoading: string;
    cloudSyncDateLoadFailed: string;
    cloudSyncWeapon: string;
    cloudSyncEchoCount: string;
    cloudSyncScore: string;
    cloudSyncNoWeapon: string;
    cloudSyncUploadConfirmTitle: string;
    cloudSyncDownloadConfirmTitle: string;
    cloudSyncUploadConfirmMessage: string;
    cloudSyncDownloadConfirmMessage: string;
    cloudSyncDownloadAllCharacters: string;
    cloudSyncUploadAllCharacters: string;
    cloudSyncIrreversibleWarning: string;
    cloudSyncExecute: string;
    cloudSyncExecuting: string;
    cloudSyncCancel: string;
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
      standard: string;
      temporary: string;
      harmonyBreak: string;
      //=========================
      fusionAnomaly: string;
      glacioAnomaly: string;
      aeroAnomaly: string;
      spectroAnomaly: string;
      havocAnomaly: string;
      //=========================
      echoDamageAmp: string;
      basicAttackAmp: string;
      skillDamageAmp: string;
      //=========================
      concertoCluster: string;
      concertoWave: string;
      linmoEngine: string;
      hypercarryMainDps: string;
      //=========================
      secondSlotSupport: string;
      thirdSlotSupport: string;
      //=========================
      teamCore: string;
      teamDps: string;
      aeroDps: string;
      //=========================
      cyberpunk: string;
      quickswap: string;
      //=========================
      alternative: string;
      budgetAlternatives: string;
    };
  };
  profile: {
    signup: {
      eyebrow: string;
      titleBeforeBrand: string;
      titleAfterBrand: string;
      description: string;
      benefits: {
        dataStorage: string;
        history: string;
        membership: string;
      };
      heading: string;
      subheading: string;
      fields: {
        email: string;
        emailPlaceholder: string;
        nickname: string;
        nicknamePlaceholder: string;
        password: string;
        passwordPlaceholder: string;
        passwordConfirm: string;
        passwordConfirmPlaceholder: string;
      };
      password: {
        show: string;
        hide: string;
        matched: string;
        mismatch: string;
        minLength: string;
        maxLength: string;
        lowercase: string;
        uppercase: string;
        numeric: string;
        special: string;
        requirementSeparator: string;
        requirements: string;
        policy: string;
      };
      agreement: {
        beforeTerms: string;
        terms: string;
        between: string;
        privacy: string;
        afterPrivacy: string;
      };
      actions: {
        submit: string;
        submitting: string;
        divider: string;
        googleSignup: string;
        hasAccount: string;
        login: string;
      };
      errors: {
        weakPassword: string;
        emailAlreadyInUse: string;
        invalidEmail: string;
        operationNotAllowed: string;
        networkRequestFailed: string;
        tooManyRequests: string;
        popupClosed: string;
        popupBlocked: string;
        popupInProgress: string;
        differentCredential: string;
        unauthorizedDomain: string;
        generic: string;
      };
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
    echoOrderHelp: string;
    echoData: string;
    inspectData: string;
  }
};

export type CardDetailPartyKey = keyof LocaleSchema["cardDetail"]["parties"];
