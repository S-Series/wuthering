import type { HomePost } from "./types";
import { SERVICE_NAME } from "./serviceName";
import { ReleaseNote, ReleaseSection } from "./ReleaseNote";

export const HOME_POST_1_2_0: HomePost = {
  id: 11,
  pinned: false,
  type: "notice",
  date: "2026-08-31 00:00:00",
  title: {
    kr: <span>{`Ver 1.2.0 || ${SERVICE_NAME.kr} 커뮤니티 게시판 업데이트`}</span>,
    en: <span>{`Ver 1.2.0 || ${SERVICE_NAME.en} Community Board Update`}</span>,
    jp: <span>Ver 1.2.0 || コミュニティ掲示板アップデート</span>,
    zh: <span>Ver 1.2.0 || 社区讨论区更新</span>,
  },
  data: {
    kr: <ReleaseNote version="Ver 1.2.0" summary="게임 정보와 이야기를 함께 나누는 새로운 커뮤니티 공간">
      <ReleaseSection title="커뮤니티 게시판 오픈">
        <p>· 자유, 질문, 공략 카테고리로 게임 이야기와 정보를 나눌 수 있는 게시판을 추가했습니다.</p>
        <p>· 제목 검색과 카테고리 필터, 페이지 이동을 지원해 원하는 게시글을 빠르게 찾을 수 있습니다.</p>
      </ReleaseSection>

      <ReleaseSection title="게시글 작성과 관리">
        <p>· 로그인한 사용자는 게시글을 작성하고 상세 화면에서 내용을 확인할 수 있습니다.</p>
        <p>· 자신이 작성한 게시글은 수정하거나 삭제할 수 있으며, 삭제된 글은 게시판 목록에서 숨겨집니다.</p>
      </ReleaseSection>

      <ReleaseSection title="로그인 및 권한 보호">
        <p>· 비로그인 사용자는 게시글 목록과 상세 내용을 열람할 수 있고, 글쓰기 선택 시 로그인 화면으로 안내됩니다.</p>
        <p>· 게시글 작성, 수정, 삭제 요청은 서버에서 로그인 정보와 작성자 권한을 다시 확인합니다.</p>
      </ReleaseSection>

      <ReleaseSection title="화면 및 사용성 개선">
        <p>· 상단 메뉴와 사이드바에서 게시판으로 바로 이동할 수 있는 메뉴를 추가했습니다.</p>
        <p>· 다크·라이트 테마와 모바일 화면, 한국어·영어·일본어·중국어 표시를 지원합니다.</p>
      </ReleaseSection>
    </ReleaseNote>,

    en: <ReleaseNote version="Ver 1.2.0" summary="A new community space for sharing game knowledge and stories">
      <ReleaseSection title="Community Board Launch">
        <p>· A new board is available for general discussions, questions, and game guides.</p>
        <p>· Title search, category filters, and pagination make it easier to find relevant posts.</p>
      </ReleaseSection>

      <ReleaseSection title="Post Creation and Management">
        <p>· Signed-in users can create posts and read them on a dedicated detail page.</p>
        <p>· Authors can edit or delete their own posts, and deleted posts are hidden from the board.</p>
      </ReleaseSection>

      <ReleaseSection title="Authentication and Permissions">
        <p>· Guests can browse the board and post details, while selecting New Post directs them to sign in.</p>
        <p>· The server verifies authentication and ownership again for every create, edit, and delete request.</p>
      </ReleaseSection>

      <ReleaseSection title="Interface Improvements">
        <p>· Community Board links have been added to both the top navigation and sidebar.</p>
        <p>· The board supports Dark and Light themes, responsive mobile layouts, and all four service languages.</p>
      </ReleaseSection>
    </ReleaseNote>,

    jp: <ReleaseNote version="Ver 1.2.0" summary="ゲーム情報や話題を共有できる新しいコミュニティスペース">
      <ReleaseSection title="コミュニティ掲示板を公開">
        <p>· 自由、質問、攻略のカテゴリーでゲームの話題や情報を共有できる掲示板を追加しました。</p>
        <p>· タイトル検索、カテゴリーフィルター、ページ移動に対応し、投稿をすばやく探せます。</p>
      </ReleaseSection>

      <ReleaseSection title="投稿の作成と管理">
        <p>· ログインユーザーは投稿を作成し、詳細画面で内容を確認できます。</p>
        <p>· 自分の投稿は編集・削除でき、削除した投稿は掲示板の一覧から非表示になります。</p>
      </ReleaseSection>

      <ReleaseSection title="ログインと権限保護">
        <p>· 未ログインでも一覧と詳細を閲覧でき、投稿を選択するとログイン画面へ案内されます。</p>
        <p>· 投稿、編集、削除の各リクエストでは、サーバー側でログイン情報と作成者権限を再確認します。</p>
      </ReleaseSection>

      <ReleaseSection title="画面と操作性の改善">
        <p>· 上部メニューとサイドバーから掲示板へ直接移動できるリンクを追加しました。</p>
        <p>· ダーク・ライトテーマ、モバイル表示、日本語を含む4言語表示に対応しています。</p>
      </ReleaseSection>
    </ReleaseNote>,

    zh: <ReleaseNote version="Ver 1.2.0" summary="一个用于分享游戏信息与故事的全新社区空间">
      <ReleaseSection title="社区讨论区上线">
        <p>· 新增自由讨论、提问和攻略分类，方便玩家分享游戏话题与信息。</p>
        <p>· 支持标题搜索、分类筛选和分页，可更快找到需要的帖子。</p>
      </ReleaseSection>

      <ReleaseSection title="帖子发布与管理">
        <p>· 登录用户可以发布帖子，并在详情页面查看完整内容。</p>
        <p>· 作者可以编辑或删除自己的帖子，已删除的帖子将从列表中隐藏。</p>
      </ReleaseSection>

      <ReleaseSection title="登录与权限保护">
        <p>· 未登录用户可以浏览列表和详情，选择发帖时会被引导至登录页面。</p>
        <p>· 每次发布、编辑和删除请求都会由服务器再次验证登录信息与作者权限。</p>
      </ReleaseSection>

      <ReleaseSection title="界面与使用体验优化">
        <p>· 顶部导航和侧边栏均新增了社区讨论区入口。</p>
        <p>· 支持深色与浅色主题、移动端布局以及包括中文在内的四种语言。</p>
      </ReleaseSection>
    </ReleaseNote>,
  },
};
