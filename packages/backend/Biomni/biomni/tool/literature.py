import os
import re
import time
from io import BytesIO
from urllib.parse import urljoin

import PyPDF2
import requests
from bs4 import BeautifulSoup
from googlesearch import search

from biomni.llm import get_llm
from biomni.config import default_config

# DuckDuckGo 검색 fallback (환경에 따라 googlesearch가 빈 결과를 반환하는 경우 대비)
try:
    from duckduckgo_search import DDGS  # type: ignore
except Exception:
    DDGS = None

def fetch_supplementary_info_from_doi(doi: str, output_dir: str = "supplementary_info"):
    """Fetches supplementary information for a paper given its DOI and returns a research log.

    Args:
        doi: The paper DOI.
        output_dir: Directory to save supplementary files.

    Returns:
        dict: A dictionary containing a research log and the downloaded file paths.

    """
    research_log = []
    research_log.append(f"Starting process for DOI: {doi}")

    # CrossRef API to resolve DOI to a publisher page
    crossref_url = f"https://doi.org/{doi}"
    headers = {"User-Agent": "Mozilla/5.0"}
    response = requests.get(crossref_url, headers=headers)

    if response.status_code != 200:
        log_message = f"Failed to resolve DOI: {doi}. Status Code: {response.status_code}"
        research_log.append(log_message)
        return {"log": research_log, "files": []}

    publisher_url = response.url
    research_log.append(f"Resolved DOI to publisher page: {publisher_url}")

    # Fetch publisher page
    response = requests.get(publisher_url, headers=headers)
    if response.status_code != 200:
        log_message = f"Failed to access publisher page for DOI {doi}."
        research_log.append(log_message)
        return {"log": research_log, "files": []}

    # Parse page content
    soup = BeautifulSoup(response.content, "html.parser")
    supplementary_links = []

    # Look for supplementary materials by keywords or links
    for link in soup.find_all("a", href=True):
        href = link.get("href")
        text = link.get_text().lower()
        if "supplementary" in text or "supplemental" in text or "appendix" in text:
            full_url = urljoin(publisher_url, href)
            supplementary_links.append(full_url)
            research_log.append(f"Found supplementary material link: {full_url}")

    if not supplementary_links:
        log_message = f"No supplementary materials found for DOI {doi}."
        research_log.append(log_message)
        return research_log

    # Create output directory
    os.makedirs(output_dir, exist_ok=True)
    research_log.append(f"Created output directory: {output_dir}")

    # Download supplementary materials
    downloaded_files = []
    for link in supplementary_links:
        file_name = os.path.join(output_dir, link.split("/")[-1])
        file_response = requests.get(link, headers=headers)
        if file_response.status_code == 200:
            with open(file_name, "wb") as f:
                f.write(file_response.content)
            downloaded_files.append(file_name)
            research_log.append(f"Downloaded file: {file_name}")
        else:
            research_log.append(f"Failed to download file from {link}")

    if downloaded_files:
        research_log.append(f"Successfully downloaded {len(downloaded_files)} file(s).")
    else:
        research_log.append(f"No files could be downloaded for DOI {doi}.")

    return "\n".join(research_log)


def query_arxiv(query: str, max_papers: int = 10) -> str:
    """Query arXiv for papers based on the provided search query.

    Parameters
    ----------
    - query (str): The search query string.
    - max_papers (int): The maximum number of papers to retrieve (default: 10).

    Returns
    -------
    - str: The formatted search results or an error message.

    """
    import arxiv

    try:
        client = arxiv.Client()
        search = arxiv.Search(query=query, max_results=max_papers, sort_by=arxiv.SortCriterion.Relevance)
        results = "\n\n".join([f"Title: {paper.title}\nSummary: {paper.summary}" for paper in client.results(search)])
        return results if results else "No papers found on arXiv."
    except Exception as e:
        return f"Error querying arXiv: {e}"


def query_scholar(query: str) -> str:
    """Query Google Scholar for papers based on the provided search query.

    Parameters
    ----------
    - query (str): The search query string.

    Returns
    -------
    - str: The first search result formatted or an error message.

    """
    from scholarly import scholarly

    try:
        search_query = scholarly.search_pubs(query)
        result = next(search_query, None)
        if result:
            return f"Title: {result['bib']['title']}\nYear: {result['bib']['pub_year']}\nVenue: {result['bib']['venue']}\nAbstract: {result['bib']['abstract']}"
        else:
            return "No results found on Google Scholar."
    except Exception as e:
        return f"Error querying Google Scholar: {e}"


