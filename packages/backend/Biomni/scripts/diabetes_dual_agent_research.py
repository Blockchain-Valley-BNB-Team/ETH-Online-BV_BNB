import os
import json
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime

from biomni.agent.react import react
from biomni.config import default_config
import biomni.utils as bm_utils
import importlib


def ensure_gemini():
    """Force Gemini as the LLM provider using env or default_config."""
    if not os.getenv("GEMINI_API_KEY"):
        raise RuntimeError(
            "GEMINI_API_KEY is not set. Please set it before running this script."
        )
    os.environ.setdefault("LLM_SOURCE", "Gemini")
    # Respect user's configured model but ensure it's a gemini model
    if not default_config.llm.startswith("gemini-"):
        default_config.llm = "gemini-2.5-flash-lite"


def limit_tool_modules():
    """Limit tool loading to lightweight modules to avoid heavy optional deps.

    This monkey-patches biomni.utils.read_module2api so that the react agent only
    registers tools from selected modules (e.g., literature, database, support_tools).
    """
    def _limited_read_module2api():
        fields = [
            "literature",
            "database",
            "support_tools",
            # Add more lightweight modules here if needed
        ]
        module2api = {}
        for field in fields:
            module_name = f"biomni.tool.tool_description.{field}"
            module = __import__(module_name, fromlist=["description"])
            module2api[f"biomni.tool.{field}"] = getattr(module, "description")
        return module2api

    # Patch both utils and the react module's local binding
    bm_utils.read_module2api = _limited_read_module2api  # type: ignore
    react_module = importlib.import_module("biomni.agent.react")
    setattr(react_module, "read_module2api", _limited_read_module2api)


def make_agent(name: str) -> react:
    # Restrict tools to avoid optional dependencies like nibabel (bioimaging)
    limit_tool_modules()
    agent = react()
    # Keep defaults; tools are auto-registered. Optionally tune configure flags here
    agent.configure(plan=True, reflect=True, data_lake=False, library_access=False)
    return agent


def run_agent(agent: react, role: str, topic: str) -> dict:
    prompt = (
        f"당신은 '{role}' 역할의 바이오메디컬 연구자입니다.\n"
        f"연구 주제: {topic}\n\n"
        "목표:\n"
        "1) 최근 문헌 및 데이터 도구를 활용해 당뇨병 관련 핵심 관찰과 통찰을 5가지 내로 요약\n"
        "2) 잠정 가설 1개 도출 (짧고 검증가능한 형태)\n"
        "3) 가설 검증을 위해 필요한 데이터/실험/분석 초안 제시 (간단 단계)\n"
        "출력은 한국어로 간결하게 작성하세요."
    )
    log, answer = agent.go(prompt)
    return {"role": role, "log": log, "answer": answer}


def debate_and_refine(h1: str, h2: str) -> str:
    """Simple debate: combine, critique, and propose a unified hypothesis via Gemini LLM."""
    from biomni.llm import get_llm

    llm = get_llm(model=default_config.llm, source="Gemini", temperature=0.2)
    debate_prompt = (
        "두 명의 연구자가 아래 두 가설을 제안했습니다.\n"
        "가설 A:\n" + h1 + "\n\n"
        "가설 B:\n" + h2 + "\n\n"
        "과학적 타당성과 검증 가능성을 기준으로 각 가설의 강약점을 간단히 비교한 뒤,\n"
        "두 가설을 통합/수정하여 단 하나의 최종 가설을 한국어 한 문장으로 제시하세요."
    )
    resp = llm.invoke(debate_prompt)
    return getattr(resp, "content", str(resp))


def research_on_hypothesis(agent: react, hypothesis: str) -> str:
    prompt = (
        "최종 가설:\n" + hypothesis + "\n\n"
        "이 가설을 빠르게 점검하기 위한 문헌 중심 미니 리서치를 수행하세요.\n"
        "- 핵심 키워드와 검색 쿼리\n- 주요 근거 3~5개 (간단 인용 표시)\n- 반례/한계 1~2개\n- 다음 단계 제안 2~3개\n"
        "모든 출력은 한국어로 간결하게."
    )
    log, answer = agent.go(prompt)
    return answer


def main():
    ensure_gemini()

    topic = "제2형 당뇨병 병태생리 및 치료 타겟 탐색"

    # Create two agents with different roles
    agent1 = make_agent("병태생리학자")
    agent2 = make_agent("대사유전학자")

    with ThreadPoolExecutor(max_workers=2) as ex:
        futs = [
            ex.submit(run_agent, agent1, "병태생리학자", topic),
            ex.submit(run_agent, agent2, "대사유전학자", topic),
        ]
        results = [f.result() for f in as_completed(futs)]

    # Extract hypotheses (just use the full answers; refinement LLM will condense)
    ans1 = next((r["answer"] for r in results if r["role"] == "병태생리학자"), "")
    ans2 = next((r["answer"] for r in results if r["role"] == "대사유전학자"), "")

    unified_hypothesis = debate_and_refine(ans1, ans2)

    # Execute research on the unified hypothesis with a fresh agent (tools already registered)
    researcher = make_agent("통합연구자")
    research_summary = research_on_hypothesis(researcher, unified_hypothesis)

    # Save outputs
    ts = datetime.now().strftime("%Y%m%d_%H%M%S")
    out_dir = os.path.expanduser("~/scripts/outputs")
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, f"diabetes_dual_agents_{ts}.json")
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(
            {
                "topic": topic,
                "agent_outputs": results,
                "unified_hypothesis": unified_hypothesis,
                "research_summary": research_summary,
            },
            f,
            ensure_ascii=False,
            indent=2,
        )

    print("Saved:", out_path)


if __name__ == "__main__":
    main()


