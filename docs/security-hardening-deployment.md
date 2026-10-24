# Security hardening: deployment checklist

These changes are local source changes only. No production environment variables,
networking, database, Firebase settings or deployed Firestore Rules were read or
changed. Existing production Rules remain unverified.

## Dependencies

OCR production and CI requirements now pin `python-multipart==0.0.32` and
`Pillow==12.2.0`. ImageMaker uses the same pins. FastAPI/Starlette are updated to
`0.156.7`/`1.7.0` (Python 3.10-compatible) rather than retaining the old form parser
framework. PaddleOCR/PaddlePaddle and NumPy/OpenCV versions are unchanged.

Rebuild the Python services, not just their source files. Run CI and test real OCR
and card generation in staging: local OCR tests mock PaddleOCR, and render boundary
tests mock the renderer. A full Paddle model/container run is not verified locally.

References: [multipart advisory](https://github.com/Kludex/python-multipart/security/advisories/GHSA-2jv5-9r88-3w3p),
[multipart releases](https://pypi.org/project/python-multipart/),
[Pillow releases](https://pypi.org/project/pillow/).

## Server Environment Variables

| Service | Variable | Value |
| --- | --- | --- |
| Gateway | `OCR_INTERNAL_SECRET` | A new random secret shared only with OCR |
| OCR | `INTERNAL_API_SECRET` | Exactly the same value as Gateway's OCR secret |
| Gateway | `RENDER_INTERNAL_SECRET` | A different new random secret shared only with Render |
| Render | `INTERNAL_API_SECRET` | Exactly the same value as Gateway's Render secret |
| Gateway | `CLIENT_IP_SOURCE` | `socket` (default), or explicitly `railway` after reviewing the ingress boundary |

Generate two independent secrets with `openssl rand -hex 32` (64 printable ASCII
characters each). Store them as platform secrets; never put them in Git, URLs,
frontend `VITE_*` variables, screenshots, request examples or browser headers.
At least 32 printable non-space ASCII characters are required.

The Gateway sends `X-Internal-Secret` on OCR single/batch/wake/health and Render
requests. Upstream redirects are rejected to avoid forwarding secrets to another
origin. Incoming browser headers are not forwarded. The Gateway refuses startup
if either secret is missing/invalid. Python services reject protected requests
with 503 when their key is missing/invalid, and 401 for missing/wrong/duplicate
request keys. Authentication runs before multipart/JSON parsing and expensive work.

Only GET/HEAD `/` and `/health` bypass internal auth; OCR currently implements both,
while Render implements `/`. `/wake`, `/ocr`, `/ocr/batch`, `/render/test`,
`/render/card`, docs and OpenAPI require the secret. Use `/` for platform liveness
checks; do not add the secret to public uptime monitors.

### Safe Rollout Order

1. Stage and test all three services. Plan a maintenance window if coordinated
   deployment cannot be done without mixed versions.
2. Add the secrets to the respective platform configurations without exposing them
   to browsers. Keep both sides of each pair identical.
3. Deploy Gateway first with the new secrets. Old Python services ignore the extra
   header, so existing functionality remains available during this transition.
4. Rebuild/deploy OCR and Render with their matching `INTERNAL_API_SECRET` values.
5. Verify direct unauthenticated OCR/batch/wake/render requests get 401, Gateway
   requests work, and mismatched keys fail. Monitor health and errors without logging
   header values. Check real OCR output and an actual rendered card.
6. Prefer private networking for Render when available. Only remove public ingress
   after the Gateway URL/routing has been tested. For public HF OCR, keep secret auth.

Do not deploy protected Python services first while an old Gateway is still live:
it cannot supply the header. Rollback should keep the authentication boundary;
coordinate compatible Gateway/Python versions, not an unauthenticated bypass flag.

## Client IP / Rate Limit

`X-Forwarded-For` is never used. Rate limiting and telemetry share the same resolver.
The default uses the socket peer address and ignores all forwarded IP headers.
Behind a proxy this may group users under one IP: choose the mode before production
rollout, otherwise availability can be affected by shared rate limits.

Enable `CLIENT_IP_SOURCE=railway` only if the listener is reachable exclusively
through Railway's edge and the edge supplies/overwrites `X-Real-IP`. The value must
be a single valid IPv4/IPv6 address; missing/invalid values fall back to the socket.
This is an explicit trust boundary, not proof inferred from spoofable Railway headers.
Do not enable this mode on a directly exposed host or a private listener reachable
by untrusted callers. Additional CDNs/proxies require a separate reviewed setup.
Rotate XFF values in staging and confirm they cannot reset the rate-limit bucket.

Reference: [Railway request headers](https://docs.railway.com/networking/public-networking/specs-and-limits).

## Firestore Rules

`firestore.rules` grants only authenticated owners access to
`gameProfiles/{Firebase Auth UID}`. All other paths are denied. UID means Firebase
UID, not Supabase user UUID. Client helpers additionally reject mismatched/signed-out
reads and writes before I/O; this is defense in depth, not a replacement for Rules.

Before deployment, export/review the current Rules in Firebase Console and confirm
that no other collection requires client access. Repository search found only
`gameProfiles` client access; production/external applications may differ. Rules
deployment replaces the project Rules, so merge any independently reviewed required
rules rather than blindly overwriting unknown production settings.

Local verification (demo emulator only, no real Firebase project):

```sh
cd backend/firebase-security
npm install --ignore-scripts
npm test
```

Node 22+ and Java 21 are required for the pinned CLI/emulator. The test uses
`demo-wuwa-security`, never production credentials. It tests owner CRUD, denied
other-user/anonymous access, collection enumeration, other collections and subpaths.
These CLI/SDK packages are dev-only, isolated from the frontend and Gateway.
Their transitive npm audit warnings remain and must not be interpreted as a clean
dependency audit; do not use `npm audit fix --force` or deploy these tools as runtime
dependencies.

After review and explicit deployment approval, authenticate the Firebase CLI and
use the exact reviewed project ID (not a guessed/default project):

```sh
# From backend/firebase-security; this command CHANGES the selected project Rules.
npx firebase deploy --config ../../firebase.json --only firestore:rules --project YOUR_REVIEWED_PROJECT_ID
```

This command has NOT been run. Test normal profile editing and cross-user denial
in a separate staging project before production. Server Admin SDKs bypass Rules.
Reference: [Firestore access conditions](https://firebase.google.com/docs/firestore/security/rules-conditions).

## Local Checks / Scope

Gateway: `npm run test:security` and `npm run test:traffic` in `backend/gateway`.
OCR: install `requirements-ci.txt`, then `python -m pytest -q` in `backend/paddle OCR`.
Frontend: `node --test tests/firebase-profile-auth.test.cjs`, plus production build.

No App Check, CORS policy change, CSP, log-secret policy, or health-response URL
cleanup is included here; those were separate audit items beyond requested 1-4.
Secret authentication does not make a publicly exposed service immune to network
flooding or replace platform resource/upload limits.
