// API 시험 — 주제 카드의 API를 5건만 불러 api-test.md 에 표로 남긴다 (vibe-plan 스킬이 실행한다).
//   node scripts/api-test.mjs <요청 주소> <목록 경로> [변수=값 ...]
//   예: node scripts/api-test.mjs https://apis.data.go.kr/B552729/kcaApiService_cq1/getCqNotice body.items.list pageNo=1 numOfRows=5
// 키는 .env.local 의 DATA_GO_KR_KEY(Decoding 키)를 여기서만 읽어 serviceKey 로 붙인다. 키 값은 화면 · 파일 어디에도 쓰지 않는다.
import { existsSync, readFileSync, writeFileSync } from "node:fs";

const [endpoint, listPath, ...pairs] = process.argv.slice(2);
if (!endpoint || !listPath) {
  console.error("사용법: node scripts/api-test.mjs <요청 주소> <목록 경로> [변수=값 ...]");
  process.exit(1);
}

const key = readKey();
if (!key) {
  console.error("키가 없습니다 — .env.local 에 DATA_GO_KR_KEY=Decoding키 를 사용자가 직접 넣어야 합니다 (시작하기.md 3번).");
  process.exit(1);
}
const hide = (text) => String(text).split(key).join("(키)").split(encodeURIComponent(key)).join("(키)");

const url = new URL(endpoint);
for (const pair of pairs) {
  const at = pair.indexOf("=");
  if (at > 0) url.searchParams.set(pair.slice(0, at), pair.slice(at + 1));
}
const shown = url.toString(); // 키를 붙이기 전 주소 — 보고용
url.searchParams.set("serviceKey", key);

let res;
try {
  res = await fetch(url, { signal: AbortSignal.timeout(15000), headers: { accept: "application/json" } });
} catch (err) {
  console.error(`연결 실패: ${hide(err.cause?.code ?? err.message)} — 인터넷 · 보안 프로그램을 확인하세요.`);
  process.exit(1);
}
const text = await res.text();
let body;
try {
  body = JSON.parse(text);
} catch {
  console.error(`JSON이 아닌 응답 (HTTP ${res.status}): ${hide(text.slice(0, 300))}`);
  process.exit(1);
}

const rows = listPath.split(".").reduce((v, k) => (v == null ? v : v[k]), body);
if (!Array.isArray(rows)) {
  const msg = body.header?.resultMsg ?? body.response?.header?.resultMsg ?? body.OpenAPI_ServiceResponse?.cmmMsgHeader?.returnAuthMsg ?? body.msg ?? body.message ?? "";
  console.error(`목록을 찾지 못했습니다 (HTTP ${res.status}, 경로 ${listPath}) ${hide(msg)}`);
  console.error(`응답 맨 위 항목: ${Object.keys(body).join(", ")}`);
  process.exit(1);
}

const five = rows.slice(0, 5);
const total = body.totalCount ?? body.body?.totalCount ?? body.matchCount;
const names = [...new Set(five.flatMap((r) => Object.keys(r)))];
const cell = (v) => {
  const s = v == null ? "" : typeof v === "object" ? JSON.stringify(v) : String(v);
  const plain = s.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();
  return (plain.length > 30 ? plain.slice(0, 30) + "…" : plain).replaceAll("|", "\\|");
};
const kind = (v) => (v == null ? "없음" : Array.isArray(v) ? "목록" : typeof v === "number" ? "숫자" : typeof v === "object" ? "묶음" : /<[a-z][^>]*>/i.test(v) ? "글자(HTML)" : "글자");

const md = [
  "# API 시험 — 5건",
  "",
  `- 요청: \`${shown}\` + serviceKey(.env.local)`,
  `- 받은 줄: ${five.length}${total != null ? ` (전체 ${total})` : ""} · 목록 경로 \`${listPath}\``,
  "",
  "## 실제로 온 항목",
  "",
  "| 항목 | 형식 | 첫 줄 값 |",
  "|---|---|---|",
  ...names.map((n) => `| \`${n}\` | ${kind(five[0]?.[n])} | ${cell(five[0]?.[n])} |`),
  "",
  "## 5건",
  "",
  `| # | ${names.map((n) => `\`${n}\``).join(" | ")} |`,
  `|---|${names.map(() => "---").join("|")}|`,
  ...five.map((r, i) => `| ${i + 1} | ${names.map((n) => cell(r[n])).join(" | ")} |`),
  "",
  "## 설명서와 다른 점",
  "",
  "| 항목 | 설명서 | 실제로 온 것 |",
  "|---|---|---|",
  "",
].join("\n");
writeFileSync("api-test.md", md);
console.log(`api-test.md 에 ${five.length}건을 썼습니다 — 항목 ${names.length}개.`);

function readKey() {
  if (!existsSync(".env.local")) return "";
  const line = readFileSync(".env.local", "utf8").split(/\r?\n/).find((l) => /^\s*DATA_GO_KR_KEY\s*=/.test(l));
  return line ? line.slice(line.indexOf("=") + 1).trim().replace(/^["']|["']$/g, "") : "";
}
