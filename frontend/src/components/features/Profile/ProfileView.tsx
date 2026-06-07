import { useMemo } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useOverlay } from "@/contexts/PopupContext";
import CharacterSlot from "@/components/features/Characters/CharacterSlot";
import { characterList } from "@/datas/characters";
import { loadSummaryStore } from "@/summaryData/storage";
import { getCharacterRank } from "@/types/character.type";

import GameProfileEdit from "@/components/features/Profile/ProfileEdit";

import "./ProfileView.override.css"

export default function ProfileView() {
  const BASE_URL = import.meta.env.VITE_IMAGE_BASE;

  const { user, gameProfile, logoutAction } = useAuthStore();
  const { openOverlay } = useOverlay();
  const summaryStore = useMemo(() => loadSummaryStore(), []);

  const userImageUrl = useMemo(() => {
    return [
      user?.imageUrl ?? "/default.webp",
      `${BASE_URL}/character/${gameProfile?.characterId ?? "rover_spectro"}/ico.webp`,
      `${BASE_URL}/character/${gameProfile?.characterId ?? "rover_spectro"}/stand.png`,
      `./stand.png`
    ]
  }, [user?.imageUrl, gameProfile?.characterId])

  const topCharacters = useMemo(() => {
    return characterList
      .map((item) => {
        const score = summaryStore.data[item.id]?.score ?? 0;

        return {
          ...item,
          score,
          rank: getCharacterRank(score),
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }, [summaryStore]);

  return (
    <div className="profile-info-field">
      <img className="main-stand-image" src={userImageUrl[2]} />
      <div className="container">
        <div className="user-info">
          <div className="profile-image-wrap">
            <img className="profile-image" src={userImageUrl[0]} />
          </div>

          <div className="profile-image-wrap">
            <img className="profile-image" src={userImageUrl[1]} />
          </div>

          <div className="text-box">
            <span className="num-font">{`Lv.${gameProfile?.gameLevel ?? 1}`}  <em>{`${user?.nickname ?? "Guest"}`}</em></span>
            <span className="num-font">{`${gameProfile?.server ?? "unknown"} / Uid.`} <em>{`${gameProfile?.gameUid ?? "- - - - - - -"}`}</em></span>
            <span className="num-font">Joined. <em>{`${new Date(user?.createdAt ?? "- - - -").toISOString().slice(0, 10)}`}</em> ~</span>
            <span className="num-font">Membership.
              {"  "}{<img src="./default.webp" />}{"  "}
              (~<em>{`${new Date(user?.createdAt ?? "- - - -").toISOString().slice(0, 10)}`})</em>
            </span>
          </div>
          <div className="button-box">
            <button onClick={() => openOverlay(<GameProfileEdit/>, {title: "게임 프로필 정보수정", width: "auto", height: "min(85vh, 80rem)", ratio: "7 / 16"})}>정보수정</button>
            <button onClick={() => logoutAction()}>로그아웃</button>
          </div>
        </div>

        <div className="game-info">
          <h2>대표 캐릭터</h2>
          <div className="profile-display-list">
            {topCharacters.map((item) => (
              <CharacterSlot
                key={item.id}
                isGrid={true}
                prop={item}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
