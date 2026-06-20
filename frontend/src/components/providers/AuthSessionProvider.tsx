import { useEffect, type ReactNode } from "react";

import { useAuthStore } from "@/stores/authStore";

export default function AuthSessionProvider({ children }: { children: ReactNode }) {
  const initAuth = useAuthStore((state) => state.initAuth);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return children;
}
