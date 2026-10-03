# PROJECT_MASTER_SPEC.md

## Purpose

This file is the current operational specification for the GLOF multi-sensor deep-learning project.

It translates the three primary project documents into a compact implementation-facing specification.

It must contain only:
- facts established by the project documents,
- decisions explicitly approved by the team,
- verified external corrections that the project has adopted.

Anything not finalized must remain `TBD`.

Do not silently invent values.

---

# 1. Project Identity

**Project title**

Multi-Sensor Deep Learning Fusion for Glacial Lake Tracking and GLOF Hazard Assessment in the Hunza Valley, Gilgit-Baltistan

**Course/context**

Deep Learning for Perception semester project.

**Team size**

3 members.

**Team members (per `DLP_Deliverable_1.pdf` byline)**

- Muhammad Ali Saleem
- Junaid Minhas
- Safee Akmal

**Lake ownership**

- Member 1 → Shishper
- Member 2 → Khurdopin
- Member 3 → Passu

**Mapping of named authors to Member 1/2/3 / specific lakes:** TBD (`TEAM-DECISION`). The byline in `DLP_Deliverable_1.pdf` gives names but no document establishes which named author owns which lake. Do not guess this mapping.

---

# 2. Core Research Goal

Build a shared Sentinel-1 SAR + Sentinel-2 optical + Copernicus DEM pipeline that:

1. acquires and preprocesses multimodal satellite data,
2. produces glacial-lake segmentation masks,
3. compares an optical-only baseline against an early-fusion model,
4. tracks lake extent over time,
5. derives area/growth/boundary-change time series,
6. feeds those measurements into a transparent hazard/susceptibility index,
7. validates the resulting historical score behavior against documented event cases.

The three target lakes are:
- Shishper
- Khurdopin
- Passu

---

# 3. Research Questions

The project documents support three main research questions.

## RQ1 — Segmentation

Does the SAR + optical + DEM fusion model perform differently from the optical-only baseline, as measured using segmentation metrics such as IoU and F1?

**Confirmed source wording** (`DLP_Deliverable_1.pdf`, Sec. I, objective ii): "train and compare an optical-only baseline against a fused SAR+optical+DEM model."

**Exact final wording for the report/thesis framing:** TBD — the source gives an objective statement, not a formally phrased research question; final interrogative wording is a `TEAM-DECISION`.

## RQ2 — Time-series tracking

What lake-area and growth-rate patterns are observed across the three lakes over the study period?

**Confirmed source wording** (`DLP_Deliverable_1.pdf`, Sec. I, objective iii): "turn each lake's tracked extent into an area and growth-rate time series."

**Exact final wording:** TBD (`TEAM-DECISION`).

## RQ3 — Hazard-score behavior

Does the transparent hazard/susceptibility score show different historical behavior for the documented event cases versus the comparison lake during the selected validation window?

**Confirmed source wording** (`DLP_Deliverable_1.pdf`, Sec. I, objectives iv–v): "combine those numbers with simple terrain features into a hazard score; and check whether that score rises for Shishper and Khurdopin ahead of their documented events, while staying lower for Passu over the same period."

Guardrail note: the source phrase "staying lower for Passu" must not be read as "Passu has never had a GLOF" — see DEC-005/DEC-016. It means the score should not falsely rise for the comparison lake during the selected validation window.

**Exact final wording:** TBD (`TEAM-DECISION`).

Important:
These are research questions, not predetermined conclusions.

---

# 4. Geographic Scope

**Region**

Hunza Valley / Hunza basin, Gilgit-Baltistan, Pakistan.

**Target lakes**

- Shishper
- Khurdopin
- Passu

**AOI coordinates**

TBD (`TEAM-DECISION` + `DATA-INSPECTION` — see `DECISIONS.md` Decision D-A). A reference starting point for Passu was found via external lookup (Passu Glacier ≈36.47°N, 74.77°E, Wikipedia — DEC-024) but this is not a frozen AOI; final boxes require each lake owner's visual GEE confirmation per `GLOF_Development_Plan.docx` US-1.5. No reference coordinates were retrieved for Shishper or Khurdopin this session.

