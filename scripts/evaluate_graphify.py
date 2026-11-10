#!/usr/bin/env python3
"""Reproducible read-only Graphify smoke test for the public Manifold Grace repo.
Graphify graphs may differ by version. All conclusions require human spot checks.
"""
import collections, json, pathlib, sys
P=pathlib.Path(sys.argv[1] if len(sys.argv)>1 else "graphify-out/graph.json")
out={"tool":"Graphify","scope":"public repository, code-only, no model credentials","graph_present":P.is_file(),"benchmark_status":"not a comparative token benchmark"}
if P.is_file():
    d=json.loads(P.read_text(encoding="utf-8"))
    nodes=d.get("nodes",[]);edges=d.get("links",d.get("edges",[]))
    out["nodes"]=len(nodes);out["edges"]=len(edges)
    sources=collections.Counter(str(n.get("source_file","")) for n in nodes if isinstance(n,dict))
    out["source_files_with_nodes"]=len([s for s in sources if s])
    out["edge_relationships"]=dict(collections.Counter(str(e.get("relation",e.get("type","unknown"))) for e in edges if isinstance(e,dict)).most_common(20))
    out["expected_code_sources"]={x:{"found":any(x in s for s in sources)} for x in [
      "research-workbench.mjs",
      "scripts/validate_research_graph.py",
      "scripts/sync_public_research.py",
    ]}
    out["limitations"]=["Code-only extraction does not validate claims in research documents.",
                        "Graph quality needs manual edge-level verification.",
                        "The number of graph nodes is not a measure of token savings."]
    if not nodes:out["warning"]="Graph output has no nodes; investigate CLI extraction and inputs."
else:
    out["warning"]="Graph did not build; check GitHub Actions job logs."
pathlib.Path("graphify-evaluation.json").write_text(json.dumps(out,indent=2)+"\n",encoding="utf-8")
print(json.dumps(out,indent=2))
if not P.is_file() or not out.get("nodes"):sys.exit(1)
