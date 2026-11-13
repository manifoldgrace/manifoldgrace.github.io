#!/usr/bin/env python3
"""Build reusable daily/weekly/monthly/yearly public-record PDF bundles.

Scope: the operator's own PUBLIC dated log entries only. Third-party articles
are referenced by URL, never copied. Uses only public site content.
"""
from __future__ import annotations
import argparse, csv, datetime as dt, hashlib, json, re, html
from collections import defaultdict
from pathlib import Path
from urllib.parse import urljoin, urlsplit
from bs4 import BeautifulSoup
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, KeepTogether, PageBreak

ROOT=Path(__file__).resolve().parents[1]
BASE="https://manifoldgrace.github.io/"
DATE=re.compile(r"^20\d{2}-\d{2}-\d{2}$")
OUT=ROOT/"archive"
def valid_url(href):
    if not href or href.startswith(("#","mailto:","javascript:","data:")): return ""
    url=urljoin(BASE,href)
    s=urlsplit(url)
    return url if s.scheme in ("https","http") and s.hostname else ""
def extract_records(path):
    soup=BeautifulSoup(path.read_text(encoding="utf-8"),"html.parser")
    records=[]
    for block in soup.find_all(["article","section"]):
        tables=block.select("table.progression-table")
        if not tables: continue
        # Only top-level dated blocks; exclude undated ancestor sections.
        if not ("log-day" in (block.get("class") or []) or DATE.match(block.get("id") or "")):continue
        date_el=block.select_one("time[datetime]")
        published=(date_el.get("datetime","")[:10] if date_el else "")
        if not DATE.match(published):
            published=(block.get("id","") if DATE.match(block.get("id","")) else "")
        if not published:continue
        try: dt.date.fromisoformat(published)
        except ValueError:continue
        for table in tables:
            body=table.find("tbody")
            if not body:continue
            for index,tr in enumerate(body.find_all("tr",recursive=False),1):
                cells=tr.find_all(["td","th"],recursive=False)
                if not cells:continue
                title=" ".join(cells[0].stripped_strings).strip()
                if not title:continue
                rid=tr.get("id") or ""
                identity=f"{published}|{rid}|{title}"
                record_id=rid or hashlib.sha256(identity.encode()).hexdigest()[:16]
                link=tr.find("a",href=True)
                evidence=valid_url(link["href"]) if link else ""
                source_url=BASE+"productivity-log.html"+("#"+rid if rid else "#"+(block.get("id") or ""))
                records.append({
                    "record_id":record_id,"recorded_date":published,
                    "original_publication_date":None,
                    "date_basis":"dated public productivity-log record, not original publication date of cited external content",
                    "title":title[:350],"source_url":source_url,
                    "evidence_url":evidence,
                    "source_type":"Manifold Grace public activity log",
                    "rights_scope":"original catalogue metadata and links; externally linked content excluded"
                })
    unique={}
    for rec in records:unique[(rec["recorded_date"],rec["record_id"])]=rec
    return sorted(unique.values(),key=lambda r:(r["recorded_date"],r["record_id"]),reverse=True)

def key_for(rec,period):
    day=dt.date.fromisoformat(rec["recorded_date"])
    if period=="daily":return day.isoformat()
    if period=="weekly":
        start=day-dt.timedelta(days=day.weekday())
        return start.isoformat()
    if period=="monthly":return day.strftime("%Y-%m")
    if period=="yearly":return day.strftime("%Y")
    raise ValueError(period)