**Final AOI bounding boxes**

TBD and must be visually verified per lake.

---

# 5. Temporal Scope

## Formal paper-level study period

**2017-01-01 to 2022-12-31**

This is the period stated in the Dataset Description and research document.

**Confirmed by `Dataset_Description.pdf` §2 (DEC-026):** "All imagery is drawn from 1 January 2017 to 31 December 2022" — stated as the single acquisition window for all three lakes, with no separate lake-specific "operational" window described in that document. This narrows the interpretation of the "operational acquisition window" concept below — see the updated note.

## Operational acquisition windows

**Status revised (OPEN-002, partially resolved):** `Dataset_Description.pdf` does not itself describe per-lake operational windows extending beyond 2017–2022; the only extensions it names are *fallback data sources* within that same window (Sentinel-2 L1C, Landsat 8) used where Sentinel-2 L2A coverage is inadequate, not an extended date range. `GLOF_Development_Plan.docx`'s references to pre-2017 Khurdopin Landsat and post-2022 Passu coverage remain unconfirmed against a primary source and should be treated as a possible scope addition requiring team confirmation, not a frozen fact.

Record them separately:

| Lake | Operational acquisition start | Operational acquisition end | Status |
|---|---|---|---|
| Shishper | 2017-01-01 (per Dataset Description) | 2022-12-31 (per Dataset Description) | Matches formal study period; Dev Plan's "early 2023" extension unconfirmed |
| Khurdopin | 2017-01-01 (per Dataset Description); Dev Plan's pre-2017 Landsat extension unconfirmed as a primary-source fact | 2022-12-31 | S2 L2A unavailable/non-global for 2017–2018 over this area (Dataset Description §2) — Landsat 8/S2 L1C fallback required within the same window, per Steiner et al.'s own approach |
| Passu | 2017-01-01 | 2022-12-31 (per Dataset Description); Dev Plan's post-2022 extension unconfirmed | — |

Do not silently merge the formal study period with an unconfirmed extended operational acquisition window.

---

# 6. Event Metadata

## Khurdopin

Use a sequence rather than an unexplained single date.

Current documented concepts (**refined per DEC-027**, verified against `Dataset_Description.pdf` and NASA Earth Observatory, both citing Steiner et al. 2018):
- lake formation: March 2017
- drainage onset: approximately 2017-07-21 ("late July 2017" per NASA/Steiner; exact day not independently re-confirmed this session, retained as working estimate)
- lake disappearance / drainage completion: **2017-08-03** (verified — supersedes the earlier "≈2017-08-05" estimate; see DEC-027)

**Official validation anchor:** TBD, expected to be drainage onset unless the team adopts another documented convention.

## Shishper

- documented 2022 outburst date: 2022-05-07
- validation anchor: 2022-05-07 unless explicitly changed
- citation for this date: **Ullah et al. (2025)** — confirmed via `Dataset_Description.pdf` §4 (DEC-032). Do not cite Khan et al. (2021) for the 2022 event specifically; Khan et al. may still be used for pre-2022 Shishper glacier-expansion history.

## Passu

Passu is the comparison case for the selected study/validation window.

Do NOT define Passu as historically GLOF-free.

**Comparison-window definition:** TBD

---

# 7. Primary Data Sources

## Sentinel-1

Collection:
`COPERNICUS/S1_GRD`

Role:
- SAR
- cloud-independent observation
- VV/VH

Orbit-direction policy:
**Frozen at the policy level (DEC-034):** one consistent orbit direction (ascending or descending) per lake throughout its time series, confirmed via `Dataset_Description.pdf` §2. The specific orbit per lake remains `DATA-INSPECTION`, determined during Epic 1 from actual GEE scene availability.

Important:
If using GEE `COPERNICUS/S1_GRD`, the pipeline must not redundantly perform physical calibration and terrain correction already included in the collection processing.

