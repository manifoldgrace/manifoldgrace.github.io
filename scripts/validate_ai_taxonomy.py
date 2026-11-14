#!/usr/bin/env python3
"""Validate Manifold Grace four-level canonical AI taxonomy, schema v1.1.
Usage: python scripts/validate_ai_taxonomy.py
No third-party packages or network required.
"""
import json, re, unicodedata
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
DATA=ROOT/"research/relational-awareness/ai-four-level-register-v1.1.json"
BASE=ROOT/"research/relational-awareness/source-baseline-v0.1.json"
LEVELS={1:"CAT",2:"PAR",3:"ALG",4:"ARC"}
# Original source URLs are pinned here independently of the JSON baseline.
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

EVIDENCE={"Linked (Unverified)","Independently Verified"}
STATUSES={"Needs Audit","Provisional (Secondary Link)","Verified (Primary Consulted)","Deprecated/Merged"}
def key(s):
    s=unicodedata.normalize("NFKD",s).casefold()
    return re.sub(r"[^a-z0-9]","",s)
def check():
    d=json.loads(DATA.read_text(encoding="utf-8"))
    b=json.loads(BASE.read_text(encoding="utf-8"))
    records=d["entries"]; sources=d["sources"]
    assert d["schema_version"]=="1.1", "Expected v1.1"
    assert len(b["source_register"])==10, "Unexpected baseline count"
    assert {x["id"]:x["url"] for x in b["source_register"]} == BASELINE_IDS_URLS, "Archived baseline drift"
    ids={e["id"] for e in records}
    assert len(ids)==len(records), "Duplicate canonical IDs"
    source_ids={s["id"] for s in sources}
    assert len(source_ids)==len(sources), "Duplicate source IDs"
    keys={}
    for e in records:
        assert e["level"] in LEVELS and e["id"].startswith(LEVELS[e["level"]]+"-"), e["id"]+": incorrect classification prefix"
        assert e["verification_status"] in STATUSES
        assert e["evidence_status"] in EVIDENCE
        assert e["verification_status"]!="Verified (Primary Consulted)" or (e["evidence_status"]=="Independently Verified" and e.get("primary_research_url")), e["id"]+": ungrounded verification"
        for x in [e["name"]]+e.get("aliases",[]):
            k=key(x)
            if k in keys and keys[k]!=e["id"]:
                raise ValueError("Duplicate canonical/alias collision: "+x+" overlaps "+keys[k])
            keys[k]=e["id"]
        assert all(x in ids for x in e.get("related_ids",[])), e["id"]+": dangling relation"
        assert len(e.get("related_ids",[]))==len(set(e.get("related_ids",[]))), e["id"]+": duplicate related IDs"
        assert e["id"] not in e.get("related_ids",[]), e["id"]+": self reference"
        assert all(x in ids for x in e.get("applied_cross_references",[])), e["id"]+": dangling application reference"
        assert all(x in source_ids for x in e.get("source_ids",[])), e["id"]+": unknown source"
        origin=e.get("origin",{})
        origin_id=origin.get("domain_id")
        if origin_id:
            assert origin_id in ids, e["id"]+": unknown origin"
            assert origin_id != e["id"], e["id"]+": self origin"
            assert next(x for x in records if x["id"]==origin_id)["level"]==1, e["id"]+": origin not CAT"
            assert origin_id not in e.get("applied_cross_references",[]), e["id"]+": origin duplicated in applications"
        applications=e.get("applied_cross_references",[])
        assert len(applications)==len(set(applications)), e["id"]+": duplicate applications"
        assert e["id"] not in applications, e["id"]+": self application"
        assert all(next(x for x in records if x["id"]==a)["level"]==1 for a in applications), e["id"]+": applied reference not CAT"
    for s in sources:
        assert s["evidence_status"] in EVIDENCE, s["id"]+": evidence status invalid"
        assert s["evidence_status"]!="Independently Verified" or s.get("consulted_primary") is True, s["id"]+": unverified source promoted"
    for s in b["source_register"]:
        assert s["id"] in source_ids, "Baseline source omitted: "+s["id"]
        assert next(x for x in sources if x["id"]==s["id"])["url"]==s["url"], "Baseline URL changed: "+s["id"]
    for group,code in [(1,"categories"),(2,"paradigms"),(3,"methods"),(4,"architectures")]:
        assert sum(e["level"]==group for e in records)==d["counts"][code], "Incorrect count: "+code
    assert len(records)==d["counts"]["total"]
    print("PASS:",len(records),"entries;",len(source_ids),"sources;",len(keys),"canonical/alias keys; four-level classification and provenance gates checked")
if __name__=="__main__":
    check()
