import { useEffect, useMemo, useState } from "react";
import Select from "react-select";
import { useAuthStore } from "@/stores/authStore";
import { useAppStore } from "@/stores/appStore";
import { useStyleStore } from "@/stores/styleStore";

import { character } from "@/datas/characters";

import type { GameProfile, GameServer } from "@/firebase/user";
import type { CharacterId } from "@/datas/characterStats";

import "./ProfileEdit.css";

export default function GameProfileEdit() {
  const { user, gameProfile, saveUserNicknameAction, saveGameProfileAction } = useAuthStore();
  const { lang } = useAppStore();
  const { baseSelectStyles } = useStyleStore();

  const [nickName, setNickName] = useState<string>("");
  const [server, setServer] = useState<GameServer | "">("");
  const [gameUid, setGameUid] = useState("");
  const [gameLevel, setGameLevel] = useState("");
  const [characterId, setCharacterId] = useState<CharacterId | "">("");

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [uidVisible, setUidVisible] = useState(false);

  useEffect(() => {
    setNickName(user?.nickname ?? "Guest")
    setServer(gameProfile?.server ?? "");
    setGameUid(gameProfile?.gameUid ?? "");
    setGameLevel(
      typeof gameProfile?.gameLevel === "number"
        ? String(gameProfile.gameLevel)
        : ""
    );
    setCharacterId(gameProfile?.characterId ?? "");
  }, [user, gameProfile]);

  const updatedAtText = useMemo(() => {
    if (!gameProfile?.updatedAt) return "-";
    return new Date(gameProfile.updatedAt).toLocaleString();
  }, [gameProfile?.updatedAt]);

  const parsedLevel = Number(gameLevel);

  const isValid =
    !!user &&
    server !== "" &&
    gameUid.trim() !== "" &&
    /^\d+$/.test(gameUid.trim()) &&
    gameLevel.trim() !== "" &&
    Number.isInteger(parsedLevel) &&
    parsedLevel >= 1 &&
    parsedLevel <= 100;

  const isChanged =
    nickName !== (user?.nickname ?? "Guest") ||
    server !== (gameProfile?.server ?? "") ||
    gameUid !== (gameProfile?.gameUid ?? "") ||
    parsedLevel !== (gameProfile?.gameLevel ?? 0) ||
    characterId !== (gameProfile?.characterId ?? "");

  const serverOptions: { value: string; label: string; }[] = [
    { value: "Asia", label: "Asia" },
    { value: "Europe", label: "Europe" },
    { value: "America", label: "America" },
    { value: "HMT (HK, MO, TW)", label: "HMT (HK, MO, TW)" },
    { value: "Sea", label: "Sea" },
  ] as const;

  const characterOptions = Object.entries(character).map(([id, data]) => ({
    value: id,
    label: data[lang],
  }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setMessage("로그인이 필요합니다.");
      return;
    }

    if (!isValid) {
      setMessage("입력값을 다시 확인하세요.");
      return;
    }

    const nextProfile: GameProfile = {
      uid: user.uid,
      server: server as GameServer,
      gameUid: gameUid.trim(),
      gameLevel: parsedLevel,
      characterId: characterId === "" ? null : characterId,
      updatedAt: Date.now(),
    };

    try {
      setSaving(true);
      setMessage("");

      await saveUserNicknameAction(nickName);
      await saveGameProfileAction(nextProfile);

      setMessage("게임 프로필이 저장되었습니다.");
    } catch (error) {
      console.error(error);
      setMessage("저장 중 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="game-setting-shell">
        <div className="game-setting-empty">
          <h1 className="game-setting-empty-title">로그인이 필요합니다</h1>
          <p className="game-setting-empty-desc">
            게임 프로필을 수정하려면 먼저 로그인해야 합니다.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="game-setting-shell">
      <div className="game-setting-wrap">
        <header className="game-setting-hero">
          <div className="game-setting-hero__text">
            <p className="game-setting-hero__eyebrow">Game Profile</p>
            <h1 className="game-setting-hero__title">게임 프로필 설정</h1>
            <p className="game-setting-hero__desc">
              서버, 게임 UID, 레벨, 대표 캐릭터를 저장할 수 있습니다.
            </p>
          </div>

          <div className="game-setting-hero__meta">
            <div className="game-setting-stat">
              <span className="game-setting-stat__label">계정 UID</span>
              <strong className={`game-setting-stat__value ${uidVisible ? "" : "hide"}`}
                onClick={() => setUidVisible(p => !p)}>
                {user.uid}
              </strong>
            </div>
            <div className="game-setting-stat">
              <span className="game-setting-stat__label">마지막 수정</span>
              <strong className="game-setting-stat__value">{updatedAtText}</strong>
            </div>
          </div>
        </header>

        <form className="game-setting-panel" onSubmit={onSubmit}>
          <section className="game-setting-summary">
            <div className="game-setting-summary__row">
              <span>유저이름</span>
              <input
                id="game-nickname"
                type="text"
                placeholder="Username"
                value={nickName}
                onChange={(e) => setNickName(e.target.value)}
              />
            </div>

            <div style={{width: "100%", height: "1px", background: "#ffffff22"}}/>

            <div className="game-setting-summary__row">
              <span>현재 서버</span>
              <div style={{ width: "10rem", height: "100%" }}>
                <Select
                  inputId="game-server"
                  classNamePrefix="game-setting-select"
                  options={serverOptions}
                  styles={baseSelectStyles}
                  onChange={(option) => {
                    setServer(option?.value as GameServer | "");
                  }}
                  value={serverOptions.find((item) => item.value === server) ?? null}
                  placeholder="서버 선택"
                />
              </div>
            </div>

            <div style={{width: "100%", height: "1px", background: "#ffffff22"}}/>

            <div className="game-setting-summary__row">
              <span>현재 UID</span>
              <input
                id="game-uid"
                type="text"
                placeholder="800123456"
                value={gameUid}
                onChange={(e) => setGameUid(e.target.value)}
              />
            </div>

            <div style={{width: "100%", height: "1px", background: "#ffffff22"}}/>

            <div className="game-setting-summary__row">
              <span>현재 레벨</span>
              <input
                id="game-level"
                type="number"
                min={1}
                max={80}
                placeholder="60"
                value={gameLevel}
                onChange={(e) => setGameLevel(e.target.value)}
              />
            </div>

            <div style={{width: "100%", height: "1px", background: "#ffffff22"}}/>

            <div className="game-setting-summary__row">
              <span>대표 캐릭터</span>
              <div style={{ width: "10rem", height: "100%" }}>
                <Select
                  id="game-character"
                  options={characterOptions}
                  styles={baseSelectStyles}
                  menuPortalTarget={document.body}
                  menuPosition="fixed"
                  minMenuHeight={200}
                  menuShouldScrollIntoView={false}
                  value={characterOptions.find(item => item.value === characterId)}
                  onChange={(opt) =>
                    setCharacterId(opt?.value as CharacterId | "")
                  }
                />
              </div>
            </div>
          </section>

          <div className="game-setting-footer">
            <div className="game-setting-message">
              {message ? (
                <p
                  className={[
                    "game-setting-message__text",
                    message.includes("오류") || message.includes("확인")
                      ? "is-error"
                      : "is-success",
                  ].join(" ")}
                >
                  {message}
                </p>
              ) : (
                <p className="game-setting-message__placeholder">
                  저장 전 입력값을 확인하세요.
                </p>
              )}
            </div>

            <button
              className="game-setting-submit"
              type="submit"
              disabled={!isValid || !isChanged || saving}
            >
              {saving ? "저장 중..." : "게임 프로필 저장"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}