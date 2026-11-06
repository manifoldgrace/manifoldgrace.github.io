# Research bibliography: provenance, temporal graphs, retrieval, and administrative friction

**Manifold Grace | Research index v0.1 | 2026-11-06**  
This is a source-assessed bibliography, **not** evidence that all frameworks have been reproduced or deployed.

## Reviewed source records

1. **Lei, Yongjia; Han, Haoyu; Rossi, Ryan A.; Dernoncourt, Franck; Lipka, Nedim; Halappanavar, Mahantesh M.; Tang, Jiliang; Wang, Yu. (2025).** “Mixture of Structural-and-Textual Retrieval over Text-rich Graph Knowledge Bases.” *Findings of ACL 2025*, pp. 18306–18321. DOI: [10.18653/v1/2025.findings-acl.941](https://doi.org/10.18653/v1/2025.findings-acl.941). **Status: peer-reviewed proceedings, bibliographic metadata checked.** Proposes a retrieval approach combining graph structure and textual search. **Does not itself provide guaranteed historical legal-entity identity resolution** or universal UUID rules. **Project application:** retrieval experiments over dated corporate relationships and source excerpts.

2. **Cheng, Lei; Shen, Wen; Zhang, Quanshi; Huang, Yuchen; Zhang, Yiming; Yang, Yuxiao; Li, Mingjie. (2026).** “Exploring Inference Patterns of LLMs as Symbolic Interactions.” *Journal of Machine Learning Research* 27(213), 1–46. [JMLR article](https://jmlr.org/papers/v27/24-1060.html). **Status: published journal paper, bibliographic metadata checked.** Studies interaction-based inference patterns inside models, not an out-of-the-box evaluator of historical factual reliability between commercial LLMs. **Project application:** methodological background, not an automatic claim-verification score.

3. **Stanford HAI (2026).** *AI Index Report 2026*, chapter 5: Science. [Official report page](https://hai.stanford.edu/ai-index/2026-ai-index-report/science). **Status: institutional research report, source checked.** Reports frontier-model results below 20% on **paper-scale astrophysics replication in ReplicationBench**; this is **not** a general 20% failure rate across all scientific fields. **Project application:** distinguish answering questions from end-to-end replication and verified outcomes.

4. **Vitali, Fabio & Pasqual, Valentina (2026).** “Provenance-Enhanced Statements in Knowledge Graphs.” [arXiv:2606.15246](https://arxiv.org/abs/2606.15246). **Status: preprint, not represented here as peer-reviewed.** Proposes DEC: a formal approach for distinguishing attributed epistemic positions from a factual core and reasoning about contradictions. **Project application:** prospective evaluation of claims, perspectives, and conflict-handling.

5. **Zep / Graphiti developers.** Graphiti temporal knowledge graph framework. [Project source](https://github.com/getzep/graphiti); [technical discussion](https://www.falkordb.com/blog/building-temporal-knowledge-graphs-graphiti/). **Status: software/project sources.** Supports time-aware graph relationships; technical claims should be tested against current releases. **Project application:** historical validity intervals, observed timestamps, and source-linked entity relationships.

6. **Mamun, Syed Muntasir (2026).** “Topic Is Not Agenda: A Comprehensive Global Review and Critical Audit of Text Embedding Architecture (Vol-I).” [Academia.edu full text](https://www.academia.edu/167771777/Topic_Is_Not_Agenda_A_Comprehensive_Global_Review_and_Critical_Audit_of_Text_Embedding_Architecture_Vol_I_). **Status: accessible independent review, peer-review status not established.** Discusses shortcomings of broad semantic similarity for narrow research-agenda retrieval. Claims and numeric findings attributed to underlying Yoo 2026 study need independent examination before republishing as established results. **Project application:** evaluate relevance at claim/agenda level, not only document-topic level.

7. **LinkedIn Top Content — “Friction in AI Development and Regulation.”** [LinkedIn page](https://www.linkedin.com/top-content/artificial-intelligence/ai-governance-practices/friction-in-ai-development-and-regulation/). **Status: industry/editorial material, not established as a peer-reviewed framework.** The specific page was not independently retrievable during this review. **Project application:** hypothesis generation about organisational process burdens, not evidence of intentional obstruction.

8. **Reid, Jemiké (2026).** “Friction as Governance: Why Efficient AI Systems Still Need Deliberate Points of Human Resistance.” [User-supplied SSRN link](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=7365539). **Status: bibliographic details not independently confirmed in this review.** Do not label it an established or peer-reviewed publication pending verification.

## Architectural distinctions

- **Entity identity ≠ name similarity.** A corporate name change does not create a new company by itself; acquisition and mergers require dated, source-specific legal analysis.
- **Source provenance ≠ factual truth.** A source being attributable to an author does not prove its assertions.
- **Temporal validity ≠ date of retrieval.** Record when an event happened, when a record was valid, when it was asserted, and when the researcher accessed the evidence.
- **Research metrics ≠ universal model performance.** Keep benchmarks scoped to their datasets and tasks.
- **Process debt ≠ deliberate obstruction.** Intent requires additional evidence beyond observable administrative friction.

## Practical sequence

1. Clean and identify historical entity relationships using the existing 300-entry candidate register.
2. Test source-linked entity resolution and temporal queries against **synthetic cases**.
3. Trial combined structural + textual retrieval (MoR as research inspiration) before claiming performance.
4. Define manual source-backed correctness checks and review disagreement logs.
5. Consider DEC-based assertion semantics after a minimal claim-level provenance graph works.
6. Design automated reporting only after reproducible evaluation data and privacy safeguards are available.

**No private employee records or personal documents should be submitted to the public static site.**
