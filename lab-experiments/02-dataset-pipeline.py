"""02. Dataset construction: schema, missing values, duplicates, provenance.
Never process private research data in a public demonstration repository.
"""
import csv
import hashlib
import io
import json
from datetime import date

SOURCE = "sample-id,measurement\nA,12.1\nB,19.8\nB,21.0\nC,broken\nD,15.2\n"
seen, valid, rejected = set(), [], []
for line, row in enumerate(csv.DictReader(io.StringIO(SOURCE)), start=2):
    identifier = (row.get("sample-id") or "").strip()
    measurement = (row.get("measurement") or "").strip()
    try:
        number = float(measurement)
        if not identifier or identifier in seen:
            raise ValueError("missing or duplicate sample id")
        seen.add(identifier)
        valid.append({"id": identifier, "measurement": number})
    except ValueError as exc:
        rejected.append({"line": line, "row": row, "reason": str(exc)})

lineage = {
    "source_sha256": hashlib.sha256(SOURCE.encode()).hexdigest(),
    "schema": {"sample-id": "unique nonempty string", "measurement": "number"},
    "transforms": ["parse CSV", "validate schema", "remove duplicate ids"],
    "valid_rows": len(valid),
    "rejected_rows": len(rejected),
}
print(json.dumps({"clean": valid, "excluded": rejected, "lineage": lineage}, indent=2))
