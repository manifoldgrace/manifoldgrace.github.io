#!/usr/bin/env python3
"""Archive Bloomberg-supplied RSS metadata only; no article text or paywall access."""
import datetime as dt
import email.utils
import json
import os
import re
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from pathlib import Path

OUT = Path("assets/bloomberg-ai-index.json")
FEEDS = {
    "Technology": "https://www.bloomberg.com/feeds/technology/news.rss",
    "Business": "https://www.bloomberg.com/feeds/business/news.rss",
    "Industries": "https://www.bloomberg.com/feeds/industries/news.rss",
    "Markets": "https://www.bloomberg.com/feeds/markets/news.rss",
}
AI_TERMS = re.compile(r"\b(ai|artificial intelligence|anthropic|openai|nvidia|chatgpt|copilot|gemini|claude|machine learning|neural network|data center|data centre|gpu|semiconductor|deep learning|robotics|chipmaker|foundation model|agentic|generative model|large language model)\b", re.I)
CATEGORIES = [
 ("Governance & regulation",r"regulat|law |lawsuit|court|antitrust|competition|governance|policy|privacy|copyright|patent"),
 ("Investment & markets",r"invest|valuation|ipo|stock|shares|market|funding|financ|revenue|profit|billion"),
 ("Infrastructure & chips",r"nvidia|gpu|chip|semiconductor|datacenter|data center|data centre|cloud|compute"),
 ("Safety & cybersecurity",r"secur|safety|risk|hack|cyber|attack|misuse|vulnerab"),
 ("Workforce & society",r"jobs|workforce|employment|labou?r|education|societ|community"),
 ("Models & research",r"model|neural|reason|robot|research|scient|agent|training|inference"),
]
def clean(value):
    return re.sub(r"\s+"," ", re.sub(r"<[^>]*>"," ",value or "")).strip()
def canonical(url):
    try:
        p=urllib.parse.urlsplit(url)
        if p.scheme not in ("http","https") or not p.hostname or not p.hostname.endswith("bloomberg.com"):
            return ""
        return urllib.parse.urlunsplit(("https",p.hostname.lower(),p.path.rstrip("/") or "/", "", ""))
    except ValueError:
        return ""
def date_utc(raw):
    if not raw: return ""
    try:
        parsed=email.utils.parsedate_to_datetime(raw)
        if parsed.tzinfo is None: parsed=parsed.replace(tzinfo=dt.timezone.utc)
        return parsed.astimezone(dt.timezone.utc).isoformat(timespec="seconds").replace("+00:00","Z")
    except (TypeError,ValueError,OverflowError):return ""
def classify(text):
    return [name for name,regex in CATEGORIES if re.search(regex,text,re.I)] or ["AI industry"]
def parse_feed(blob,feed):
    root=ET.fromstring(blob)
    entries=[]
    for item in root.findall(".//item"):
        grab=lambda tag: clean(item.findtext(tag) or "")
        title=grab("title")
        description=grab("description")
        link=canonical(grab("link") or grab("guid"))
        published=date_utc(grab("pubDate"))
        if not title or not link or not published: continue
        if not AI_TERMS.search(title+" "+description): continue
        creator=clean(item.findtext("{http://purl.org/dc/elements/1.1/}creator") or item.findtext("author") or "")
        entries.append({"title":title[:240],"url":link,"published":published,"authors":creator[:150],"categories":classify(title+" "+description),"feeds":[feed]})
    return entries
def main():
    existing={"articles":[]}
    if OUT.exists():
        try: existing=json.loads(OUT.read_text(encoding="utf-8"))
        except (ValueError,OSError): pass
    lookup={x["url"]:x for x in existing.get("articles",[]) if isinstance(x,dict) and x.get("url")}
    report={}
    for name,url in FEEDS.items():
        try:
            request=urllib.request.Request(url,headers={"User-Agent":"ManifoldGrace-ResearchIndex/1.0 (+https://manifoldgrace.github.io/); RSS metadata archive","Accept":"application/rss+xml, application/xml, text/xml"})
            with urllib.request.urlopen(request,timeout=30) as response: blob=response.read(2_000_000)
            stories=parse_feed(blob,name)
            report[name]={"status":"ok","matches":len(stories)}
            for story in stories:
                key=story["url"]
                if key in lookup:
                    original=lookup[key]
                    original["feeds"]=sorted(set(original.get("feeds",[])+story["feeds"]))
                    if not original.get("authors") and story["authors"]:original["authors"]=story["authors"]
                else:lookup[key]=story
        except Exception as exc:
            report[name]={"status":"unavailable","reason":type(exc).__name__}
    successes=sum(x["status"]=="ok" for x in report.values())
    if not successes:
        print("No RSS feeds accessible; retaining existing archive; no false refresh claim.")
        raise SystemExit(1)
    articles=sorted(lookup.values(),key=lambda x:(x.get("published",""),x.get("url","")),reverse=True)[:10000]
    output={"schema_version":1,"source":"Bloomberg RSS metadata","archive_updated_utc":dt.datetime.now(dt.timezone.utc).isoformat(timespec="seconds").replace("+00:00","Z"),"feed_status":report,"article_count":len(articles),"articles":articles}
    OUT.parent.mkdir(parents=True,exist_ok=True)
    OUT.write_text(json.dumps(output,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    print(f"Archived {len(articles)} unique matching links; successful feeds: {successes}.")
if __name__=="__main__":main()
