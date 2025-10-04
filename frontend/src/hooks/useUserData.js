import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { db } from "../firebase";
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc 
} from "firebase/firestore";
import { useFirebase } from "./useFirebase";

const UserDataContext = createContext(null);

export function UserDataProvider({ children }) {
  const { currentUser } = useFirebase();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // 사용자 로그인 시 데이터 로드
  useEffect(() => {
    if (!currentUser) {
      setUserData(null);
      setLoading(false);
      return;
    }

    loadUserData(currentUser.uid);
  }, [currentUser]);

  // Firestore에서 사용자 데이터 로드
  const loadUserData = async (uid) => {
    try {
      setLoading(true);
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        setUserData(userSnap.data());
      } else {
        // 처음 로그인하는 사용자 - 기본 데이터 생성
        const defaultData = {
          uid,
          email: currentUser.email,
          displayName: currentUser.displayName || "사용자",
          photoURL: currentUser.photoURL || null,
          subscription: {
            active: false,
            tier: "free", // free, basic, premium
            startDate: null,
            endDate: null
          },
          userLevel: 1,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        };

        await setDoc(userRef, defaultData);
        setUserData(defaultData);
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      setLoading(false);
    }
  };

  // 사용자 데이터 업데이트
  const updateUserData = async (updates) => {
    try {
      if (!currentUser) {
        return { success: false, error: "로그인이 필요합니다." };
      }

      const userRef = doc(db, "users", currentUser.uid);
      await updateDoc(userRef, {
        ...updates,
        updatedAt: new Date().toISOString()
      });

      // 로컬 상태 업데이트
      setUserData(prev => ({ ...prev, ...updates }));

      return { success: true, message: "데이터가 업데이트되었습니다." };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // 구독 시작
  const startSubscription = async (tier, durationDays = 30) => {
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + durationDays);

    return await updateUserData({
      subscription: {
        active: true,
        tier, // "basic" or "premium"
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      }
    });
  };

  // 구독 취소
  const cancelSubscription = async () => {
    return await updateUserData({
      "subscription.active": false
    });
  };

  // 사용자 레벨 업데이트
  const updateUserLevel = async (newLevel) => {
    return await updateUserData({
      userLevel: newLevel
    });
  };

  const value = useMemo(
    () => ({
      userData,
      loading,
      updateUserData,
      startSubscription,
      cancelSubscription,
      updateUserLevel,
    }),
    [userData, loading]
  );

  return (
    <UserDataContext.Provider value={value}>
      {children}
    </UserDataContext.Provider>
  );
}

export function useUserData() {
  const ctx = useContext(UserDataContext);
  if (!ctx) throw new Error("useUserData() must be used inside <UserDataProvider>.");
  return ctx;
}