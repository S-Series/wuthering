import { Fragment, type ReactNode } from "react";

import { characterGuideData } from "@/datas/characters.guide";
import { getCharacterMeta } from "@/datas/characters.meta";
import { character } from "@/datas/characters";
import { echoDict, type EchoData } from "@/datas/echos";
import { harmony } from "@/datas/harmonies";
import { FixedStats, type StatId } from "@/datas/stats";
import { weaponDict } from "@/datas/weapon";
import { locale } from "@/locales/locale";
import { useAppStore, type LangType } from "@/stores/appStore";
import type { CharacterData } from "@/types/character.type";

import "./Card.Detail.css";

type Props = {
  cData: CharacterData;
};

function getEchoData(echoId: string): Omit<EchoData, "id"> | null {
  for (const echoes of Object.values(echoDict)) {
    if (echoId in echoes) return echoes[echoId];
  }

  return null;
}

function getStatLabel(statId: StatId, lang: LangType) {
  const label = FixedStats[statId][lang];
  if (lang !== "en") return label;

  return label
    .replace(/\bDamage\b/gi, "DMG")
    .replace(/\bBonus\b/gi, "%")
    .replace(/\s+%/g, "%");
}

function StatSlot({
  statId,
  lang,
  suffix,
}: {
  statId: StatId;
  lang: LangType;
  suffix?: ReactNode;
}) {
  return (
    <div className="stat-slot">
      <img src={`/ico/stats/${statId}.webp`} />
      <span className={`${lang}-font`}>
        {getStatLabel(statId, lang)}
        {suffix}
      </span>
    </div>
  );
}

