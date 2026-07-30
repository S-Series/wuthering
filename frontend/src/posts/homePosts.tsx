import type { LangType } from "@/stores/appStore";

export type LocaleReactNode = Record<LangType, React.ReactNode>;

export type HomePost = {
  id: number;
  pinned?: boolean;
  type: "update" | "notice" | "event";
  date: string;
  title: LocaleReactNode;
  data: LocaleReactNode;
};

const SERVICE_NAME: LocaleReactNode = {
  kr: "띵데브",
  en: "WuWa DEV",
  jp: "",
  zh: "",
};

function ReleaseNote({
  children,
  summary,
  version = "Ver 1.0.0",
}: {
  children: React.ReactNode;
  summary: string;
  version?: string;
}) {
  return (
    <div className="home-post-detail-slot release-note-v1">
      <div className="release-note-hero">
        <span>{version}</span>
        <strong>{summary}</strong>
      </div>
      <div className="release-note-grid">{children}</div>
    </div>
  );
}

function ReleaseSection({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <section className="release-note-section">
      <h4>{title}</h4>
      <div>{children}</div>
    </section>
  );
}

export const HOME_POSTS: HomePost[] = [
  {
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
  },
  {
    id: 7,
    pinned: false,
    type: "notice",
    date: "2026-06-26 00:00:00",
    title: {
      kr: <span>{`Ver 1.0.0 || ${SERVICE_NAME.kr} 정식 업데이트 내역`}</span>,
      en: <span>{`Ver 1.0.0 || ${SERVICE_NAME.en} Official Update Notes`}</span>,
      jp: <span>{`Ver 1.0.0 || ${SERVICE_NAME.jp} 正式アップデート内容`}</span>,
      zh: <span>{`Ver 1.0.0 || ${SERVICE_NAME.zh} 正式更新内容`}</span>,
    },
    data: {
      kr: <ReleaseNote summary="스펙카드 생성기의 정식 릴리즈">
        <ReleaseSection title="정식 버전 전환">
        <p>· 띵데브 스펙카드 생성기가 Ver 1.0.0으로 전환되었습니다.</p>
        <p>· 카드 작성, 에코 관리, OCR 입력, 클라우드 저장 흐름을 정식 기능으로 정리했습니다.</p>
        </ReleaseSection>

        <ReleaseSection title="클라우드 동기화">
        <p>· 캐릭터 세팅 데이터를 클라우드에 업로드하고 내려받을 수 있습니다.</p>
        <p>· 내려받기 시 현재 캐릭터만 적용하거나, 모든 캐릭터 데이터를 한 번에 적용할 수 있습니다.</p>
        <p>· 사이드바 하단에도 클라우드 동기화 버튼을 추가했습니다.</p>
        </ReleaseSection>

        <ReleaseSection title="에코 데이터 관리">
        <p>· 에코 목록을 착용 슬롯 5개와 예비 슬롯 5개로 나누어 관리할 수 있습니다.</p>
        <p>· 드래그 앤 드롭으로 착용 / 예비슬롯 순서를 변경할 수 있습니다.</p>
        <p>· 에코 데이터 입력창의 placeholder와 주옵션 값 계산을 정리했습니다.</p>
        </ReleaseSection>

        <ReleaseSection title="OCR 이미지 입력">
        <p>· 이미지 입력창을 슬롯 선택, 이미지/OCR 결과, 에코 데이터 편집 영역으로 재구성했습니다.</p>
        <p>· 선택한 슬롯의 미리보기가 즉시 반영되도록 수정했습니다.</p>
        <p>· 통합 OCR 서버 기준으로 health / wake 흐름을 정리했습니다.</p>
        </ReleaseSection>

        <ReleaseSection title="카드 사용성 개선">
        <p>· 캐릭터/무기/에코 영역 클릭으로 각 데이터 관리창을 바로 열 수 있습니다.</p>
        <p>· 캐릭터 카드의 6개 공명 체인 버튼으로 돌파 단계를 바로 조정할 수 있습니다.</p>
        <p>· 스탯 hover 시 관련 에코 부옵션이 강조되며, 공격력/HP/방어력은 고정값과 % 옵션을 함께 강조합니다.</p>
        <p>· CV / AV 점수 안내와 카드 도움말 단계를 세분화했습니다.</p>
        </ReleaseSection>

        <ReleaseSection title="시스템 개선">
        <p>· 로그인 세션 확인을 최상위 Provider로 정리해 페이지 이동 시 불필요한 로딩과 요청을 줄였습니다.</p>
        <p>· Navbar와 Profile 화면에서 캐시된 사용자 정보를 먼저 보여주도록 개선했습니다.</p>
        </ReleaseSection>
      </ReleaseNote>,

      en: <ReleaseNote summary="Official release of the stat card generator">
        <ReleaseSection title="Official Release">
        <p>· The WuWa DEV stat card generator has moved to Ver 1.0.0.</p>
        <p>· Card editing, Echo management, OCR input, and cloud saving are now organized as official features.</p>
        </ReleaseSection>

        <ReleaseSection title="Cloud Sync">
        <p>· Character setup data can now be uploaded to and downloaded from the cloud.</p>
        <p>· Downloads can replace only the current character or all character data at once.</p>
        <p>· A Cloud Sync button has been added to the bottom of the sidebar.</p>
        </ReleaseSection>

        <ReleaseSection title="Echo Data Management">
        <p>· Echoes are now managed as 5 equipped slots and 5 spare slots.</p>
        <p>· Equipped and spare slot order can be changed with drag and drop.</p>
        <p>· Placeholders and main stat value handling in the Echo editor have been cleaned up.</p>
        </ReleaseSection>

        <ReleaseSection title="OCR Image Input">
        <p>· The image input panel now separates slot selection, image/OCR results, and Echo editing.</p>
        <p>· The selected slot preview now updates immediately.</p>
        <p>· Health and wake flows have been organized around the unified OCR server.</p>
        </ReleaseSection>

        <ReleaseSection title="Card Usability">
        <p>· Character, weapon, and Echo areas can open their related management panels directly.</p>
        <p>· The six resonance chain buttons on the character card can adjust breakthroughs directly.</p>
        <p>· Hovering a stat highlights matching Echo substats. ATK, HP, and DEF now highlight both flat and percent options.</p>
        <p>· CV / AV score hints and the card guide flow have been expanded.</p>
        </ReleaseSection>

        <ReleaseSection title="System Improvements">
        <p>· Login session handling has been moved to a top-level provider to reduce repeated loading and requests.</p>
        <p>· Navbar and Profile now show cached user data first.</p>
        </ReleaseSection>
      </ReleaseNote>,

      jp: <ReleaseNote summary="ステータスカード生成機能の正式リリース">
        <ReleaseSection title="正式版への移行">
        <p>· ステータスカード生成機能を Ver 1.0.0 に更新しました。</p>
        <p>· カード編集、エコー管理、OCR入力、クラウド保存の流れを正式機能として整理しました。</p>
        </ReleaseSection>

        <ReleaseSection title="クラウド同期">
        <p>· キャラクター設定データをクラウドへアップロード、またはダウンロードできます。</p>
        <p>· 現在のキャラクターのみ、または全キャラクターデータをまとめて適用できます。</p>
        <p>· サイドバー下部にもクラウド同期ボタンを追加しました。</p>
        </ReleaseSection>

        <ReleaseSection title="エコーデータ管理">
        <p>· エコーを装備スロット5個と予備スロット5個に分けて管理できます。</p>
        <p>· ドラッグ＆ドロップで装備 / 予備スロットの順番を変更できます。</p>
        <p>· エコー編集画面のプレースホルダーとメインステータス値の処理を整理しました。</p>
        </ReleaseSection>

        <ReleaseSection title="OCR画像入力">
        <p>· 画像入力画面をスロット選択、画像/OCR結果、エコー編集領域に再構成しました。</p>
        <p>· 選択したスロットのプレビューがすぐ反映されるよう修正しました。</p>
        <p>· 統合OCRサーバー基準で health / wake の流れを整理しました。</p>
        </ReleaseSection>

        <ReleaseSection title="カード操作性">
        <p>· キャラクター、武器、エコー領域から関連管理画面を直接開けます。</p>
        <p>· キャラクターカード上の6つの共鳴チェーンボタンで突破段階を直接調整できます。</p>
        <p>· ステータスにマウスを乗せると対応するエコーサブステータスを強調表示します。</p>
        <p>· CV / AV の説明とカードヘルプの段階を拡張しました。</p>
        </ReleaseSection>
      </ReleaseNote>,

      zh: <ReleaseNote summary="属性卡生成器正式版本">
        <ReleaseSection title="正式版本">
        <p>· 属性卡生成器已更新至 Ver 1.0.0。</p>
        <p>· 卡片编辑、声骸管理、OCR 输入与云端保存流程已整理为正式功能。</p>
        </ReleaseSection>

        <ReleaseSection title="云端同步">
        <p>· 现在可以上传或下载角色配置数据。</p>
        <p>· 下载时可只替换当前角色，也可以一次性应用所有角色数据。</p>
        <p>· 侧边栏底部新增了云端同步按钮。</p>
        </ReleaseSection>

        <ReleaseSection title="声骸数据管理">
        <p>· 声骸现在分为5个装备槽和5个备用槽管理。</p>
        <p>· 可通过拖拽调整装备 / 备用槽顺序。</p>
        <p>· 整理了声骸编辑器的占位文本与主词条数值处理。</p>
        </ReleaseSection>

        <ReleaseSection title="OCR 图片输入">
        <p>· 图片输入界面已重构为槽位选择、图片/OCR结果、声骸编辑区域。</p>
        <p>· 所选槽位的预览现在会立即更新。</p>
        <p>· 基于统一 OCR 服务器整理了 health / wake 流程。</p>
        </ReleaseSection>

        <ReleaseSection title="卡片易用性">
        <p>· 角色、武器、声骸区域可直接打开对应管理窗口。</p>
        <p>· 角色卡上的6个共鸣链按钮可直接调整突破阶段。</p>
        <p>· 鼠标悬停属性时会高亮对应声骸副词条，攻击、生命、防御会同时高亮固定值与百分比。</p>
        <p>· 扩展了 CV / AV 说明与卡片帮助流程。</p>
        </ReleaseSection>
      </ReleaseNote>,
    },
  },
  {
    id: 6,
    pinned: false,
    type: "notice",
    date: "2026-06-15 00:12:30",
    title: {
      kr: <span>{`Ver 0.9.3 || ${SERVICE_NAME.kr} 업데이트 내역`}</span>,
      en: <span>{`Ver 0.9.3 || ${SERVICE_NAME.en} Update Notes`}</span>,
      jp: <span>{`Ver 0.9.3 || ${SERVICE_NAME.jp} アップデート内容`}</span>,
      zh: <span>{`Ver 0.9.3 || ${SERVICE_NAME.zh} 更新内容`}</span>,
    },
    data: {
      kr: <div className="home-post-detail-slot">
        <span className="subtitle">§ 기능추가</span>
        <p>· 스펙카드 생성 페이지 하단에, 육성 가이드가 추가되었습니다</p>
        <p className="indent">아직 데이터가 정리중이기에, 잘못된 데이터가 있을 수 있습니다.</p>
        <p className="indent">이 점, 유의하시고 사용자분들의 너그러운 양해 바랍니다.</p>
        <br/>
        <span className="subtitle">§ 데이터 추가</span>
        <p>· 3.4버전의 루시, 레베카, 루실라 등 데이터가 추가되었습니다.</p>
        <br/>
        <span className="subtitle">§ 기타 변경사항</span>
        <p>· 디자인 및 배치를 전반적으로 수정하고 있습니다.</p>
        <p className="indent">조금 더 세련되고 깔끔하게 바꾸고자 하고 있습니다.</p>
        <p className="indent">피드백은 언제든지 메일을 통해 알려주시기 바랍니다.</p>
      </div>,

      en: <div className="home-post-detail-slot">
        <span className="subtitle">§ Bug Fix</span>
        <p>· Fixed an issue where, upon character breakthrough, the lowered</p>
        <p className="indent">Resonance Efficiency requirement was not separately reflected in the score.</p>
      </div>,

      jp: <div className="home-post-detail-slot">
        <span className="subtitle">§ 不具合修正</span>
        <p>· キャラクター突破時に、共鳴効率の必要値が下がることが</p>
        <p className="indent">スコアに個別で反映されていなかった不具合を修正しました。</p>
      </div>,

      zh: <div className="home-post-detail-slot">
        <span className="subtitle">§ 问题修复</span>
        <p>· 修复了角色突破时，共鸣效率需求降低的效果</p>
        <p className="indent">没有单独反映到评分中的问题。</p>
      </div>,
    },
  },
  {
    id: 5,
    pinned: false,
    type: "notice",
    date: "2026-04-14 15:32:54",
    title: {
      kr: <span>{`Ver 0.9.2 || ${SERVICE_NAME.kr} 업데이트 내역`}</span>,
      en: <span>{`Ver 0.9.2 || ${SERVICE_NAME.en} Update Notes`}</span>,
      jp: <span>{`Ver 0.9.2 || ${SERVICE_NAME.jp} アップデート内容`}</span>,
      zh: <span>{`Ver 0.9.2 || ${SERVICE_NAME.zh} 更新内容`}</span>,
    },
    data: {
      kr: <div className="home-post-detail-slot">
        <span className="subtitle">§ 버그 수정</span>
        <p>· 캐릭터 돌파시, 공명효율 요구치가 낮아지는게</p>
        <p className="indent">점수에 별도로 적용되지 않던 오류를 수정하였습니다.</p>
      </div>,

      en: <div className="home-post-detail-slot">
        <span className="subtitle">§ Bug Fix</span>
        <p>· Fixed an issue where, upon character breakthrough, the lowered</p>
        <p className="indent">Resonance Efficiency requirement was not separately reflected in the score.</p>
      </div>,

      jp: <div className="home-post-detail-slot">
        <span className="subtitle">§ 不具合修正</span>
        <p>· キャラクター突破時に、共鳴効率の必要値が下がることが</p>
        <p className="indent">スコアに個別で反映されていなかった不具合を修正しました。</p>
      </div>,

      zh: <div className="home-post-detail-slot">
        <span className="subtitle">§ 问题修复</span>
        <p>· 修复了角色突破时，共鸣效率需求降低的效果</p>
        <p className="indent">没有单独反映到评分中的问题。</p>
      </div>,
    },
  },
  {
    id: 4,
    pinned: false,
    type: "notice",
    date: "2026-04-09 15:40:36",
    title: {
      kr: <span>{`Ver 0.9.1 || ${SERVICE_NAME.kr} 업데이트 내역`}</span>,
      en: <span>{`Ver 0.9.1 || ${SERVICE_NAME.en} Update Notes`}</span>,
      jp: <span>{`Ver 0.9.1 || ${SERVICE_NAME.jp} アップデート内容`}</span>,
      zh: <span>{`Ver 0.9.1 || ${SERVICE_NAME.zh} 更新内容`}</span>,
    },
    data: {
      kr: <div className="home-post-detail-slot">
        <span className="subtitle">§ 기능 개선</span>
        <p>· 점수 시스템을 개선하였습니다.</p>
        <p>· 이제 캐릭터 점수는 <em>실제 DPS</em>를 어느정도 반영합니다.</p>
        <p>· 캐릭터별로 <em>공효 요구치</em> 및 <em>에코 주옵션</em> 관련 보정이 들어갑니다.</p>
      </div>,

      en: <div className="home-post-detail-slot">
        <span className="subtitle">§ Feature Improvements</span>
        <p>· The scoring system has been improved.</p>
        <p>· Character scores now reflect <em>actual DPS</em> to some extent.</p>
        <p>· Adjustments are now applied based on each character’s <em>required ER</em> and <em>Echo main stats</em>.</p>
      </div>,

      jp: <div className="home-post-detail-slot">
        <span className="subtitle">§ 機能改善</span>
        <p>・スコアシステムを改善しました。</p>
        <p>・キャラクタースコアが、ある程度 <em>実際のDPS</em> を反映するようになりました。</p>
        <p>・キャラクターごとに <em>必要共鳴効率</em> と <em>エコーのメインステータス</em> に関する補正が適用されます。</p>
      </div>,

      zh: <div className="home-post-detail-slot">
        <span className="subtitle">§ 功能优化</span>
        <p>· 评分系统已优化。</p>
        <p>· 角色评分现在会在一定程度上反映 <em>实际DPS</em>。</p>
        <p>· 现已根据不同角色的 <em>共鸣效率需求</em> 与 <em>声骸主词条</em> 进行修正。</p>
      </div>,
    },
  },
  {
    id: 3,
    pinned: false,
    type: "notice",
    date: "2026-04-05 16:27:25",
    title: {
      kr: <span>{`Ver 0.9 || ${SERVICE_NAME.kr} 업데이트 내역`}</span>,
      en: <span>{`Ver 0.9 || ${SERVICE_NAME.en} Update Notes`}</span>,
      jp: <span>{`Ver 0.9 || ${SERVICE_NAME.jp} アップデート内容`}</span>,
      zh: <span>{`Ver 0.9 || ${SERVICE_NAME.zh} 更新内容`}</span>,
    },
    data: {
      kr: <div className="home-post-detail-slot">
        <span className="subtitle start">§ 버그 수정</span>
        <p>· 일부 잘못된 옵션들의 수치를 수정하였습니다.</p>
        <p>· 일부 캐릭터에 유효옵션이 잘못 적용되던 문제를 해결했습니다.</p>
        <p>· 에코 관리에서, 옵션이 제대로 적용되지 않던 오류를 수정했습니다.</p>

        <span className="subtitle">§ 기능 개선</span>
        <p>· OCR 서버 안정화를 진행하였습니다.</p>
        <p>· 이제 스텟카드 <em>이미지를 생성 및 다운로드</em> 할 수 있습니다.</p>
        <p>· 이제 에코 선택에서 에코명으로 검색할 수 있습니다.</p>
        <p>· 이제 캐릭터 부옵션 점수가 실제 DPS를 약간 반영합니다.</p>

        <span className="subtitle">§ 그 외 변경내역</span>
        <p>· 홈화면 공지사항이 더욱 이뻐졌습니다 <em>지금 보시는 것 처럼요!</em></p>
        <p>· 에코 데이터 관리슬롯의 ui가 변경되었습니다.</p>
        <p>· 부하 및 비용문제로 인해 이미지 생성 쿨다운이 증가했습니다.</p>

        <span className="subtitle">§ 업데이트 예정 목록</span>
        <p>· 멤버쉽 및 캐릭터 세팅 클라우드 서비스 제공 예정</p>
        <p>· 공명 효율관련 점수 로직 최적화 예정</p>
        <p>· 캐릭터별 에코세트, 장비, 주옵션 추천순 정렬</p>
        <p>· 캐릭터별 스텟 요구치 표기 예정 (이잘키 참고 예정)</p>
        <p>· 캐릭터 목록에서 검색 및 필터기능 추가</p>
      </div>,

      en: <div className="home-post-detail-slot">
        <span className="subtitle start">§ Bug Fixes</span>
        <p>· Corrected some incorrect option values.</p>
        <p>· Fixed an issue where valid options were applied incorrectly to some characters.</p>
        <p>· Fixed an error where options were not being applied properly in Echo management.</p>

        <span className="subtitle">§ Improvements</span>
        <p>· Improved OCR server stability.</p>
        <p>· You can now <em>generate and download</em> stat card images.</p>
        <p>· You can now search by Echo name in the Echo selection menu.</p>
        <p>· Character substat scores now slightly reflect actual DPS.</p>

        <span className="subtitle">§ Other Changes</span>
        <p>· The home screen notices look much better now <em>just like what you're seeing right now!</em></p>
        <p>· The UI of the Echo data management slot has been updated.</p>
        <p>· Due to load and cost issues, the image generation cooldown has been increased.</p>

        <span className="subtitle">§ Planned Updates</span>
        <p>· Membership and cloud service for character settings</p>
        <p>· Score logic optimization for Resonance efficiency</p>
        <p>· Sorting recommendations for Echo sets, weapons, and main stats by character</p>
        <p>· Character stat requirement display planned</p>
        <p>· Search and filter functions will be added to the character list</p>
      </div>,

      jp: <div className="home-post-detail-slot">
        <span className="subtitle start">§ バグ修正</span>
        <p>· 一部の誤っていたオプション数値を修正しました。</p>
        <p>· 一部キャラクターに有効オプションが正しく適用されていなかった問題を修正しました。</p>
        <p>· エコー管理でオプションが正常に適用されなかった不具合を修正しました。</p>

        <span className="subtitle">§ 機能改善</span>
        <p>· OCRサーバーの安定化を行いました。</p>
        <p>· ステータスカード画像の<em>生成とダウンロード</em>ができるようになりました。</p>
        <p>· エコー選択でエコー名検索ができるようになりました。</p>
        <p>· キャラクターのサブオプションスコアが実際のDPSを少し反映するようになりました。</p>

        <span className="subtitle">§ その他の変更点</span>
        <p>· ホーム画面のお知らせ表示がさらに見やすくなりました <em>今見えているこんな感じです！</em></p>
        <p>· エコーデータ管理スロットのUIを変更しました。</p>
        <p>· 負荷とコストの都合により、画像生成のクールダウンが長くなりました。</p>

        <span className="subtitle">§ 今後のアップデート予定</span>
        <p>· メンバーシップおよびキャラクター設定のクラウドサービス対応予定</p>
        <p>· 共鳴効率関連のスコアロジック最適化予定</p>
        <p>· キャラクター別のエコーセット、装備、メインオプションおすすめ順ソート</p>
        <p>· キャラクター別の必要ステータス表示予定</p>
        <p>· キャラクター一覧に検索・フィルター機能追加予定</p>
      </div>,

      zh: <div className="home-post-detail-slot">
        <span className="subtitle start">§ 错误修复</span>
        <p>· 修正了部分错误的词条数值。</p>
        <p>· 修复了部分角色的有效词条被错误应用的问题。</p>
        <p>· 修复了在声骸管理中词条无法正常生效的问题。</p>

        <span className="subtitle">§ 功能改进</span>
        <p>· 提升了 OCR 服务器的稳定性。</p>
        <p>· 现在可以<em>生成并下载</em>属性卡图片了。</p>
        <p>· 现在可以在声骸选择中通过声骸名称进行搜索。</p>
        <p>· 现在角色副词条评分会稍微反映实际 DPS。</p>

        <span className="subtitle">§ 其他变更</span>
        <p>· 首页公告现在更好看了 <em>就像你现在看到的一样！</em></p>
        <p>· 声骸数据管理槽位的 UI 已更新。</p>
        <p>· 由于负载与成本问题，图片生成功能的冷却时间增加了。</p>

        <span className="subtitle">§ 计划更新内容</span>
        <p>· 计划提供会员功能及角色配置云服务</p>
        <p>· 计划优化与共鸣效率相关的评分逻辑</p>
        <p>· 按角色推荐排序声骸套装、装备与主词条</p>
        <p>· 计划显示各角色所需属性</p>
        <p>· 角色列表将增加搜索与筛选功能</p>
      </div>
    },
  },
  {
    id: 2,
    pinned: false,
    type: "notice",
    date: "2026-03-14 16:15:55",
    title: {
      kr: <span>{`Ver 0.8 || ${SERVICE_NAME.kr} 업데이트 내역`}</span>,
      en: <span>{`Ver 0.8 || ${SERVICE_NAME.en} Update Notes`}</span>,
      jp: <span>{`Ver 0.8 || ${SERVICE_NAME.jp} アップデート内容`}</span>,
      zh: <span>{`Ver 0.8 || ${SERVICE_NAME.zh} 更新内容`}</span>,
    },
    data: {
      kr: `§ 이제 홈 화면의 공식 유튜브영상을 재생할 수 있습니다.
§ 일부 점수계산에서 오류를 수정하였습니다.
§ 로그인/회원가입 기능이 활성화 되었습니다.`,
      en: `§ You can now play the official YouTube video on the home screen.
§ Fixed some errors in score calculation.
§ Login and sign-up features have been enabled.`,
      jp: `§ ホーム画面で公式YouTube動画を再生できるようになりました。
§ 一部のスコア計算の不具合を修正しました。
§ ログイン / 会員登録機能が有効になりました。`,
      zh: `§ 现在可以在首页播放官方 YouTube 视频了。
§ 修复了部分分数计算错误。
§ 登录 / 注册功能现已启用。`,
    },
  },
  {
    id: 1,
    pinned: false,
    type: "notice",
    date: "2026-03-13 17:56:28",
    title: {
      kr: `${SERVICE_NAME.kr} 정식 오픈까지 얼마 남지 않았습니다!`,
      en: `We're Getting Close to the Official Launch of ${SERVICE_NAME.en}!`,
      jp: `${SERVICE_NAME.jp} 正式オープンまであとわずかです！`,
      zh: `${SERVICE_NAME.zh} 即将正式上线！`,
    },
    data: {
      kr: `${SERVICE_NAME.kr}를 찾아주신 여러분께 진심으로 감사드립니다.

현재 로그인 및 회원가입 기능, 이미지 생성 기능을 구현 중이며
일부 UI/UX 최적화 작업도 함께 진행되고 있습니다.

정식 오픈이 얼마 남지 않았습니다.
빠른 시일내에 다시 찾아뵙도록 노력하겠습니다.`,

      en: `Thank you very much for visiting ${SERVICE_NAME.en}.

We are currently implementing the login/signup system,
the image generation feature, and making several UI/UX improvements.

The official launch is just around the corner.
We look forward to welcoming you again very soon.`,

      jp: `${SERVICE_NAME.jp}をご利用いただき、誠にありがとうございます。

現在、ログイン・会員登録機能や画像生成機能の実装、
および一部UI/UXの最適化作業を進めております。

正式オープンまであとわずかです。
もう少しだけお待ちいただけますと幸いです。`,

      zh: `感谢您访问 ${SERVICE_NAME.zh}。

目前我们正在开发登录/注册功能、图片生成功能，
同时也在进行部分 UI/UX 的优化。

正式上线已经近在眼前。
请再稍作等待，我们会尽快与大家见面。`,
    },
  },
];
