#!/usr/bin/env python3
"""Build a versioned headline metadata cache from the GDELT DOC API.
This collects only publicly indexed title, URL, indexing time, and publisher.
No article body, summary, or publisher photo/video is copied.
GDELT source: https://www.gdeltproject.org/ (credit required).
"""
import datetime as dt
import json
import os
import time
import urllib.parse
import urllib.request
from pathlib import Path
from urllib.parse import urlparse

SOURCES = [
    ("Al Jazeera", "aljazeera.com"),
    ("Associated Press", "apnews.com"),
    ("BBC News", "bbc.com"),
    ("CBC News", "cbc.ca"),
    ("CNA", "channelnewsasia.com"),
    ("Deutsche Welle", "dw.com"),
    ("Euronews", "euronews.com"),
    ("France 24", "france24.com"),
    ("The Guardian", "theguardian.com"),
    ("NHK World Japan", "nhk.or.jp"),
    ("NPR", "npr.org"),
    ("The New York Times", "nytimes.com"),
    ("Reuters", "reuters.com"),
    ("Sky News", "news.sky.com"),
]
OUTPUT = Path("assets/news-headlines.json")
NOW = dt.datetime.now(dt.timezone.utc)
CUTOFF = NOW - dt.timedelta(days=4)

def validate_link(url, domain):
    try:
        parsed = urlparse(url)
        h = parsed.hostname or ""
        return parsed.scheme in ("http", "https") and (h == domain or h.endswith("." + domain))
    except (ValueError, TypeError):
        return False

def region_from_path(url):
    path = urlparse(url).path.lower()
    for region, patterns in (
        ("Africa", ("africa", "afrique")),
        ("Americas", ("america", "canada", "usa", "latin-america")),
        ("Asia Pacific", ("asia", "china", "india", "japan", "singapore", "australia", "pacific")),
        ("Europe", ("europe", "europa")),
        ("Middle East", ("middle-east", "middle_east", "middleeast")),
        ("United Kingdom", ("uk", "england", "scotland", "wales", "northern-ireland")),
    ):
        if any(part in path.split("/") for part in patterns):
            return region
    return "World"

def format_date(raw):
    try:
        cleaned = raw.replace("T", "").replace("Z", "")
        if len(cleaned) == 14 and cleaned.isdigit():
            return dt.datetime.strptime(cleaned, "%Y%m%d%H%M%S").replace(tzinfo=dt.timezone.utc).isoformat().replace("+00:00", "Z")
    except ValueError:
        pass
    return ""

def download(provider, domain):
    query = urllib.parse.urlencode({
        "query": "domain:" + domain,
        "mode": "artlist",
        "maxrecords": 65,
        "timespan": "2d",
        "format": "json",
        "sort": "datedesc",
    })
    req = urllib.request.Request(
        "https://api.gdeltproject.org/api/v2/doc/doc?" + query,
        headers={"User-Agent": "ManifoldGrace-NewsMetadata/1.0 (source-attributed research index)", "Accept": "application/json"},
    )
    with urllib.request.urlopen(req, timeout=32) as response:
        data = json.load(response)
    rows = []
    seen = set()
    for a in data.get("articles", []):
        url = a.get("url")
        title = str(a.get("title") or "").strip()
        published = format_date(str(a.get("seendate") or ""))
        if not title or not validate_link(url, domain) or url in seen:
            continue
        if published and dt.datetime.fromisoformat(published.replace("Z", "+00:00")) < CUTOFF:
            continue
        rows.append({
            "provider": provider,
            "url": url,
            "title": title[:220],
            "published": published,
            "region": region_from_path(url),
            "classification": "publisher-url-path",
        })
        seen.add(url)
    rows.sort(key=lambda a: a.get("published", ""), reverse=True)
    return rows[:5]

def main():
    previous = {}
    if OUTPUT.exists():
        try:
            previous = json.loads(OUTPUT.read_text(encoding="utf-8")).get("providers", {})
        except (ValueError, OSError):
            pass
    feeds = {}
    failures = []
    for i, (provider, domain) in enumerate(SOURCES):
        if i:
            time.sleep(6)  # Avoid aggressive GDELT API polling.
        try:
            rows = download(provider, domain)
            if not rows:
                raise ValueError("No indexed articles")
            feeds[provider] = {"items": rows, "status": "indexed"}
        except Exception as exc:
            failures.append(provider + ": " + str(exc)[:120])
            # Keep only previously verifiable, explicitly dated records.
            older = previous.get(provider, {}).get("items", [])
            feeds[provider] = {"items": [x for x in older if x.get("published")][:5], "status": "stale" if older else "unavailable"}
    all_rows = []
    for record in feeds.values():
        all_rows.extend(record["items"])
    all_rows.sort(key=lambda a: a.get("published", ""), reverse=True)
    result = {
        "schema_version": 1,
        "source": "GDELT DOC API",
        "source_url": "https://www.gdeltproject.org/",
        "updated": NOW.isoformat().replace("+00:00", "Z"),
        "providers": feeds,
        "articles": all_rows,
        "status": "partial" if failures else "ok",
        "failures": failures,
    }
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(json.dumps(result, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Wrote {len(all_rows)} GDELT-indexed article records; {len(failures)} unavailable source queries")

if __name__ == "__main__":
    main()
