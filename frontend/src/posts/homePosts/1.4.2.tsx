import type { HomePost } from "./types";
import { ReleaseNote, ReleaseSection } from "./ReleaseNote";

export const HOME_POST_1_4_2: HomePost = {
  id: 15,
  pinned: false,
  type: "notice",
  date: "2026-10-06 00:00:00",
  title: {
    kr: <span>Ver 1.4.2 || 다중 에코 OCR 배치 화면 개선</span>,
    en: <span>Ver 1.4.2 || Improved Batch Echo OCR Layout</span>,
    jp: <span>Ver 1.4.2 || 複数音骸OCRの配置画面を改善</span>,
    zh: <span>Ver 1.4.2 || 批量声骸OCR配置界面优化</span>,
  },
  data: {
    kr: <ReleaseNote version="Ver 1.4.2" summary="여러 장의 인식 결과를 한 화면에서 확인하고 원하는 슬롯에 배치하세요">
      <ReleaseSection title="기존 에코와 새 결과를 함께 확인">
        <p>· 다중 OCR 창에서 현재 입력된 에코 10개를 5×2 슬롯으로 확인할 수 있습니다. 기존 에코는 파란색, 새 OCR 결과는 주황색 테두리로 구분됩니다.</p>
        <p>· 슬롯은 번호, 에코 아이콘, 랭크 아이콘만 표시해 더 간결해졌습니다. 랭크는 선택한 캐릭터 기준으로 계산됩니다.</p>
      </ReleaseSection>
      <ReleaseSection title="드래그로 배치하고 직접 수정">
        <p>· 새 결과를 원하는 슬롯으로 드래그해 넣거나 기존 슬롯끼리 자리를 바꿀 수 있습니다. 교체된 기존 에코는 대기 영역에 남아 다시 배치할 수 있습니다.</p>
        <p>· 클릭한 에코의 옵션과 수치를 오른쪽 드롭다운에서 수정할 수 있습니다. 작은 화면에서도 편집 영역은 오른쪽에 유지됩니다.</p>
      </ReleaseSection>
      <ReleaseSection title="완료를 누르면 저장">
        <p>· 배치와 수정 내용을 확인한 뒤 ‘완료’를 누르면 10개 슬롯에 반영됩니다. 완료 전에 창을 닫으면 변경사항은 저장되지 않습니다.</p>
        <p>· 슬롯에 배치하지 않은 대기 결과는 저장되지 않습니다. OCR 결과에 잘못 읽힌 항목이 없는지 확인해 주세요.</p>
      </ReleaseSection>
    </ReleaseNote>,
    en: <ReleaseNote version="Ver 1.4.2" summary="Review multiple recognition results together and arrange them in your preferred slots">
      <ReleaseSection title="Existing Echoes and New Results Together">
        <p>· The batch OCR window shows your 10 existing Echoes in a 5×2 grid. Blue borders indicate existing Echoes; orange borders indicate new OCR results.</p>
        <p>· Compact tiles now show only the slot number, Echo icon, and rank icon. Ranks are calculated for the selected character.</p>
      </ReleaseSection>
      <ReleaseSection title="Drag to Arrange and Edit">
        <p>· Drag a new result into a slot or swap existing slots. Replaced Echoes remain in the unassigned area and can be placed again.</p>
        <p>· Select an Echo to edit its stats and values using the dropdowns on the right. The editor stays on the right on smaller screens too.</p>
      </ReleaseSection>
      <ReleaseSection title="Save with Done">
        <p>· Review your changes and select Done to update the 10 slots. Closing the window before selecting Done discards your changes.</p>
        <p>· Unassigned results are not saved. Check for incorrectly recognized fields before finishing.</p>
      </ReleaseSection>
    </ReleaseNote>,
    jp: <ReleaseNote version="Ver 1.4.2" summary="複数の認識結果をまとめて確認し、好きなスロットに配置できます">
      <ReleaseSection title="既存の音骸と新しい結果を一覧表示">
        <p>· 複数画像のOCR画面に、入力済みの音骸10個を5×2のスロットで表示します。既存の音骸は青、新しいOCR結果はオレンジの枠で区別します。</p>
        <p>· スロットは番号、音骸アイコン、ランクアイコンのみのコンパクトな表示になりました。ランクは選択中のキャラクターを基準に計算します。</p>
      </ReleaseSection>
      <ReleaseSection title="ドラッグで配置して編集">
        <p>· 新しい結果をスロットへドラッグしたり、既存スロット同士を入れ替えたりできます。置き換えた音骸は未配置エリアに残り、再配置できます。</p>
        <p>· 音骸を選択すると、右側のドロップダウンでステータスと数値を編集できます。小さい画面でも編集欄は右側に表示されます。</p>
      </ReleaseSection>
      <ReleaseSection title="完了ボタンで保存">
        <p>· 配置と編集内容を確認して「完了」を押すと、10個のスロットに反映されます。完了前に画面を閉じると変更は保存されません。</p>
        <p>· 未配置の結果は保存されません。誤認識された項目がないか確認してください。</p>
      </ReleaseSection>
    </ReleaseNote>,
    zh: <ReleaseNote version="Ver 1.4.2" summary="在同一界面检查多张图片的识别结果，并放入所需槽位">
      <ReleaseSection title="同时查看已有声骸与新结果">
        <p>· 批量OCR窗口以5×2布局显示已录入的10个声骸。蓝色边框表示已有声骸，橙色边框表示新OCR结果。</p>
        <p>· 槽位仅显示编号、声骸图标和评级图标，更加简洁。评级根据当前选择的角色计算。</p>
      </ReleaseSection>
      <ReleaseSection title="拖动配置并编辑">
        <p>· 可将新结果拖入槽位，也可交换已有槽位。被替换的声骸会保留在待配置区域，可再次放入槽位。</p>
        <p>· 点击声骸后，可通过右侧下拉框修改属性与数值。小屏幕上编辑区域也保持在右侧。</p>
      </ReleaseSection>
      <ReleaseSection title="点击完成后保存">
        <p>· 检查配置与修改内容后，点击“完成”即可更新10个槽位。完成前关闭窗口不会保存修改。</p>
        <p>· 未放入槽位的结果不会保存。请检查是否存在识别错误后再完成。</p>
      </ReleaseSection>
    </ReleaseNote>,
  },
};
