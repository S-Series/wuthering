import type { HomePost } from "./types";
import { ReleaseNote, ReleaseSection } from "./ReleaseNote";

export const HOME_POST_1_4_0: HomePost = {
  id: 13,
  pinned: false,
  type: "notice",
  date: "2026-10-01 00:00:00",
  title: {
    kr: <span>Ver 1.4.0 || 명조 3.7 데이터 업데이트 완료 및 에코 OCR 개선</span>,
    en: <span>Ver 1.4.0 || Wuthering Waves 3.7 Data Update and Echo OCR Improvements</span>,
    jp: <span>Ver 1.4.0 || 鳴潮3.7データ更新完了・音骸OCR改善</span>,
    zh: <span>Ver 1.4.0 || 鸣潮3.7数据更新完成与声骸OCR优化</span>,
  },
  data: {
    kr: <ReleaseNote version="Ver 1.4.0" summary="새로운 캐릭터와 에코를 만나고, 여러 스크린샷을 한 번에 입력하세요">
      <ReleaseSection title="명조 3.7 데이터 업데이트 완료">
        <p>· 여우의 별자리와 쇄명, 두 캐릭터의 전용 무기 데이터를 추가했습니다.</p>
        <p>· 캐릭터별 기초 스탯, 공명 체인, 추천 무기와 에코, 목표 스탯을 확인하고 나만의 세팅을 만들어 보세요.</p>
      </ReleaseSection>
      <ReleaseSection title="신규 하모니와 에코 추가">
        <p>· 꿈으로 세상을 비추는 마음, 거울 그림자에 번개가 스치는 찰나, 추억에 붉게 물든 꽃 하모니 3종을 반영했습니다.</p>
        <p>· 새로 등장한 에코와 기존에 누락된 일반 뇌운의 비늘을 포함해 에코 7종을 추가하고, 기존 에코의 선택 가능한 하모니도 갱신했습니다.</p>
      </ReleaseSection>
      <ReleaseSection title="여러 이미지 순차 OCR">
        <p>· 에코 데이터 관리의 ‘이미지 여러장 입력’에서 여러 스크린샷을 선택하거나 끌어놓을 수 있습니다.</p>
        <p>· ‘순차 OCR 시작’을 누르면 이미지를 한 장씩 인식하며, 각 이미지의 진행 상태와 성공·실패 여부를 확인할 수 있습니다.</p>
        <p>· 인식 결과는 선택한 에코 슬롯부터 이미지 순서대로 적용됩니다. 선택한 슬롯에 따라 입력 가능한 이미지 수가 달라지며, 최대 10장까지 입력할 수 있습니다.</p>
      </ReleaseSection>
      <ReleaseSection title="OCR 사용 전 확인해 주세요">
        <p>· 한 장씩 입력할 때는 인식된 에코 이름과 옵션을 미리보기와 수정란에서 확인한 뒤 적용할 수 있습니다.</p>
        <p>· 일괄 적용은 해당 슬롯의 기존 에코 데이터를 변경하므로 시작 슬롯과 이미지 순서를 먼저 확인해 주세요. 잘못 인식된 옵션은 적용 후 에코 데이터에서 수정할 수 있습니다.</p>
        <p>· 이미지 상태에 따라 인식 오류가 발생할 수 있습니다. 처음 요청할 때는 서버 준비로 시간이 걸릴 수 있으며, 실패한 이미지는 다시 요청할 수 있습니다.</p>
      </ReleaseSection>
    </ReleaseNote>,
    en: <ReleaseNote version="Ver 1.4.0" summary="Explore new characters and Echoes, and import multiple screenshots together">
      <ReleaseSection title="Wuthering Waves 3.7 Data Update Complete">
        <p>· Added Hsin, Suoming, and their signature weapons.</p>
        <p>· Check their base stats, Resonance Chains, recommended weapons and Echoes, and target stats to plan your builds.</p>
      </ReleaseSection>
      <ReleaseSection title="New Sonata Effects and Echoes">
        <p>· Added Heart of Sworn Vigil, Flash of Electric Reflection, and Flower of Tinged Yearning.</p>
        <p>· Added seven missing Echoes, including the new releases and regular Thundering Mephis, and updated available Sonata Effects for existing Echoes.</p>
      </ReleaseSection>
      <ReleaseSection title="Sequential OCR for Multiple Images">
        <p>· Open ‘Add Multiple Images’ in Echo Data Management to select or drop multiple screenshots.</p>
        <p>· ‘Start Sequential OCR’ processes images one at a time and shows each image's progress and success or failure.</p>
        <p>· Results are applied in image order, starting from the selected Echo slot. The image limit depends on the starting slot, with up to ten images supported.</p>
      </ReleaseSection>
      <ReleaseSection title="Before Applying OCR Results">
        <p>· For single-image input, review and edit the recognized Echo name and stats before applying them.</p>
        <p>· Batch application changes existing Echo data in the destination slots. Check the starting slot and image order first; incorrect stats can be edited afterward.</p>
        <p>· Recognition may vary with image quality. The first request may take longer while the server starts, and failed images can be retried.</p>
      </ReleaseSection>
    </ReleaseNote>,
    jp: <ReleaseNote version="Ver 1.4.0" summary="新しいキャラクターと音骸をチェックし、複数のスクリーンショットをまとめて入力">
      <ReleaseSection title="鳴潮3.7データ更新完了">
        <p>· 新キャラクター2名と、それぞれのモチーフ武器のデータを追加しました。</p>
        <p>· 基本ステータス、共鳴チェーン、おすすめ武器・音骸、目標ステータスを確認して、自分のビルドを作成できます。</p>
      </ReleaseSection>
      <ReleaseSection title="新ハーモニーと音骸を追加">
        <p>· 「銜夢照世の心」「鏡影流電の閃」「フラワー・レミニセンス」の3セットを反映しました。</p>
        <p>· 新登場の音骸と未収録だった通常の「雲閃のウロコ」を含む7種を追加し、既存音骸で選べるハーモニーも更新しました。</p>
      </ReleaseSection>
      <ReleaseSection title="複数画像の順次OCR">
        <p>· 音骸データ管理の「複数画像を入力」から、複数のスクリーンショットを選択・ドロップできます。</p>
        <p>· 「順次OCRを開始」で1枚ずつ認識し、各画像の進行状況と成功・失敗を確認できます。</p>
        <p>· 結果は選択中の音骸スロットから画像順に適用されます。開始スロットに応じて入力可能な枚数が変わり、最大10枚に対応します。</p>
      </ReleaseSection>
      <ReleaseSection title="OCR結果を適用する前に">
        <p>· 1枚ずつ入力する場合は、認識された音骸名とステータスを確認・修正してから適用できます。</p>
        <p>· 一括適用は対象スロットの既存データを変更します。開始スロットと画像順を確認してください。誤認識した項目は適用後に修正できます。</p>
        <p>· 画像の状態によって認識ミスが発生する場合があります。初回はサーバーの準備に時間がかかることがあり、失敗した画像は再試行できます。</p>
      </ReleaseSection>
    </ReleaseNote>,
    zh: <ReleaseNote version="Ver 1.4.0" summary="查看新角色与声骸，并一次录入多张截图">
      <ReleaseSection title="鸣潮3.7数据更新完成">
        <p>· 新增两位角色及各自的专属武器数据。</p>
        <p>· 可查看基础属性、共鸣链、推荐武器与声骸以及目标属性，规划自己的配装。</p>
      </ReleaseSection>
      <ReleaseSection title="新增合鸣效果与声骸">
        <p>· 已更新“衔梦照世之心”“镜影流电之瞬”“茜染怀想之花”三套合鸣效果。</p>
        <p>· 新增包括新声骸与此前遗漏的普通“云闪之鳞”在内的七种声骸，并更新已有声骸可选择的合鸣效果。</p>
      </ReleaseSection>
      <ReleaseSection title="多张图片顺序OCR">
        <p>· 在声骸数据管理中打开“输入多张图片”，即可选择或拖入多张截图。</p>
        <p>· 点击“开始顺序OCR”后逐张识别，并显示每张图片的进度与成功或失败状态。</p>
        <p>· 结果将从当前选中的声骸栏位开始，按图片顺序应用。可录入的数量取决于起始栏位，最多支持十张。</p>
      </ReleaseSection>
      <ReleaseSection title="应用OCR结果前请确认">
        <p>· 单张录入时，可先查看并修改识别出的声骸名称与属性，再应用结果。</p>
        <p>· 批量应用会更改目标栏位原有的声骸数据，请先确认起始栏位和图片顺序。误识别的属性可在应用后修改。</p>
        <p>· 图片质量可能影响识别结果。首次请求可能需要等待服务器启动，失败的图片可以重试。</p>
      </ReleaseSection>
    </ReleaseNote>,
  },
};
