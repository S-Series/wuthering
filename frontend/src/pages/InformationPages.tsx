import { useEffect, type ReactNode } from "react";
import { Link, NavLink } from "react-router-dom";
import "./InformationPages.css";

export function InformationPage({ title, children }: { title: string; children: ReactNode }) {
  useEffect(() => {
    const previousTitle = document.title;
    const description = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    const previousDescription = description?.content;
    document.title = `${title} | 띵조 DEV`;
    if (description) description.content = `띵조 DEV의 ${title}. 명조 스펙카드 생성기 이용에 필요한 정보를 확인하세요.`;
    window.scrollTo(0, 0);
    return () => {
      document.title = previousTitle;
      if (description && previousDescription !== undefined) description.content = previousDescription;
    };
  }, [title]);

  return (
    <div className="information-page kr-font" lang="ko">
      <nav className="information-nav" aria-label="서비스 안내">
        <NavLink to="/about">서비스 소개</NavLink>
        <NavLink to="/guide" end>사용법</NavLink>
        <NavLink to="/guide/scoring">점수 계산 기준</NavLink>
        <NavLink to="/privacy">개인정보처리방침</NavLink>
        <NavLink to="/terms">이용약관</NavLink>
      </nav>
      {children}
    </div>
  );
}

export function AboutPage() {
  return (
    <InformationPage title="서비스 소개">
      <article className="site-document">
        <p className="document-eyebrow">WUWA DEV</p>
        <h1>명조의 캐릭터 세팅을 한 장으로</h1>
        <p>띵조 DEV는 명조: 워더링 웨이브의 캐릭터, 무기, 에코 세팅을 정리하고 스펙카드 이미지로 만드는 비공식 팬 도구입니다. 게임 화면을 보며 수치를 직접 입력하거나, 스크린샷의 문자를 OCR로 읽어 입력을 도울 수 있습니다.</p>
        <h2>어떤 일을 할 수 있나요?</h2>
        <ul>
          <li>캐릭터와 무기, 공명 체인, 에코 주옵션·부옵션을 설정하고 최종 스탯을 확인합니다.</li>
          <li>에코의 CV와 AV를 비교하고, 캐릭터별 추천 세팅과 목표 스탯을 참고합니다.</li>
          <li>현재 세팅을 이미지로 생성해 다운로드하고 다른 이용자에게 공유합니다.</li>
          <li>로그인한 계정으로 캐릭터 데이터를 클라우드에 저장하거나 불러옵니다.</li>
        </ul>
        <h2>처음 방문하셨나요?</h2>
        <p><Link to="/guide">스펙카드 만들기 안내</Link>에서 입력부터 이미지 다운로드까지 확인할 수 있습니다. 점수가 궁금하다면 <Link to="/guide/scoring">점수 계산 기준</Link>을 참고하세요.</p>
        <p className="document-callout">점수와 추천은 이 서비스의 계산 기준에 따른 참고 정보입니다. 실제 전투 결과는 파티 구성, 버프, 적의 조건, 플레이 방식에 따라 달라집니다.</p>
        <h2>운영 및 문의</h2>
        <p>운영자: SSeries<br />문의: <a href="mailto:SSeries000923@gmail.com">SSeries000923@gmail.com</a></p>
        <p>오류를 제보할 때는 발생한 화면과 재현 순서, 사용한 브라우저를 함께 알려주세요. 비밀번호나 인증 정보는 보내지 마세요.</p>
        <h2>게임과의 관계</h2>
        <p>이 사이트는 Kuro Games와 제휴하거나 공식적으로 운영되는 서비스가 아닙니다. Wuthering Waves 및 관련 게임 자산의 권리는 Kuro Games 등 각 권리자에게 있습니다.</p>
      </article>
    </InformationPage>
  );
}

