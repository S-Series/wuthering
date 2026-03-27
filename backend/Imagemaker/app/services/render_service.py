from app.core.constants import ASSET_DIR, ASSET_BASE_URL, IMAGE_VERSION
from app.renderers.profile_card import render_profile_card


def prepare_render_data(payload: dict) -> bytes:
    base = payload.get("base", {})
    lang = str(base.get("lang"))

    #region CharacterData Format ============================
    character = payload.get("character", {})
    character["lang"] = lang

    #stand image
    c_id = character.get("id") or "rover_spectro"
    character["stand_image_url"] = (
        f"{ASSET_BASE_URL}/character/{c_id}/stand.png?v={IMAGE_VERSION}"
    )

    c_constell = character.get("constell") or "0"
    character["overlay_image_url"] = (
        f"{ASSET_DIR}/ui/CharacterC{c_constell}.png"
    )

    character["constell_icon_urls"] = [
        f"{ASSET_BASE_URL}/character/{c_id}/C1.png?v={IMAGE_VERSION}",
        f"{ASSET_BASE_URL}/character/{c_id}/C2.png?v={IMAGE_VERSION}",
        f"{ASSET_BASE_URL}/character/{c_id}/C3.png?v={IMAGE_VERSION}",
        f"{ASSET_BASE_URL}/character/{c_id}/C4.png?v={IMAGE_VERSION}",
        f"{ASSET_BASE_URL}/character/{c_id}/C5.png?v={IMAGE_VERSION}",
        f"{ASSET_BASE_URL}/character/{c_id}/C6.png?v={IMAGE_VERSION}",
    ]
    
    #data icon
    ico_id1 = character.get("elementType") or "default"
    ico_id2 = character.get("mainStatType") or "default"
    ico_id3 = character.get("attackType") or "default"
    ico_id4 = character.get("weaponType") or "default"
    character["icon_image_urls"] = ([
        f"{ASSET_DIR}/ico/element/{ico_id1}.png",
        f"{ASSET_DIR}/ico/stats/{ico_id2}.webp",
        f"{ASSET_DIR}/ico/stats/{ico_id3}Bns.webp",
        f"{ASSET_DIR}/ico/weapon_type/{ico_id4}.webp",
    ])

    payload["character"] = character
    #endregion

    #region UserData Format ============================
    user = payload.get("user", {})
    user["lang"] = lang

    #text value
    server_text = (user.get("server") or "Guest") + " Server"
    user["server_text"] = server_text

    name_text = "Lv." + (str(user.get("level")) or "--") + " " + (user.get("name") or "Guest")
    user["name_text"] = name_text

    uid_text = "Uid. " + (user.get("uid") or "--- --- ---")
    user["uid_text"] = uid_text

    payload["user"] = user
    #endregion

    #region WeaponData Format ============================
    weapon = payload.get("weapon", {})
    weapon["lang"] = lang

    w_type = character.get("weaponType") or None
    w_img_key = weapon.get("imgKey") or "default"
    weapon["weapon_image_path"] = (
        f"{ASSET_DIR}/default.webp" 
        if not w_type
        else f"{ASSET_BASE_URL}/weapon/{w_type}/{w_img_key}.png?v={IMAGE_VERSION}"
    )

    weapon_stat = weapon.get("statType")
    weapon["stat_icon_paths"] = [
        f"{ASSET_DIR}/ico/stats/atk.webp",
        f"{ASSET_DIR}/ico/stats/{weapon_stat}.webp",
    ]

    weapon_stat = weapon.get("stats")
    weapon["stat_values"] = [weapon_stat[0], weapon_stat[1]+"%"]

    payload["weapon"] = weapon
    #endregion

    #region StatData Format ============================
    stats = payload.get("stats", {})
    stats["lang"] = lang

    stat_ids = stats.get("statId")
    stats["stat_icon_paths"] = [
        f"{ASSET_DIR}/ico/stats/{stat_ids[0]}.webp",
        f"{ASSET_DIR}/ico/stats/{stat_ids[1]}.webp",
        f"{ASSET_DIR}/ico/stats/{stat_ids[2]}.webp",
        f"{ASSET_DIR}/ico/stats/{stat_ids[3]}.webp",
        f"{ASSET_DIR}/ico/stats/{stat_ids[4]}.webp",
        f"{ASSET_DIR}/ico/stats/{stat_ids[5]}.webp",
        f"{ASSET_DIR}/ico/stats/{stat_ids[6]}.webp",
        f"{ASSET_DIR}/ico/stats/{stat_ids[7]}.webp",
    ]
    
    raw_harmony = stats.get("harmony") or []
    stats["harmony_items"] = []

    for item in raw_harmony:
        harmony_id = item[0] if len(item) > 0 else "default"
        harmony_text = item[1] if len(item) > 1 else ""
        harmony_count = item[2] if len(item) > 2 else "-"

        stats["harmony_items"].append({
            "icon_path": f"{ASSET_DIR}/ico/harmony/{harmony_id}.png",
            "text": f"{harmony_text} [{harmony_count}]",
        })

    payload["stats"] = stats
    #endregion

    #region NamecardData Format ============================
    namecard = payload.get("namecard", {})
    namecard["lang"] = lang

    score = namecard.get("score") or 0.0
    namecard["score_text"] = f"Tv. {score:.1f}pt"
    
    #? {c_id} is in character region
    namecard["image_path"] = f"{ASSET_BASE_URL}/character/{c_id}/art.png?v={IMAGE_VERSION}"

    icon_path = namecard.get("rank") or "default"
    namecard["rank_icon_path"] = f"{ASSET_DIR}/ico/rank/{icon_path}.png"

    payload["namecard"] = namecard
    #endregion

    #region EchoData Format ============================
    echoes = payload.get("echoes", [])

    formatted_echoes = []

    for e in echoes[:5]:
        e["lang"] = lang
        echo_id = e.get("id") or "default"
        harmony_id = e.get("harmonyId") or "default"
        rank = (e.get("rank") or "default").upper()

        if "stats" in e:
            stats = [
                {
                    "id": s.get("statId"),
                    "value": s.get("statValue"),
                    "color": s.get("statColorHex"),
                    "path": f"{ASSET_DIR}/ico/stats/{s.get('statId') or 'default'}.webp",
                }
                for s in e.get("stats", [])
            ]
        else:
            stat_ids = e.get("statId") or []
            stat_values = e.get("statValue") or []
            stat_colors = e.get("statColorHex") or []

            stats = [
                {
                    "id": sid,
                    "value": val,
                    "color": col,
                    "path": f"{ASSET_DIR}/ico/stats/{sid or 'default'}.webp",
                }
                for sid, val, col in zip(stat_ids, stat_values, stat_colors)
            ]

        scores = [f"{s} pt" for s in (e.get("scores") or [])]

        formatted_echoes.append({
            "id": echo_id,

            "image": f"{ASSET_BASE_URL}/ico/echos/{echo_id}.webp?v={IMAGE_VERSION}",

            "harmony_image": f"{ASSET_DIR}/ico/harmony/{harmony_id}.png",

            "rank_image": f"{ASSET_DIR}/ico/rank/{rank}.png",

            "stats": stats,

            "scores": scores,
        })

    # 5칸 패딩
    while len(formatted_echoes) < 5:
        formatted_echoes.append({
            "id": "default",
            "image": f"{ASSET_BASE_URL}/ico/echos/default.webp?v={IMAGE_VERSION}",
            "harmony_image": f"{ASSET_BASE_URL}/ico/harmony/default.webp?v={IMAGE_VERSION}",
            "rank_image": "assets/rank/default.webp",
            "stats": [],
            "scores": [],
        })

    payload["echoes"] = formatted_echoes
    #endregion

    return render_profile_card(payload)