import os
import re
import json
import argparse
from pathlib import Path
from datetime import datetime

def find_input_path(cli_in: str | None) -> Path:
    if cli_in:
        p = Path(cli_in)
        if not p.exists():
            raise FileNotFoundError(f"Input JSON not found: {p}")
        return p
    base = Path("scripts") / "outputs"
    if not base.exists():
        raise FileNotFoundError(f"Outputs directory not found: {base}")
    candidates = sorted(base.glob("diabetes_dual_agents_*.json"), key=lambda p: p.stat().st_mtime, reverse=True)
    if not candidates:
        raise FileNotFoundError(f"No matching JSON in {base}")
    return candidates[0]

def load_data(in_path: Path) -> dict:
    with in_path.open("r", encoding="utf-8") as f:
        return json.load(f)

def write_text(path: Path, content: str):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")

def build_report_md(data: dict, ts: str) -> str:
    topic = data.get("topic", "")
    hypo = (data.get("unified_hypothesis", "") or "").strip()
    summary = (data.get("research_summary", "") or "").strip()
    agents = data.get("agent_outputs", [])

    def section(title, body):
        return f"## {title}\n\n{body}\n\n"

    agent_blurbs = []
    for a in agents:
        role = a.get("role", "")
        ans = (a.get("answer", "") or "").strip()
        agent_blurbs.append(f"### 에이전트: {role}\n\n{ans}\n")

    report = []
    report.append(f"# 제2형 당뇨 연구 리포트 ({ts})\n\n")
    report.append(section("주제", topic))
    report.append(section("최종 통합 가설", hypo))
    report.append("---\n\n")
    report.append(section("연구 요약", summary))
    report.append("---\n\n")
    report.append(section("에이전트 결과", "\n".join(agent_blurbs)))
    return "".join(report)

def extract_actions(summary: str) -> list[str]:
    actions: list[str] = []
    for line in summary.splitlines():
        s = line.strip()
        if "제안 " in s or s.startswith("- 제안"):
            actions.append(s)
    if not actions:
        for line in summary.splitlines():
            s = line.strip()
            if ("다음 단계" in s) or ("추가 연구" in s):
                actions.append(s)
    return actions

def extract_queries(summary: str) -> list[str]:
    queries: list[str] = []
    capture = False
    for line in summary.splitlines():
        if "검색 쿼리:" in line:
            capture = True
            continue
        if capture:
            s = line.strip()
            if s.startswith("*") or s.startswith("-"):
                q = re.sub(r"^[*-]\s*", "", s)
                if q:
                    queries.append(q)
            else:
                break
    return queries

def main():
    parser = argparse.ArgumentParser(description="Post-process diabetes dual-agent output JSON.")
    parser.add_argument("--in", dest="in_path", required=False, help="Input JSON path. If omitted, newest JSON in scripts/outputs is used.")
    parser.add_argument("--out-dir", dest="out_dir", default=str(Path("scripts") / "outputs"), help="Output directory.")
    args = parser.parse_args()

    in_path = find_input_path(args.in_path)
    data = load_data(in_path)

    ts = datetime.now().strftime("%Y%m%d_%H%M%S")
    out_dir = Path(args.out_dir)

    md_path = out_dir / f"diabetes_report_{ts}.md"
    actions_path = out_dir / f"diabetes_actions_{ts}.md"
    queries_path = out_dir / f"diabetes_queries_{ts}.txt"

    summary = (data.get("research_summary", "") or "").strip()

    report_md = build_report_md(data, ts)
    write_text(md_path, report_md)

    actions = extract_actions(summary)
    actions_md = "# 후속 액션 아이템\n\n" + ("\n".join(f"- {a}" for a in actions) if actions else "- (요약에서 액션 아이템 패턴을 찾지 못했습니다)\n")
    write_text(actions_path, actions_md)

    queries = extract_queries(summary)
    write_text(queries_path, "\n".join(queries))

    print("Saved:")
    print(md_path)
    print(actions_path)
    print(queries_path)

if __name__ == "__main__":
    main()