def query_pubmed(query: str, max_papers: int = 10, max_retries: int = 3) -> str:
    """Query PubMed for papers based on the provided search query.

    Parameters
    ----------
    - query (str): The search query string.
    - max_papers (int): The maximum number of papers to retrieve (default: 10).
    - max_retries (int): Maximum number of retry attempts with modified queries (default: 3).

    Returns
    -------
    - str: The formatted search results or an error message.

    """
    from pymed import PubMed

    try:
        # PubMed는 유효한 email이 필요함: 환경변수 PUBMED_EMAIL로 지정 가능
        pubmed_email = os.getenv("PUBMED_EMAIL", "your-email@example.com")
        pubmed = PubMed(tool="MyTool", email=pubmed_email)

        # Initial attempt
        papers = list(pubmed.query(query, max_results=max_papers))

        # Retry with modified queries if no results
        retries = 0
        while not papers and retries < max_retries:
            retries += 1
            # Simplify query with each retry by removing the last word
            simplified_query = " ".join(query.split()[:-retries]) if len(query.split()) > retries else query
            time.sleep(1)  # Add delay between requests
            papers = list(pubmed.query(simplified_query, max_results=max_papers))

        if papers:
            results = "\n\n".join(
                [f"Title: {paper.title}\nAbstract: {paper.abstract}\nJournal: {paper.journal}" for paper in papers]
            )
            return results
        else:
            return "No papers found on PubMed after multiple query attempts."
    except Exception as e:
        return f"Error querying PubMed: {e}"


def search_google(query: str, num_results: int = 3, language: str = "en") -> list[dict]:
    """웹 검색 결과를 리스트(dict)로 반환합니다. DuckDuckGo 우선, Google 스크래핑 보조."""
    results: list[dict] = []
    try:
        # 1) DuckDuckGo 우선 시도 (더 안정적으로 결과를 주는 경우가 많음)
        if DDGS is not None:
            with DDGS() as ddgs:
                for r in ddgs.text(query, region="us-en", safesearch="moderate", max_results=num_results):
                    link = r.get("href") or r.get("url") or r.get("link")
                    results.append({
                        "title": r.get("title", ""),
                        "link": link or "",
                        "snippet": r.get("body", "")
                    })
        # 2) 결과가 부족하면 googlesearch로 보완
        if len(results) < num_results:
            need = num_results - len(results)
            search_query = f"{query}"
            print(f"Searching for {search_query} with {need} results and {language} language (google fallback)")
            count = 0
            for res in search(search_query, num_results=num_results, lang=language, advanced=True):
                results.append({
                    "title": res.title,
                    "link": res.url,
                    "snippet": res.description or ""
                })
                count += 1
                if count >= need:
                    break
    except Exception as e:
        print(f"Error performing search: {str(e)}")
    return results


def advanced_web_search_claude(
    query: str,
    max_searches: int = 1,
    max_retries: int = 3,
) -> str:
    """
    Gemini 전용 경로로 대체된 wrapper.
    기존 Claude 전용 API 대신 `advanced_web_search_gemini`를 호출합니다.
    파라미터 호환을 위해 시그니처는 유지하되, 내부적으로 Gemini를 사용합니다.
    """
    # max_searches는 Gemini 경로에서 num_results로 사용
    return advanced_web_search_gemini(query=query, max_sources=max_searches)


def extract_url_content(url: str) -> str:
    """Extract the text content of a webpage using requests and BeautifulSoup.

    Args:
        url: Webpage URL to extract content from

    Returns:
        Text content of the webpage

    """
    response = requests.get(url, headers={"User-Agent": "Mozilla/5.0"})

    # Check if the response is in text format
    if "text/plain" in response.headers.get("Content-Type", "") or "application/json" in response.headers.get(
        "Content-Type", ""
    ):
        return response.text.strip()  # Return plain text or JSON response directly

    # If it's HTML, use BeautifulSoup to parse
    soup = BeautifulSoup(response.text, "html.parser")

    # Try to find main content first, fallback to body, 마지막으로 전체 텍스트
    content = soup.find("main") or soup.find("article") or soup.body
    if content is None:
        return soup.get_text(" ", strip=True)

    # Remove unwanted elements
    for element in content(["script", "style", "nav", "header", "footer", "aside", "iframe"]):
        element.decompose()

    # Extract text with better formatting
    paragraphs = content.find_all(["p", "h1", "h2", "h3", "h4", "h5", "h6"])
    cleaned_text = []

    for p in paragraphs:
        text = p.get_text().strip()
        if text:  # Only add non-empty paragraphs
            cleaned_text.append(text)

    return "\n\n".join(cleaned_text)

