import { useState, useEffect } from "react";
import "./App.css";
import NavBar from "../components/NavBar";
import SideBar from "../components/SideBar";
import { useFirebase } from "../hooks/useFirebase";
import { useUserData } from "../hooks/useUserData";
import LoginSection from "./LoginSection";
import "./Userinfo.css";

function Userinfo() {

  const { 
    currentUser, 
    logout, 
    resendVerificationEmail, 
    updateUserProfile 
  } = useFirebase();

  const { userData, updateUserData } = useUserData();

  console.log("=== DEBUG ==="); //$ << 여기서부터도 디버깅이 안떠
  console.log("currentUser:", currentUser);
  console.log("userData:", userData);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // 프로필 편집 상태
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    displayName: "",
    photoURL: "",
    gameUid: "",
    gameServer: "",
    gameLevel: "",
  });

  useEffect(() => {
    if (currentUser && userData) {
      setEditForm({
        displayName: currentUser.displayName || "",
        photoURL: currentUser.photoURL || "",
        gameUid: userData.gameUid || "",
        gameServer: userData.gameServer || "",
        gameLevel: userData.gameLevel || "",
      });
    }
  }, [currentUser, userData]);

  useEffect(() => {
    if (currentUser) {
      console.log("=== 🔥 Firebase Auth User ===");
      console.log("UID:", currentUser.uid);
      console.log("Email:", currentUser.email);
      console.log("Display Name:", currentUser.displayName);
      console.log("Photo URL:", currentUser.photoURL);
      console.log("Email Verified:", currentUser.emailVerified);
      console.log("Provider:", currentUser.providerData);
      console.log("Created:", currentUser.metadata.creationTime);
      console.log("Last Login:", currentUser.metadata.lastSignInTime);
    }

    if (userData) {
      console.log("\n=== 📦 Firestore User Data ===");
      console.log(userData);
      console.log("\n사용 가능한 데이터:");
      console.log("- userData.gameUid:", userData.gameUid);
      console.log("- userData.gameServer:", userData.gameServer);
      console.log("- userData.gameLevel:", userData.gameLevel);
      console.log("- userData.subscription:", userData.subscription);
      console.log("- userData.userLevel:", userData.userLevel);
    }
  }, [currentUser, userData]);

  // 이메일 인증 발송
  const handleSendVerification = async () => {
    setError("");
    setMessage("");
    setLoading(true);

    const result = await resendVerificationEmail();

    if (result.success) {
      setMessage(result.message);
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  // 프로필 저장
  const handleSaveProfile = async () => {
    setError("");
    setMessage("");
    setLoading(true);

    // Firebase Auth 프로필 업데이트 (닉네임, 프로필사진)
    const authUpdate = await updateUserProfile({
      displayName: editForm.displayName,
      photoURL: editForm.photoURL,
    });

    if (!authUpdate.success) {
      setError(authUpdate.error);
      setLoading(false);
      return;
    }

    // Firestore 데이터 업데이트 (게임 정보)
    const dataUpdate = await updateUserData({
      displayName: editForm.displayName,
      photoURL: editForm.photoURL,
      gameUid: editForm.gameUid,
      gameServer: editForm.gameServer,
      gameLevel: parseInt(editForm.gameLevel) || 0,
    });

    if (dataUpdate.success) {
      setMessage("프로필이 저장되었습니다!");
      setIsEditing(false);
    } else {
      setError(dataUpdate.error);
    }

    setLoading(false);
  };

  // 편집 취소
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditForm({
      displayName: currentUser?.displayName || "",
      photoURL: currentUser?.photoURL || "",
      gameUid: userData?.gameUid || "",
      gameServer: userData?.gameServer || "",
      gameLevel: userData?.gameLevel || "",
    });
    setError("");
    setMessage("");
  };

  return (
    <div className="app-wrapper">
      <NavBar />
      <div className="viewport">
        <SideBar />
        <div className="main-content">
          <div className="userinfo-container">
            {!currentUser ? (
              // 로그인 안된 상태
              <LoginSection />
            ) : (
              // 로그인된 상태 - 프로필 편집
              <div className="user-profile">
                <h2>내 프로필</h2>
                <div className="profile-card">
                  {/* 프로필 아바타 */}
                  <div className="profile-avatar-section">
                    {isEditing ? (
                      <div className="avatar-edit">
                        <div className="avatar-preview">
                          {editForm.photoURL ? (
                            <img src={editForm.photoURL} alt="Preview" />
                          ) : (
                            <div className="avatar-placeholder">
                              {editForm.displayName?.[0]?.toUpperCase() || "?"}
                            </div>
                          )}
                        </div>
                        <input
                          type="text"
                          value={editForm.photoURL}
                          onChange={(e) =>
                            setEditForm({ ...editForm, photoURL: e.target.value })
                          }
                          placeholder="프로필 이미지 URL"
                          className="photo-input"
                        />
                      </div>
                    ) : (
                      <div className="profile-avatar">
                        {currentUser.photoURL ? (
                          <img src={currentUser.photoURL} alt="Profile" />
                        ) : (
                          <div className="avatar-placeholder">
                            {currentUser.email?.[0]?.toUpperCase()}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* 기본 정보 */}
                  <div className="profile-info">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.displayName}
                        onChange={(e) =>
                          setEditForm({ ...editForm, displayName: e.target.value })
                        }
                        placeholder="닉네임"
                        className="name-input"
                      />
                    ) : (
                      <h3>{currentUser.displayName || "사용자"}</h3>
                    )}

                    <p className="email">{currentUser.email}</p>
                    <p className="user-id">UID: {currentUser.uid}</p>

                    {/* 이메일 인증 */}
                    <div className="email-verification">
                      {currentUser.emailVerified ? (
                        <span className="verified-badge">✅ 이메일 인증 완료</span>
                      ) : (
                        <div>
                          <span className="unverified-badge">❌ 이메일 미인증</span>
                          <button
                            onClick={handleSendVerification}
                            className="verify-btn"
                            disabled={loading}
                          >
                            인증 메일 발송
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* 게임 정보 */}
                <div className="game-info-section">
                  <h3>게임 정보</h3>

                  {isEditing ? (
                    <div className="game-form">
                      <div className="form-row">
                        <label>인게임 UID</label>
                        <input
                          type="text"
                          value={editForm.gameUid}
                          onChange={(e) =>
                            setEditForm({ ...editForm, gameUid: e.target.value })
                          }
                          placeholder="100000000"
                        />
                      </div>

                      <div className="form-row">
                        <label>서버</label>
                        <select
                          value={editForm.gameServer}
                          onChange={(e) =>
                            setEditForm({ ...editForm, gameServer: e.target.value })
                          }
                        >
                          <option value="">선택</option>
                          <option value="Asia">Asia</option>
                          <option value="America">America</option>
                          <option value="Europe">Europe</option>
                          <option value="SEA">SEA</option>
                        </select>
                      </div>

                      <div className="form-row">
                        <label>레벨</label>
                        <input
                          type="number"
                          value={editForm.gameLevel}
                          onChange={(e) =>
                            setEditForm({ ...editForm, gameLevel: e.target.value })
                          }
                          placeholder="80"
                          min="1"
                          max="90"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="game-info-display">
                      <div className="info-item">
                        <span className="label">인게임 UID:</span>
                        <span className="value">{userData?.gameUid || "미설정"}</span>
                      </div>
                      <div className="info-item">
                        <span className="label">서버:</span>
                        <span className="value">
                          {userData?.gameServer || "미설정"}
                        </span>
                      </div>
                      <div className="info-item">
                        <span className="label">레벨:</span>
                        <span className="value">
                          {userData?.gameLevel || "미설정"}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* 메시지 */}
                {error && <p className="error-message">{error}</p>}
                {message && <p className="success-message">{message}</p>}

                {/* 버튼들 */}
                <div className="action-buttons">
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleSaveProfile}
                        className="save-btn"
                        disabled={loading}
                      >
                        {loading ? "저장 중..." : "저장"}
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="cancel-btn"
                        disabled={loading}
                      >
                        취소
                      </button>
                    </>
                  ) : (
                    <button onClick={() => setIsEditing(true)} className="edit-btn">
                      프로필 수정
                    </button>
                  )}

                  <button onClick={logout} className="logout-btn">
                    로그아웃
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Userinfo;