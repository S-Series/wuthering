import "@/pages/InformationPages.css";

export default function Privacy() {
  return (
    <article className="site-document kr-font" lang="ko">
      <h1>개인정보처리방침</h1>
      <p className="document-date">최종 수정: 2026년 10월 29일</p>
      <p>띵조 DEV(운영자: SSeries)는 계정 관리, 스펙카드 생성, 데이터 저장과 서비스 운영을 위해 아래 정보를 처리합니다.</p>

      <h2>1. 처리하는 정보와 목적</h2>
      <ul>
        <li>계정 정보: 이메일, 계정 식별자, 닉네임, 프로필 이미지와 로그인 제공자 정보를 로그인 및 계정 관리에 사용합니다.</li>
        <li>게임·세팅 정보: 이용자가 입력한 게임 UID, 서버, 플레이어 정보, 캐릭터·무기·에코 정보를 카드 생성과 데이터 저장·동기화에 사용합니다.</li>
        <li>이미지: OCR을 위해 선택한 스크린샷과 카드 생성에 필요한 이미지·세팅 정보를 해당 기능의 처리에 사용합니다.</li>
        <li>게시판 정보: 작성한 글, 댓글과 작성자 정보를 게시판 제공 및 운영에 사용합니다. 공개 게시물에 입력한 정보는 다른 방문자가 볼 수 있습니다.</li>
        <li>이용 기록: 페이지 방문, 로그인·다운로드 등 기능 사용 내역, 오류 및 요청 처리 정보를 통계, 장애 대응과 부정 이용 방지에 사용합니다. 서버와 호스팅 제공자는 접속 과정에서 IP 주소 등 기술 정보를 처리할 수 있습니다.</li>
      </ul>

      <h2>2. 이미지 처리와 브라우저 저장</h2>
      <p>서버 OCR을 사용하는 경우 이미지 또는 인식에 필요한 영역이 게이트웨이와 OCR 처리 서버로 전송됩니다. 브라우저 OCR은 해당 문자 인식을 기기에서 수행합니다. 이미지 생성 기능에서는 카드 생성에 필요한 데이터가 서버로 전송됩니다. 스크린샷에 불필요한 개인정보가 포함되지 않도록 확인해 주세요.</p>
      <p>설정, 캐릭터 세팅, 로그인 상태의 일부 정보, 공지 확인 상태와 생성 이미지는 브라우저의 로컬 저장소·세션 저장소·IndexedDB에 저장될 수 있습니다. 브라우저의 사이트 데이터 삭제 기능으로 지울 수 있으며, 삭제하면 기기에 저장된 세팅과 이미지도 사라질 수 있습니다. 클라우드에 저장된 데이터는 브라우저 데이터를 지워도 별도로 남습니다.</p>

      <h2>3. 외부 서비스</h2>
      <p>서비스 제공 과정에서 다음 외부 서비스를 사용합니다. 각 기능에 필요한 정보가 해당 제공자의 인프라에서 처리될 수 있습니다.</p>
      <ul>
        <li>Google / Firebase: 로그인, 인증 및 저장 기능. <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google 개인정보처리방침</a></li>
        <li>Supabase: 계정 연동 정보, 게시판 및 서비스 운영 데이터 관리. <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer">Supabase 개인정보처리방침</a></li>
        <li>Hugging Face: 서버 OCR 처리. <a href="https://huggingface.co/privacy" target="_blank" rel="noopener noreferrer">Hugging Face 개인정보처리방침</a></li>
        <li>Railway: 게이트웨이 등 서버 운영. <a href="https://railway.com/legal/privacy" target="_blank" rel="noopener noreferrer">Railway 개인정보처리방침</a></li>
        <li>Vercel: 사이트 호스팅 및 Web Analytics 방문 통계. <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">Vercel 개인정보처리방침</a></li>
        <li>YouTube / Google: 동영상 정보 제공과 동영상 재생. 동영상을 재생하면 해당 제공자가 재생 및 접속 관련 정보를 처리할 수 있습니다.</li>
      </ul>

      <h2>4. Google AdSense와 광고 쿠키</h2>
      <p>이 사이트에는 Google AdSense 연결 코드가 포함되어 있으며, 승인 및 광고 설정에 따라 광고를 게재할 수 있습니다. Google을 포함한 제3자 광고 제공자는 이용자의 이 사이트 및 다른 웹사이트 방문 기록을 바탕으로 광고를 제공하기 위해 쿠키를 사용할 수 있습니다. Google의 광고 쿠키를 통해 Google과 파트너가 방문 기록에 따른 맞춤 광고를 제공할 수 있습니다.</p>
      <p>Google 외의 제3자 광고 제공자와 광고 네트워크도 광고 제공을 위해 쿠키를 사용할 수 있습니다. 관련 정보는 <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer">Google 파트너 사이트의 데이터 사용 안내</a>와 <a href="https://support.google.com/adsense/answer/9012903?hl=ko" target="_blank" rel="noopener noreferrer">광고 기술 제공업체 안내</a>에서 확인할 수 있습니다.</p>
      <p>이용자는 <a href="https://myadcenter.google.com/" target="_blank" rel="noopener noreferrer">Google 내 광고 센터</a>에서 맞춤 광고 설정을 변경하거나 거부할 수 있습니다. 다른 참여 업체의 맞춤 광고 쿠키는 <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer">업계 광고 선택 도구</a> 또는 해당 업체의 설정에서 거부할 수 있습니다. 맞춤 광고를 거부해도 광고 자체가 모두 사라지는 것은 아닙니다.</p>
      <p>쿠키는 브라우저 설정에서도 관리하거나 삭제할 수 있습니다. 광고 동의 메시지가 표시되는 경우에는 해당 메시지에서 제공하는 선택을 이용할 수 있습니다.</p>

      <h2>5. 보관과 삭제 요청</h2>
      <p>계정과 클라우드 저장 정보는 계정 및 저장 기능을 제공하는 동안 처리합니다. 기기 내 데이터는 이용자가 사이트 데이터를 삭제하거나 서비스에서 저장 내용을 변경할 때까지 남을 수 있습니다. 외부 제공자의 처리 기록은 해당 제공자의 정책에 따릅니다.</p>
      <p>개인정보의 열람·정정·삭제 또는 계정 이용 종료를 원하면 아래 이메일로 요청해 주세요. 요청자 본인 확인 후 처리하며, 관련 법령상 보존 의무가 있는 정보는 해당 의무에 따라 처리합니다. 브라우저 데이터 삭제와 로그아웃만으로 서버의 계정·게시물·클라우드 정보가 모두 삭제되지는 않습니다.</p>

      <h2>6. 문의와 변경 안내</h2>
      <p>개인정보 관련 문의 및 권리 행사: <a href="mailto:SSeries000923@gmail.com">SSeries000923@gmail.com</a> (운영자 SSeries). 요청에 비밀번호나 인증 토큰을 포함하지 마세요.</p>
      <p>처리하는 정보나 외부 서비스가 달라지면 이 페이지를 수정하고 최종 수정일을 갱신합니다.</p>
    </article>
  );
}
