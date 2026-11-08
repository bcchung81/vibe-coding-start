# 바이브코딩 중급 — 시작 폴더

교육생이 실습을 시작하는 폴더 두 개다. 사전설치 스크립트(`setup.ps1`)가 이 저장소를 `C:\workspace\vibe-coding-start` 에 받고, 아래 두 폴더를 `C:\workspace` 에 **없을 때만** 복사한다 — 이미 있는 내 작업은 덮지 않는다.

| 폴더 | 복사되는 곳 | 쓰는 날 | 들어 있는 것 |
|---|---|---|---|
| `vibe/` | `C:\workspace\vibe` | 1일차 — 기관 업무 웹앱 | 규칙 · 명령 3개(`vibe-plan` · `vibe-develop` · `vibe-design`) · 주제 카드 3개 · API 시험 스크립트 · Next.js 뼈대 |
| `deck/` | `C:\workspace\deck` | 2일차 — 3D 발표 덱 · 영상 | 규칙 · 명령 3개(`deck-plan` · `deck-build` · `deck-export`) · 예시 덱 6장 · 3D 장면 3개 · 영상 내보내기 |

시작은 각 폴더의 `시작하기.md` 를 본다.

## 명령이 함께 쓰는 스킬 · MCP

| 명령 | 함께 쓰는 것 |
|---|---|
| `vibe-plan` | `scripts/api-test.mjs`(API 5건 시험) · think → sequential-thinking MCP |
| `vibe-develop` | ego-browser(눌러 보고 확인 · 공개 주소 확인) · think → sequential-thinking MCP · Vercel CLI(`scripts/vercel.mjs` — `.env.local` 의 `VERCEL_TOKEN`) |
| `vibe-design` | impeccable · ego-browser(완료 기준 · 휴대폰 너비) |
| `deck-plan` | kordoc MCP(hwpx 읽기) · think → sequential-thinking MCP |
| `deck-build` | ego-browser · impeccable · aimotion(기술만 옮김) |
| `deck-export` | Edge · FFmpeg |

전역 스킬(think · impeccable · slop-rewrite · aimotion)과 MCP(sequential-thinking · kordoc)는 `setup.ps1` 이, ego-browser는 ego lite 설치가 넣는다.

## 관리

- 주제 카드(`vibe/topics/`)의 원본은 교육 허브 저장소 [bcchung81/vibe-coding](https://github.com/bcchung81/vibe-coding)의 `docs/교육생_배포/웹앱_주제/` 다. 카드를 고치면 여기에도 같은 파일을 복사한다.
- 키 · `.env.local` 은 올리지 않는다 (`.gitignore`). 예시 데이터(`vibe/data/`)는 공공데이터포털 공개 데이터다.
