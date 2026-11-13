#!/usr/bin/env python3
"""Curated publisher RSS headline/link indexes; no articles downloaded.

Publisher rights and RSS reuse terms must be reviewed. This prototype captures
limited bibliographic fields only, retains source publication timestamps, and
never treats feed coverage as comprehensive historical publication coverage.
"""
import datetime as dt
import email.utils
import html
import json
import pathlib
import re
import sys
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from collections import defaultdict
from xml.sax.saxutils import escape as xesc

ROOT=pathlib.Path(__file__).resolve().parents[1]
REG=ROOT/"archive/sources/multi-publisher-registry.json"
DEST=ROOT/"archive/multi-publisher"
CACHE=DEST/"records.json"
MANIFEST=DEST/"periods.json"
AGENT="ManifoldGraceSourceIndex/0.1 (+https://manifoldgrace.github.io/multi-publisher-archive.html)"
def clean(x,limit=240):
    return re.sub(r"\s+"," ",html.unescape(re.sub(r"<[^>]*>","",x or ""))).strip()[:limit]
def date_of(x):
    if not x:return None
    try:
        v=email.utils.parsedate_to_datetime(x)
        if v.tzinfo is None:return None
        return v.astimezone(dt.timezone.utc).isoformat()
    except Exception:
        try:return dt.datetime.fromisoformat(x.replace("Z","+00:00")).astimezone(dt.timezone.utc).isoformat()
        except Exception:return None
def allowed_article_url(url):
    try:
        u=urllib.parse.urlparse(url)
        return u.scheme in ("https","http") and bool(u.hostname)
    except Exception:return False
def parse_feed(source,data):
    root=ET.fromstring(data)
    items=[]
    if root.tag.lower().endswith("rss") or root.find("channel") is not None:
        ch=root.find("channel")
        entries=ch.findall("item") if ch is not None else []
        for e in entries[:100]:
            title=clean(e.findtext("title"))
            link=clean(e.findtext("link"),1500)
            when=date_of(e.findtext("pubDate"))
            if not title or not allowed_article_url(link):continue
            items.append((title,link,when))
    else:
        ns={"a":"http://www.w3.org/2005/Atom"}
        for e in root.findall("a:entry",ns)[:100]:
            title=clean(e.findtext("a:title",default="",namespaces=ns))
            link=""
            for a in e.findall("a:link",ns):
                if a.get("rel","alternate")=="alternate":link=a.get("href","");break
            when=date_of(e.findtext("a:published",default="",namespaces=ns) or e.findtext("a:updated",default="",namespaces=ns))
            if title and allowed_article_url(link):items.append((title,link,when))
    return [{"source_id":source["id"],"publisher":source["name"],"topic":source["topic"],
      "title":a,"canonical_url":b,"published_utc":c,"date_basis":"publisher feed timestamp" if c else "date not supplied",
      "source_feed":source["feed"],"rights":"headline metadata and source link only; no article text reproduced"} for a,b,c in items]
def load():
    if not CACHE.exists():return []
    try:
        o=json.loads(CACHE.read_text(encoding="utf-8"))
        return o.get("records",[])
    except Exception:return []
def build():
    sources=json.loads(REG.read_text(encoding="utf-8"))["sources"]
    records={(r.get("source_id"),r.get("canonical_url")):r for r in load()
             if r.get("source_id") and allowed_article_url(r.get("canonical_url"))}
    run=[]
    for src in sources:
        if src.get("ingestion")!="pilot" or not src.get("feed"):continue
        try:
            req=urllib.request.Request(src["feed"],headers={"User-Agent":AGENT,"Accept":"application/rss+xml,application/xml,text/xml"})
            with urllib.request.urlopen(req,timeout=20) as response:
                data=response.read(1_500_001)
                if len(data)>1_500_000:raise ValueError("Feed size over limit")
            parsed=parse_feed(src,data)
            for r in parsed:records[(r["source_id"],r["canonical_url"])]=r
            run.append({"source_id":src["id"],"status":"fetched","item_count":len(parsed)})
        except Exception as exc:
            run.append({"source_id":src["id"],"status":"fetch_failed","error_type":type(exc).__name__})
    gathered=sorted(records.values(),key=lambda r:(r.get("published_utc") or "",r["publisher"],r["title"]),reverse=True)
    DEST.mkdir(parents=True,exist_ok=True)
    built=dt.datetime.now(dt.timezone.utc).isoformat()
    CACHE.write_text(json.dumps({"scope":"Publisher RSS metadata only, not comprehensive","generated_utc":built,
        "records":gathered},ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    periods=[]
    try:
        from reportlab.pdfgen.canvas import Canvas
        from reportlab.lib.pagesizes import A4
    except ImportError:raise SystemExit("Install reportlab for PDF generation")
    for grain in ("daily","weekly","monthly","yearly"):
        groups=defaultdict(list)
        for r in gathered:
            if not r["published_utc"]:continue
            d=dt.date.fromisoformat(r["published_utc"][:10])
            k=d.isoformat() if grain=="daily" else (d-dt.timedelta(days=d.weekday())).isoformat() if grain=="weekly" else d.strftime("%Y-%m" if grain=="monthly" else "%Y")
            groups[k].append(r)
        for key,rows in groups.items():
            rel=f"archive/multi-publisher/downloads/{grain}/{key}.pdf"
            target=ROOT/rel
            target.parent.mkdir(parents=True,exist_ok=True)
            pdf=Canvas(str(target),pagesize=A4,pageCompression=1)
            pdf.setTitle(f"Multi-publisher indexed links | {grain} {key}")
            width,height=A4
            def header():
                pdf.setFont("Helvetica-Bold",13)
                pdf.drawString(40,height-45,"International news | sourced URL index")
                pdf.setFont("Helvetica",9)
                pdf.drawString(40,height-64,f"{grain.title()}: {key} | {len(rows)} records | metadata only")
                pdf.drawString(40,height-78,"Partial RSS coverage. External articles excluded. See archive scope notes.")
            header();y=height-106
            for index,r in enumerate(sorted(rows,key=lambda v:(v["published_utc"],v["publisher"]),reverse=True),1):
                if y<74:pdf.showPage();header();y=height-106
                pdf.setFont("Helvetica-Bold",9)
                publisher=(r["publisher"]+" | "+r["published_utc"][:10])[:85]
                pdf.drawString(40,y,publisher);y-=13
                pdf.setFont("Helvetica",9)
                title=r["title"]
                for part in [title[j:j+95] for j in range(0,min(len(title),190),95)]:
                    pdf.drawString(40,y,part.encode("latin-1","replace").decode("latin-1"));y-=12
                u=r["canonical_url"]
                label=(u[:100]+"..." if len(u)>100 else u).encode("latin-1","replace").decode("latin-1")
                pdf.setFillColorRGB(.10,.33,.53)
                pdf.drawString(40,y,label)
                pdf.linkURL(u,(40,y-2,min(width-40,40+len(label)*5),y+10),relative=0)
                pdf.setFillColorRGB(0,0,0)
                y-=22
            pdf.save()
            periods.append({"period":grain,"key":key,"count":len(rows),"file":rel})
    MANIFEST.write_text(json.dumps({"generated_utc":built,"scope":"Curated RSS links, partial coverage",
        "record_count":len(gathered),"sources":run,"periods":sorted(periods,key=lambda x:(x["period"],x["key"]),reverse=True)},indent=2)+"\n",encoding="utf-8")
    print(f"Sources attempted {len(run)}, records retained {len(gathered)}, PDFs {len(periods)}")
    if not gathered:print("No publisher articles collected; source listing remains visible with honest status")
if __name__=="__main__":build()
