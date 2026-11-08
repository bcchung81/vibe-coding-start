// Vercel 배포 — .env.local 의 VERCEL_TOKEN 으로 vercel.cmd 를 부른다 (vibe-develop 스킬이 실행한다).
//   node scripts/vercel.mjs whoami
//   node scripts/vercel.mjs project create kca02-hong
//   node scripts/vercel.mjs link --yes --project kca02-hong
//   node scripts/vercel.mjs env-add DATA_GO_KR_KEY      ← .env.local 의 값을 production 환경변수로 등록
//   node scripts/vercel.mjs deploy --prod --yes
// 토큰 · 키 값은 명령에도 화면에도 쓰지 않는다. 토큰은 환경변수 VERCEL_TOKEN 으로, 키는 표준입력으로만 넘긴다.
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";

const args = process.argv.slice(2);
if (!args.length) {
  console.error("사용법: node scripts/vercel.mjs <vercel 명령 ...>  (예: whoami · deploy --prod --yes · env-add DATA_GO_KR_KEY)");
  process.exit(1);
}

const token = readEnv("VERCEL_TOKEN");
if (!token) {
  console.error("VERCEL_TOKEN 이 없습니다 — vercel.com → Account Settings → Tokens 에서 만든 토큰을 사용자가 직접 .env.local 에 VERCEL_TOKEN=토큰 으로 넣어야 합니다 (시작하기.md 3번).");
  process.exit(1);
}

let input;
let cli = args;
if (args[0] === "env-add") {
  const name = args[1];
  input = name ? readEnv(name) : "";
  if (!input) {
    console.error(`.env.local 에 ${name ?? "(이름)"} 값이 없습니다 — 사용자가 직접 넣어야 합니다.`);
    process.exit(1);
  }
  cli = ["env", "add", name, "production", "--force", "--yes"];
}

// Windows 는 vercel.cmd(배치 파일)라 셸을 거쳐야 실행된다. 인자는 명령 이름 · 옵션뿐이라 그대로 넘긴다.
const win = process.platform === "win32";
const r = spawnSync(win ? "vercel.cmd" : "vercel", cli, {
  env: { ...process.env, VERCEL_TOKEN: token },
  input,
  stdio: [input === undefined ? "inherit" : "pipe", "inherit", "inherit"],
  shell: win,
});
if (r.error) console.error(`vercel 을 실행하지 못했습니다 (${r.error.code ?? r.error.message}) — 새 창에서 vercel.cmd --version 을 확인하세요.`);
process.exit(r.status ?? 1);

function readEnv(name) {
  if (!existsSync(".env.local")) return "";
  const line = readFileSync(".env.local", "utf8").split(/\r?\n/).find((l) => l.trim().startsWith(`${name}=`) || new RegExp(`^\\s*${name}\\s*=`).test(l));
  return line ? line.slice(line.indexOf("=") + 1).trim().replace(/^["']|["']$/g, "") : "";
}