export default function CardDetail({ cData }: Props) {
  const { lang, imgVer } = useAppStore();
  const BASE_URL = import.meta.env.VITE_IMAGE_BASE;
  const localeText = locale(lang).cardDetail;

  const characterData = character[cData.characterId];
  const guide = characterGuideData[cData.characterId];
  const meta = getCharacterMeta(cData.characterId, cData.constell[0]);
  const mainEcho = getEchoData(guide.guideMainEcho);
  const cost1MainStat = `${meta.statType}Pct` as StatId;
  const effectiveSubStats: StatId[] = meta.isNeedCrit
    ? [FixedStats.critRate.id, FixedStats.critDmg.id, cost1MainStat]
    : [cost1MainStat];
  const secondarySubStats: StatId[] = [
    FixedStats.resonanceBns.id,
    FixedStats[`${characterData.type}Bns`].id,
  ];
  const characterImageId = cData.characterId.includes("rover")
    ? "rover"
    : cData.characterId;

  return (
    <div className="card-detail-body">
      <div className="title-area">
        <img
          src={`${BASE_URL}/character/${characterImageId}/ico.webp?v=${imgVer}`}
        />
        <span className={`${lang}-font`}>
          {characterData[lang]} {localeText.sections.target}
        </span>
      </div>

      <div className="content-area">
        <div className="inner-slot detail-area">
          <span className={`${lang}-font`}>{localeText.sections.party}</span>

          <div className="party-slot">
            <img
              src={`${BASE_URL}/character/${characterImageId}/stand.png?v=${imgVer}`}
            />

            <div className={`party-detail-slot ${lang}-font`}>
              {guide.guideParties.map((party, index) => (
                <div
                  className={`party-detail-item ${
                    index < guide.guideParties.length - 1 ? "has-divider" : ""
                  }`}
                  key={`${cData.characterId}-party-${index}`}
                >
                  <span>{localeText.parties[party.nameKey]}</span>
                  <div className="character-icon-slot">
                    {party.characters.map((partyCharacterId) => (
                      <div
                        className="party-character-image-slot"
                        key={partyCharacterId}
                      >
                        <img
                          src={`${BASE_URL}/character/${
                            partyCharacterId.includes("rover")
                              ? "rover"
                              : partyCharacterId
                          }/ico.webp?v=${imgVer}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              {Array.from({
                length: Math.max(0, 3 - guide.guideParties.length),
              }).map((_, index) => (
                <div
                  aria-hidden="true"
                  className="party-detail-spacer"
                  key={`${cData.characterId}-party-spacer-${index}`}
                />
              ))}
            </div>
          </div>

          <span className={`inner-title ${lang}-font`}>
            {localeText.sections.skill}
          </span>

          <div className="skill-slot">
            {guide.guideSkillOrder.map((skill) => (
              <div className="container" key={skill}>
                <img
                  src={`/ico/stats/${
                    skill === "basic" ||
                    skill === "skill" ||
                    skill === "liberation"
                      ? `${skill}Bns`
                      : skill
                  }.webp`}
                />
                <span>{localeText.skills[skill]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="inner-slot equipment-area">
          <span className={`${lang}-font`}>{localeText.sections.weapon}</span>

          <div className="weapon-image-slot">
            {guide.guideWeapons.map((weaponId, index) => {
              const weaponData = weaponDict[weaponId];

              return (
                <img
                  key={weaponId}
                  className={index === 0 ? "main" : "sub"}
                  src={`${BASE_URL}/weapon/${characterData.weapon}/${weaponData.imgKey}.png?v=${imgVer}`}
                  title={String(weaponData[lang])}
                />
              );
            })}
          </div>

          <div style={{ height: "7.5%" }} />

          <span className={`${lang}-font`}>{localeText.sections.echo}</span>

          <div className="echo-recommend-slot">
            <div className="detail-echo-image-slot">
              <img
                className="echo"
                src={`${BASE_URL}/ico/echos/${guide.guideMainEcho}.webp?v=${imgVer}`}
              />
            </div>
            <div className="echo-data-field">
              <span className={`${lang}-font`}>
                {mainEcho?.[lang] ?? guide.guideMainEcho}
              </span>
              <div className="divider" />
              {meta.harmonySets.map((harmonyId, index) => (
                <Fragment key={harmonyId}>
                  <div
                    className={`harmony-slot ${index === 0 ? "main" : "sub"}`}
                  >
                    <img src={`/ico/harmony/${harmonyId}.png`} />
                    <span className={`${lang}-font`}>
                      {harmony[harmonyId][lang]}
                    </span>
                  </div>
                  {index === 0 && meta.harmonySets.length > 1 && (
                    <div className="divider" />
                  )}
                </Fragment>
              ))}
            </div>
          </div>
        </div>

        <div className="inner-slot option-area">
          <span className={`${lang}-font`}>{localeText.sections.main}</span>

          <div className="stat-list-slot">
            <span className={`${lang}-font`}>Cost 4</span>
            <div className="divider" />
            {meta.cost4MainStats.map((statId) => (
              <StatSlot key={statId} statId={statId} lang={lang} />
            ))}

            <div className="split" />
            <span className={`${lang}-font`}>Cost 3</span>
            <div className="divider" />
            {meta.cost3MainStats.map((statId) => (
              <StatSlot key={statId} statId={statId} lang={lang} />
            ))}

            <div className="split" />
            <span className={`${lang}-font`}>Cost 1</span>
            <div className="divider" />
            <StatSlot statId={cost1MainStat} lang={lang} />
          </div>
        </div>

        <div className="inner-slot option-area">
          <span className={`${lang}-font`}>{localeText.sections.sub}</span>

          <div className="stat-list-slot">
            <span className={`${lang}-font`}>
              {localeText.subStats.priority}
            </span>
            <div className="divider" />
            {effectiveSubStats.map((statId) => (
              <StatSlot key={statId} statId={statId} lang={lang} />
            ))}

            <div className="split" />
            <span className={`${lang}-font`}>
              {localeText.subStats.secondary}
            </span>
            <div className="divider" />
            {secondarySubStats.map((statId) => (
              <StatSlot key={statId} statId={statId} lang={lang} />
            ))}
          </div>
        </div>

        <div className="inner-slot stat-area">
          <span className={`${lang}-font`}>{localeText.sections.target}</span>
          {/*

          <div className="stat-info">
            <StatSlot
              statId={FixedStats.resonanceBns.id}
              lang={lang}
              suffix={` ${meta.resReq}%`}
            />
            <StatSlot statId={cost1MainStat} lang={lang} />
            {meta.isNeedCrit && (
              <>
                <StatSlot statId={FixedStats.critRate.id} lang={lang} />
                <StatSlot statId={FixedStats.critDmg.id} lang={lang} />
              </>
            )}
          </div>

          <div className="stat-info extra">
            <StatSlot
              statId={FixedStats.resonanceBns.id}
              lang={lang}
              suffix={` +${meta.subResReq}%`}
            />
          </div>
           */}
        </div>
      </div>
    </div>
  );
}
