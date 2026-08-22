import type { HomePost } from "./types";
import { SERVICE_NAME } from "./serviceName";
import { ReleaseNote, ReleaseSection } from "./ReleaseNote";

export const HOME_POST_1_0_0: HomePost = {
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
};