# 새 함수(파일 하단에 추가)
def query_pubmed_structured(query: str, max_papers: int = 10, max_retries: int = 3) -> list[dict]:
    text = query_pubmed(query=query, max_papers=max_papers, max_retries=max_retries)
    if not text or text.startswith("Error") or text.startswith("No papers"):
        return []
    items = []
    for chunk in text.split("\n\n"):
        title = None
        abstract = None
        journal = None
        for line in chunk.splitlines():
            if line.startswith("Title: "):
                title = line.removeprefix("Title: ").strip()
            elif line.startswith("Abstract: "):
                abstract = line.removeprefix("Abstract: ").strip()
            elif line.startswith("Journal: "):
                journal = line.removeprefix("Journal: ").strip()
        if title:
            items.append({"title": title, "abstract": abstract or "", "journal": journal or ""})
    return items

def advanced_web_search_gemini(query: str, max_sources: int = 5, per_source_chars: int = 2500) -> str:
    """
    Gemini를 사용해 웹 검색 결과를 요약하고 출처를 함께 제시합니다.
    - 검색: 내장 googlesearch 사용
    - 컨텐츠 수집: extract_url_content 재사용
    - 요약: get_llm()으로 Gemini 호출
    """
    # 1) 검색
    hits = search_google(query, num_results=max_sources, language="en")
    if not hits:
        return "No results found."

    # 2) 본문 수집
    sources = []
    for h in hits:
        try:
            text = extract_url_content(h["link"])
            if isinstance(text, str) and text:
                sources.append({
                    "title": h["title"],
                    "url": h["link"],
                    "content": (text[:per_source_chars] + "…") if len(text) > per_source_chars else text
                })
        except Exception:
            pass
    if not sources:
        return "Failed to extract content from search results."

    # 3) 프롬프트 구성
    context_chunks = []
    for i, s in enumerate(sources, 1):
        context_chunks.append(f"[{i}] {s['title']} ({s['url']})\n{s['content']}\n")
    context = "\n\n".join(context_chunks)
    prompt = (
        "You are a scientific assistant. Using the sources below, answer concisely in Korean.\n"
        "Include numbered citations like [1], [2] where appropriate, and provide a short bullet summary.\n\n"
        f"Question:\n{query}\n\n"
        f"Sources:\n{context}\n\n"
        "Answer:"
    )

    # 4) Gemini 호출
    llm = get_llm(model=default_config.llm, source="Gemini", temperature=0.2)
    result = llm.invoke(prompt)
    return result.content if hasattr(result, "content") else str(result)

def extract_pdf_content(url: str) -> str:
    """Extract the text content of a PDF file given its URL.

    Args:
        url: URL of the PDF file to extract text from

    Returns:
        The extracted text content from the PDF

    """
    try:
        # Check if the URL ends with .pdf
        if not url.lower().endswith(".pdf"):
            # If not, try to find a PDF link on the page
            response = requests.get(url, timeout=30)
            if response.status_code == 200:
                # Look for PDF links in the HTML content
                pdf_links = re.findall(r'href=[\'"]([^\'"]+\.pdf)[\'"]', response.text)
                if pdf_links:
                    # Use the first PDF link found
                    if not pdf_links[0].startswith("http"):
                        # Handle relative URLs
                        base_url = "/".join(url.split("/")[:3])
                        url = base_url + pdf_links[0] if pdf_links[0].startswith("/") else base_url + "/" + pdf_links[0]
                    else:
                        url = pdf_links[0]
                else:
                    return f"No PDF file found at {url}. Please provide a direct link to a PDF file."

        # Download the PDF
        response = requests.get(url, timeout=30)

        # Check if we actually got a PDF file (by checking content type or magic bytes)
        content_type = response.headers.get("Content-Type", "").lower()
        if "application/pdf" not in content_type and not response.content.startswith(b"%PDF"):
            return f"The URL did not return a valid PDF file. Content type: {content_type}"

        pdf_file = BytesIO(response.content)

        # Try with PyPDF2 first
        try:
            text = ""
            pdf_reader = PyPDF2.PdfReader(pdf_file)
            for page_num in range(len(pdf_reader.pages)):
                page = pdf_reader.pages[page_num]
                text += page.extract_text() + "\n\n"
        except Exception as e:
            print(f"Error extracting text from PDF: {str(e)}")

        # Clean up the text
        text = re.sub(r"\s+", " ", text).strip()

        if not text:
            return "The PDF file did not contain any extractable text. It may be an image-based PDF requiring OCR."

        return text

    except requests.exceptions.RequestException as e:
        return f"Error downloading PDF: {str(e)}"
    except Exception as e:
        return f"Error extracting text from PDF: {str(e)}"

