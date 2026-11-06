#!/usr/bin/env python3
"""Non-destructive SHACL gate for Manifold Grace synthetic RDF fixtures.

Only checks graph structure. Does not establish real-world identity,
factual truth, legality, cryptographic authenticity, or audit completion.
"""
from pathlib import Path
import sys
from rdflib import Graph
from pyshacl import validate

ROOT = Path(__file__).resolve().parents[1]
SHAPES = ROOT / "ontology" / "manifold-grace-research-v0.1.ttl"
VALID = ROOT / "tests" / "fixtures" / "mg-evidence-valid.ttl"
INVALID = ROOT / "tests" / "fixtures" / "mg-evidence-invalid.ttl"

def parse_graph(path):
    graph = Graph()
    graph.parse(str(path), format="turtle")
    return graph

def run_case(path, expected):
    result, _, report = validate(
        data_graph=parse_graph(path),
        shacl_graph=parse_graph(SHAPES),
        inference="none",
        abort_on_first=False,
        meta_shacl=True,
    )
    print(f"{path.name}: conforms={result} (expected={expected})")
    if bool(result) != expected:
        print(report)
        return False
    return True

def main():
    if not SHAPES.exists():
        print(f"Shapes file not found: {SHAPES}", file=sys.stderr)
        return 2
    # Parse ontology independently of SHACL validation.
    ontology = parse_graph(SHAPES)
    print(f"Ontology parsed: {len(ontology)} triples")
    if not len(ontology):
        print("Empty ontology", file=sys.stderr)
        return 2
    checks = [
        run_case(VALID, True),
        run_case(INVALID, False),
    ]
    return 0 if all(checks) else 1

if __name__ == "__main__":
    raise SystemExit(main())
