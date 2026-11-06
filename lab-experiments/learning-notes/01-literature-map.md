# Learning note 01 — Literature mapping

**Status:** Source inspected; proposed change not implemented or tested. No execution result is recorded in this note.

**Artefact examined:** [`01-literature-map.py`](01-literature-map.py)  
**Purpose:** Learn how a small Python retrieval baseline turns text into a ranked list, and identify what that ranking does—and does not—mean.

## Lesson: follow the data from text to ranking

The script uses a small in-file set of four synthetic paper records and a fixed query. Its main processing path is:

1. **Tokenise:** `tokens` lowercases text and extracts sequences matching `[a-z]+`.
2. **Count and weight:** `tfidf` counts terms within each paper and document frequency across the corpus, then creates weighted term dictionaries.
3. **Represent the query:** the query is tokenised and weighted using the corpus document frequencies.
4. **Compare:** `cosine` calculates a normalised overlap score between each paper vector and the query vector. If either vector has zero magnitude, it returns `0.0`.
5. **Rank and display:** the script pairs each paper record with its score, sorts by descending score, and prints the identifier, score and text field.

This is a useful architecture lesson: a readable baseline makes intermediate representations inspectable. It is also a useful research lesson: a ranking score produced by this term-based method is not proof of relevance, quality, completeness or suitability for inclusion in a systematic review. The script itself describes the example as a teaching sample and says human screening and source provenance remain necessary.

## Code-reading questions

- What information is lost when text is reduced to lowercase alphabetic tokens? Consider punctuation, phrases, negation, numbers, spelling variants and related words.
- How does document frequency affect the weight of a term shared by many records?
- What happens to a query term that does not occur in any paper?
- Why should the printed ranking be treated as a screening aid rather than an inclusion decision?
- Which additional source metadata would a researcher need to verify and revisit a result?

## Small, reproducible investigation

Use only the script’s synthetic text. Before running it, write down an expected change to the ordering. Change **one thing at a time**—for example, the query or one synthetic paper text—then run the script using the command in the [experiments README](README.md).

Record:

- **Baseline:** the original query and paper set.
- **Single change:** the one input changed.
- **Prediction:** what you expect to move in the ranking and why.
- **Observation:** the output actually produced, copied or captured after execution.
- **Interpretation:** what the difference suggests about this implementation.
- **Boundary:** what this tiny synthetic test cannot establish about real literature searches.

Do not record an expected result as an observed result. A screenshot is optional; if added later, identify the code version and inputs it depicts and avoid including private or restricted material.

## Improvement proposal — inactive and untested

**Proposal:** Explore representing each paper as a named record with separate fields for identifier, source reference and display text, then retain those fields in a structured ranking result.

**Reason to investigate:** The current example keeps an identifier and text together in a tuple and prints them with a score. A more explicit record could make the relationship between a ranked item and its source easier to extend and inspect in a later research workflow.

**Status:** Design proposal only. No code change has been made, and no improvement is claimed.

**Possible bounded test:** With a small synthetic fixture, reorder the input records and check whether each returned identifier remains associated with the same text and score. This would test record association for that fixture; it would not validate relevance quality or establish suitability for a real review.

## Evidence record to extend later

- **Repository / commit:** Add the exact source URL and commit SHA when the artefact version is recorded.
- **Static observation:** The script defines tokenisation, TF–IDF-style weighting, cosine similarity and descending score order.
- **Interpretation:** These components provide an inspectable lexical-retrieval baseline.
- **Execution status:** Not recorded here; complete only after running the script.
- **Evidence capture:** Add a screenshot, diagram or output excerpt after an actual session.
- **Next question:** Which source and provenance fields should accompany a ranked result so a human can verify it?

## Concise session log

> Inspected the literature-mapping script and traced its text-to-ranking path. Added this companion lesson and an inactive source-traceability proposal. Execution, screenshots and evaluation remain outstanding.

---

**Attribution and boundary:** This note is supplementary learning material for the existing teaching example. It does not replace or modify the original script, claim that its authors abandoned the work, or report a new experiment or research finding.
