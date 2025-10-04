import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { auth } from "../firebase";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateProfile,
  updateEmail,
  updatePassword
} from "firebase/auth";

const FirebaseContext = createContext(null);

export function FirebaseProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 인증 상태 변화 감지
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // 이메일/비밀번호 로그인
  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: userCredential.user };
    } catch (error) {
      return { success: false, error: getErrorMessage(error.code) };
    }
  };

  // 이메일/비밀번호 회원가입
  const signup = async (email, password, displayName = null) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // 프로필 설정 (닉네임)
      if (displayName) {
        await updateProfile(userCredential.user, { displayName });
      }
      
      return { 
        success: true, 
        user: userCredential.user,
        message: "회원가입이 완료되었습니다."
      };
    } catch (error) {
      return { success: false, error: getErrorMessage(error.code) };
    }
  };

  // 이메일 인증 재발송
  const resendVerificationEmail = async () => {
    try {
      if (!currentUser) {
        return { success: false, error: "로그인이 필요합니다." };
      }
      
      await sendEmailVerification(currentUser);
      return { success: true, message: "인증 이메일이 발송되었습니다." };
    } catch (error) {
      return { success: false, error: getErrorMessage(error.code) };
    }
  };

  // Google 로그인
  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      return { success: true, user: userCredential.user };
    } catch (error) {
      return { success: false, error: getErrorMessage(error.code) };
    }
  };

  // 비밀번호 재설정 이메일 발송
  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { 
        success: true, 
        message: "비밀번호 재설정 이메일이 발송되었습니다." 
      };
    } catch (error) {
      return { success: false, error: getErrorMessage(error.code) };
    }
  };

  // 프로필 업데이트 (닉네임, 프로필 사진)
  const updateUserProfile = async (updates) => {
    try {
      if (!currentUser) {
        return { success: false, error: "로그인이 필요합니다." };
      }
      
      await updateProfile(currentUser, updates);
      
      // 상태 업데이트 (UI 반영)
      setCurrentUser({ ...currentUser, ...updates });
      
      return { success: true, message: "프로필이 업데이트되었습니다." };
    } catch (error) {
      return { success: false, error: getErrorMessage(error.code) };
    }
  };

  // 이메일 변경
  const changeEmail = async (newEmail) => {
    try {
      if (!currentUser) {
        return { success: false, error: "로그인이 필요합니다." };
      }
      
      await updateEmail(currentUser, newEmail);
      await sendEmailVerification(currentUser);
      
      return { 
        success: true, 
        message: "이메일이 변경되었습니다. 새 이메일로 인증을 완료해주세요." 
      };
    } catch (error) {
      return { success: false, error: getErrorMessage(error.code) };
    }
  };

  // 비밀번호 변경
  const changePassword = async (newPassword) => {
    try {
      if (!currentUser) {
        return { success: false, error: "로그인이 필요합니다." };
      }
      
      await updatePassword(currentUser, newPassword);
      return { success: true, message: "비밀번호가 변경되었습니다." };
    } catch (error) {
      return { success: false, error: getErrorMessage(error.code) };
    }
  };

  // 로그아웃
  const logout = async () => {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      return { success: false, error: getErrorMessage(error.code) };
    }
  };

  // 에러 메시지 변환
  const getErrorMessage = (code) => {
    switch (code) {
      case "auth/email-already-in-use":
        return "이미 사용 중인 이메일입니다.";
      case "auth/invalid-email":
        return "유효하지 않은 이메일 형식입니다.";
      case "auth/user-not-found":
        return "존재하지 않는 사용자입니다.";
      case "auth/wrong-password":
        return "비밀번호가 올바르지 않습니다.";
      case "auth/weak-password":
        return "비밀번호는 6자 이상이어야 합니다.";
      case "auth/popup-closed-by-user":
        return "로그인 팝업이 닫혔습니다.";
      case "auth/requires-recent-login":
        return "보안을 위해 다시 로그인해주세요.";
      case "auth/too-many-requests":
        return "너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요.";
      default:
        return "작업에 실패했습니다. 다시 시도해주세요.";
    }
  };

  const value = useMemo(
    () => ({
      currentUser,
      loading,
      login,
      signup,
      resendVerificationEmail,
      loginWithGoogle,
      resetPassword,
      updateUserProfile,
      changeEmail,
      changePassword,
      logout,
    }),
    [currentUser, loading]
  );

  return (
    <FirebaseContext.Provider value={value}>
      {!loading && children}
    </FirebaseContext.Provider>
  );
}

export function useFirebase() {
  const ctx = useContext(FirebaseContext);
  if (!ctx) throw new Error("useFirebase() must be used inside <FirebaseProvider>.");
  return ctx;
}