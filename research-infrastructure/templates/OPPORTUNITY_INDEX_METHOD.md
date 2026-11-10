# Opportunity Window Backtesting and Monitoring Specification
Status: research specification, not an active scheduled agent.

## Market signals
Demand acceleration, actual buyer need, competing supplier penetration, pricing, entry time, platform absorption, regulatory change, switching cost, and customer success/retention.

## Observation schema
Opportunity ID | signal type | jurisdiction | observation date | source URL | extract | source class | baseline | latest value | method | reviewer | confidence note.

## Scoring
Six favourable-high dimensions, each 1–5. Simple raw score is sum /30. If weighted: weighted_score=sum(weight_i * score_i), weights must sum to 1 and the reported maximum is 5. Never merge incompatible score definitions.

## Backtest
Choose date t; hide post-t information; document forecasts and thresholds; assess events t+3/6/12 months; calculate calibration and false positives. Historical examples must have contemporaneous source evidence. Outcome: pilot acquisition, gross margin, real buyer spend or category substitution, not subjective hindsight.

## Suggested source types
Official UK business survey, public procurement notices, company filings and supplier disclosures, independent research, industry job postings and transparent competitor pricing.

## Operating boundaries
No unattended scraping that contravenes permissions or site policies. No claim that a weekly monitoring feed is operating until a run log, source timestamps and public output verify it. Human-review any promotional statement.

## Historical transition questions
Early educational programming robots; desktop-to-cloud changes; enterprise on-premise-to-managed services; classical BI-to-self-service BI; manually written deployment scripts-to-CI/CD; rules-engine-to-learning-model integration. These are candidate case studies, not proven substitution narratives.
