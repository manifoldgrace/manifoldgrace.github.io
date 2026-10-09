# Manifold Grace AI research experiments

These are five **executable teaching examples**, with explicit, synthetic and non-sensitive data. They can run locally or in a browser-hosted IDE such as GitHub Codespaces.

## Run a project

Open a Codespace from this repository: https://github.com/codespaces/new?repo=manifoldgrace/manifoldgrace.github.io

From the built-in terminal, run any of the following:

```sh
python lab-experiments/01-literature-map.py
python lab-experiments/02-dataset-pipeline.py
python lab-experiments/03-model-benchmark.py
python lab-experiments/04-governance-audit.py
python lab-experiments/05-simulation.py
```

All scripts use only Python's standard library. Their tiny data sets are provided for **pedagogy**, not research findings.

### Logic and architecture

**Frontend:** website project selector, annotations, and browser JavaScript demonstrations.

**Code workspace:** this repository and Python source files, made accessible via GitHub Codespaces subject to account access, policies and usage costs.

**Real production backend (not deployed):** authenticated API, user/project authorisation, queued jobs, isolated compute runtime, private research storage, artifact registry, audit logs and cost limits.

**Security:** No credentials, personal data or confidential research information should be committed to this public repository. GitHub Codespaces is an external service and may have separate billing and availability.

## Extending

Replace example input sources with approved research data **only within an authorised private workspace**. Log dataset hashes, methodology, code versions and restrictions. Preserve a separate test set for model evaluation, and do not mischaracterise synthetic model performance.
