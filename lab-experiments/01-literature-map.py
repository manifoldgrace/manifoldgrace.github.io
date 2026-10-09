"""01. Literature mapping with a transparent TF-IDF retrieval baseline.
Teaching sample; not a systematic review. Python standard library only.
"""
import math
import re
from collections import Counter

PAPERS = [
    ("P1", "AI governance requires accountable monitoring of model performance."),
    ("P2", "Machine learning improves biomedical image classification."),
    ("P3", "Governance audits assess fairness of machine learning."),
    ("P4", "Climate research applies predictive analytics to energy systems."),
]
QUERY = "AI governance fairness"

def tokens(text):
    return re.findall(r"[a-z]+", text.lower())

def tfidf(documents):
    rows = [Counter(tokens(text)) for _, text in documents]
    df = Counter(word for row in rows for word in row)
    vectors = []
    for row in rows:
        vectors.append({word: (1 + math.log(count)) *
                        (1 + math.log((1 + len(rows))/(1 + df[word])))
                        for word, count in row.items()})
    return vectors, df

def cosine(a, b):
    top = sum(a.get(word, 0)*value for word, value in b.items())
    na = math.sqrt(sum(value*value for value in a.values()))
    nb = math.sqrt(sum(value*value for value in b.values()))
    return top/(na*nb) if na and nb else 0.0

vectors, docfreq = tfidf(PAPERS)
q = Counter(tokens(QUERY))
qvec = {word: (1 + math.log(n)) *
        (1 + math.log((1 + len(PAPERS))/(1 + docfreq.get(word, 0))))
        for word, n in q.items()}
for (paper_id, title), score in sorted(
    zip(PAPERS, [cosine(v, qvec) for v in vectors]),
    key=lambda item: -item[1]):
    print(paper_id, f"relevance={score:.3f}", title)
print("NOTE: This counts terms; human screening and source provenance remain necessary.")
