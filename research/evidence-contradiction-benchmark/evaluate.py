"""Dependency-free synthetic claim/evidence evaluation baseline."""
import argparse
import json
import re
from pathlib import Path

LABELS = ("supports", "contradicts", "insufficient")
NEG = {"no", "not", "never", "without", "none"}
STOP = {"a", "an", "the", "is", "are", "was", "were", "to", "of", "on", "in", "at", "and", "for", "by", "from", "it"}

def tokens(text):
    return set(re.findall(r"[a-z0-9]+", text.lower())) - STOP

def baseline(claim, evidence):
    c, e = tokens(claim), tokens(evidence)
    if not c or not e or len((c - NEG) & (e - NEG)) / max(1, len(c - NEG)) < 0.55:
        return "insufficient"
    return "contradicts" if bool(c & NEG) != bool(e & NEG) else "supports"

def evaluate(rows, preds):
    matrix = {gold: {prediction: 0 for prediction in LABELS} for gold in LABELS}
    slices = {}
    ids = set()
    for row in rows:
        key = row["id"]
        if key in ids or row["gold_label"] not in LABELS or preds.get(key) not in LABELS:
            raise ValueError("Duplicate ID, invalid gold label or invalid/missing prediction: " + key)
        ids.add(key)
        matrix[row["gold_label"]][preds[key]] += 1
        bucket = slices.setdefault(row["challenge"], {"total": 0, "correct": 0})
        bucket["total"] += 1
        bucket["correct"] += int(row["gold_label"] == preds[key])
    f1 = {}
    for label in LABELS:
        tp = matrix[label][label]
        fp = sum(matrix[other][label] for other in LABELS if other != label)
        fn = sum(matrix[label][other] for other in LABELS if other != label)
        precision = tp / (tp + fp) if tp + fp else 0
        recall = tp / (tp + fn) if tp + fn else 0
        f1[label] = round(2 * precision * recall / (precision + recall), 4) if precision + recall else 0
    return {"count": len(rows),
            "accuracy": round(sum(matrix[x][x] for x in LABELS) / len(rows), 4) if rows else 0,
            "macro_f1": round(sum(f1.values()) / len(LABELS), 4),
            "class_f1": f1, "confusion_matrix": matrix,
            "challenge_accuracy": {k: round(v["correct"]/v["total"],4) for k,v in sorted(slices.items())}}

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--data", default=str(Path(__file__).with_name("synthetic_cases.jsonl")))
    parser.add_argument("--predictions", help="JSON object mapping fixture IDs to labels")
    parser.add_argument("--output", help="Optional report JSON destination")
    args = parser.parse_args()
    rows = [json.loads(line) for line in Path(args.data).read_text(encoding="utf8").splitlines() if line.strip()]
    preds = json.loads(Path(args.predictions).read_text(encoding="utf8")) if args.predictions else {row["id"]: baseline(row["claim"], row["evidence"]) for row in rows}
    report = {"method": "submitted-predictions" if args.predictions else "lexical-baseline",
              "dataset_kind": "synthetic author-labelled practice fixture", "metrics": evaluate(rows,preds),
              "predictions": [{"id":row["id"],"gold":row["gold_label"],"predicted":preds[row["id"]]} for row in rows]}
    rendered = json.dumps(report,indent=2)
    if args.output:
        Path(args.output).write_text(rendered+"\n",encoding="utf8")
    print(rendered)

if __name__ == "__main__":
    main()
