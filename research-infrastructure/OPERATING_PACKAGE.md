# Research-to-Delivery Operating Package
Date: 10 November 2026
Status: Internal implementation handbook; not an offer already in operation, certification, or client record.

## A. Scope, roles and releases
- **Research** maintains question, sources, timestamps, mapping and uncertainty.
- **Technical** creates versioned schemas, controlled experiments, comparisons and test evidence.
- **Venture** assesses paid customer need, competitive fit, pricing assumptions and procurement constraints.
- **Governance** reviews jurisdiction, privacy, security, stakeholder impacts and human approvals.
- **Release rule**: no client claim, website compliance conclusion, or third-party system change without evidence and authority.

## B. Deliverables reusable across all workstreams
| Output | Required fields | Verification |
|---|---|---|
| System record | ID, sectors, components, relationships, controls, claims | JSON schema and cited original sources |
| Research question | hypothesis, null alternative, closest prior work, measurable difference | peer and source overlap review |
| Evidence record | claim, source locator, timestamp, provenance, contradiction, status | independently retrievable citations |
| Opportunity record | need, buyer, budgets, competition, build effort, window durability | interviews, contracts, observed benchmarks |
| Diagnostic report | current inventory, overlap, controls, scenarios, costs | permissioned source review and customer sign-off |
| Release note | date, evidence links, commit hash, verified status | code review and deployment check |

## C. Eight-stage research-agent pipeline
1. **Authorise:** define use case, domain, permitted source list, rights and scope; prohibit external writes.
2. **Ingest:** save public or permitted documents in versioned source records; retain line/section references and hashes.
3. **Extract:** propose named components, interfaces, controls and claims; use machine-readable JSON; label unknowns.
4. **Verify:** check each proposition against an exact source locator and independent evidence; contradictions remain visible.
5. **Compare:** normalise entities then compute shared nodes, unique edges, deployment differences and untested assumptions.
6. **Assess:** evaluate safeguards and legal duties for the declared role/jurisdiction, never issue automated compliance certification.
7. **Challenge:** test false claims, manipulated source text, conflicting versions, absent citations and authorisation failures.
8. **Approve:** send evidence packet for accountable human sign-off; stage GitHub proposals before publication.

### Acceptance tests before a live agent
- 5 reference documents: retain diagram captions, tables, code blocks and hierarchy; manually score parser fidelity (no premature 100% claim).
- 1 human-labelled architecture: measure field precision, recall and error categories; proposed threshold 90%, subject to realistic evaluation.
- 3 known false claims: all must be flagged in a fixture, but this does not prove production robustness.
- 10-system batch: no unintended file overwrite or broken links; tests should be rerun after any change.
- Access protection: prompt-injection probes, sandboxed read-only tools, no client secrets in generated logs, review gates for every write.

## D. Demonstration portal — ten sequential gates
1. Route /demos or static demo page, shared navigation, no broken links.
2. Consistent card: purpose → input/output → method → limitations → linked evidence.
3. Local-only demos for architecture comparison, opportunity index and overlap analysis.
4. Accessible controls, keyboard navigation, responsive layout and visible calculation assumptions.
5. Security baseline: never embed API credentials in browser JavaScript.
6. Authorised document import gated behind server validation, rate limits and retention policy.
7. Backend agent integration only after authentication, source permissions and budget limits are documented.
8. Human review for any compliance-related or externally released result.
9. Tests: model outputs are safely rendered as text; adversarial inputs and error paths covered.
10. Publish source commit, check live response and record successful deployment separately.

## E. First consulting offering — AI Stack Consolidation & Risk Audit
**Client problem:** duplicated spending, unclear AI tool use, unmanaged dependencies or weak evidence of outcomes.
**Buyer:** IT, finance, operations or compliance decision-maker at a consenting organisation.
**Pilot format:** two-week diagnostic is a *proposed* delivery model, subject to client scope and available evidence.
**Scope:** inventory tools and licences; collect contracts and administrator-approved data; map functionality and integrations; document security review questions; evaluate keep/consolidate/replace scenarios and the economics of implementation.
**Deliverables:** system map, overlap matrix, cost baseline, identified gaps, risk caveats, prioritised actions and methodology.
**Exclusions:** no unapproved penetration testing, private account access, legal certification, guaranteed savings or assumption that tools can simply be switched off.
**Commercial validation:** measure actual budget, cost of acquisition, conversion, fixed-fee willingness to pay, lead time and client acceptance.
**Savings calculation:** annual spend avoided – migration cost – retraining cost – recurring replacement cost – verified productivity impact. Never promise a 20–40% reduction without data.
**Gate:** no product roadmap based exclusively on speculative scorecards.

## F. Additional advisory frameworks
### Legacy-to-AI readiness
Data accessibility; interface/API availability; permission boundaries; latency and reliability; human fallback; audit traceability; vendor obligations; change-management risks. Produce one per-system dependency map with uncertainties.

### Compliance and ethics
List jurisdiction, operator role, intended purpose, data type, effective rule/version, original source, control evidence and residual risk. Ethics review separately addresses impacts, fairness, accessibility, dignity and stakeholder concerns. Missing public documentation ≠ legal breach.

## G. Commercial opportunity index
Original six factors: demand acceleration, unmet needs, low competition intensity, willingness to pay, fast time to market, window durability. Assign 1–5 with all scales favourable-high. **Do not claim weights without actually applying them**; equal-weight 30-point scores remain uncalibrated. For any weighted alternative, publish the factors, weights, formula, dated evidence and sensitivity analysis.
Kill gates: confirmed buyer and budget; feasible pilot; comparative advantage; affordable entry; regulatory permissions; platform absorption; honest customer value. Record negative evidence.
Stages: 2027 diagnosis and low-capital pilots; later repeatable tools only after conversion data; no claimed launch date without resources and customer commitment.

## H. Research and paper standards
Template: title → abstract → research question → claims/prior art → strongest counter-evidence → scope → methods → data and permissions → hypotheses → evaluation metrics → results → limitations → ethics → reproducibility → references and contribution statement.
Novelty gate: strongest five closest works (expand as needed), documented unresolved limitation, alternative explanation, measurable proposed contribution, stop conditions and overlap history. Originality is never inferred from an absent search result.

## I. Quality assurance
Track task accuracy, citation fidelity, extraction precision/recall, false-positive rate, robustness to hostile content, run-to-run variability, latency, cost and human intervention. Maintain golden fixtures and adversarial cases. Any live safety or legal claim needs domain review.

## J. Historical windows
Case templates: earliest signals; adoption acceleration; customer pain; competitors and margins; substitution event; alternative explanations; dated market evidence; window-closing indicators; comparison with future opportunity claims.
Start with the historical educational robotics observation, but do not declare the entire category obsolete without sales and curriculum evidence.

## K. Site review and reporting
Keep Research methodologies, Venture financial assumptions, Government public-system oversight, and Technical working examples distinct. Cross-link instead of deleting duplicates without review. Only log verified actions and date; avoid personal names in public daily logs.
Automation design: GitHub workflow may validate schemas and generate a *proposed* changelog, but must not assert that a deployed website has refreshed simply because a commit succeeded.
