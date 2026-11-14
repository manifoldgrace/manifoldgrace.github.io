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
        assert all(x in ids for x in e.get("applied_cross_references",[])), e["id"]+": dangling application reference"
        assert all(x in source_ids for x in e.get("source_ids",[])), e["id"]+": unknown source"
        origin=e.get("origin",{})
        assert not origin.get("domain_id") or origin["domain_id"] in ids, e["id"]+": unknown origin"
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
