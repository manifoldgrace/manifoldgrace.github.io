"""04. Compare multiple model metrics using invented, group-labelled test cases.
Measurements are illustrations, not proof of discrimination or compliance.
"""
DATA = [
    # group, true label, model prediction
    ("A", 1, 1), ("A", 1, 1), ("A", 0, 1),
    ("A", 0, 0), ("A", 0, 0),
    ("B", 1, 1), ("B", 1, 0), ("B", 0, 0),
    ("B", 0, 0), ("B", 0, 0),
]

def safe_div(a, b):
    return a/b if b else float("nan")

for group in ("A", "B"):
    entries = [(truth, prediction) for g, truth, prediction in DATA if g == group]
    selected = sum(pred == 1 for truth, pred in entries)
    positives = sum(truth == 1 for truth, pred in entries)
    tp = sum(truth == pred == 1 for truth, pred in entries)
    fp = sum(truth == 0 and pred == 1 for truth, pred in entries)
    negatives = len(entries) - positives
    print(group, {
        "selection_rate": round(safe_div(selected, len(entries)), 3),
        "true_positive_rate": round(safe_div(tp, positives), 3),
        "false_positive_rate": round(safe_div(fp, negatives), 3),
    })
print("Audit interpretation needs social context, data quality and stakeholder review.")