**`Dataset_Description.pdf` §2's phrase "Sentinel-1 is terrain-corrected and speckle-filtered, with DEM-derived shadow/layover masks" is interpreted per DEC-029 as describing the input's already-processed state (terrain correction inherited from `COPERNICUS/S1_GRD`) plus two genuinely additional local steps (speckle filtering, DEM-derived shadow/layover masking) — not as an instruction to reapply physical terrain correction.**

Additional SAR processing:
Speckle filtering (Refined Lee, per `GLOF_Development_Plan.docx`) and DEM-derived shadow/layover masking. Exact filter window size: TBD (Category 4, implementation-time default).

## Sentinel-2 L2A

Collection:
`COPERNICUS/S2_SR_HARMONIZED`

Role:
- optical imagery
- spectral bands
- NDWI

Cloud/shadow handling:
- required

## Sentinel-2 cloud probability

Collection:
`COPERNICUS/S2_CLOUD_PROBABILITY`

Role:
- observation quality / cloud masking

It is NOT a training label.

## Sentinel-2 L1C

Collection:
`COPERNICUS/S2_HARMONIZED`

Role:
- fallback where L2A is unavailable

## Landsat 8

Collection:
`LANDSAT/LC08/C02/T1_L2`

Role:
- historical fallback/supplement, especially for the Khurdopin pre-2017 context where needed

## Copernicus DEM

Collection:
`COPERNICUS/DEM/GLO30`

Role:
- elevation
- terrain/slope
- terrain context for SAR preprocessing
- hazard features

Source resolution:
approximately 30 m

Model grid:
TBD, current plan targets 10 m.

Important:
A 30 m source resampled to a 10 m grid is not native 10 m terrain data.

---

# 8. External Labeled / Reference Data

## IEEE DataPort glacial lake dataset

**Confirmed** (`Dataset_Description.pdf` §3, DEC-031):
- 1,200 cloud-free Sentinel-2 true-colour images, RGB PNGs
- 1,000 train / 200 test
- manually generated masks
- sampled across High Mountain Asia (broad HMA coverage, not Hunza-specific)
- **no paired Sentinel-1 or DEM data** (confirmed at the source level, not just inferred)
- **Karakoram/Hunza-lake coverage not verified** — unknown whether any Hunza-basin lakes are actually included (OPEN-025)
- georeferencing not yet confirmed against the dataset's own README (OPEN-025)

Intended role:
- optical segmentation pretraining / optical baseline support only

Not paired S1 + DEM data — confirmed, do not use for fusion-model pretraining (Guardrail G1).

Transfer-learning implications:
TBD (which layers transfer vs. reinitialize — still a training-time decision).

## Lesi et al. regional inventory

**Role clarified** (`Dataset_Description.pdf` §4, DEC-030) — more specific than previously stated:

1. **Corridor-wide fusion-model training data**: the 10 m 2020 layer (7,560 lakes, 500 m² minimum mapping unit, validated against Google Earth boundaries at ~4.5% median difference) is used as training labels for the fusion model on CPEC-corridor lakes **outside** the three target lakes, pulling matching Sentinel-1/Sentinel-2/DEM imagery from Earth Engine for those lakes' 2020 dates. **This is additional scope not reflected in `GLOF_Development_Plan.docx`'s epic structure — see `DECISIONS.md` OPEN-026 / Decision D-F2, requires team sign-off on scope (proposed default: 5–10 corridor lakes, lightweight).**
2. **2020 reference for Shishper and Passu only** — NOT Khurdopin. The inventory has no 2017 or 2022 snapshot and does not contain Khurdopin's 2017 ephemeral lake.
3. The 1990/2000 Landsat-era Lesi layers are explicitly out of scope (predate Sentinel-1/2).

Important limitations:
- optical-derived label characteristics
- temporal/source-image metadata must be respected (`Dataset_Description.pdf` itself flags source-image date matching as unresolved — OPEN item, `[check Lesi's source-image dates in their methods]`)
- not universal ground truth for 2017/2022
- not usable as any kind of Khurdopin reference

