import { useMemo } from "react";
import { useAuthStore } from "@/stores/authStore";

export default function ProfileView() {
  const BASE_URL = import.meta.env.VITE_IMAGE_BASE;

  const { user, gameProfile, logoutAction } = useAuthStore();

  const userImageUrl = useMemo(() => {
    return [
      user?.imageUrl ?? "/default.webp",
      `${BASE_URL}/character/${gameProfile?.characterId ?? "rover_spectro"}/ico.webp`,
      `${BASE_URL}/character/${gameProfile?.characterId ?? "rover_spectro"}/stand.png`,
      `./stand.png`
    ]
  }, [user?.imageUrl, gameProfile?.characterId])

  return (
    <div className="profile-field">
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
            <button>정보수정</button>
            <button onClick={() => logoutAction()}>로그아웃</button>
          </div>
        </div>

        <div className="game-info">

        </div>
      </div>
    </div>
  )
}
