import type { CharacterData } from "@/types/character.type"
import { useAppStore } from "@/stores/appStore";

import "./Card.Detail.css"
import { harmony, type HarmonyId } from "@/datas/harmonies";

type Props = {
  cData: CharacterData;
}

export default function CardDetail(data : Props) {
  const { lang, imgVer } = useAppStore();
  const BASE_URL = import.meta.env.VITE_IMAGE_BASE;

  return (
    <div className="card-detail-body">
      <div className="title-area">
        <img src={`/default.webp`}/>
        <span>캐릭터 속성 추천</span>
      </div>

      <div className="header heavy"/>
      <div className="header"/>

      <div className="content-area">
        <div className="inner-slot detail-area">
          <span className={`${lang}-font`}>§추천 파티정보</span>

          <div className="party-slot">
            <img src={`${BASE_URL}/character/${data.cData.characterId?.includes("rover")
                ? `rover?v=${imgVer}`
                : data.cData.characterId
              }/stand.png?v=${imgVer}`} />

            <div className={`party-detail-slot ${lang}-font`}>
              <span>조화도 파괴 파티</span>
              <div className="character-icon-slot">
                <img src={`${BASE_URL}/character/lynae/ico.webp`}/>
                <img src={`${BASE_URL}/character/mornye/ico.webp`}/>
              </div>

              <div className="divider"/>

              <span>융용 이상효과 파티</span>
              <div className="character-icon-slot">
                <img src={`${BASE_URL}/character/denia/ico.webp`}/>
                <img src={`${BASE_URL}/character/chisa/ico.webp`}/>
              </div>

              <div className="divider"/>

              <span>가성비 대체 캐릭</span>
              <div className="character-icon-slot">
                <img src={`${BASE_URL}/character/jianxin/ico.webp`}/>
                <img src={`${BASE_URL}/character/verina/ico.webp`}/>
                <img src={`${BASE_URL}/character/shorekeeper/ico.webp`}/>
              </div>
            </div>
          </div>

          <div style={{height: "5%"}}/>

          <span className={`inner-title ${lang}-font`}>§스킬작 우선순위</span>

          <div className="skill-slot">
            <div className="container">
              <img src="/ico/stats/basicBns.webp" />
              <span>일반 공격</span>
            </div>
            <div className="container">
              <img src="/ico/stats/skillBns.webp" />
              <span>공명 스킬</span>
            </div>
            <div className="container">
              <img src="/ico/stats/liberationBns.webp" />
              <span>공명 해방</span>
            </div>
            <div className="container">
              <img src="/ico/stats/forte.webp" />
              <span>공명 회로</span>
            </div>
            <div className="container">
              <img src="/ico/stats/outro.webp" />
              <span>변주 스킬</span>
            </div>
          </div>
        </div>

        <div className="inner-slot equipment-area">
          <span className={`${lang}-font`}>§추천 무기</span>

          <div className="weapon-image-slot">
            <img className="main" src={`/default.webp`}/>
            <img className="sub" src={`/default.webp`}/>
            <img className="sub" src={`/default.webp`}/>
          </div>

          <div style={{height:"7.5%"}}/>

          <span className={`${lang}-font`}>§추천 에코</span>

          <div className="echo-recommend-slot">
            <img className="echo" src={`/default.webp`}/>
            <div className="echo-data-field">
              <span className={`${lang}-font`}>시길룸 시불룸 시길룸 시길룸</span>
              <div className="divider"/>
              {(() => {
                const temp: HarmonyId[] = [
                  harmony.Star.id,
                  harmony.Foam.id,
                  harmony.Clouds.id,
                ];

                const ret = temp.map((item, idx) => {
                  return (<>
                    <div className={`harmony-slot ${idx === 0 ? "main" : "sub"}`}>
                      <img src={`/ico/harmony/${item}.png`} />
                      <span className={`${lang}-font`}>
                        {harmony[item][lang]}
                      </span>
                    </div>

                    {idx === 0 ? (<div className="divider" />) : (null)}

                  </>)
                })

                return (<>{ret}</>);
              })()}
            </div>
          </div>
        </div>

        <div className="inner-slot option-area">
          <span className={`${lang}-font`}>§추천 주옵션</span>

          <div className="stat-list-slot">
            <span className={`${lang}-font`}>Cost 4</span>
            <div className="divider"/>
            <div className="stat-slot">
              <img src="/default.webp"/>
              <span className={`${lang}-font`}>Cost 4</span>
            </div>
            <div className="stat-slot">
              <img src="/default.webp"/>
              <span className={`${lang}-font`}>Cost 4</span>
            </div>

            <div className="split"/>
            <span className={`${lang}-font`}>Cost 3</span>
            <div className="divider"/>
            <div className="stat-slot">
              <img src="/default.webp"/>
              <span className={`${lang}-font`}>Cost 4</span>
            </div>
            <div className="stat-slot">
              <img src="/default.webp"/>
              <span className={`${lang}-font`}>Cost 4</span>
            </div>
            <div className="stat-slot">
              <img src="/default.webp"/>
              <span className={`${lang}-font`}>Cost 4</span>
            </div>

            <div className="split"/>
            <span className={`${lang}-font`}>Cost 1</span>
            <div className="divider"/>
            <div className="stat-slot">
              <img src="/default.webp"/>
              <span className={`${lang}-font`}>Cost 4</span>
            </div>
          </div>  
        </div>

        <div className="inner-slot option-area">
          <span className={`${lang}-font`}>§추천 부옵션</span>

          <div className="stat-list-slot">
            <span className={`${lang}-font`}>유효 옵션</span>
            <div className="divider"/>
            <div className="stat-slot">
              <img src="/default.webp"/>
              <span className={`${lang}-font`}>Cost 4</span>
            </div>
            <div className="stat-slot">
              <img src="/default.webp"/>
              <span className={`${lang}-font`}>Cost 4</span>
            </div>

            <div className="split"/>
            <span className={`${lang}-font`}>반유효 옵션</span>
            <div className="divider"/>
            <div className="stat-slot">
              <img src="/default.webp"/>
              <span className={`${lang}-font`}>Cost 4</span>
            </div>
            <div className="stat-slot">
              <img src="/default.webp"/>
              <span className={`${lang}-font`}>Cost 4</span>
            </div>
            <div className="stat-slot">
              <img src="/default.webp"/>
              <span className={`${lang}-font`}>Cost 4</span>
            </div>
          </div>  
        </div>

        <div className="inner-slot stat-area">

        </div>
      </div>
    </div>
  )
}