Exact acquisition-date matching procedure:
TBD (`SOURCE-VERIFICATION` — the Dataset Description itself flags this as unconfirmed)

## GLO dataset

Potential/optional external pretraining source.

Current role:
TBD — not mentioned in `Dataset_Description.pdf` at all (that document names only IEEE DataPort and Lesi as the external sources); treat GLO as a lower-priority/stretch option per Decision D-F, since the project's own Dataset Description does not currently plan to use it.

Do not treat as Hunza target-lake ground truth.

---

# 9. Label Taxonomy

The project must distinguish:

1. weak labels
2. manually corrected labels
3. training labels
4. validation/reference labels
5. held-out test labels
6. external inventory labels
7. model predictions

Approximate local corrected-label target:
**Minimum 10 dates per lake (`Dataset_Description.pdf` §4 commitment), targeting ~15–20 dates per lake (`GLOF_Development_Plan.docx` plan) — reconciled, not conflicting, per DEC-033.** Labels come from visual interpretation of Sentinel-2 or Landsat 8 imagery (Planet imagery conditionally, if access is obtained). A subset of cloud-affected dates is labeled from the nearest clear date where the lake was visibly stable and must be reported as approximate; snow/ice-covered dates are flagged and reported separately (`Dataset_Description.pdf` §4).

Cross-label fraction:
**10–20%** (converged figure — both `Dataset_Description.pdf` and `GLOF_Development_Plan.docx` independently state this same range; DEC-033). Agreement (IoU) between cross-labelers must be reported.

---

# 10. Processing Grid

Target model grid resolution:
**10 m** (subject to final confirmation)

