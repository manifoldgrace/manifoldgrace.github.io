# Manifold Grace — Publication log
**Release date:** 9 October 2026  
**Repository:** [manifoldgrace/manifoldgrace.github.io](https://github.com/manifoldgrace/manifoldgrace.github.io)  
**Branch:** `main`  
**Scope:** Five coordinated page/navigation updates prepared in the current conversation.

## Published commits

| File | Change | Commit |
|---|---|---|
| `cv.html` | Education ladder, UK Levels 1–8, expandable qualifications and evidence, APL/RPL distinctions, AI syllabus summary; original professional CV remains | [ea54468](https://github.com/manifoldgrace/manifoldgrace.github.io/commit/ea54468f7129b74f45a99d98cf32c3a4a0cc992a) |
| `papers.html` | Research index for papers, preprints, working papers, reports, project proposals, frameworks, by-year listings and Zenodo DOIs; five distinct public Zenodo records, existing CESI and flooring entries preserved | [55309b3](https://github.com/manifoldgrace/manifoldgrace.github.io/commit/55309b30e85662934c81550384ad93d132134d4f) |
| `my-book.html` | `Trojan Horse` added to the existing books shelf as Book 11, with a restrained introductory teaser and manuscript-in-development status | [cf58849](https://github.com/manifoldgrace/manifoldgrace.github.io/commit/cf588493a03d517c3d2600aef57124da36af87af) |
| `socials.html` | Featured visual profile directory (eight confirmed URLs), expandable platform index preserved, search control, LinkMe preview, Hearts of Oak SC external reference | [64053ca](https://github.com/manifoldgrace/manifoldgrace.github.io/commit/64053cac53a774072c624006d01a3dec96fb7c7e) |
| `site-shell.js` | Added **Socials** to the primary menu while retaining its footer link and other site navigation | [f11c0c0](https://github.com/manifoldgrace/manifoldgrace.github.io/commit/f11c0c02c1e9be58db90b7f6fbfaeb3898c91391) |

### Additional Socials preview enhancement

- `socials.html`: The featured GitHub card now requests up to four recent **public** repository names from the GitHub public API; it gracefully falls back to the static GitHub profile link if unavailable. [Commit 916fbf5](https://github.com/manifoldgrace/manifoldgrace.github.io/commit/916fbf59f71bf575a635dc24f47cb7a6add532f5).

## Research publication coverage

- **Preprints (3):** CESI v1.0 (Zenodo 17266802), The Cosmology of Cognition (17290625), Delegated Agency / Moral Outsourcing of Automation (17294405).
- **Report (1):** Loyal Residency (17439986).
- **Project deliverable (1):** London Smart Piezoelectric Flooring Pilot Dossier (17439725).
- DOI links point to the underlying public Zenodo records; public preprints are **not** presented as peer-reviewed journal articles.
- The publication directory lists thematic navigation categories without claiming unpublished papers exist.

## Publication boundaries and accuracy

- **Trojan Horse:** The full manuscript, personal case studies and unpublished analysis were **not uploaded** to the public repository; only a short preview appears on `my-book.html#trojan-horse`.
- **CV:** APL/RPL mapping is described as proposed recognition evidence, not awarded university credit. MPhil/PhD is aspirational or to be confirmed and not presented as conferred.
- **Socials:** Links are only active where a destination was previously established. Other platforms remain unlinked until verified. A third-party external link to [Hearts of Oak SC](https://www.heartsofoaksc.com/) has had Facebook click-tracking parameters removed and does not imply affiliation.
- **Existing pages:** Prior book projects, CV experience, older Zenodo entries and social links were preserved.
- **Future automation:** A recurring authenticated Zenodo sync was **not** enabled by these commits. Private uploads are not indexed.
- **Brand assets:** Some CV institution identifiers remain typographic placeholders rather than verified official brand artwork.

## Deployment and verification

The five page/navigation files were committed to GitHub `main`. GitHub Pages normally updates after successful deployment and cache refresh. **Successful GitHub commits are confirmed; live HTTP rendering and GitHub Pages deployment status were not independently confirmed at the time this log was written.**

Check:
- [Digital CV](https://manifoldgrace.github.io/cv.html)
- [Papers](https://manifoldgrace.github.io/papers.html)
- [My Books — Trojan Horse](https://manifoldgrace.github.io/my-book.html#trojan-horse)
- [Socials](https://manifoldgrace.github.io/socials.html)

## Not part of this release

Other changes mentioned across earlier chats and unprovided files are not represented as completed by this log. Each requires a separately verified implementation.
