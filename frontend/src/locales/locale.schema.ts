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
    eMenu: string;
    oMenu: string;
  };
  ocr: {
    status: string;
    request: string;
    loading: string;
    result: string;
    description1: string,
    description2: string,
    description3: string,
  }
};