export function GuidePage() {
  return (
    <InformationPage title="스펙카드 사용법">
      <article className="site-document">
        <p className="document-eyebrow">GETTING STARTED</p>
        <h1>스펙카드 만들기</h1>
        <p>게임 화면의 장비 정보를 준비한 뒤 아래 순서로 입력해 보세요. OCR을 사용하더라도 마지막에는 인식된 수치를 직접 확인하는 것이 좋습니다.</p>
        <h2>1. 캐릭터와 무기 설정</h2>
        <p><Link to="/card">스펙카드 화면</Link>을 열고 캐릭터 또는 무기 영역을 눌러 관리 창을 엽니다. 캐릭터, 무기, 무기 공진 단계를 선택하고 공명 체인을 실제 세팅에 맞춥니다. 캐릭터 이미지 위의 공명 체인 버튼으로도 단계를 바꿀 수 있습니다.</p>
        <h2>2. 에코 정보 입력</h2>
        <p>장착 에코 영역을 눌러 에코 관리 창을 엽니다. 에코 종류와 소나타 효과, 코스트, 주옵션, 부옵션을 확인해 입력합니다. 보유 에코 중 어떤 다섯 개를 장착했는지도 확인하세요. 입력값이나 장착 순서를 바꾸면 스탯과 점수가 다시 계산됩니다.</p>
        <h2>3. 스크린샷으로 입력하기</h2>
        <p>에코 관리 창의 OCR 기능에서 스크린샷을 선택하거나 붙여 넣고, 안내에 따라 에코 정보 영역을 지정합니다. 옵션 이름과 수치가 잘리지 않고 선명하게 보이는 원본 화면을 사용하세요. 문자 언어는 게임 화면에 맞춥니다.</p>
        <ul>
          <li>OCR은 숫자, 소수점, % 기호, 옵션 이름을 잘못 읽을 수 있습니다. 적용 전에 결과를 게임 화면과 비교하세요.</li>
          <li>잘못 읽힌 값은 수동으로 수정합니다. 반복해서 실패하면 장비 정보만 선명하게 보이도록 다시 캡처해 보세요.</li>
          <li>서버 OCR을 사용하면 처리할 이미지가 서버로 전송됩니다. 채팅, 이메일 등 불필요한 개인정보가 포함되지 않게 준비하세요.</li>
        </ul>
        <h2>4. 최종 스탯과 점수 확인</h2>
        <p>치명타 확률·피해와 공명 효율을 포함한 최종 스탯을 확인합니다. 개별 에코 점수와 장착 세트 전체 점수는 보정 조건이 다릅니다. <Link to="/guide/scoring">CV·AV 계산 기준</Link>을 함께 확인하면 세팅 차이를 이해하기 쉽습니다.</p>
        <h2>5. 이미지 생성과 다운로드</h2>
        <p>플레이어 정보와 이미지를 확인한 뒤 이미지 생성 메뉴를 실행합니다. 생성이 끝나면 다운로드 창에서 이미지를 저장하세요. 공유할 이미지에 게임 UID나 닉네임이 표시되는지도 확인하세요.</p>
        <h2>저장 데이터는 어디에 있나요?</h2>
        <p>브라우저에 저장된 세팅과 이미지는 다른 기기에서 자동으로 보이지 않습니다. 브라우저 데이터를 지우기 전에는 필요한 데이터를 보관하세요. 계정으로 클라우드 동기화를 사용할 때는 업로드가 현재 세팅을 저장하고, 다운로드가 저장된 세팅을 불러오는 동작인지 확인한 뒤 실행하세요.</p>
        <p>문제가 해결되지 않으면 <Link to="/about">문의 안내</Link>를 참고하세요. 데이터 처리에 관한 내용은 <Link to="/privacy">개인정보처리방침</Link>에서 확인할 수 있습니다.</p>
      </article>
    </InformationPage>
  );
}

