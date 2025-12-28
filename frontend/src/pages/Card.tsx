import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import Select from "react-select/base";

import ImagePicker from "@/components/ImagePicker";
import { useAppStore } from "@/hooks/appStore";
import { useUserStore } from "@/hooks/userStore";

import { character, WeaponTypes as WeaponLists ,ElementTypes as ElementLists } from "@/datas/characters"
import type { Character, WeaponTypes, ElementTypes } from "@/datas/characters"

import "@/pages/Card.css"
import "@/pages/Card.contents.main.css"

export default function Card() {

  const { lang } = useAppStore();
  const BASE_URL = import.meta.env.VITE_IMAGE_BASE;
  const SCOREBOARD_URL = "https://docs.google.com/spreadsheets/d/169EqXJatZIMqL0MPbHF6Eg9DgLFcaxjE6hG03gYZ-_U/edit?gid=1750559029#gid=1750559029";
  
  const [searchParams] = useSearchParams();
  const paramData = searchParams.get("character") ?? "empty";

  const [weaponFilter, setWeaponFilter] = useState([false, false, false, false, false])
  const [elementFilter, setElementFilter] = useState([false, false, false, false, false, false])
  
  const CHARACTER_LIST = Object.entries(character);
  const [characterData, setCharacterData] = useState<Character>(() => {
    const data = CHARACTER_LIST.find(([key]) => key === paramData)?.[1] || character["rover_spectro"]
    return data;
  });

  

  const characterImage = useUserStore((s) => s.characterImage);
  const namecardImage = useUserStore((s) => s.namecardImage);

  const setImageSrc = useUserStore((s) => s.setImageSrc);
  const resetImage = useUserStore((s) => s.resetImage);

  return (
    <div id="card-page-slot">
      <div className="card-section left">
        <div className="card-header">
          {/* filter buttons */}
          <div className="header-slot">
            <div className="item-slot filter">
              <div style={{display: "flex", gap: "min(0.5vw, 1rem)"}}>
                {WeaponLists.map((item, idx) => {
                  return (
                    <button className={
                      `card-page-button filter ${weaponFilter[idx] ? "active" : ""}`
                    }
                      onClick={() => {
                        setWeaponFilter((prev) =>
                          prev.map((v, i) => (i === idx ? !v : v)))
                      }}>
                      <img alt="weapon icon"
                        src={`${BASE_URL}/ico/weapon_type/${item}.webp`} />
                    </button>
                  )
                })}
                <div style={{ width: "4px" }} />
              </div>

              <div style={{display: "flex", gap: "min(0.5vw, 1rem)"}}>
                {ElementLists.map((item, idx) => {
                  return (
                    <button className={
                      `card-page-button filter ${elementFilter[idx] ? "active" : ""}`
                    }
                      onClick={() => {
                        setElementFilter((prev) =>
                          prev.map((v, i) => (i === idx ? !v : v)))
                      }}>
                      <img alt="filter icon"
                        src={`${BASE_URL}/ico/element/${item}.png`} />
                    </button>
                  )
                })}
                <div style={{ width: "4px" }} />
                <button className="card-page-button"
                  onClick={() => {
                    setWeaponFilter([false, false, false, false, false]);
                    setElementFilter([false, false, false, false, false, false]);
                  }}><span className="en-font">Reset</span></button>
              </div>
            </div>

            <div className="item-slot">
              asdf
            </div>
          </div>

          {/* Select Field */}
          <div className="header-slot">
            <div className="item-slot">
              {/* Character Select */}
              <Select/>

              <div style={{ width: "4px" }} />

              {/* Weapon Select */}
              <Select/>
            </div>
          </div>
        </div>

        <div className="card-contents">
          <div className="card-contents-slot header"> 
            <div className="item-slot">
                <button className="card-page-button content top">
                  <span>ⓘ&nbsp;&nbsp;Help</span>
                </button>
                <button className="card-page-button content top">
                  <span>Request Generate</span>
                </button>
                <button className="card-page-button content top">
                  <span>Download Image</span>
                </button>
            </div>

            <div className="item-slot">
                <button className="card-page-button content top">
                  <span>Reset Plate Image</span>
                </button>
                <button className="card-page-button content top">
                  <span>Idle</span>
                </button>
            </div>
          </div>

          {/* == //$ Main Content */}
          <div className="card-contents-slot main">
            <div className="main-item-slot character">
              <div className="card-character-slot">
                <ImagePicker
                  src={characterImage.src}
                  defaultSrc={`${BASE_URL}/character/${characterData.en}/stand.png`}
                  onChangeSrc={(src) =>
                    setImageSrc("characterImage", src)
                  }
                />
                <span className="account-info region en-font">{`Asia`}</span>
                <span className="account-info player-name en-font">{`Lv.-- Guest Player`}</span>
                <span className="account-info player-uid en-font">{`UID. - - -  - - -  - - -`}</span>
                <span className={`character-name ${lang}-font`}>
                  {characterData[lang]?.charAt(0).toUpperCase() + characterData[lang]?.slice(1)}
                </span>
                <img className="character-icon element" 
                  alt="element icon" 
                  src={`/ico/element/${characterData.element}.png`}/>
                <img className="character-icon stat-type" 
                  alt="stat type icon" 
                  src={`/ico/stats/atk.webp`}/>
                <img className="character-icon attack-type" 
                  alt="attack type icon" 
                  src={`/ico/stats/${characterData.type}Bns.webp`}/>
                <img className="character-icon weapon-type" 
                  alt="weapon type icon" 
                  src={`/ico/weapon_type/${characterData.weapon}.webp`}/>
              </div>
            </div>
            <div className="main-item-slot weapon">
              
            </div>
            <div className="main-item-slot stats">
              
            </div>
            <div className="main-item-slot description">
              
            </div>
            <div className="main-item-slot namecard">
              
            </div>
            <div className="main-item-slot echos">
              
            </div>
          </div>
          {/* == //$ Main Content End */}

          <div className="card-contents-slot footer">
            <div className="item-slot">
                <button className="card-page-button content bottom">
                  <span>Reset Character Image</span>
                </button>
            </div>

            <div className="item-slot">
                <button className="card-page-button content bottom"
                  onClick={() => window.open(SCOREBOARD_URL, "_blank")}>
                  <span>§Echo Scoreboard ↗</span>
                </button>
            </div>
          </div>
        </div>
      </div>

      <div className="card-section right">
        <div className="card-setting">
          에코 세팅 슬롯 + OCR
        </div>
      </div>
    </div>
  )
}