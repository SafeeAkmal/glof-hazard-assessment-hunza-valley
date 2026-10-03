# DECISIONS.md

## Purpose

Chronological record of decisions that affect the project specification, implementation, data interpretation, evaluation, or scientific claims.

Rules:

- Do not rewrite history.
- Do not delete superseded decisions.
- A changed decision gets a new entry.
- The current state belongs in `PROJECT_MASTER_SPEC.md`.
- Every material deviation from the original project documents must be recorded here.

---

# Initial Audit / Pre-Implementation Decisions

## DEC-001 — Use a separate guardrail layer

**Status:** Approved

**Decision**

`GLOF_PROJECT_ISSUES_AND_GUARDRAILS.md` is the correction/guardrail layer for the three original project documents.

**Reason**

The original documents contain known citation, event-metadata, data-scope, and implementation ambiguities.

**Implication**

Claude must check the guardrails before making substantive implementation decisions.

---

## DEC-002 — Distinguish publication year from event year

**Status:** Approved

**Decision**

The Steiner Khurdopin paper is treated as a 2018 publication documenting 2017 events.

**Reason**

Event year and publication year are different facts.

**Implication**

Bibliography must use the publication year; event metadata must use the event year.

---

## DEC-003 — Do not use Khan et al. 2021 as the primary source for the 7 May 2022 Shishper event

**Status:** Approved

**Decision**

A source specifically documenting the 7 May 2022 event must be used for that event.

**Reason**

The Khan et al. paper does not serve as the primary documentation for the 2022 event.

**Implication**

Reference list and event-validation metadata must use an appropriate 2022-event source.

---

## DEC-004 — Represent Khurdopin as a drainage sequence

**Status:** Approved

**Decision**

Do not reduce Khurdopin to an unexplained single event date.

**Current metadata**

- drainage onset ≈ 21 July 2017
- lake disappearance/drainage completion ≈ 5 August 2017

**Validation anchor**

TBD; expected to be drainage onset unless the team explicitly chooses otherwise.

---

## DEC-005 — Treat Passu as a period-specific comparison case

**Status:** Approved

**Decision**

Passu is the comparison lake for the selected validation window, not a lake that is historically GLOF-free.

**Reason**

Historical literature documents an earlier Passu outburst.

**Implication**

Use period-specific language in code, plots, report, and presentation.

---

## DEC-006 — Separate formal study period from operational acquisition period

**Status:** Approved

**Decision**

Maintain both:
- formal paper study period
- operational acquisition windows

**Reason**

The development plan includes operational coverage outside the formal 2017–2022 period.

**Implication**

Do not silently merge these windows.

---

## DEC-007 — Avoid duplicate physical Sentinel-1 preprocessing

**Status:** Approved

**Decision**

If using GEE `COPERNICUS/S1_GRD`, do not blindly repeat radiometric calibration and terrain correction.

**Reason**

The GEE GRD collection already contains major preprocessing steps.

**Implication**

Local processing must be limited to explicitly documented additional steps.

---

## DEC-008 — Distinguish DEM source resolution from model grid

**Status:** Approved

**Decision**

The Copernicus GLO-30 DEM remains a roughly 30 m source even when resampled to a 10 m model grid.

**Implication**

Never describe the resulting raster as a native 10 m DEM.

---

## DEC-009 — Exact model channels must be frozen before training

**Status:** Approved

**Decision**

The exact ordered channel list must be written into `DATA_DICTIONARY.md` and configuration before training.

**Reason**

The project documents currently contain example channel counts that do not fully define the actual bands.

**Implication**

Do not hard-code the example `3` or `8` channel counts as final specifications.

---

## DEC-010 — IEEE dataset is optical pretraining data, not multimodal ground truth

**Status:** Approved

**Decision**

Use the IEEE dataset only for roles supported by its actual modalities and labels.

**Implication**

Do not describe it as paired S1+DEM pretraining.

---

## DEC-011 — Lesi inventory is regional reference/training data, not universal ground truth

**Status:** Approved

**Decision**

Use the 10 m 2020 Lesi inventory as regional training/reference information with explicit temporal and label-source limitations.

**Implication**

Respect source-image metadata and optical-origin label bias.

---

## DEC-012 — Use date-aware splits

**Status:** Approved

**Decision**

Train/validation/test separation must be date-aware to limit temporal leakage.

**Implication**

The split must be explicitly saved and reused by both baseline and fusion evaluation.

---

## DEC-013 — Add cloud-stratified evaluation

**Status:** Approved in principle; exact thresholds TBD

**Decision**

Where observation-quality metadata permit, segmentation performance should be reported by optical usability/cloud condition.

**Reason**

Cloud robustness is central to the project's motivation.

**Implication**

Exact cloud categories and thresholds remain TBD.

---

## DEC-014 — Hazard index is a reduced AHP-inspired adaptation

**Status:** Approved

**Decision**

The project will not claim to reproduce the full Muneeb et al. hazard framework.

**Implication**

The selected subset of features and their weights must be explicitly defined and justified.

---

## DEC-016 — `DLP_Deliverable_1.pdf` is a literature-review deliverable, not the full "Sections 1–12" research plan

**Status:** Approved (factual finding, recorded during specification audit)

**Decision**

Treat `DLP_Deliverable_1.pdf` as what it actually is: a 4-page IEEE-style literature-review paper (Abstract, Introduction, Literature Review with Tables I–III, Research Gap/Problem Statement, and the opening sentence of a "Proposed Dataset (Overview)" section that is cut off mid-sentence). It is authored by Muhammad Ali Saleem, Junaid Minhas, and Safee Akmal.

It is **not** the "approved research plan (Sections 1–12)" that `GLOF_Development_Plan.docx` claims to derive from. No document in the project actually contains numbered Sections 1–12 of a research plan.

**Reason**

Direct inspection of the PDF (extracted page text) shows only: Abstract → I. Introduction → II. Literature Review (Tables I–III + Discussion) → III. Research Gap and Problem Statement → the start of "IV. Proposed Dataset (Overview)," which ends mid-sentence referencing a document/section called "Dataset Description and Data Sources." This confirms that a separate "Dataset Description" document was intended to exist, consistent with the Claude Project Instructions' reference to `Dataset Description.pdf` as primary document #2 — but that file is not present among the uploaded project files (only `CLAUDE_PROJECT_INSTRUCTIONS_V2.md`, `DATA_DICTIONARY.md`, `DECISIONS.md`, `DLP_Deliverable_1.pdf`, `GLOF_Development_Plan.docx`, `GLOF_PROJECT_ISSUES_AND_GUARDRAILS.md`, `PROJECT_MASTER_SPEC.md` were actually available for this audit).

**Implication**

- Any claim in `GLOF_Development_Plan.docx` that cites a specific "research plan Section N" (e.g., Section 4 team table, Section 5 data-source/time-period table, Section 9 timeline) cannot currently be verified against a primary source, because that primary source is missing.
- Facts that *do* appear verified directly in `DLP_Deliverable_1.pdf` (event dates, the five project objectives, the reference list, the Muneeb et al. Passu/Shishper validation scores) are treated as confirmed. Facts that only appear in `GLOF_Development_Plan.docx` without independent confirmation in `DLP_Deliverable_1.pdf` (AOI center coordinates, exact per-lake operational date ranges, patch size defaults, encoder choice, band-selection examples) remain `TBD` pending either discovery of the missing research-plan/Dataset-Description documents or an explicit team decision.
- See OPEN-021 below.

**Affected files:** `PROJECT_MASTER_SPEC.md` (Sections 1, 3), `DATA_DICTIONARY.md` (all TBD sections), this file.

---

## DEC-017 — Direct textual confirmation of the Passu guardrail (B3/DEC-005) found in `DLP_Deliverable_1.pdf`

**Status:** Approved

**Decision**

`DLP_Deliverable_1.pdf` itself, not just the guardrail file, contains direct evidence that Passu is not historically GLOF-free, and that its own Introduction's phrasing ("Passu... has not fully drained... stable comparison lake") is in tension with its own literature-review table.

**Evidence**