def render_pdf(records,path,label,generated_at):
    path.parent.mkdir(parents=True,exist_ok=True)
    styles=getSampleStyleSheet()
    styles.add(ParagraphStyle(name="ArchiveHeading",parent=styles["Heading1"],fontName="Helvetica-Bold",fontSize=16,leading=20,spaceAfter=10,textColor=colors.HexColor("#202020")))
    styles.add(ParagraphStyle(name="ArchiveEntry",parent=styles["Normal"],fontName="Helvetica",fontSize=9.5,leading=13,spaceAfter=7))
    styles.add(ParagraphStyle(name="ArchiveSmall",parent=styles["Normal"],fontName="Helvetica",fontSize=8,leading=11,spaceAfter=6,textColor=colors.HexColor("#555555")))
    styles.add(ParagraphStyle(name="ArchiveDate",parent=styles["Heading3"],fontName="Helvetica-Bold",fontSize=11,leading=14,spaceBefore=12,spaceAfter=5))
    pdf=SimpleDocTemplate(str(path),pagesize=A4,leftMargin=20*mm,rightMargin=20*mm,topMargin=20*mm,bottomMargin=19*mm,
        title="Manifold Grace Public Publication Directory - "+label,author="Manifold Grace",subject="Index and links only; third-party article bodies are excluded")
    story=[Paragraph("Manifold Grace | Public Evidence Directory",styles["ArchiveHeading"]),
           Paragraph("<b>"+html.escape(label)+"</b> - "+str(len(records))+" public dated log records",styles["Normal"]),Spacer(1,8),
           Paragraph("Generated UTC: "+generated_at+" | Source: public productivity log | Original source articles are not reproduced.",styles["ArchiveSmall"]),
           Paragraph("Date integrity: the dates below are dates of the public log entries, not independently established original publication dates of linked external articles. An archive is not evidence that all historical publications have been captured.",styles["ArchiveSmall"]),
           Paragraph("Access: machine-readable JSON/CSV and a searchable HTML directory accompany these PDFs. PDF/UA conformance has NOT been independently established.",styles["ArchiveSmall"])]
    last=None
    for r in sorted(records,key=lambda r:(r["recorded_date"],r["record_id"]),reverse=True):
        if r["recorded_date"]!=last:
            story.append(Paragraph(html.escape(r["recorded_date"]),styles["ArchiveDate"]))
            last=r["recorded_date"]
        title=html.escape(r["title"])
        url=html.escape(r["source_url"],quote=True)
        text=f'<b>{title}</b><br/><link href="{url}" color="#214b79">Original public log entry</link>'
        if r["evidence_url"]:
            evidence=html.escape(r["evidence_url"],quote=True)
            text+=f' | <link href="{evidence}" color="#214b79">Source evidence link</link>'
        story.append(Paragraph(text,styles["ArchiveEntry"]))
    def page(canvas,doc):
        canvas.setFont("Helvetica",8);canvas.setFillColor(colors.HexColor("#555555"))
        canvas.drawString(20*mm,12*mm,"Manifold Grace | Public dated records | Links and metadata only")
        canvas.drawRightString(190*mm,12*mm,f"Page {doc.page}")
    pdf.build(story,onFirstPage=page,onLaterPages=page)

def build(source,out):
    records=extract_records(source)
    out.mkdir(parents=True,exist_ok=True)
    metadata=out/"metadata";metadata.mkdir(parents=True,exist_ok=True)
    generated=dt.datetime.now(dt.timezone.utc).isoformat(timespec="seconds").replace("+00:00","Z")
    (metadata/"publication-records.json").write_text(json.dumps({"schema_version":1,"generated_utc":generated,
        "scope":"Public dated Manifold Grace productivity-log entries only","count":len(records),"records":records},indent=2,ensure_ascii=False)+"\n",encoding="utf-8")
    fields=["record_id","recorded_date","original_publication_date","date_basis","title","source_url","evidence_url","source_type","rights_scope"]
    with (metadata/"publication-records.csv").open("w",encoding="utf-8",newline="") as fd:
        w=csv.DictWriter(fd,fieldnames=fields);w.writeheader();w.writerows(records)
    periods=[]
    for kind in ("daily","weekly","monthly","yearly"):
        groups=defaultdict(list)
        for r in records:groups[key_for(r,kind)].append(r)
        for key,group in sorted(groups.items(),reverse=True):
            rel=f"archive/downloads/{kind}/{key}.pdf"
            render_pdf(group,ROOT/rel,f"{kind.capitalize()} | {key}",generated)
            periods.append({"period":kind,"key":key,"count":len(group),"file":rel,"start_date":min(x["recorded_date"] for x in group),
                "end_date":max(x["recorded_date"] for x in group)})
    if records:
        render_pdf(records,ROOT/"archive/downloads/all-records.pdf","Complete indexed public log",generated)
    (metadata/"periods.json").write_text(json.dumps({"generated_utc":generated,"scope":"Manifold Grace public log","record_count":len(records),
        "periods":periods,"all_pdf":"archive/downloads/all-records.pdf" if records else None},indent=2)+"\n",encoding="utf-8")
    print(f"{len(records)} log records, {len(periods)} time-period PDFs + complete index")
    return records,periods

if __name__=="__main__":
    p=argparse.ArgumentParser();p.add_argument("--source",type=Path,default=ROOT/"productivity-log.html");p.add_argument("--out",type=Path,default=OUT)
    a=p.parse_args();build(a.source,a.out)
