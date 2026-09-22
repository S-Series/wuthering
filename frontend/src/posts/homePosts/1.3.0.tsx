import type { HomePost } from "./types";
import { SERVICE_NAME } from "./serviceName";
import { ReleaseNote, ReleaseSection } from "./ReleaseNote";

export const HOME_POST_1_3_0: HomePost = {
  id: 12,
  pinned: false,
  type: "notice",
  date: "2026-09-23 00:00:00",
  title: {
    kr: <span>{`Ver 1.3.0 || ${SERVICE_NAME.kr} 에코 입력 및 파티 가이드 업데이트`}</span>,
    en: <span>{`Ver 1.3.0 || ${SERVICE_NAME.en} Echo Input and Team Guide Update`}</span>,
    jp: <span>Ver 1.3.0 || 音骸入力・編成ガイドアップデート</span>,
    zh: <span>Ver 1.3.0 || 声骸录入与配队指南更新</span>,
  },
  data: {
    kr: <ReleaseNote version="Ver 1.3.0" summary="스크린샷 한 장으로 더 빠르게 완성하는 에코 데이터">
      <ReleaseSection title="스크린샷으로 에코 입력">
        <p>· 에코 데이터 관리 화면에서 게임 스크린샷을 선택해 에코 이름과 옵션을 한 번에 불러올 수 있습니다.</p>
        <p>· 인식된 결과는 적용하기 전에 미리 확인하고 직접 수정할 수 있어, 잘못 읽힌 옵션도 바로 고칠 수 있습니다.</p>
      </ReleaseSection>

      <ReleaseSection title="에코 관리 화면 개선">
        <p>· 장착 중인 에코와 예비 에코를 한 화면에서 비교하고, 드래그로 원하는 슬롯에 옮길 수 있습니다.</p>
        <p>· 선택 상태와 이동 중인 에코가 더 또렷하게 표시되며, 미리보기에서 Cv와 Av 점수를 함께 확인할 수 있습니다.</p>
      </ReleaseSection>

      <ReleaseSection title="추천 파티 정리">
        <p>· 추천 파티를 실제 3인 조합 기준으로 정리해 각 캐릭터 페이지에서 일관된 조합을 확인할 수 있습니다.</p>
        <p>· 같은 파티에 포함된 캐릭터라면 어느 캐릭터 페이지에서도 해당 조합을 찾을 수 있습니다.</p>
      </ReleaseSection>

      <ReleaseSection title="경연 데이터 추가">
        <p>· 경연의 기초 스탯, 공명 체인, 추천 무기와 에코, 주옵션과 부옵션, 목표 스탯을 추가했습니다.</p>
        <p>· 전용 무기 수많은 인도와 황천길을 밝히는 등불 세트, 추천 파티 정보도 함께 확인할 수 있습니다.</p>
      </ReleaseSection>
    </ReleaseNote>,

    en: <ReleaseNote version="Ver 1.3.0" summary="Build Echo data faster from a single screenshot">
      <ReleaseSection title="Echo Input from Screenshots">
        <p>· Select an in-game screenshot in Echo Data Management to import the Echo name and its stats at once.</p>
        <p>· Review and edit every recognized result before applying it, so incorrectly read stats can be corrected immediately.</p>
      </ReleaseSection>

      <ReleaseSection title="Improved Echo Management">
        <p>· Compare equipped and reserve Echoes on one screen, then drag them into the slot you want.</p>
        <p>· Selected and moving Echoes are easier to identify, and the preview now shows both Cv and Av scores.</p>
      </ReleaseSection>

      <ReleaseSection title="Clearer Team Recommendations">
        <p>· Recommended teams are now organized as complete three-character lineups for consistent guidance on every character page.</p>
        <p>· A lineup can be found from the page of any character included in that team.</p>
      </ReleaseSection>

      <ReleaseSection title="Jingran Data Added">
        <p>· Added Jingran's base stats, Resonance Chains, recommended weapons and Echoes, main and sub stats, and target stats.</p>
        <p>· His signature weapon Thousandfold Deliverance, Lamp of Nether Road set, and recommended teams are also available.</p>
      </ReleaseSection>
    </ReleaseNote>,

    jp: <ReleaseNote version="Ver 1.3.0" summary="スクリーンショット1枚から音骸データをすばやく作成">
      <ReleaseSection title="スクリーンショットから音骸を入力">
        <p>· 音骸データ管理画面でゲームのスクリーンショットを選択すると、音骸名とステータスをまとめて読み込めます。</p>
        <p>· 認識結果は適用前に確認・修正できるため、誤って読み取られた項目もすぐに直せます。</p>
      </ReleaseSection>

      <ReleaseSection title="音骸管理画面の改善">
        <p>· 装備中と予備の音骸を同じ画面で比較し、ドラッグして希望のスロットへ移動できます。</p>
        <p>· 選択中・移動中の音骸が分かりやすくなり、プレビューでCvとAvの両方を確認できます。</p>
      </ReleaseSection>

      <ReleaseSection title="おすすめ編成の整理">
        <p>· おすすめ編成を3人の完成した組み合わせとして整理し、各キャラクターページで一貫した編成を確認できます。</p>
        <p>· 同じ編成に含まれる、どのキャラクターのページからでもその組み合わせを確認できます。</p>
      </ReleaseSection>

      <ReleaseSection title="景燃のデータを追加">
        <p>· 景燃の基本ステータス、共鳴チェーン、おすすめ武器・音骸、メイン・サブステータス、目標ステータスを追加しました。</p>
        <p>· モチーフ武器「幾千の導き」、「冥夜を導く灯」セット、おすすめ編成も確認できます。</p>
      </ReleaseSection>
    </ReleaseNote>,

    zh: <ReleaseNote version="Ver 1.3.0" summary="通过一张截图更快完成声骸数据录入">
      <ReleaseSection title="通过截图录入声骸">
        <p>· 在声骸数据管理页面选择游戏截图，即可一次读取声骸名称和属性。</p>
        <p>· 识别结果可在应用前预览并手动修改，误识别的词条也能立即修正。</p>
      </ReleaseSection>

      <ReleaseSection title="声骸管理界面优化">
        <p>· 可在同一画面比较已装备与备用声骸，并通过拖动将其放入需要的栏位。</p>
        <p>· 选中和移动中的声骸更加醒目，预览中也会同时显示Cv与Av评分。</p>
      </ReleaseSection>

      <ReleaseSection title="推荐配队整理">
        <p>· 推荐配队现按完整三人队伍整理，在各角色页面都能查看一致的组合。</p>
        <p>· 从队伍中任意角色的页面，都可以找到该推荐组合。</p>
      </ReleaseSection>

      <ReleaseSection title="新增景燃数据">
        <p>· 新增景燃的基础属性、共鸣链、推荐武器与声骸、主副词条以及目标属性。</p>
        <p>· 同时可查看专属武器“千般渡”、“冥途夜行之灯”套装和推荐配队。</p>
      </ReleaseSection>
    </ReleaseNote>,
  },
};
