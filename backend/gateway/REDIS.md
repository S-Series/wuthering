# 게시판·댓글 공유 캐시

게시판 목록·본문·댓글의 공개 조회 결과만 Redis 호환 서비스에 저장한다. 원본과 모든 쓰기는 Supabase에 유지한다. 로그인, 권한, 개인 클라우드 데이터는 이 캐시에 저장하지 않는다.

## 서버 설정

기존 Railway **게이트웨이 서비스**의 Variables에 아래 값을 설정하고 이번 게이트웨이 코드를 배포한다. Railway에 Redis 서비스를 추가할 필요는 없다. 로컬 개발은 게이트웨이의 Git 제외 파일 `.env`를 사용한다.

| 환경 변수 | 기본값 | 설명 |
| --- | --- | --- |
| `REDIS_URL` | 없음 | Aiven Connection information의 Service URI. `rediss://` TLS 주소를 그대로 사용. 서버 전용 비밀 값 |
| `BOARD_CACHE_NAMESPACE` | `SUPABASE_URL` | 같은 환경의 모든 게이트웨이에서 동일하게 설정. 개발·운영은 서로 다른 값 사용 |
| `BOARD_CACHE_TTL_MS` | `30000` | 응답 보관 시간. 동시 만료 완화를 위해 0–10% 지터 추가 |
| `BOARD_CACHE_MAX_VALUE_BYTES` | `524288` | JSON 봉투를 포함한 한 응답의 캐시 상한. 큰 댓글 응답은 DB에서 그대로 반환 |
| `REDIS_COMMAND_TIMEOUT_MS` | `300` | 명령 하나의 최대 대기 ms. 배포 리전에서 측정한 지연을 기준으로 조정 |
| `REDIS_CA_CERT` | 없음 | 사설 CA를 요구하는 서비스에만 PEM 인증서 설정. 실제 줄바꿈과 `\n` 모두 지원 |

`REDIS_URL`을 브라우저 환경 변수나 `VITE_*`에 넣지 않는다. TLS 인증서 검증을 끄지 않는다. URL이 없으면 기존 프로세스 메모리 캐시(10초·256개)로 동작한다. URL이 있는데 접속이 실패하면 DB를 조회한다. 잘못된 URL 형식이나 잘못된 숫자 설정은 시작 시 거부한다.

## 동작과 통신량

- 정상 캐시 적중: Redis Lua 명령 **1회**, DB 조회 없음. 미적중: 잠금 획득을 포함한 조회 1회 → DB 조회 → 저장·잠금 해제 1회.
- 동일 요청은 프로세스 안에서 합치고, 서로 다른 게이트웨이는 짧은 분산 잠금으로 중복 DB 조회를 줄인다. 잠금 대기는 최대 1.5초이며 초과 시 DB를 조회한다. 잠금은 처리량 최적화용이고 원본 쓰기를 보호하는 트랜잭션 잠금은 아니다.
- 글·댓글 작성/수정/숨김 및 해결 상태 변경이 성공하면 모든 목록과 해당 글의 본문·댓글 버전을 한 번의 명령으로 변경한다. 다른 글의 본문 캐시는 유지한다. 변경 도중 실행 중이던 DB 결과는 버전 검사 후 다시 조회하므로 오래된 값으로 캐시를 채울 수 없다.
- 만료·축출된 버전 키를 다시 만들 때 무작위 버전을 사용한다. 전체 복구 버전도 함께 검사해 오래된 응답이 다시 유효해지지 않도록 한다.
- Redis 설정 시 프로세스별 TTL 캐시를 겹쳐 두지 않는다. 끊긴 서버는 DB로 우회한다. Redis 무효화 실패가 이미 성공한 DB 쓰기를 실패 응답으로 바꾸지 않으며, 해당 서버가 Redis를 다시 사용할 때 전체 캐시 버전을 갱신한다.
- 네트워크 분할 중 다른 정상 서버는 기존 캐시를 **최대 TTL(기본 약 33초)** 동안 반환할 수 있다. DB에서 직접 수정하거나 닉네임을 바꾸는 경우에도 TTL 내 갱신이다. DB와 캐시를 원자적으로 커밋하는 내구성 있는 outbox는 이번 범위에 포함하지 않는다.
- `?view=1` 조회수 증가는 캐시 적중 여부와 관계없이 매번 DB 쓰기를 한다. 본문 조회와 병렬 실행한다. 댓글 전체 반환과 목록 OFFSET 페이지네이션도 유지된다.

`X-Cache: HIT/MISS/COALESCED/BYPASS`, `X-Cache-Store: redis/memory/db`, `Server-Timing: board_read`로 동작을 확인한다. 브라우저 응답은 `Cache-Control: no-store`다. Redis 설정 직후 연결 준비 전 몇 요청은 `BYPASS/db`가 정상이다.

## Aiven 무료 Valkey

2026-10-18에 `wuwa-dev / valkey-3cd46ba4`의 **Free-1, 1 CPU·1 GB**, Valkey 9.1.2, `Running`을 확인했다. 리전은 DigitalOcean Bangalore다. 캐시 전용 서비스이며 메모리 부족 시 덜 쓰는 키를 교체하도록 **allkeys-lfu** 정책을 적용했다. 실제 TLS 연결은 시스템 CA 검증으로 성공했고 별도 CA 설정은 필요하지 않았다.

무료 요금제는 데이터용 메모리가 RAM의 50%이고 SLA가 없으며 장기 유휴 시 정지될 수 있다. 1,000만 사용자 운영 용량을 검증한 구성이 아니다. [Aiven 무료 요금제 공식 문서](https://aiven.io/docs/products/valkey/concepts/valkey-free-tier). 배포 위치와 캐시 리전 간 왕복 시간이 크면 지연 이득이 줄어든다. 적중률, DB 요청 감소, p95 지연, 메모리·축출량을 배포 후 함께 측정한다.

## 검증

```powershell
npm run test:redis
npm run test:board
npm run test:traffic
npx tsc --noEmit

# 실제 Valkey: .env의 REDIS_URL 사용. 무작위 테스트 네임스페이스만 생성·정리
$env:BOARD_REDIS_INTEGRATION = '1'
npm run test:redis:live
npm run test:board:live
```

실제 Lua/TLS 테스트는 서버 간 적중, 대상별 무효화, 변경 중 조회, 동시 캐시 채우기, DB 실패, Redis 장애·복구, 복구 중 재무효화, TTL, 잠금 만료/소유권, 큰 응답 우회와 환경 분리를 검사한다. 실사용 게시글이나 댓글은 수정하지 않는다. 운영 어댑터의 실제 명령 제한과 적중/미적중 왕복 횟수도 확인한다.

`test:board:live`는 로컬 `.env`의 실제 Supabase를 읽으며 독립적인 두 Fastify 앱에서 목록·본문·댓글의 공유 캐시 적중을 확인한다. 조회수 증가 요청과 DB 쓰기는 하지 않는다. 격리된 캐시 네임스페이스의 키만 정리한다.

배포 후 같은 목록을 두 번 조회해 `MISS → HIT`와 `X-Cache-Store: redis`를 확인한다. 글 또는 댓글 변경 후 관련 목록·본문·댓글이 갱신되는지 확인하고, 여러 복제본이 있다면 같은 네임스페이스를 쓰는지 확인한다.
