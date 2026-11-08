import snapshot from "../../../data/snapshot.json";

// 화면이 데이터를 받는 유일한 길.
// 지금: 미리 받은 data/snapshot.json 을 그대로 돌려준다.
// PLAN.md 1단계(연결): 같은 자리에서 실제 API를 부르고, 키가 없거나 실패하면 snapshot 을 live: false 로 돌려준다 — 키는 .env.local 의 DATA_GO_KR_KEY 를 여기서만 읽는다.
export function GET() {
  return Response.json(snapshot);
}