Target CRS:
**EPSG:32643 (WGS 84 / UTM zone 43N)** — frozen, see `DECISIONS.md` DEC-023. Resolved by authoritative geodetic computation (UTM zone formula applied to the Hunza basin's ~74.7–75.0°E longitude range), not a team decision.

Reference grid:
TBD (grid origin/alignment convention still open — see Decision D-E context)

Patch size:
TBD — see `DECISIONS.md` Decision D-E for the proposed default (256×256 px, stride 128) pending team approval.

Patch stride:
TBD — see Decision D-E.

---

# 11. Exact Input Channel Specification

This section MUST be finalized before model training.

## Optical baseline

Exact channels:
TBD

Current conceptual definition:
Sentinel-2 selected bands + NDWI.

## Fusion model

Exact channels:
TBD

Current conceptual definition:
Sentinel-1 VV/VH + selected Sentinel-2 bands + NDWI + DEM (+ optional terrain channels).

## Final channel order

TBD

## Per-channel units

TBD

## Per-channel normalization

TBD

Do not use example values such as `3` or `8` channels as final specifications until the exact channel dictionary is approved.

---

# 12. Preprocessing

## SAR

Planned:
- consistent S1 selection
- orbit consistency where practical
- speckle filtering
- terrain/shadow/layover handling where appropriate

Do not duplicate calibration/terrain correction already provided by the GEE S1 GRD product.

Exact preprocessing:
TBD

## Optical

Planned:
- cloud/shadow masking
- selected-band extraction
- NDWI calculation

NDWI definition:
`(Green - NIR) / (Green + NIR)`

## Co-registration

All modalities must share:
- CRS
- transform
- resolution
- shape

Exact resampling methods:
TBD

---

# 13. Model Architecture

## Baseline

Optical-only U-Net.

Architecture:
U-Net with configurable encoder via `segmentation-models-pytorch` or equivalent implementation consistent with the development plan.

Encoder:
TBD

## Fusion

Early-fusion U-Net.

Input-level stacked channels.

Do NOT replace the main model with feature-level cross-attention, YOLO, transformer, or foundation-model architecture unless separately approved as an additional experiment.

---

# 14. Training Strategy

Pretraining:
TBD after external dataset audit.

Baseline:
fine-tune using the configured optical input.

Fusion:
fine-tune using the configured multimodal input.

Important:
Document which pretrained layers transfer and which layers are reinitialized when channel counts differ.

Train/validation/test splitting:
date-aware; exact split TBD.

---

# 15. Evaluation

Minimum segmentation metrics:
- IoU
- F1
- precision
- recall

Evaluate:
- per lake
- pooled

Also produce qualitative mask overlays.

Cloud-stratified evaluation:
TBD but should be implemented where observation metadata permit it.

---

# 16. Time-Series Outputs

For each available date:
- predicted lake mask
- lake area
- growth rate
- boundary/perimeter change

Growth rate must account for irregular time intervals.

Reference-date accuracy:
MAE/RMSE or another explicitly selected metric against held-out manually corrected reference masks.

---

# 17. Hazard Index

The planned hazard component is a transparent weighted susceptibility index, not a trained classifier.

Current candidate feature family:
- current lake area
- growth rate
- surrounding slope
- glacier-terminus distance

Exact normalization:
TBD

Exact weights:
TBD

Weight-justification evidence:
TBD

Sensitivity analysis:
TBD

Important:
This is a reduced AHP-inspired adaptation, not a reproduction of the complete Muneeb et al. framework.

---

# 18. Hazard Validation

## Shishper

Test historical score behavior leading to the documented 2022 outburst.

## Khurdopin

Test historical score behavior leading to drainage onset/event interval.

## Passu

Evaluate score behavior during the selected comparison window.

Do not present historical retrospective validation as an operational early-warning system.

---

# 19. Reproducibility

Canonical repository:

`glof-fusion/`

Primary directories:
- `configs/`
- `data/`
- `notebooks/`
- `src/glof/`
- `models/`
- `results/`
- `reports/`
- `tests/`

Top-level pipeline stages:
- export-data
- preprocess
- label
- pretrain
- train-baseline
- train-fusion
- evaluate
- timeseries
- hazard
- test
- reproduce-all

Exact data artifact storage:
TBD

---

# 20. Known Methodological Constraints

- Small number of target lakes.
- Sparse manually corrected target-lake labels.
- Temporal autocorrelation.
- Domain shift between external pretraining data and Hunza.
- Optical cloud contamination.
- S1 noise and representation issues.
- 30 m DEM source resampled to 10 m model grid.
- Lesi labels have optical-derived characteristics.
- Only two confirmed event cases are used for event-oriented validation.
- Passu is a period-specific comparison case, not historically event-free.
- Hazard weights are model assumptions and require sensitivity analysis.
- **Sentinel-1B satellite failure (23 December 2021, verified — DEC-028) roughly halves SAR revisit frequency for the remainder of the study period, directly overlapping the Shishper 7 May 2022 event window. Report S1 scene counts separately for pre-/post-Dec-2021 periods.**
- **Sentinel-2 L2A coverage is not global for 2017–2018 (`Dataset_Description.pdf` §2), affecting exactly the Khurdopin 2017 event window — Landsat 8/S2 L1C fallback is required, not optional, for that window.**
- **Khurdopin's lake is small, short-lived, and surge-dammed; a growth-rate-based hazard feature may behave qualitatively differently there than for Shishper (`Dataset_Description.pdf` §7, "Known Limitations").**
- **IEEE DataPort coverage of Karakoram/Hunza lakes specifically is unverified (OPEN-025) — a domain-shift risk beyond the general HMA-vs-Hunza gap already noted above.**
- **Lesi's source-image acquisition dates are not yet confirmed against its own methods paper (`Dataset_Description.pdf` §4/§6) — needed before date-matching corridor-lake or Shishper/Passu reference imagery.**

---

# 21. Frozen / Unfrozen Status

A value is considered **frozen** only when:
1. it is recorded here,
2. it is supported by a source or approved decision,
3. the decision is recorded in `DECISIONS.md`.

Otherwise mark it `TBD`.

Do not silently convert a TBD into a final project fact.