export function ScoringPage() {
  return (
    <InformationPage title="점수 계산 기준">
      <article className="site-document">
        <p className="document-eyebrow">CV &amp; AV</p>
        <h1>에코 점수는 어떻게 계산하나요?</h1>
        <p>띵조 DEV는 치명타 부옵션을 비교하는 CV와 캐릭터별 유효 옵션을 반영하는 AV를 제공합니다. 두 점수는 게임의 공식 평가나 실제 피해량을 뜻하지 않습니다.</p>
        <h2>CV: 치명타 부옵션 비교</h2>
        <p>개별 에코의 부옵션 중 치명타 확률과 치명타 피해만 계산합니다. 주옵션이나 무기의 치명타 수치는 CV에 더하지 않습니다.</p>
        <p className="document-formula">CV = 치명타 확률 부옵션 × 2 + 치명타 피해 부옵션</p>
        <p>예를 들어 치명타 확률 10.5%, 치명타 피해 21.0%인 에코의 CV는 42.0입니다. 전체 CV는 현재 장착한 다섯 에코의 CV를 합산하고 소수점 첫째 자리로 반올림합니다.</p>
        <h2>개별 AV: 캐릭터에게 유효한 옵션 평가</h2>
        <p>공격력·HP·방어력 비율, 치명타, 일반 공격·강공격·공명 스킬·공명 해방 피해 보너스 등에 캐릭터별 가중치를 적용합니다. 캐릭터가 사용하는 기본 능력치의 고정 수치는 기준 능력치 대비 비율로 환산해 반영합니다. 공명 효율은 개별 에코의 가중 합산에서 제외하고 전체 세팅에서 별도로 평가합니다.</p>
        <p>캐릭터별 기준 배율을 적용한 뒤, 치명타가 필요한 캐릭터는 치명타 확률과 피해 부옵션이 모두 있을 때 10점을 더합니다. 치명타가 필요하지 않은 캐릭터는 이 가산점을 기본으로 받습니다. 캐릭터·코스트별 기준에 맞지 않는 주옵션은 10점을 차감합니다.</p>
        <h2>전체 AV: 다섯 에코와 세팅 보정</h2>
        <ol>
          <li>현재 장착한 다섯 에코의 AV를 합산합니다.</li>
          <li>최종 치명타 확률에서 에코 부옵션 외의 기여를 분리하고, 확률 100%까지 남은 유효 범위에 맞춰 에코 치명타 확률의 점수 기여를 보정합니다. 범위를 넘는 부옵션은 유효 기여에서 제외됩니다.</li>
          <li>캐릭터의 요구 공명 효율보다 부족하면 부족량에 따라 감점합니다.</li>
          <li>무기·공명 체인·장착 에코 등에 따른 별도 세팅 보정값을 반영합니다.</li>
        </ol>
        <p>공명 효율 부족량이 5%p 이하면 기본 10점, 5%p 초과 15%p 이하면 기본 20점, 15%p 초과면 기본 40점을 차감하며 각 구간의 추가 부족량에 가중치를 적용한 감점이 더해집니다. 최종 AV는 0~500 범위로 제한하고 소수점 첫째 자리로 반올림합니다.</p>
        <h2>점수를 비교할 때</h2>
        <p>같은 에코도 캐릭터에 따라 AV가 달라집니다. 전체 AV에는 세팅 보정이 들어가므로 개별 점수의 단순 합과 다를 수 있습니다. 입력 오류, 장착 에코, 무기와 공명 체인을 먼저 확인하고 같은 조건에서 비교하세요.</p>
        <p className="document-callout">높은 AV가 모든 파티에서 더 높은 피해량을 보장하지는 않습니다. 점수와 함께 필요한 공명 효율, 실제 파티의 버프, 플레이 조건을 확인하세요. 서비스의 기준 데이터와 계산 방식이 바뀌면 같은 세팅의 점수도 달라질 수 있습니다.</p>
        <p><Link to="/card">내 세팅 확인하기</Link> · <Link to="/guide">사용법으로 돌아가기</Link></p>
      </article>
    </InformationPage>
  );
}
