#!/usr/bin/env python3
"""Refresh metadata for allowlisted PUBLIC Zenodo records. Never publish Docs."""
import datetime, json, pathlib, urllib.request, urllib.error
ROOT=pathlib.Path(__file__).resolve().parents[1]
PATH=ROOT/"assets/research/connected-publications.json"
APPROVALS=ROOT/"assets/research/approved-google-docs.json"
def fetch_json(url):
    req=urllib.request.Request(url,headers={"Accept":"application/json","User-Agent":"ManifoldGraceResearchIndex/1.0 (https://manifoldgrace.github.io)"})
    with urllib.request.urlopen(req,timeout=20) as r:return json.load(r)
def main():
    data=json.loads(PATH.read_text(encoding="utf-8"))
    assert APPROVALS.exists() and json.loads(APPROVALS.read_text(encoding="utf-8"))["approved_documents"]==[], "Manual review required for approved documents"
    refreshed=0
    for w in data["works"]:
        record_id=w["id"].split("zenodo.")[-1]
        try:
            rec=fetch_json("https://zenodo.org/api/records/"+record_id)
            meta=rec.get("metadata",{})
            # Only refresh explicit allowlisted public records; never add other records.
            doi=(rec.get("doi") or meta.get("doi") or "").lower()
            if doi!=w["id"].lower():continue
            title=meta.get("title")
            if isinstance(title,str) and title.strip():w["title"]=title.strip()
            date=meta.get("publication_date") or rec.get("created","")
            if str(date)[:4].isdigit():w["year"]=int(str(date)[:4])
            refreshed+=1
        except (OSError,ValueError,KeyError,TimeoutError) as exc:print("Zenodo refresh skipped",record_id,str(exc))
    # Public ORCID connectivity check; do not import new works without review.
    try:
        works=fetch_json("https://pub.orcid.org/v3.0/"+data["orcid"]+"/works")
        data["orcid_public_work_groups"]=len(works.get("group",[]))
        data["orcid_status"]="readable"
    except (OSError,ValueError,KeyError,TimeoutError) as exc:
        data["orcid_status"]="unavailable; public profile link retained"
        print("ORCID read unavailable:",exc)
    if refreshed:
        data["updated_at"]=datetime.datetime.now(datetime.timezone.utc).isoformat()
        data["sync_status"]=f"refreshed {refreshed} approved Zenodo records"
        PATH.write_text(json.dumps(data,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    else: print("No approved Zenodo records refreshed; preserving last verified data.")
if __name__=="__main__":main()
