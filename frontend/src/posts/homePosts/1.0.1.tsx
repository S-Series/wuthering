import type { HomePost } from "./types";
import { SERVICE_NAME } from "./serviceName";
import { ReleaseNote, ReleaseSection } from "./ReleaseNote";

export const HOME_POST_1_0_1: HomePost = {
  id: 8,
  pinned: false,
  type: "notice",
  date: "2026-07-30 12:36:10",
  title: {
    kr: <span>{`Ver 1.0.1 || ${SERVICE_NAME.kr} 콘텐츠 정보 업데이트`}</span>,
    en: <span>{`Ver 1.0.1 || ${SERVICE_NAME.en} Content Update`}</span>,
    jp: <span>Ver 1.0.1 || コンテンツ情報アップデート</span>,
    zh: <span>Ver 1.0.1 || 内容信息更新</span>,
  },
  data: {
    kr: <ReleaseNote version="Ver 1.0.1" summary="주간 콘텐츠와 파티 가이드를 더 정확하게">
      <ReleaseSection title="주간 활약도">
        <p>· 홈 화면의 인게임 정보에 주간 활약도 일정을 추가했습니다.</p>
        <p>· 주간 활약도는 매주 월요일 오전 4시에 자동으로 갱신됩니다.</p>
        <p>· 다음 갱신까지 남은 시간을 별도의 일정 등록 없이 계속 확인할 수 있습니다.</p>
      </ReleaseSection>

      <ReleaseSection title="파티 가이드">
        <p>· 암흑 이상효과 파티 분류를 새롭게 추가했습니다.</p>
        <p>· 파티 유형을 역할별로 정리해 추천 조합을 더 쉽게 구분할 수 있도록 개선했습니다.</p>
      </ReleaseSection>

      <ReleaseSection title="다국어 및 일정 정리">
        <p>· 파티 유형 명칭을 한국어, 영어, 일본어, 중국어에 맞게 보완했습니다.</p>
        <p>· 역경의 탑, 죽음의 노래와 바닷속 폐허, 종말 매트릭스 일정은 기존과 동일하게 유지됩니다.</p>
      </ReleaseSection>
    </ReleaseNote>,

    en: <ReleaseNote version="Ver 1.0.1" summary="Clearer weekly content and party guides">
      <ReleaseSection title="Weekly Activity">
        <p>· Weekly Activity has been added to the in-game information section on the home page.</p>
        <p>· Weekly Activity now refreshes automatically every Monday at 4:00 AM.</p>
        <p>· The time remaining until the next refresh stays available without manual schedule updates.</p>
      </ReleaseSection>

      <ReleaseSection title="Party Guide">
        <p>· A new Havoc Anomaly Party category has been added.</p>
        <p>· Party types are now grouped by role so recommended teams are easier to identify.</p>
      </ReleaseSection>

      <ReleaseSection title="Localization and Schedules">
        <p>· Party type names have been updated in Korean, English, Japanese, and Chinese.</p>
        <p>· Tower of Adversity, Whimpering Wastes, and Endstate Matrix schedules remain unchanged.</p>
      </ReleaseSection>
    </ReleaseNote>,

    jp: <ReleaseNote version="Ver 1.0.1" summary="週間コンテンツと編成ガイドをより分かりやすく">
      <ReleaseSection title="週間活躍度">
        <p>· ホーム画面のゲーム内情報に週間活躍度を追加しました。</p>
        <p>· 週間活躍度は毎週月曜日の午前4時に自動更新されます。</p>
        <p>· 日程を手動で追加しなくても、次回更新までの残り時間を確認できます。</p>
      </ReleaseSection>

      <ReleaseSection title="編成ガイド">
        <p>· 消滅異常編成カテゴリを新たに追加しました。</p>
        <p>· おすすめ編成を判別しやすいよう、編成タイプを役割別に整理しました。</p>
      </ReleaseSection>

      <ReleaseSection title="多言語と日程の整理">
        <p>· 編成タイプの名称を韓国語、英語、日本語、中国語で更新しました。</p>
        <p>· 逆境深塔、死の歌が纏う海の廃墟、終焉マトリクスの日程に変更はありません。</p>
      </ReleaseSection>
    </ReleaseNote>,

    zh: <ReleaseNote version="Ver 1.0.1" summary="让每周内容与配队指南更加清晰">
      <ReleaseSection title="每周活跃度">
        <p>· 首页的游戏内信息中新增了每周活跃度。</p>
        <p>· 每周活跃度将在每周一凌晨4点自动刷新。</p>
        <p>· 无需手动登记日程，也可以持续查看距离下次刷新的剩余时间。</p>
      </ReleaseSection>

      <ReleaseSection title="配队指南">
        <p>· 新增了湮灭异常队分类。</p>
        <p>· 按照队伍定位整理了配队类型，让推荐阵容更容易辨认。</p>
      </ReleaseSection>

      <ReleaseSection title="多语言与日程整理">
        <p>· 更新了配队类型的韩语、英语、日语和中文名称。</p>
        <p>· 逆境深塔、冥歌海墟与终焉矩阵的日程保持不变。</p>
      </ReleaseSection>
    </ReleaseNote>,
  },
};
