import { createContext, useCallback, useContext, useMemo, useState } from "react";

const DataContext = createContext(null);

export function DataHolder({children}) {
  const [echoImageBase64, setEchoImageBase64] = useState(Array(5).fill("/default.webp"));
  const setImageHolder = useCallback((index, value) => {
    setEchoImageBase64((prev) =>
      prev.map((item, idx) => (idx === index ? value : item))
    );
  }, []); 

  const value = useMemo(() => {
    return { echoImageBase64, setImageHolder };
  }, [echoImageBase64, setImageHolder]);

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useDataHolder() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useDataHolder() must be used inside <DataHolder>.");
  return ctx;
}