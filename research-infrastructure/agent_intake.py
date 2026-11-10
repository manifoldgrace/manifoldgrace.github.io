#!/usr/bin/env python3
"""Read-only local research intake demonstration. No network calls, no LLM, no autonomous actions."""
from __future__ import annotations
import argparse
import hashlib
import json
import pathlib
import re
from datetime import date

MAX_BYTES=1_000_000
def read_allowed(path: pathlib.Path, root: pathlib.Path) -> tuple[str,str]:
    resolved=path.resolve()
    if not resolved.is_relative_to(root.resolve()):
        raise ValueError("file outside authorised intake directory")
    if resolved.suffix.lower() not in {".txt",".md"}:
        raise ValueError("only UTF-8 text/markdown files are supported in this starter")
    data=resolved.read_bytes()
    if len(data)>MAX_BYTES: raise ValueError("file exceeds 1 MB limit")
    return data.decode("utf-8"),hashlib.sha256(data).hexdigest()

def extract_claims(text: str, source: str, digest: str) -> dict:
    claims=[]
    for number,line in enumerate(text.splitlines(),1):
        stripped=line.strip()
        if stripped.startswith("CLAIM:"):
            statement=stripped[6:].strip()
            if statement:
                claims.append({"id":f"C-{len(claims)+1:03d}","statement":statement,"status":"unverified",
                               "sources":[{"uri":source,"type":"other","accessed_at":date.today().isoformat(),
                                           "source_span":stripped,"locator":f"line:{number}","hash_sha256":digest}],
                               "contradictions":[],"confidence_note":"Not independently verified"})
    return {"id":"SYS-LOCAL-SAMPLE","title":"Local extracted candidate claims","version":"1.0",
            "domains":["systems-analysis"],"research_date":date.today().isoformat(),
            "components":[],"relationships":[],"claims":claims,"controls":[],
            "review_status":"extracted","open_questions":["Evidence verification and human approval required"]}

def main()->None:
    ap=argparse.ArgumentParser()
    ap.add_argument("--root",required=True,help="Authorised local intake directory")
    ap.add_argument("--file",required=True,help="Relative .txt or .md path within root")
    args=ap.parse_args()
    root=pathlib.Path(args.root).resolve()
    path=(root/args.file).resolve()
    text,digest=read_allowed(path,root)
    output=extract_claims(text,path.name,digest)
    print(json.dumps(output,ensure_ascii=False,indent=2))
if __name__=="__main__":main()