- Sec. I (Introduction): "A third lake, Passu, has not fully drained but has been growing for years and is flagged by Pakistan's Meteorological Department as high-risk."
- Table III (Literature Review), row for Muneeb et al. (2021) [3]: "Validated against both historical GLOFs: Passu (0.69), Shisper (0.94)" — i.e., the paper the project's own literature review cites states that Muneeb et al. validated their hazard-susceptibility ranking against **two** historical GLOFs, one of which is Passu.

**Reason**

This is an internal inconsistency within the project's own primary document, not only a risk imported from the guardrail file: the Introduction's framing of Passu as merely "growing," "high-risk," and (elsewhere in `GLOF_Development_Plan.docx`) a "stable" comparison lake sits alongside a literature-review table entry the same paper cites, which states Passu is one of two "historical GLOFs."

**Implication**

This strengthens (does not merely repeat) DEC-005 / guardrail B3/N: Passu must be described in all code, configs, notebooks, figures, and report text as "the comparison lake with no documented outburst during the selected study/validation window," never as "historically GLOF-free" or "a lake that has never experienced GLOF." The exact date and source of Passu's earlier historical outburst remain `TBD` (`SOURCE-VERIFICATION`) — Muneeb et al. (2021) is the lead the team should trace when writing the literature-review/background section of the report and when defining Passu's `event_date` field (currently correctly `null` with `comparison_mode: stable_during_study_window` in guardrail B4's example config — note that the config field name `comparison_mode` should be understood as "no documented outburst in the study window," not "inherently stable").

**Affected files:** `GLOF_PROJECT_ISSUES_AND_GUARDRAILS.md` (already correct, no change needed), `PROJECT_MASTER_SPEC.md` Section 6, `DECISIONS.md`.

---

## DEC-018 — Original document's own reference list reproduces the Steiner year error

**Status:** Approved

**Decision**

`DLP_Deliverable_1.pdf`'s own reference [1] lists "Jakob F. Steiner et al. ... In: The Cryosphere 12.1 (**2017**), pp. 95–101," which is the exact citation-year error flagged in guardrail A1 (correct publication year is 2018; DOI `10.5194/tc-12-95-2018`, which is itself only consistent with a 2018 publication year). The in-text citation correctly uses "21 July 2017" as the **event** date.

**Reason**

Direct confirmation, not inference: the error already exists in the team's own submitted literature review, not merely a hypothetical risk.

**Implication**

When the bibliography is finalized (Epic 12 report, and any /reports notebook citing Steiner), correct the publication year to 2018 while preserving "2017" as the event year, per DEC-002. Do not silently "fix" the PDF; record the correction here and apply it going forward in `PROJECT_MASTER_SPEC.md` / report references.

**Affected files:** future `reports/final_report/`, citation lists in notebooks.

---

## DEC-019 — GLO and HMA-inventory citation corrections apply to specific reference-list entries

**Status:** Approved

**Decision**

Two Zhang-authored 2026 references appear in `DLP_Deliverable_1.pdf`'s reference list — [15] "H. Zhang et al. (2026), Journal of Hydrology 664" and [16] "M. Zhang, Chen, Tian et al. (2026), Scientific Reports." Guardrail A3's correction (to Ravindra Kumar and Saurabh Vijay, *Scientific Reports* 16, 5760, 2026) applies specifically to reference **[16]**, the "Automated satellite-based glacial lake inventory and change detection in High Mountain Asia" entry — not to [15], which is a distinct paper.

Separately, reference [19] "L. D. Rawlins, C. S. Watson, M. B. Chand, et al. ... Earth System Science Data 18 (**2025**), p. 5143" conflicts with guardrail A4's correction (2026 publication year, same volume/page). This is a genuine year discrepancy between the source document and the guardrail file.

**Reason**

Prevents misapplying a bibliographic correction to the wrong reference-list entry, and flags that the GLO year correction still needs independent source verification before being frozen, since it changes a fact stated in the primary document itself.

**Implication**

- Apply the A3 correction to reference [16] only when the bibliography is finalized.
- Mark the GLO/Rawlins publication year as `SOURCE-VERIFICATION` (OPEN-023) rather than silently adopting either 2025 or 2026 — verify against the publisher (ESSD) before freezing.

**Affected files:** future `reports/final_report/`, `PROJECT_MASTER_SPEC.md` Section 8 (GLO dataset role).

---

## DEC-020 — `Dataset Description.pdf` still not found; cannot incorporate as requested

**Status:** Approved (factual correction to session input)

**Decision**

The user's instruction for this task stated that `Dataset Description.pdf` is "now available." A direct filesystem check of the Claude Project's uploaded files (`/mnt/project/`) and the chat's own upload area during this session found no such file — only the same six documents present during the prior audit (`CLAUDE_PROJECT_INSTRUCTIONS_V2.md`, `DATA_DICTIONARY.md`, `DECISIONS.md`, `DLP_Deliverable_1.pdf`, `GLOF_Development_Plan.docx`, `GLOF_PROJECT_ISSUES_AND_GUARDRAILS.md`, `PROJECT_MASTER_SPEC.md`).

**Reason**

Fabricating dataset-description content (exact dataset sizes, per-lake date windows, band lists) not actually present in any document would violate the project's core scientific-integrity rule against inventing dataset properties. It is safer to explicitly flag the gap than to silently proceed as if the file had been read.

**Implication**

OPEN-021 remains open. All items whose resolution depends specifically on `Dataset Description.pdf` (exact per-lake operational date windows, dataset size figures beyond what `DLP_Deliverable_1.pdf` already states) remain `TBD`. If/when the file is actually uploaded to the Claude Project, it must be read and this decision superseded by a new entry, not silently overwritten.

**Affected files:** `PROJECT_MASTER_SPEC.md` Section 5, `DECISIONS.md` OPEN-021.

---

## DEC-021 — External verification: GLO (Rawlins et al.) publication year is 2026, not 2025

**Status:** Approved

**Decision**

Web search directly against the publisher (Copernicus/ESSD) confirms: Rawlins, L. D., Watson, C. S., Bhambri, R., Khadka, N., and Chand, M. B., "Glacial Lake Observatory (GLO): annual dataset of glacial lakes in Nepal and transboundary catchments (2017–2024)," *Earth System Science Data*, 18, 5143–5165, https://doi.org/10.5194/essd-18-5143-2026, published 2026 (article page: essd.copernicus.org/articles/18/5143/2026/). This resolves OPEN-023.

**Reason**

Authoritative external verification directly against the journal's own article page, not a secondary source.

**Implication**

Guardrail A4 (2026) is correct. `DLP_Deliverable_1.pdf`'s own reference [19], which lists "(2025/2026)" with year 2025 in the citation body, contains the error, not the guardrail. Freeze the 2026 publication year for any future citation of this source. Note the discussion-paper predecessor (`essd-2025-751`) was posted for discussion in January 2026 and carries a 2025 preprint identifier in its URL — this is the likely source of the ambiguity in the original document, not evidence for a 2025 final-publication year.

**Evidence:** https://essd.copernicus.org/articles/18/5143/2026/ (accessed via web search, this session).

**Affected files:** future `reports/final_report/` bibliography; `DECISIONS.md` OPEN-023 (now resolved).

---

## DEC-022 — External verification: Kumar & Vijay automated HMA glacial-lake inventory work exists and is dated 2026 (partial verification)

**Status:** Approved with caveat

**Decision**

Web search confirms Ravindra Kumar and Saurabh Vijay (IIT Roorkee) authored an automated multi-sensor glacial-lake inventory/GLOF-detection framework for High Mountain Asia, evidenced by: an EGU General Assembly 2026 abstract ("Automated Multi-Sensor Framework for Glacial Lake Dynamics and Unreported GLOF Detection across High Mountain Asia," EGU26-702, 2026), a PANGAEA dataset record ("Inventory of Glacial Lakes in High Mountain Asia for the Years 2016 and 2022," Kumar & Vijay, Publication Year 2026, DOI 10.1594/PANGAEA.983845) reporting 31,698 lakes in 2022, and a January 2026 Hindi-language news report on the same IIT Roorkee study citing the identical 31,698-lake figure.

**Reason**

This corroborates the authorship, institution, and approximate 2026 timing behind guardrail A3's correction, but the search did **not** independently re-confirm the exact *Scientific Reports* 16, 5760 (2026) volume/page/DOI the guardrail file cites.

**Implication**

Treat A3's author correction (Kumar and Vijay, not "M. Zhang et al.") as verified. Treat the exact *Scientific Reports* DOI/page as `SOURCE-VERIFICATION` still pending final confirmation before the report bibliography is frozen — see OPEN-024.

**Evidence:** EGU26-702 (meetingorganizer.copernicus.org), PANGAEA DOI 10.1594/PANGAEA.983845, aajtak.in news report (31 Jan 2026).

**Affected files:** `DECISIONS.md` OPEN-024 (new).

---

## DEC-023 — Target CRS resolved: EPSG:32643 (UTM Zone 43N)

**Status:** Approved

**Decision**

Freeze the target CRS as **EPSG:32643 (WGS 84 / UTM zone 43N)**.

**Reason**

All three lakes lie between approximately 74.7°E and 75.0°E (Passu glacier ≈74.77°E per Wikipedia; Shishper/Khurdopin in the same Hunza basin span). The UTM zone for a longitude λ is `floor((λ + 180) / 6) + 1`; for λ ≈ 74.7–75.0°E this gives zone 43, and all three lakes are in the Northern Hemisphere (≈36°N), so EPSG:32643 is the geometrically correct UTM CRS. `GLOF_Development_Plan.docx`'s coregistration module description already suggested "likely UTM zone for Hunza, e.g. EPSG:32643" as an example; this decision converts that example into a frozen project setting because it is independently verifiable arithmetic, not a discretionary choice.

**Evidence:** UTM zone formula (standard geodesy); Passu Glacier coordinates 36.47°N, 74.77°E (Wikipedia, "Passu Glacier," accessed this session).

**Implication**

`configs/preprocessing.yaml` and `DATA_DICTIONARY.md` Section 1 ("Target CRS") should use `EPSG:32643` once implementation begins. This does not freeze the AOI extents themselves (still open — see OPEN-001) or the per-lake bounding boxes (still requires visual GEE confirmation per `GLOF_Development_Plan.docx` US‑1.5).

**Affected files:** `DATA_DICTIONARY.md` Section 1, `PROJECT_MASTER_SPEC.md` Section 10.

---

## DEC-024 — Approximate reference coordinates found for Passu; Shishper and Khurdopin not verified this session

**Status:** Informational only — does not freeze an AOI

**Decision**

Web search found a reference point for Passu: Passu Glacier front ≈36.47°N, 74.77°E; Passu village ≈36.467°N, 74.90°E (Wikipedia). No equivalent quick-reference coordinate was retrieved this session for the Shishper or Khurdopin lake fronts specifically (only general valley/basin names — Hassanabad for Shishper, Shimshal valley for Khurdopin).

**Reason**

These are useful starting reference points for a human to center a GEE AOI search on, but they are village/glacier-front coordinates from a general encyclopedia source, not a surveyed lake-extent bounding box, and are explicitly not a substitute for the visual AOI confirmation `GLOF_Development_Plan.docx` already requires (Epic 1, US‑1.5).

**Implication**

Do **not** freeze these as AOI centers. OPEN-001 remains open and is properly closed only by each lake owner's visual GEE confirmation, as already specified in the Development Plan. This decision only narrows the search space for that step.

**Affected files:** none frozen; informational note added to `PROJECT_MASTER_SPEC.md` Section 4.

---

## DEC-025 — Additional independent corroboration of Khurdopin/Shimshal's multi-event GLOF history

**Status:** Informational

**Decision**

Independent sources (Pamir Times; a UN OCHA/ReliefWeb report) confirm the Shimshal valley (where Khurdopin sits) has a documented multi-decade GLOF history predating 2017, including events reported in 1884, 1906, and a ~20-year surge/burst cycle noted by Pakistan's NDMA, in addition to the 2017 event this project uses as its validation anchor. One secondary source (Pamir Times) describes the 2017 outburst culminating around "1 August 2017" rather than the ~5 August drainage-completion date in the guardrail file/Steiner et al. — a minor date variation across secondary sources.

**Reason**

This is supporting historical context, not a correction to the frozen Khurdopin event window (drainage onset ≈21 July 2017, per Steiner et al. 2018, remains the peer-reviewed anchor per DEC‑004).

**Implication**

None of this changes DEC-004's frozen validation anchor. It does reinforce that, like Passu, Khurdopin/Shimshal should not be described as if 2017 were its only historical GLOF — useful context for the report's background section, not a configuration change.

**Affected files:** none (informational; optional background-section content for Epic 12).

---

## DEC-026 — `Dataset Description.pdf` received and incorporated; supersedes DEC-020

**Status:** Approved

**Decision**

`Dataset Description.pdf` was uploaded by the user in this session (via chat upload, not the Claude Project's file store) and has now been read in full and incorporated below. DEC-020's concern (the file was missing) is resolved for the content of this document. Note: it arrived as a chat attachment, not as an addition to the Claude Project's persistent file store — if the project's file store is what future sessions read from, the team should still add it there so it persists across sessions.

**Reason**

Direct read of the uploaded document.

**Implication**

OPEN-021 is now partially resolved (the Dataset Description document itself is available); the other half of OPEN-021 — the missing "research plan Sections 1–12" that `GLOF_Development_Plan.docx` cites — is still unresolved, since `Dataset_Description.pdf` is a distinct, shorter document (7 sections: Overview, Raw Satellite Imagery, Existing Labeled Dataset, Existing Regional Lake Inventory, Justification Summary, Access Notes, Known Limitations) and does not itself contain a 12-section research plan either.

**Important caveat about this source's own reliability:** `Dataset_Description.pdf` is itself an incomplete draft — it contains numerous bracketed author placeholders still unresolved in the source text itself (e.g., "[table/appendix]", "[confirm Lesi's source-image dates in their methods]", "[N ≥ 10]", "[10–20]%", "[replace or drop Khan et al., 2021 unless it covers 2022]", "[confirm]" next to Passu's no-outburst claim, "[glacier outlines, e.g. RGI 7.0]", "[check whether Muneeb's inventory is downloadable]", and "confirm with scene counts" for the Sentinel-1B gap). These bracketed items are treated below as the *source document's own* open items, not resolved facts, and are carried into `PROJECT_MASTER_SPEC.md`/`DATA_DICTIONARY.md` as such rather than silently treated as settled.

**Affected files:** all three control files, updated below.

---

## DEC-027 — Khurdopin event-date refinement: drainage completion verified as 3 August 2017 (not ~5 August)

**Status:** Approved (refines DEC-004, does not delete it)

**Decision**

Three independent sources now agree on a more precise Khurdopin timeline than the guardrail file's approximate dates:
- Lake formation: March 2017 (`Dataset_Description.pdf`; NASA Earth Observatory, citing Steiner's group directly, also states the lake "pooled up in March 2017").
- Drainage onset: "late July 2017" — NASA Earth Observatory (citing Steiner): "In late July 2017, the size of the lake dropped from 100,000 square meters to about 40,000 square meters in a few days." This is consistent with, but does not itself pin down, the guardrail's "≈21 July 2017" onset date — no source found in this session states the day "21 July" explicitly; it appears to originate from the guardrail file's own prior research and is not contradicted by "late July," so it is retained as the working onset anchor unless a more precise primary-source check finds otherwise.
- Drainage completion: **3 August 2017** — confirmed identically by `Dataset_Description.pdf` ("drained by 3 August 2017") and independently by NASA Earth Observatory ("By August 3, 2017, the lake had completely drained"). This is 2 days earlier than the guardrail file's "≈5 August 2017."

**Reason**

Two independent sources (the project's own Dataset Description and NASA Earth Observatory, both ultimately citing Steiner et al. 2018) agree exactly on 3 August; no source found supports 5 August specifically. This is authoritative external verification (category 2), not a silent judgment call.

**Implication**

Update the Khurdopin drainage-completion date used in configs/plots/report from "≈5 August 2017" to **3 August 2017**. Keep "≈21 July 2017" as the onset anchor (still the best available estimate for "late July") but note it is an approximation, not independently re-verified to the exact day this session. `GLOF_PROJECT_ISSUES_AND_GUARDRAILS.md` B1/B4 is not edited (guardrail files are the correction layer, not to be silently rewritten) — this decision is the authoritative update going forward; `PROJECT_MASTER_SPEC.md` Section 6 is updated to reflect it.

**Evidence:** `Dataset_Description.pdf` §4; NASA Earth Observatory, "When Glaciers and Rivers Collide," science.nasa.gov (accessed this session); Steiner et al. 2018, *The Cryosphere* 12, 95–101 (abstract/text consulted directly, confirms March 2017 lake formation and surge chronology, though the exact day-level drainage dates come from the NASA feature rather than the abstract itself).

**Affected files:** `PROJECT_MASTER_SPEC.md` Section 6, `configs/lakes.yaml` (at implementation time).

---

## DEC-028 — New verified risk: Sentinel-1B failure (23 Dec 2021) reduces SAR revisit exactly over the Shishper 2022 event window

**Status:** Approved (new finding, not previously logged)

**Decision**

`Dataset_Description.pdf`'s own "Known Limitations" section flags, with a "confirm with scene counts" caveat: "Sentinel-1B stopped in December 2021, so 2022 SAR revisit is sparser." This is now externally verified: ESA/Copernicus confirms Sentinel-1B suffered a fatal power-supply anomaly on **23 December 2021** and the mission was formally ended in August 2022; Sentinel-1A alone continued operating. This means SAR revisit frequency over all three lakes roughly halved (from a combined ~6-day repeat cycle to ~12-day, subject to the actual acquisition plan) for the entire 2022 portion of the study period — which is exactly the window containing the Shishper 7 May 2022 outburst, the project's second event-validation case.

**Reason**

This is a genuine, externally-confirmed data-availability constraint that directly affects the project's ability to observe a rising hazard/growth signal in SAR data in the lead-up to the Shishper event — a hazard-validation risk (relates to Guardrail M/DEC-013's cloud-robustness motivation, since sparser SAR reduces exactly the modality meant to compensate for cloud gaps).

**Implication**

- Add to `PROJECT_MASTER_SPEC.md` Section 20 (Known Methodological Constraints).
- When Epic 1 runs the actual scene-count check (as `Dataset_Description.pdf` itself calls for), report S1 scene counts separately for pre-Dec-2021 and post-Dec-2021 periods per lake, since this could materially affect fusion-vs-optical comparison fairness specifically around the Shishper window.
- Does not block implementation — it's a reporting/interpretation requirement, not a missing decision.

**Evidence:** ESA, "Mission ends for Copernicus Sentinel-1B satellite," esa.int (accessed this session, confirms 23 Dec 2021 anomaly date and permanent loss).

**Affected files:** `PROJECT_MASTER_SPEC.md` Section 20.

---

## DEC-029 — Resolving `Dataset_Description.pdf`'s ambiguous Sentinel-1 "terrain-corrected" wording per the existing no-double-processing guardrail

**Status:** Approved

**Decision**

`Dataset_Description.pdf` §2 states: "Sentinel-1 is terrain-corrected and speckle-filtered, with DEM-derived shadow/layover masks." Read literally and in isolation, "terrain-corrected" could be misread as instructing an additional local terrain-correction pass on top of `COPERNICUS/S1_GRD`, which already includes terrain correction — exactly the double-processing risk Guardrail D1/DEC-007 warns against.

**Decision:** interpret "terrain-corrected" in this sentence as referring to the terrain correction already included in the `COPERNICUS/S1_GRD` product (i.e., descriptive of the input's existing state), not as an instruction to reapply physical terrain correction locally. The only genuinely *additional* local processing this document specifies is speckle filtering and DEM-derived shadow/layover masking — both of which are legitimate additional steps under Guardrail D1.

**Reason**

This reading is the only one consistent with `Dataset_Description.pdf`'s own Section 2 table, which explicitly names `COPERNICUS_S1_GRD` (already-processed GRD) as the source, and with the project's already-frozen DEC-007/Guardrail D1. Guardrail-file corrections take precedence over an ambiguous phrase in a newly supplied document per the project instructions ("do not silently reproduce a flagged problem merely because it appears in the original documents").

**Implication**

`src/glof/preprocessing/sar_preprocessing.py` (Epic 2) must NOT implement radiometric calibration or a redundant terrain-correction algorithm; it should implement speckle filtering (Refined Lee, per Dev Plan) and DEM-derived shadow/layover masking only, and its docstring should explicitly state that terrain correction is inherited from `COPERNICUS/S1_GRD`, not reapplied.

**Affected files:** `DATA_DICTIONARY.md` §2 (processing rule), future `src/glof/preprocessing/sar_preprocessing.py` docstring.

---

## DEC-030 — Lesi et al. (2022) role clarified: corridor-wide fusion training, not target-lake ground truth

**Status:** Approved (refines DEC-011, does not delete it)

**Decision**

`Dataset_Description.pdf` §4 gives a materially more precise role for the Lesi inventory than any prior document:
1. The 10 m 2020 layer (7,560 lakes, 500 m² minimum mapping unit, validated against Google Earth boundaries at ~4.5% median difference) is used as **training labels for the fusion model on corridor lakes outside the three target lakes** — i.e., it expands the fusion model's training set using other CPEC-corridor lakes, pulling matching-date Sentinel-1/Sentinel-2/DEM from Earth Engine for those *other* lakes' 2020 dates.
2. It is separately used as a **2020 reference for Shishper and Passu only** — not Khurdopin, because the inventory "has no 2017 or 2022 snapshot and does not contain Khurdopin's 2017 lake" (its ephemeral surge-dammed lake did not exist as a stable feature in 2020).
3. The 1990/2000 Landsat-era Lesi layers are explicitly not used (predate Sentinel-1/2).

**Reason**

This is a materially different and more specific role than "regional training/reference information" as previously stated — it clarifies Lesi is a *training-set expansion* mechanism (extra corridor lakes for the fusion model to learn from) in addition to being a reference-only role for two of the three target lakes, and is not usable at all as a Khurdopin reference.

**Implication**

- `src/glof/labeling/` and `src/glof/datasets/lake_dataset.py` scope should be understood as needing a "corridor lakes" training set distinct from the three target lakes' own labeled data — this is a new, previously-unscoped data source category, not just a validation reference. Flag for the team: this may add non-trivial scope (identifying and pulling Earth Engine imagery for corridor lakes beyond Shishper/Khurdopin/Passu) that wasn't explicit in `GLOF_Development_Plan.docx`'s repository/epic structure. Recommend the team confirm whether this corridor-lakes training step is in scope for the semester or should be treated as a stretch goal (see new Decision D-F addendum, below).
- Do not use Lesi as any kind of Khurdopin reference or training source.
- `Dataset_Description.pdf` itself flags `[check Lesi's source-image dates in their methods]` as unresolved — carry forward as `SOURCE-VERIFICATION`.

**Affected files:** `DATA_DICTIONARY.md` §12, `PROJECT_MASTER_SPEC.md` §8, Decision Table addendum D-F2 (below).

---

## DEC-031 — IEEE DataPort dataset description confirmed with primary-source figures; coverage caveat added

**Status:** Approved

**Decision**

`Dataset_Description.pdf` §3 confirms the IEEE DataPort figures already carried in `PROJECT_MASTER_SPEC.md` (1,200 cloud-free Sentinel-2 true-colour images, 1,000 train / 200 test, manually generated masks, sampled across High Mountain Asia) — these are now sourced to the project's own Dataset Description rather than an unsourced prior draft. New information: the images are RGB PNGs with **no paired Sentinel-1 or DEM data** (confirming Guardrail G1/DEC-010's "optical pretraining only" framing directly from a primary source now), and **coverage of Karakoram/Hunza lakes specifically has not been verified** — the dataset spans HMA broadly, and whether it includes any Hunza-basin lakes at all is unconfirmed. The document also flags `[confirm georeferencing in the README]` as unresolved.

**Reason**

Strengthens DEC-010 with primary-source confirmation; adds two previously-unlogged caveats (no geographic overlap confirmed with the study area; georeferencing unconfirmed).

**Implication**

Before Epic 3 pretraining, check the IEEE dataset's README for (a) georeferencing/coordinates per image, to determine if any Hunza-basin scenes are included (relevant to domain-shift discussion in Guardrail G1 and `PROJECT_MASTER_SPEC.md` §20), and (b) confirm it is genuinely disjoint from the three target lakes' own imagery to avoid any accidental train/test overlap.

**Affected files:** `PROJECT_MASTER_SPEC.md` §8, §20.

---

## DEC-032 — Shishper 2022 citation resolved: use Ullah et al. (2025), drop Khan et al. (2021) for this specific claim

**Status:** Approved (closes DEC-003's open citation question)

**Decision**

`Dataset_Description.pdf` §4 explicitly cites "Ullah et al. (2025)" for the 7 May 2022 Shishper outburst, and itself flags `[replace or drop Khan et al., 2021 unless it covers 2022]` — the project's own authors already recognized the Khan-2021 issue independently of the guardrail file. Freeze: **Ullah et al. (2025)** is the citation for the 7 May 2022 event date; Khan et al. (2021) may still be cited elsewhere (e.g., for pre-2022 Shishper glacier expansion history) but never as the source for the 2022 event itself.

**Reason**

Closes the loop opened by DEC-003/Guardrail A2 with the team's own primary-source confirmation.

**Implication**

`configs/lakes.yaml` and the report bibliography should cite Ullah et al. (2025) specifically for `shishper.outburst_date: 2022-05-07`.

**Affected files:** `PROJECT_MASTER_SPEC.md` §6, future `configs/lakes.yaml`.

---

## DEC-033 — Target-lake manual label count: minimum 10, target 15–20 (reconciled, not conflicting)

**Status:** Approved

**Decision**

`Dataset_Description.pdf` §4 commits only to "[N ≥ 10] dates per lake," while `GLOF_Development_Plan.docx`, `PROJECT_MASTER_SPEC.md`, and the guardrail file all describe "~15–20 dates per lake" as the plan. These are not in conflict: read `Dataset_Description.pdf`'s "N ≥ 10" as the **minimum acceptable** scope commitment (i.e., the floor below which the label set is insufficient), and "~15–20" as the **planning target**, consistent with `Dataset_Description.pdf` itself not contradicting the higher figure, only declining to over-promise it in the more cautious Dataset Description document.

**Reason**

Reconciling rather than picking one, since 15–20 ≥ 10 makes both statements simultaneously true; treating "N ≥ 10" as a hard ceiling would misread the source, which uses "≥," not "=".

**Implication**

Definition-of-done for Epic 4 (per-lake corrected labels) should read: "at least 10 dates per lake, targeting 15–20." Cross-label fraction is confirmed at **10–20%** — both `Dataset_Description.pdf` and `GLOF_Development_Plan.docx` independently give this same range, so treat 10–20% as a converged (though still not point-valued) figure.

**Affected files:** `PROJECT_MASTER_SPEC.md` §9, `DATA_DICTIONARY.md` §12.

---

## DEC-034 — Sentinel-1 orbit-direction policy confirmed at the policy level; exact orbit remains data-inspection

**Status:** Approved (partially resolves OPEN-003)

**Decision**

`Dataset_Description.pdf` §2 states: "One orbit direction per lake for consistency" — confirming the *policy* (each lake uses a single, consistent ascending-or-descending orbit throughout, rather than mixing orbits within a lake's time series). The *specific* orbit (ascending vs. descending) per lake is not stated and requires checking actual scene availability in Google Earth Engine per lake (a `DATA-INSPECTION` task, properly assigned to Epic 1).

**Reason**

Direct source confirmation of the policy; the specific orbit choice genuinely depends on GEE data availability that can't be determined from documents alone.

**Implication**

OPEN-003 downgraded from fully open to "policy frozen, specific value pending Epic 1 data inspection" — not a blocker, safe to proceed with Epic 1 as already scoped.

**Affected files:** `PROJECT_MASTER_SPEC.md` §7.

---

## DEC-015 — Hazard weights require sensitivity analysis

**Status:** Approved

**Decision**

Final hazard-score results must include a sensitivity check against reasonable alternate weights.

**Reason**

With a small three-lake study, arbitrary weighting could dominate the result.

**Exact sensitivity procedure:** TBD

---

# Open Decisions

## OPEN-001 — Exact AOIs and bounding boxes

Status: TBD. `Dataset_Description.pdf` does not give lake coordinates either (it says AOI bounding boxes are used to filter GEE queries but does not state them) — still requires visual GEE confirmation per lake (Decision D-A).

## OPEN-002 — Final formal vs operational date windows

Status: Partially resolved. `Dataset_Description.pdf` confirms all imagery is drawn from the single formal window 1 Jan 2017–31 Dec 2022 for all three lakes (no separate "operational" window beyond this is described in the Dataset Description) — this narrows, but does not fully close, `GLOF_Development_Plan.docx`'s implication of lake-specific operational windows extending beyond the formal period (e.g., pre-2017 Khurdopin Landsat, post-2022 Passu coverage). Treat the Dataset Description's single 2017–2022 window as authoritative for data acquisition scope unless/until the missing full research-plan document (OPEN-021) says otherwise; the Development Plan's broader per-lake windows are downgraded to an unconfirmed possibility, not a frozen fact.

## OPEN-003 — Sentinel-1 orbit-direction policy

**Status: Policy resolved — see DEC-034** ("one orbit direction per lake for consistency"). Specific orbit (ascending/descending) per lake remains `DATA-INSPECTION`, to be determined in Epic 1.

## OPEN-004 — Exact Sentinel-2 bands

Status: TBD — remains a Category 3 team decision (Decision D-B). `Dataset_Description.pdf` says only "RGB, NIR and NDWI for clear-sky detection," which is consistent with but does not itself pin down the exact band codes (B02/B03/B04/B08); D-B's proposed default stands.

## OPEN-005 — Final optical channel count

Status: TBD — blocked on OPEN-004/Decision D-B.

## OPEN-006 — Final fusion channel count/order

Status: TBD — blocked on OPEN-004/Decision D-B and Decision D-C (slope channel).

## OPEN-007 — Target CRS

**Status: RESOLVED — see DEC-023.** EPSG:32643.

## OPEN-008 — Resampling methods

Status: TBD (Category 4, proposed default given — bilinear/nearest, see Category 4 table).

## OPEN-009 — Patch size and stride

Status: TBD — Category 3 team decision (Decision D-E).

## OPEN-010 — Exact train/validation/test date splits

Status: TBD — genuinely cannot be frozen before Epic 4 labeling happens; not a blocker.

## OPEN-011 — Pretraining dataset(s)

Status: TBD — Category 3 team decision (Decision D-F), now refined by DEC-030's discovery that Lesi's actual role is corridor-wide fusion-model training data, not just a reference — see Decision D-F2 (below) for the added scope question this raises.

## OPEN-012 — Encoder architecture

Status: TBD.

## OPEN-013 — Exact cloud-stratification thresholds

Status: TBD — Category 3 team decision (Decision D-G).

## OPEN-014 — Hazard feature normalization

Status: TBD (Category 4, proposed default given — min-max from pooled training distribution).

## OPEN-015 — Hazard weights

Status: TBD — Category 3 team decision (Decision D-H), core scientific decision.

## OPEN-016 — Glacier-terminus definition / coordinates

Status: TBD — now clarified but not resolved by `Dataset_Description.pdf` §4's own bracketed note: "[glacier outlines, e.g. RGI 7.0] for glacier proximity in the hazard score; if not used, state that the score uses only DEM-derived terrain features plus lake area and growth rate." This means the terminus-distance feature is itself conditionally in scope — see new Decision D-J (below).

## OPEN-017 — Hazard-validation lead window

Status: TBD (Category 4, proposed default given — 6 months).

## OPEN-018 — Storage strategy for large rasters/checkpoints

Status: TBD — Category 3 team decision (Decision D-I).

## OPEN-019 — Final report format

Status: TBD.

## OPEN-020 — Rule for choosing model carried into time-series inference

Status: TBD.

## OPEN-021 — Missing primary source documents

**Status: Partially resolved.** `Dataset_Description.pdf` is now available (DEC-026) and closes that half of this item. Still open: no document with the "approved research plan (Sections 1–12)" structure that `GLOF_Development_Plan.docx` cites has been found — `Dataset_Description.pdf` is a distinct 7-section document, not that research plan. Team-table details (Section 4 of the alleged research plan), and any Development-Plan claims not corroborated by either `DLP_Deliverable_1.pdf` or `Dataset_Description.pdf`, remain unverified against a primary source.

## OPEN-022 — Mapping of named authors to Member 1/2/3 lake ownership

Status: TBD (`TEAM-DECISION`)

`DLP_Deliverable_1.pdf`'s byline gives three names (Muhammad Ali Saleem, Junaid Minhas, Safee Akmal) but no document states which author owns Shishper, Khurdopin, or Passu.

## OPEN-023 — GLO (Rawlins et al.) publication year discrepancy

**Status: RESOLVED — see DEC-021.** Confirmed 2026 via direct publisher verification.

## OPEN-024 — Exact *Scientific Reports* DOI/page for Kumar & Vijay HMA inventory citation

Status: TBD (`SOURCE-VERIFICATION`) — authorship/timing corroborated (DEC-022), exact journal DOI/page not independently re-confirmed this session.

## OPEN-025 — Georeferencing and Karakoram/Hunza coverage of the IEEE DataPort dataset

Status: TBD (`DATA-INSPECTION`) — see DEC-031. Must check the IEEE dataset's own README before Epic 3 pretraining.

## OPEN-026 — Corridor-lakes training scope for the fusion model (Lesi-derived)

Status: TBD (`TEAM-DECISION`) — see DEC-030 and Decision D-F2. `Dataset_Description.pdf` describes training the fusion model on corridor lakes beyond the three target lakes using Lesi 2020 labels; this is additional scope not reflected in `GLOF_Development_Plan.docx`'s epic/repository structure and needs an explicit in/out-of-scope call.

## OPEN-027 — Whether glacier-terminus distance is used as a hazard feature at all

Status: TBD (`TEAM-DECISION`) — see Decision D-J.

---

# Specification Audit

**Audit date:** Pre-implementation bootstrap (this session). **Scope:** `DLP_Deliverable_1.pdf`, `GLOF_Development_Plan.docx`, `GLOF_PROJECT_ISSUES_AND_GUARDRAILS.md`, `PROJECT_MASTER_SPEC.md`, `DECISIONS.md`, `DATA_DICTIONARY.md`. `Dataset Description.pdf` was listed as in-scope but is not present (OPEN-021).

## Confirmed

- Project title, three-lake scope (Shishper, Khurdopin, Passu), and the two-model comparison (optical-only U-Net vs. early-fusion S1+S2+DEM U-Net) are confirmed directly in `DLP_Deliverable_1.pdf` Sec. I.
- The project's five objectives are confirmed verbatim-equivalent in `DLP_Deliverable_1.pdf` Sec. I (now reflected in `PROJECT_MASTER_SPEC.md` Section 3, RQ1–RQ3).
- Khurdopin drainage-onset date (21 July 2017) and Shishper outburst date (7 May 2022) are confirmed directly in `DLP_Deliverable_1.pdf` Sec. I, consistent with `GLOF_Development_Plan.docx`, guardrails, and prior `DECISIONS.md` entries.
- Passu's non-GLOF-free status (guardrail B3/N, DEC-005) is now confirmed with a direct textual source inside the project's own literature review (Muneeb et al. validated against "both historical GLOFs: Passu (0.69), Shisper (0.94)") — see DEC-017.
- The Steiner et al. citation-year error (guardrail A1) is confirmed to already exist in the team's own submitted reference list — see DEC-018.
- Formal study period (1 Jan 2017 – 31 Dec 2022) is confirmed in both `GLOF_Development_Plan.docx` and consistent with `DLP_Deliverable_1.pdf`'s truncated "Proposed Dataset" section.
- Core data sources (Sentinel-1 GRD, Sentinel-2 L2A, Copernicus DEM GLO-30, IEEE DataPort dataset, Lesi et al. 2020 inventory) are confirmed at the collection/role level; exact bands, channels, and dates remain unconfirmed (see below).

## Conflicts found

- Internal document conflict: `DLP_Deliverable_1.pdf`'s own Introduction frames Passu as "growing... high-risk" (not GLOF-free) while `GLOF_Development_Plan.docx` and earlier drafts referred to it as a "stable" comparison lake. Resolved per DEC-005/DEC-017: period-specific framing only.
- Bibliographic: Steiner et al. year (2017 in source vs. 2018 correct — DEC-018), GLO/Rawlins year (2025 in source vs. 2026 per guardrail — OPEN-023, still needs independent verification), and the "M. Zhang et al." HMA-inventory attribution, which maps specifically to reference [16] and not [15] (DEC-019).
- Structural: `GLOF_Development_Plan.docx` cites a "research plan Sections 1–12" that does not exist among the available documents; `DLP_Deliverable_1.pdf` is a literature-review-only deliverable (DEC-016). Any Development-Plan claim sourced only to a specific research-plan section number (AOI coordinates, per-lake operational windows, patch-size/encoder examples) is unverified against a primary source.

## Missing information

- `Dataset Description.pdf` is absent (OPEN-021) — this document was expected to define exact bands, dataset sizes, and per-lake time windows in more detail than either available document provides.
- The full "research plan (Sections 1–12)" referenced by the Development Plan is absent or does not exist as a separate document (OPEN-021).
- No document establishes which named author (Saleem, Minhas, Akmal) owns which lake (OPEN-022).
- All items already marked `TBD` in `PROJECT_MASTER_SPEC.md` and `DATA_DICTIONARY.md` remain unresolved: AOIs, target CRS, patch size/stride, exact S2 band set, exact channel order/count for both models, encoder choice, normalization parameters, cloud-stratification thresholds, hazard feature normalization/weights, and artifact-storage strategy.

## Decisions required before implementation

In dependency order (per the project instructions' 16-step ordering):

1. Resolve OPEN-021 (locate/upload the missing Dataset Description and/or full research-plan document, or formally adopt `GLOF_Development_Plan.docx` as authoritative for the details it currently only paraphrases).
2. Freeze formal vs. operational date windows per lake (OPEN-002).
3. Freeze AOIs (OPEN-001).
4. Freeze the exact sensor/channel dictionary — S2 bands, NDWI inclusion, DEM/slope channels, S1 channel order (OPEN-004, OPEN-005, OPEN-006, DEC-009/Guardrail F).
5. Freeze target CRS and processing grid (OPEN-007, OPEN-008).
6. Freeze patch size/stride (OPEN-009).
7. Confirm date-aware split policy and exact split dates (OPEN-010).
8. Confirm pretraining dataset(s) and encoder (OPEN-011, OPEN-012).
9. Confirm cloud-stratification thresholds (OPEN-013).
10. Confirm hazard feature normalization and weights, with sensitivity method (OPEN-014, OPEN-015).
11. Confirm glacier-terminus definition/coordinates and hazard-validation lead window (OPEN-016, OPEN-017).
12. Confirm large-artifact storage strategy (OPEN-018).
13. Resolve OPEN-022 (author-to-lake mapping) — low technical risk but needed for per-lake notebook ownership.
14. Resolve OPEN-023 (GLO year) and the other bibliographic corrections — needed only before the report/citation list is finalized, not before coding.

## Safe implementation tasks that can proceed

These do not depend on any currently-open decision and can begin without risk of rework:

- Epic 0 repository skeleton, environment files, `.gitignore`, `Makefile` stubs, package `__init__.py` scaffolding, placeholder tests.
- GEE authentication smoke test (`src/glof/gee/auth.py`).
- Writing the *shape* of `configs/lakes.yaml` and `configs/data_sources.yaml` with `TBD` placeholders for AOI/date values, so the schema is agreed even while values are pending.
- Metric functions (`IoU`, `F1`, `precision`, `recall`) and their synthetic-case unit tests — these do not depend on any unresolved channel/AOI/date decision.
- Loss functions (Dice/BCE).
- Generic U-Net wrapper class supporting configurable `in_channels` (do not hard-code 3 or 8; leave the actual value driven by config, per DEC-009).
- Scaffolding `DATA_DICTIONARY.md`-consuming code (a config loader that reads channel lists from YAML rather than hardcoding them) so that once the channel dictionary is frozen, no code changes are needed.

---

# Specification Closure — Item Classification (dependency order)

Classification key: **[1]** fixable from project documents · **[2]** fixable by authoritative external verification · **[3]** requires explicit scientific/methodological decision (see Decision Table below) · **[4]** configurable, non-blocking.

| # | Item | Class | Resolution this session |
|---|---|---|---|
| 1 | Formal study period | [1] | Already frozen: 2017‑01‑01–2022‑12‑31 (DLP1 + Dev Plan agree). |
| 1 | Per-lake operational acquisition windows | blocked | Depends on missing `Dataset Description.pdf` (OPEN-021). Remains TBD. |
| 2 | AOIs (Shishper, Khurdopin, Passu) | [3]/data-inspection | See Decision Table D-A. Reference coordinates found for Passu only (DEC-024); final boxes need visual GEE confirmation per team. |
| 3 | Sentinel-1 inputs/preprocessing philosophy | [1] | Already frozen: use `COPERNICUS/S1_GRD`, do not double-calibrate/terrain-correct (DEC-007, Guardrail D). Exact filter parameters are [4]. |
| 4 | Exact Sentinel-2 bands | [3] | See Decision Table D-B. |
| 5 | Exact channel definitions/order | [3] | Depends on D-B and D-D (DEM/slope); see Decision Table D-B/D-C. |
| 6 | DEM and derived-terrain inputs | [1]+[3] | Role/resolution distinction already frozen (30 m source ≠ 10 m grid, DEC-008). Whether slope is included as a channel is [3] — see Decision Table D-C. |
| 7 | CRS / common 10 m grid | [2] | **Resolved this session:** EPSG:32643 (DEC-023). Grid origin/alignment still [4]. |
| 8 | Resampling rules | [4] | See Proposed Defaults. |
| 9 | Patch size/extraction policy | [3]/[4] | See Decision Table D-E. |
| 10 | Label taxonomy/label-quality policy | [1] | Already frozen (Sec. 9/12 of `DATA_DICTIONARY.md`, Guardrail I). No change needed. |
| 11 | Date-aware split | [1] (policy) + [4] (exact dates) | Policy already frozen (DEC-012). Exact dates depend on which dates get manually corrected (Epic 4) — genuinely can't be frozen yet, not a blocker. |
| 12 | Pretraining strategy/transfer policy | [3] | See Decision Table D-F. |
| 13 | Exact baseline model input | blocked | Depends on D-B (S2 bands) and NDWI-as-channel confirmation (already implied yes). |
| 14 | Exact fusion model input | blocked | Depends on D-B, D-C, and #3. |
| 15 | Evaluation metrics / cloud stratification | [1] (metrics) + [3] (thresholds) | Metrics already frozen. Thresholds — see Decision Table D-G. |
| 16 | Time-series calculation rules | [1] | Already frozen at the definitional level (area = pixel count × pixel area; growth rate normalized by elapsed time; Guardrail M staged reporting). Implementation-level formula choices are [4]. |
| 17 | Hazard features/normalization | [1] (feature list) + [4] (normalization method) | Feature list already frozen (area, growth rate, slope, terminus distance). Normalization method — see Proposed Defaults. |
| 18 | Hazard weighting methodology | [3] | See Decision Table D-H. Core scientific decision — cannot default silently beyond a starting proposal. |
| 19 | Event-validation windows | [1] (anchors) + [4] (lead-window length) | Anchors already frozen (Khurdopin onset 2017‑07‑21, Shishper 2022‑05‑07). Lead-window length for trend inspection — see Proposed Defaults. |
| 20 | Artifact/data storage | [3] | See Decision Table D-I. |

---

# Category 3 — Decisions Requiring Team/Scientific Approval

| ID | Item | Why it matters | Proposed default | Alternative(s) | Consequences | Approval needed for |
|---|---|---|---|---|---|---|
| D-A | Exact AOI bounding box per lake | Wrong AOI silently clips lake extent or glacier terminus in some years, biasing area/growth time series | ~8 km × 8 km box centered on each lake's approximate coordinates (Passu ≈36.47°N/74.77°E per DEC-024; Shishper/Khurdopin centers TBD), confirmed visually against basemap imagery spanning the full study period (not just current extent) | Larger box (more terminus/upstream context, more compute); per-lake asymmetric box shaped to valley orientation | Too small: clips growth in high-extent years. Too large: wastes compute, may include unrelated water bodies | Each lake owner's visual sign-off (already required by Dev Plan US-1.5) |
| D-B | Exact Sentinel-2 band set for optical baseline | Directly sets `in_channels` for the baseline model and fusion model's optical portion; affects cloud/snow discrimination ability | Blue (B02), Green (B03), Red (B04), NIR (B08), plus NDWI as a derived channel — 5 channels total, 10 m native resolution, no resampling needed for these bands | Add SWIR (B11/B12, 20 m resampled to 10 m) for better snow/ice vs. water discrimination, at the cost of introducing a second native resolution to reconcile | Fewer bands = simpler/faster, matches "S2 bands + NDWI" framing in both source docs, but may confuse snow/ice with water at high altitude | Team sign-off before Epic 2/3; must be written into `DATA_DICTIONARY.md` §3 once approved |
| D-C | Whether slope (and/or shadow/layover mask) is an extra fusion channel | Directly changes fusion `in_channels` count | Include slope as one additional channel (derived from the DEM); do not include shadow/layover mask as a model input channel (use it only as a preprocessing/QC flag) | Exclude slope entirely (simpler, matches literal "S1+S2+DEM" framing); include both slope and a binary shadow mask as channels (richer but more complex, more can go wrong with only ~15–20 labeled dates/lake) | More terrain channels can help hazard-adjacent context but also increases overfitting risk given the small labeled set | Team sign-off; must be written into `DATA_DICTIONARY.md` §6/§8 |
| D-E | Patch size and stride | Affects how many training patches exist from a lake AOI this size, and how much context each patch has for a moraine-dammed lake | 256×256 px at 10 m (2.56 km × 2.56 km), stride 128 px (50% overlap) for training; non-overlapping tiling for full-AOI time-series inference | Smaller patches (128×128) for more samples from the small labeled set; larger patches (512×512) for more spatial context per lake at the cost of far fewer independent patches | Too small: may not contain the full lake at high-extent dates. Too large: very few effectively-independent patches given only 3 lakes | Team sign-off; needed before Epic 2 patch generation |
| D-F | Pretraining dataset selection | Sets what the shared pretrained checkpoint actually represents, and what can honestly be claimed about it later (Guardrails G1/G3) | Pretrain on IEEE DataPort only, for the optical-only baseline's encoder; do **not** claim any SAR/DEM pretraining signal from either external dataset. Evaluate GLO as a second, later, explicitly-labeled experiment (S1+S2 fusion pretraining) if time permits, kept clearly separate from the IEEE-based optical pretraining | Skip pretraining entirely given semester compute constraints; use GLO as the sole/primary pretraining source instead of IEEE | Combining datasets casually risks exactly the fabrication risk guardrail G1/G3 warns about (claiming multimodal pretraining that didn't happen) | Team sign-off; affects Epic 3 scope and Epic 12's transfer-learning documentation obligations (Section 12 of the instructions) |
| D-G | Cloud-stratification thresholds | Central to testing the project's own cloud-robustness motivation (Guardrail K, DEC-013) | Clear: scene-level cloud probability <10%; Partially cloud-affected: 10–50%; Heavily cloud-affected/optical-unusable: >50% (using the `COPERNICUS/S2_CLOUD_PROBABILITY` collection already named as a data source) | Use the SCL band's usable-pixel fraction over the lake AOI specifically (more precise, more implementation work) instead of whole-scene cloud probability | Whole-scene thresholds are simpler but can mislabel a scene as "heavily cloud-affected" when the cloud is nowhere near the lake, or vice versa | Team sign-off; needed before Epic 7 evaluation code is finalized (can be implemented provisionally and revised, since it's evaluation-only) |
| D-H | Reduced AHP-inspired hazard weighting scheme | This is the core scientific claim of RQ3; blind-copying Muneeb's full-framework weights onto a 4-feature reduced set would misrepresent both the original and the reduced model (Guardrail L2, DEC-014/015) | Equal weighting (0.25 each) across area, growth rate, slope, terminus distance as the naive baseline, reported alongside at least 2 alternate weightings in the mandatory sensitivity analysis (e.g., a "growth-rate-weighted" scheme emphasizing rate of change, and a "terrain-weighted" scheme emphasizing slope/proximity) — none presented as "the" model | Derive weights from a small expert-elicitation exercise among the 3 team members (mini-AHP pairwise comparison) — more defensible but more effort; or a data-driven weighting (e.g., normalize by each feature's variance) — simplest to implement but hardest to justify scientifically | Any single fixed weighting is a modeling assumption; the sensitivity analysis (already mandatory per DEC-015) is what makes the result defensible regardless of which default is chosen | Team sign-off on final default + which 2+ alternates to report; needed before Epic 9 |
| D-I | Large-artifact storage strategy | Where raw rasters, patches, and checkpoints actually live since they're gitignored (Dev Plan Section F) | Google Drive shared folder with a `models/*/README.md` pointer + path convention, given a 3-person semester team without institutional DVC/cloud-storage infrastructure | DVC with a remote (Google Drive or S3 backend) for full reproducibility tracking; GEE Assets for the raw exports only, Drive for patches/checkpoints | Drive-only is simplest but has no versioning; DVC is more reproducible but adds setup overhead a 3-person semester team may not have time for | Team sign-off; needed before Epic 0 closes (`.gitignore`/README already anticipate this decision) |
| D-F2 | Corridor-lakes training scope (Lesi-derived, new since `Dataset_Description.pdf`) | `Dataset_Description.pdf` §4 describes using the Lesi 10 m 2020 inventory to train the fusion model on corridor lakes *beyond* Shishper/Khurdopin/Passu — extra scope not reflected in `GLOF_Development_Plan.docx`'s Epic/repository structure or timeline | Treat as **in scope but lightweight**: pull a modest number (e.g., 5–10) of well-covered, high-quality corridor lakes from the Lesi 2020 layer as additional fusion-model training patches, reusing the same Epic 2 preprocessing pipeline; do not expand the repository structure or add a new epic for it | (a) Full scope as literally described — every Lesi lake with good 2020 coverage — significant added compute/labeling-adjacent work for a 3-person semester team; (b) Drop entirely, train the fusion model on the three target lakes' own labels only, treating Lesi purely as a Shishper/Passu 2020 reference (simpler, closer to the Development Plan's original scope, but loses Lesi's main stated value per the Dataset Description) | Full scope risks semester timeline (Guardrail/Dev-Plan risk already named: 3-person coordination, compute limits). Dropping it contradicts §4/§5's explicit "Labeling burden" justification for including Lesi at all | Team sign-off — this changes Epic 3/6 scope, needed before Epic 3 begins |
| D-J | Whether glacier-terminus distance is used as a hazard feature | `Dataset_Description.pdf` §4 makes this conditional: "[glacier outlines, e.g. RGI 7.0] for glacier proximity in the hazard score; if not used, state that the score uses only DEM-derived terrain features plus lake area and growth rate." This changes the hazard feature count from 4 to possibly 3 | Use RGI 7.0 (Randolph Glacier Inventory, a free, standard, well-documented glacier-outline product) to compute terminus distance as the 4th hazard feature, since it requires no extra fieldwork and is a one-time static download like the DEM | Drop terminus distance entirely and use a 3-feature hazard index (area, growth rate, slope) — simpler, but diverges further from Muneeb et al.'s framework and loses a spatially-meaningful proximity signal | A 3-feature vs. 4-feature index changes the weighting scheme in Decision D-H — this must be settled before D-H's weights are finalized, not after | Team sign-off; needed before Epic 9, and before D-H's weights can be finalized (dependency: D-J → D-H) |

---

# Category 4 — Proposed Defaults (configurable, non-blocking)

These can be written into configs now without waiting for team approval, and changed later without upstream rework:

| Item | Proposed default | Rationale |
|---|---|---|
| Resampling method (continuous rasters: DEM, S1 backscatter) | Bilinear | Standard for continuous physical quantities; avoids blocky artifacts nearest-neighbor would introduce at a 30 m→10 m DEM resampling |
| Resampling method (categorical: cloud/SCL masks) | Nearest-neighbor | Preserves discrete class labels; bilinear would invent fractional class values |
| Hazard feature normalization | Min–max normalization per feature, computed from the pooled 3-lake training-period distribution (not per-inference-image) | Keeps the weighted sum interpretable in [0,1]; consistent with "computed from training data only" rule already frozen for channel normalization (`DATA_DICTIONARY.md` §9) |
| Hazard-validation lead window | 6 months before each documented event/anchor date | Long enough to observe a trend, short enough to stay within each lake's available imagery density; adjustable per Guardrail M's per-stage reporting requirement |
| S1 speckle filter | Refined Lee filter, single pass, documented window size TBD at implementation time | Already named as the intended approach in `GLOF_Development_Plan.docx`; keeping it a single documented pass (not repeated calibration) is consistent with DEC-007 |
| Boundary/perimeter change metric | Simple perimeter length difference between consecutive dates, reported alongside area (not a separate shape-complexity index) | Matches the instructions' "boundary/perimeter change" wording without over-engineering; can be extended later |

---

# Verified External Facts (this session)

| Fact | Verified value | Source | Supersedes |
|---|---|---|---|
| GLO (Rawlins et al.) publication year | 2026 | essd.copernicus.org/articles/18/5143/2026/ | `DLP_Deliverable_1.pdf` ref [19] ("2025/2026" ambiguity) — resolved in favor of 2026, matching Guardrail A4 |
| Target UTM zone for Hunza-basin lakes | EPSG:32643 (UTM 43N) | Computed from Passu Glacier coordinates (36.47°N, 74.77°E, Wikipedia) via standard UTM zone formula | `GLOF_Development_Plan.docx`'s tentative "e.g. EPSG:32643" — now frozen, not just an example |
| Kumar & Vijay HMA inventory authorship/timing | Corroborated (EGU26-702, PANGAEA DOI 10.1594/PANGAEA.983845, Jan 2026 news coverage, 31,698 lakes in 2022) | Multiple independent sources, this session | Confirms Guardrail A3's author correction; exact *Scientific Reports* DOI/page still open (OPEN-024) |
| Khurdopin/Shimshal historical GLOF context | Multi-event history (1884, 1906, ~20-yr surge cycle per NDMA, 2017) independent of the project's own sources | Pamir Times, ReliefWeb/UN OCHA | Reinforces (does not change) the frozen 2017 anchor (DEC-004) |
| Khurdopin drainage completion date | **3 August 2017** (not ≈5 August) | NASA Earth Observatory (science.nasa.gov, citing Steiner's group) + `Dataset_Description.pdf` §4, independently agreeing | Refines guardrail B1/B4's "≈5 August 2017" — see DEC-027 |
| Sentinel-1B satellite failure date | 23 December 2021, mission formally ended August 2022 | ESA, "Mission ends for Copernicus Sentinel-1B satellite," esa.int | New risk, not previously logged — see DEC-028 |

