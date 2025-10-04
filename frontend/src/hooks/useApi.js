import { createContext, useContext, useMemo } from "react";

const ApiContext = createContext(null);

export function ApiProvider({ children }) {
  const assetApiUrl = process.env.REACT_APP_ASSET_API_URL;
  const imgMakeApiUrl = process.env.REACT_APP_IMAGE_API_URL;
  const ocrApiUrl = {
    en: process.env.REACT_APP_OCR_EN_API_URL,
    kr: process.env.REACT_APP_OCR_KR_API_URL,
    jp: process.env.REACT_APP_OCR_JP_API_URL,
    zh: process.env.REACT_APP_OCR_ZH_API_URL,
  };

  const value = useMemo(
    () => ({
      assetApiUrl,
      imgMakeApiUrl,
      ocrApiUrl,
    }),
    []
  );

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
}
export function useApi() {
  const ctx = useContext(ApiContext);
  if (!ctx) throw new Error("useApi() must be used inside <ProfileProvider>.");
  return ctx;
}
