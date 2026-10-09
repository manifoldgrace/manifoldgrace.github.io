"""03. Benchmark a real small supervised classifier from first principles.
Synthetic, non-sensitive examples. Train/test split is fixed and separate.
"""
import math
from collections import Counter

TRAIN = [
    ("fair model transparency", 1),
    ("accountability audit risk", 1),
    ("model bias fairness", 1),
    ("garden roses sunshine", 0),
    ("coffee table window", 0),
    ("landscape painting art", 0),
]
TEST = [
    ("transparency fairness audit", 1),
    ("garden coffee sunlight", 0),
    ("model governance risk", 1),
    ("painting flowers", 0),
]
counts = {0: Counter(), 1: Counter()}
for text, label in TRAIN:
    counts[label].update(text.split())
vocab = set().union(*[set(x) for x in counts.values()])
totals = {label: sum(counts[label].values()) for label in [0, 1]}
prior = {label: math.log(sum(y == label for _, y in TRAIN)/len(TRAIN))
         for label in [0, 1]}

def predict(text):
    scores = {}
    for label in [0, 1]:
        scores[label] = prior[label] + sum(
            math.log((counts[label][word]+1)/(totals[label]+len(vocab)))
            for word in text.split() if word in vocab)
    return max(scores, key=scores.get)

tp = fp = fn = tn = 0
for text, actual in TEST:
    predicted = predict(text)
    print(f"actual={actual} predicted={predicted}: {text}")
    tp += predicted == actual == 1
    tn += predicted == actual == 0
    fp += predicted == 1 and actual == 0
    fn += predicted == 0 and actual == 1
precision = tp/(tp+fp) if tp+fp else 0
recall = tp/(tp+fn) if tp+fn else 0
print({"TP": tp, "TN": tn, "FP": fp, "FN": fn,
       "precision": round(precision, 3), "recall": round(recall, 3)})
print("Tiny synthetic test sets do not provide deployable performance evidence.")
