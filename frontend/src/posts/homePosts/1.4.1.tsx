import type { HomePost } from "./types";
import { ReleaseNote, ReleaseSection } from "./ReleaseNote";

export const HOME_POST_1_4_1: HomePost = {
  id: 14,
  pinned: false,
  type: "notice",
  date: "2026-10-06 00:00:00",
  title: {
    kr: <span>Ver 1.4.1 || 에코 OCR 인식 정확도 개선</span>,
    en: <span>Ver 1.4.1 || Improved Echo OCR Accuracy</span>,
    jp: <span>Ver 1.4.1 || 音骸OCRの認識精度を改善</span>,
    zh: <span>Ver 1.4.1 || 声骸OCR识别准确度优化</span>,
  },
  data: {
    kr: <ReleaseNote version="Ver 1.4.1" summary="스크린샷 속 에코 옵션을 더 안정적으로 읽어옵니다">
      <ReleaseSection title="에코 옵션 인식 개선">
        <p>· 공격력, 크리티컬, 공명 스킬 피해 보너스 등 옵션 종류를 더 안정적으로 구분하도록 인식 방식을 개선했습니다.</p>
        <p>· 여러 인식 결과를 함께 확인해 더 많이 일치하는 옵션을 우선 선택하고, 결과가 엇갈릴 때는 인식 신뢰도를 참고합니다.</p>
      </ReleaseSection>
      <ReleaseSection title="일부 인식이 실패해도 결과 유지">
        <p>· 한 가지 인식 방식에서 옵션을 읽지 못해도 다른 방식에서 확인된 결과를 활용합니다.</p>
        <p>· 숫자를 읽지 못했더라도 확인된 옵션 종류는 유지되어, 미리보기에서 필요한 수치를 직접 채울 수 있습니다.</p>
        <p>· 한 장 입력과 여러 이미지 순차 입력에 모두 적용됩니다.</p>
      </ReleaseSection>
      <ReleaseSection title="적용 전 확인해 주세요">
        <p>· 이미지 상태에 따라 이름, 옵션 종류나 수치가 잘못 인식될 수 있습니다. 인식 결과를 확인하고 필요한 항목을 수정한 뒤 적용해 주세요.</p>
        <p>· 처음 이용할 때는 인식 준비로 시간이 조금 더 걸릴 수 있습니다. 옵션 글자와 수치가 선명하게 보이는 스크린샷을 사용해 주세요.</p>
      </ReleaseSection>
    </ReleaseNote>,
    en: <ReleaseNote version="Ver 1.4.1" summary="More reliable recognition of Echo stats from screenshots">
      <ReleaseSection title="Improved Stat Recognition">
        <p>· Improved identification of stat types such as ATK, Critical Rate, and Resonance Skill DMG Bonus.</p>
        <p>· Recognition results are compared to favor the most frequently identified stat, with confidence used to resolve ties.</p>
      </ReleaseSection>
      <ReleaseSection title="Keep Results When Some Recognition Fails">
        <p>· If one recognition method cannot read a stat, results from other methods can still be used.</p>
        <p>· Recognized stat types are retained even when their values cannot be read, so you can fill in missing values in the preview.</p>
        <p>· Available for both single-image input and sequential processing of multiple images.</p>
      </ReleaseSection>
      <ReleaseSection title="Review Before Applying">
        <p>· Image quality can still affect names, stat types, and values. Review the results and correct any necessary fields before applying them.</p>
        <p>· The first use may take longer while recognition is prepared. Use screenshots with clearly visible stat labels and values.</p>
      </ReleaseSection>
    </ReleaseNote>,
    jp: <ReleaseNote version="Ver 1.4.1" summary="スクリーンショットの音骸ステータスをより安定して読み取ります">
      <ReleaseSection title="ステータス認識を改善">
        <p>· 攻撃力、クリティカル、共鳴スキルダメージアップなど、ステータスの種類をより安定して判別できるよう改善しました。</p>
        <p>· 複数の認識結果を比較して一致する数が多い項目を優先し、同数の場合は認識の信頼度を参考にします。</p>
      </ReleaseSection>
      <ReleaseSection title="一部の認識が失敗しても結果を保持">
        <p>· ある認識方法で読み取れなくても、ほかの方法で確認できた結果を利用します。</p>
        <p>· 数値を読み取れなくても判別できた種類は保持されるため、プレビューで不足する数値を入力できます。</p>
        <p>· 1枚の入力と複数画像の順次入力の両方に適用されます。</p>
      </ReleaseSection>
      <ReleaseSection title="適用前にご確認ください">
        <p>· 画像の状態によっては名前、ステータスの種類、数値を誤認識する場合があります。結果を確認し、必要な項目を修正してから適用してください。</p>
        <p>· 初回は認識の準備に時間がかかる場合があります。文字と数値が鮮明に見えるスクリーンショットをご利用ください。</p>
      </ReleaseSection>
    </ReleaseNote>,
    zh: <ReleaseNote version="Ver 1.4.1" summary="更稳定地识别截图中的声骸属性">
      <ReleaseSection title="属性识别优化">
        <p>· 优化了攻击、暴击、共鸣技能伤害加成等属性类型的识别方式。</p>
        <p>· 综合比较多个识别结果，优先采用一致结果较多的属性；数量相同时参考识别置信度。</p>
      </ReleaseSection>
      <ReleaseSection title="部分识别失败时保留可用结果">
        <p>· 即使一种识别方式未能读取属性，也可使用其他方式识别出的结果。</p>
        <p>· 即使数值未能读取，已识别的属性类型仍会保留，您可在预览中手动补充数值。</p>
        <p>· 单张图片录入和多张图片顺序识别均支持此改进。</p>
      </ReleaseSection>
      <ReleaseSection title="应用前请确认">
        <p>· 图片质量仍可能导致名称、属性类型或数值识别错误。请检查结果并修正必要项目后再应用。</p>
        <p>· 首次使用可能需要额外时间准备识别。建议使用属性文字和数值清晰可见的截图。</p>
      </ReleaseSection>
    </ReleaseNote>,
  },
};
