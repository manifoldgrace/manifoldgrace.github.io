#!/usr/bin/env python3
"""Validate Manifold Grace canonical AI taxonomy v1.3 and source baseline."""
import csv
import json
import re
import unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "research/relational-awareness/ai-four-level-register-v1.3.json"
EXPORT = ROOT / "research/relational-awareness/ai-four-level-register-v1.3.csv"
BASE = ROOT / "research/relational-awareness/source-baseline-v0.1.json"
LEVELS = {1: "CAT", 2: "PAR", 3: "ALG", 4: "ARC"}
BASELINE_IDS_URLS={
  "SRC-001": "https://www.ibm.com/think/topics/computer-vision",
  "SRC-002": "https://www.ibm.com/think/topics/natural-language-processing",
  "SRC-003": "https://arxiv.org/abs/1706.03762",
  "SRC-004": "https://arxiv.org/abs/2010.11929",
  "SRC-005": "https://scikit-learn.org/stable/supervised_learning.html",
  "SRC-006": "https://scikit-learn.org/stable/unsupervised_learning.html",
  "SRC-007": "https://mitpress.ublish.com/book/reinforcement-learning-an-introduction-2",
  "SRC-008": "https://pmc.ncbi.nlm.nih.gov/articles/PMC10357905/",
  "SRC-009": "https://doi.org/10.1214/08-AOAS169",
  "SRC-010": "https://www.w3.org/TR/prov-o/"
}
EVIDENCE = {"Linked (Unverified)", "Independently Verified"}
STATUSES = {"Needs Audit", "Provisional (Secondary Link)", "Verified (Primary Consulted)", "Deprecated/Merged"}

def normal(text):
    return re.sub(r"[^a-z0-9]", "", unicodedata.normalize("NFKD", text).casefold())

def check():
    data=json.loads(DATA.read_text(encoding="utf-8"))
    baseline=json.loads(BASE.read_text(encoding="utf-8"))
    entries=data["entries"]
    sources=data["sources"]
    assert data["schema_version"] == "1.3", "Wrong canonical schema version"
    assert len(baseline["source_register"]) == 10, "Baseline source count changed"
    assert {s["id"]:s["url"] for s in baseline["source_register"]} == BASELINE_IDS_URLS, "Archived baseline modified"
    ids=[e["id"] for e in entries]
    assert len(ids)==len(set(ids)), "Duplicate IDs"
    by_id={e["id"]:e for e in entries}
    active=[e for e in entries if e.get("record_state")=="Active"]
    historical=[e for e in entries if e.get("record_state")=="Deprecated/Merged"]
    assert len(active)+len(historical)==len(entries), "Unknown record state"
    assert len(active)==data["counts"]["active"] and len(historical)==data["counts"]["deprecated"], "State counts wrong"
    source_by_id={s["id"]:s for s in sources}
    assert len(source_by_id)==len(sources), "Duplicate source IDs"
    names={}
    for e in entries:
        eid=e["id"]
        assert e["level"] in LEVELS and re.fullmatch(LEVELS[e["level"]]+r"-[0-9]{3,4}",eid), eid+": ID prefix"
        assert e["evidence_status"] in EVIDENCE and e["verification_status"] in STATUSES, eid+": status"
        assert e["verification_status"]!="Verified (Primary Consulted)" or (e["evidence_status"]=="Independently Verified" and e.get("primary_research_url")), eid+": unsupported promotion"
        assert all(k in by_id for k in e.get("related_ids",[])), eid+": unknown related ID"
        assert len(e.get("related_ids",[]))==len(set(e.get("related_ids",[]))), eid+": duplicate related IDs"
        assert eid not in e.get("related_ids",[]), eid+": self-related"
        assert all(k in source_by_id for k in e.get("source_ids",[])), eid+": unknown source ID"
        origin=e.get("origin") or {}
        oid=origin.get("domain_id")
        applied=e.get("applied_cross_references",[])
        assert len(applied)==len(set(applied)), eid+": repeated application link"
        assert eid not in applied, eid+": self application"
        assert all(k in by_id and by_id[k]["level"]==1 for k in applied), eid+": application not CAT"
        if oid:
            assert oid in by_id and by_id[oid]["level"]==1 and oid!=eid, eid+": invalid origin"
            assert oid not in applied, eid+": origin repeated as application"
        replacement=e.get("replaced_by_id")
        if replacement:
            assert e["record_state"]=="Deprecated/Merged", eid+": active redirect"
            assert replacement in by_id and replacement!=eid, eid+": invalid replacement"
            assert by_id[replacement]["record_state"]=="Active", eid+": replacement not active"
        if e["record_state"]=="Active":
            assert e.get("project_url") and e.get("paper_initiative_url"), eid+": project/paper links missing"
            for name in [e["name"],*e.get("aliases",[])]:
                key=normal(name)
                assert key, eid+": empty name"
                assert key not in names or names[key]==eid, eid+": duplicate canonical or alias "+name
                names[key]=eid
    for s in sources:
        assert s.get("evidence_status") in EVIDENCE, s["id"]+": invalid source status"
        assert s["evidence_status"]!="Independently Verified" or s.get("consulted_primary") is True, s["id"]+": source promotion without consultation"
    for s in baseline["source_register"]:
        assert s["id"] in source_by_id and source_by_id[s["id"]]["url"]==s["url"], "Source baseline drift: "+s["id"]
    for level,key in [(1,"categories"),(2,"paradigms"),(3,"methods"),(4,"architectures")]:
        assert sum(e["level"]==level for e in active)==data["counts"][key], "Incorrect active count: "+key
    assert len(entries)==data["counts"]["total"], "Incorrect total count"
    with EXPORT.open(encoding="utf-8",newline="") as stream:
        rows=list(csv.DictReader(stream))
    assert len(rows)==len(entries), "CSV row count differs from JSON"
    for row,e in zip(rows,entries):
        assert row["ID"]==e["id"] and row["AI type"]==e["name"], e["id"]+": CSV identity mismatch"
        assert row["Record state"]==e["record_state"], e["id"]+": CSV state mismatch"
        assert row["Replaced by"]==(e.get("replaced_by_id") or ""), e["id"]+": CSV redirect mismatch"
    print("PASS:",len(active),"active,",len(historical),"historical,",len(sources),"sources,",len(names),"name and alias keys, and matching CSV")

if __name__=="__main__":
    check()
