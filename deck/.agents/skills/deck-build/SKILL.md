---
name: deck-build
description: deck-plan.md대로 index.html의 장을 만들고 3D 장면(globe · bars · wave)을 고친다. aimotion에서 찾은 표현 기법은 기술만 옮긴다. 장 하나씩 만들고 ego-browser로 확인한다. 사용자가 deck-build 스킬을 부를 때만 쓴다.
---

예시 덱을 고쳐 쓴다. 새로 만들지 않는다. 먼저 `AGENTS.md` · `deck-plan.md` · `index.html` 을 읽는다.

## 1. 무엇을 할지

| 사용자가 말한 것 | 할 일 |
|---|---|
| "1장부터 차례로" · "다음 장" | 아직 `deck-plan.md` 와 다른 첫 장 **하나만** 고친다. 끝나면 다음 장을 할지 묻는다 |
| 특정 장 · 색 · 3D · 숫자 | 그것만 고친다 |
| "값 복사"로 붙인 값 (`src/params.js 기본값을 … 로 바꿔줘`) | `src/params.js` 의 값만 바꾼다 |

## 2. 장 고치기 (`index.html`)

- 장 하나 = `<section class="slide">` 하나. 파일 맨 위 주석에 속성 설명이 있다.
- 제목은 `deck-plan.md` 의 "하려는 말 한 문장" 그대로. 본문은 3줄 이하. 글자 크기를 줄여 욱여넣지 않는다 — 넘치면 글을 줄인다.
- 움직임은 `data-in`(`up` · `fade` · `count`)과 `data-at`(ms)으로만. 숫자를 세게 하려면 숫자만 든 `<span data-in="count">` 에 쓴다 (쉼표 · 소수 그대로).
- 장의 `data-sec` 를 `deck-plan.md` 의 초로 맞춘다.
- 장을 더하거나 뺄 때는 `<section>` 을 통째로 복사 · 삭제한다.

## 3. 3D 고치기

- 장면은 장의 `data-scene` 으로 고른다: `globe`(지구본) · `bars`(막대) · `wave`(파동). 3D는 한 장에 하나.
- 막대 숫자: 장의 `data-values` · `data-labels` · `data-unit` 만 바꾼다. 숫자는 `deck-plan.md` · 보고서에 있는 것만.
- 색 · 속도 · 빛 번짐은 `src/params.js` 로 바꾼다. "기관 색"이라고 하면 `color` 를 기관 대표색, `accent` 를 그와 어울리는 밝은 강조색으로 정하고 무엇을 골랐는지 말한다.
- 모양을 바꿀 때는 `src/scenes/` 의 그 장면 파일만 고친다. 지킬 것 (`AGENTS.md` 3장):
  - 움직임은 `update(t, p)` 의 t로만. `Math.random` · `Date.now` · `setTimeout` 금지
  - 점 15,000개 이하 · 막대 12개 이하 · `light` 일 때 점을 줄인다
  - 새 패키지 설치 금지. 사용자가 원하면 안 되는 이유를 말하고 지금 장면으로 할 수 있는 방법을 제안한다
- 다 만든 뒤 사용자가 다듬어 달라고 하면 `impeccable` 스킬로 `src/style.css` 를 다듬는다. 글자 크기 하한(제목 72px · 본문 40px)은 지킨다.

## 4. aimotion에서 가져온 기법 옮기기

사용자가 `aimotion` 스킬로 찾은 기법을 옮겨 달라고 하면:

1. 그 기법을 데모의 소재 없이 한 문장으로 적어 먼저 보여 준다 (예: "막대 높이와 숫자를 같은 이징으로 0에서 값까지 t에 맞춰 키운다").
2. 고치는 곳은 그 장의 장면 파일(`src/scenes/…`)과 `src/params.js` 뿐이다. 데모의 소재 · 장면 · 색 · 문구 · 구도는 가져오지 않는다 — 숫자 · 이름은 `deck-plan.md` 그대로.
3. 3장의 규칙을 그대로 지킨다: 움직임은 `update(t, p)` 의 t로만 · 새 패키지 금지 · 점 · 막대 수 상한. 데모가 다른 라이브러리를 쓰면 원리만 가져와 지금 장면 코드로 다시 쓴다.
4. 확인은 아래 5장대로 한다.

## 5. 확인 — 장마다

1. `npm.cmd run build` 가 통과하는지 본다.
2. 개발 서버(http://localhost:5173)가 켜져 있어야 한다. 꺼져 있으면 사용자에게 새 창에서 `npm.cmd run dev` 를 켜 달라고 한다.
3. `ego-browser` 스킬로 http://localhost:5173/#장번호 를 열어 3초 기다린 뒤 본다: 글자가 넘치거나 겹치지 않나 · 3D가 글을 가리지 않나 · 숫자가 맞나. 고친 장만 연다.
4. 결과를 한 줄로 보고하고, 사용자에게 내 브라우저에서도 그 장을 보라고 말한다.
