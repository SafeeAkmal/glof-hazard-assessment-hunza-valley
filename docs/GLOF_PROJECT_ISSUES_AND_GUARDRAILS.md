# GLOF Project — Issues, Corrections & Guardrails

## Purpose

This file is a **guardrail layer** for the Claude Project.

The three original project documents remain the primary project specification, but several issues were identified during a pre-implementation audit. Claude must not silently reproduce these issues.

Use this file together with:

- `DLP_Deliverable_1.pdf`
- `Dataset Description.pdf`
- `GLOF_Development_Plan.docx`

The original documents are the project specification. This document records corrections, ambiguities, and implementation safeguards that must be respected when interpreting and implementing them.

---

# A. Non-Negotiable Reference Corrections

## A1. Steiner et al. citation year

The project currently lists the Khurdopin paper as a 2017 publication.

Correct bibliographic information:

**Steiner et al. (2018)**  
“Brief communication: The Khurdopin glacier surge revisited – extreme flow velocities and formation of a dammed lake in 2017.”  
*The Cryosphere*, 12, 95–101.  
DOI: https://doi.org/10.5194/tc-12-95-2018

Important distinction:

- the **event is in 2017**
- the **paper publication year is 2018**

Never convert an event year into a publication year.

## A2. Khan et al. (2021) must NOT be used as the primary source for the 7 May 2022 Shishper event

The Khan et al. paper concerns earlier Shishper evolution/outburst history and should not be cited as though it documented the 7 May 2022 event.

For the 2022 event, use a source that actually documents/reconstructs the 7 May 2022 event.

The current dataset document already flags this issue. Resolve it before finalizing the literature/reference list.

## A3. Reference currently attributed to “M. Zhang et al.” on HMA automated lake inventory

The project bibliography should be checked and corrected to the actual published article:

Ravindra Kumar and Saurabh Vijay.  
“Automated satellite-based glacial lake inventory and change detection in High Mountain Asia.”  
*Scientific Reports*, 16, 5760 (2026).  
DOI: https://doi.org/10.1038/s41598-026-35446-0

Do not retain an incorrect author attribution merely because it appears in the supplied draft.

## A4. GLO / Glacial Lake Observatory publication year

The GLO paper is a 2026 publication, not a 2025 paper.

Use the final publication metadata:

Rawlins et al.  
“Glacial Lake Observatory (GLO): Annual dataset of glacial lakes in Nepal and transboundary catchments (2017–2024).”  
*Earth System Science Data*, 18, 5143–5165 (2026).  
DOI: https://doi.org/10.5194/essd-18-5143-2026

Treat earlier 2025/pre-publication wording in the supplied literature review as outdated metadata.

## A5. U-ViT / Geo-Foundation Model citation

Do not leave the project bibliography with the informal label:

“U-ViT Geo-Foundation Model Study.”

Use the formal publication information:

Jiang, Di, Li, Shiyi, Hajnsek, Irena, Siddique, Muhammad Adnan, Hong, Wen, and Wu, Yirong.  
“Glacial lake mapping using remote sensing Geo-Foundation Model.”  
*International Journal of Applied Earth Observation and Geoinformation*, 136, 104371 (2025).  
DOI: https://doi.org/10.1016/j.jag.2025.104371

## A6. CryoSentinel

CryoSentinel is useful recent technical context, but it is a preprint and must be labeled as such.

Do not describe a preprint as peer-reviewed evidence.

---

# B. Event Metadata Guardrails

## B1. Khurdopin must not be represented as a single simplistic event day

Use the documented drainage sequence rather than reducing everything to one date.

A useful representation is:

- formation / filling: earlier 2017
- drainage onset: approximately 21 July 2017
- lake disappearance: approximately 5 August 2017

For validation experiments, define a clear event anchor such as **drainage onset** and separately preserve the full event interval.

Do not silently invent a one-day “GLOF date” when the source documents a multi-day drainage sequence.

## B2. Shishper

Use **7 May 2022** for the documented 2022 outburst event.

Do not use the 2021 Khan paper as evidence for this date.

## B3. Passu is not a “stable lake” in the absolute historical sense

Passu is acceptable as the **no-documented-outburst-during-the-selected-validation-window comparison case**.

Do not describe Passu as:

- a lake that has never experienced GLOF
- inherently stable
- a non-GLOF lake

unless a cited source explicitly supports that claim.

Historical literature documents a Passu GLOF/outburst before the project's selected period.

The correct framing is period-specific:
**Passu = comparison case with no documented outburst during the chosen study/validation window.**

## B4. Event metadata should support intervals

Prefer configuration such as:

```yaml
khurdopin:
  drainage_onset: 2017-07-21
  drainage_end: 2017-08-05
  validation_anchor: drainage_onset

shishper:
  outburst_date: 2022-05-07
  validation_anchor: outburst_date

passu:
  event_date: null
  comparison_mode: stable_during_study_window
```

Exact values must be verified from the adopted source before being frozen.

---

# C. Study-Period and Date-Window Guardrails

The dataset document defines the main study period as:

**1 January 2017 – 31 December 2022.**

The development plan, however, contains operational windows that can extend beyond this common study period, especially for Khurdopin and some post-event coverage.

Do NOT silently merge them.

Maintain two concepts:

1. **Formal paper study period**
2. **Operational data-acquisition window**

For every lake, configuration should explicitly state:

- formal study-window dates
- raw-data acquisition dates
- time-series analysis dates
- event/pre-event/post-event windows

Any discrepancy must be documented in `DECISIONS.md`.

---

# D. Sentinel-1 Processing Guardrails

## D1. Do not double-apply GEE preprocessing

The project uses `COPERNICUS/S1_GRD`.

Google Earth Engine's Sentinel-1 GRD collection already includes important preprocessing such as orbit correction, border-noise removal, thermal-noise removal, radiometric calibration and terrain correction.

Therefore, if the implementation uses `COPERNICUS/S1_GRD`:

- do not pretend the pipeline starts from raw uncalibrated SAR
- do not blindly implement another full radiometric-calibration + terrain-correction pass
- document exactly what additional processing is being applied after GEE's preprocessing

The current development-plan wording must therefore be interpreted carefully.

A sensible implementation may include:

- selection/filtering
- consistent orbit handling
- shadow/layover masking where needed
- speckle filtering
- normalization/standardization
- export

but must not silently perform duplicate physical corrections.

If a genuinely raw-SAR workflow is desired, that is a methodological deviation and must be explicitly approved/documented.

## D2. SAR value-range tests must match the actual representation

Do not hard-code a generic expected `-25 to 5 dB` range as a universal truth.

Test the actual representation produced by the pipeline and document whether data are:

- linear power
- sigma-nought
- dB backscatter
- filtered dB

---

# E. DEM Guardrails

Copernicus DEM GLO-30 is a roughly 30 m source.

The project uses a **10 m model grid** for co-registration.

Therefore:

**30 m source data resampled to a 10 m grid ≠ a true 10 m DEM.**

Always document:

```text
source_resolution: 30 m
model_grid_resolution: 10 m
resampling_method: <chosen method>
```

Do not describe the resulting raster as native 10 m terrain information.

---

# F. Channel Specification Guardrails

The development plan currently contains an internal inconsistency:

- it gives an example of `in_channels=3` for optical
- it gives an example of `in_channels=8` for fusion
- but elsewhere it defines the optical baseline as “S2 bands + NDWI”
- and fusion as “S1 VV/VH + S2 bands + NDWI + DEM (+ optional slope)”

The exact number of channels therefore depends on the final band configuration.

Before training:

1. Freeze the exact Sentinel-2 bands.
2. Freeze whether NDWI is an extra channel.
3. Freeze whether slope is an extra fusion channel.
4. Freeze DEM representation.
5. Write the exact ordered channel list into `DATA_DICTIONARY.md`.
6. Put the channel list in configuration.
7. Make model `in_channels` derive from that configuration.

Never hard-code “3 optical channels” or “8 fusion channels” unless the final channel dictionary actually contains those numbers.

---

# G. Pretraining / Transfer-Learning Guardrails

## G1. IEEE dataset

The IEEE DataPort dataset in the supplied project description is an optical/cloud-free dataset with RGB true-colour images and masks.

It does not provide paired SAR + DEM for the same samples.

Therefore:

- it can support optical segmentation pretraining
- it cannot be described as multimodal S1+S2+DEM pretraining
- it cannot be used as target-lake ground truth without a separate justification

## G2. Fusion initialization

If an optical pretrained U-Net is transferred into a multimodal fusion model:

- explicitly identify transferable layers
- explicitly identify newly initialized layers
- document how the input layer is adapted
- log the transfer/reinitialization behavior

Never claim all fusion channels were pretrained if only optical data supplied the pretraining signal.

## G3. GLO dataset

The Glacial Lake Observatory dataset is a valuable candidate for additional external pretraining because it contains annual Sentinel-1/Sentinel-2 glacial-lake products.

However:

- it is geographically different from Hunza
- it must be treated as external pretraining/transfer data
- it must not silently become target-lake ground truth
- its domain-shift implications should be discussed

Do not automatically replace the existing IEEE plan; evaluate both datasets' suitability.

---

# H. Lesi Dataset Guardrails

The Lesi 10 m 2020 inventory is a valuable regional reference/training source.

However:

- it is a 2020 inventory
- its labels have optical-derived characteristics
- its labels should not be described as perfect multimodal ground truth
- it has temporal/source-image metadata that should be respected

When matching imagery to Lesi labels, use the actual source-scene/acquisition metadata where available rather than arbitrarily selecting a “2020” image.

Treat Lesi as:

- regional training/reference data
- a 2020 reference for suitable lakes

not as a universal ground-truth source for all years.

---

# I. Label Semantics Guardrails

Maintain explicit distinctions among:

- weak labels
- manually corrected labels
- training labels
- validation labels
- held-out test labels
- external inventory/reference labels
- model predictions

Never call a weak label “ground truth.”

Never call the Lesi inventory a 2017/2022 ground truth.

Never evaluate on a manually corrected date that was also used in training.

---

# J. Data-Leakage Guardrails

Temporal imagery is highly autocorrelated.

Random patch-level splitting is unsafe.

Avoid placing nearly identical consecutive dates from the same lake in both train and test.

Prefer date-aware splits.

The split must be explicitly saved, for example:

```text
data/processed/<lake>/split.json
```

The exact same held-out dates must be used for baseline and fusion.

---

# K. Cloud-Robustness Evaluation Guardrail

The project's central motivation involves optical cloud obstruction.

Therefore, overall IoU/F1 alone is insufficient to test the motivation.

Where data permit, report segmentation performance separately for:

- clear optical observations
- partially cloud-affected observations
- heavily cloud-affected / optical-unusable observations where SAR remains usable

Do not claim that fusion solves the cloud problem merely because it scores slightly higher overall.

The project should demonstrate the specific condition in which the additional sensor information matters.

---

# L. Hazard-Score Guardrails

## L1. Do not call the reduced index “Muneeb et al.'s model”

The project does NOT reproduce the full Muneeb et al. framework.

The project uses a reduced, dynamic, image-derived index inspired by the AHP-style framework.

The project's accessible features are currently closer to:

- lake area
- growth rate
- terrain/slope
- distance to glacier terminus

Muneeb's published framework includes a broader set of factors.

Therefore, use wording such as:

> “A reduced AHP-inspired susceptibility index adapted from the Muneeb et al. framework.”

Do not state:

> “We implemented Muneeb et al.'s hazard model.”

## L2. Do not copy Muneeb weights blindly

Muneeb's original weights correspond to their full feature set.

If the project uses a reduced feature set:

- define a new reduced weighting scheme
- justify each weight
- document normalization
- perform sensitivity analysis

Do not simply delete unavailable variables and silently renormalize the remaining weights.

## L3. Hazard score is not a trained classifier

Maintain the planned transparent weighted index.

Do not turn the three-lake project into a “hazard classifier” unless explicitly reframed as a separate experimental study.

## L4. Retrospective validation, not operational early warning

The project validates historical event-related behavior.

Do not claim the resulting score is an operational early-warning system.

A stronger claim requires:
- prospective validation
- more events
- independent data
- uncertainty calibration
- robustness testing

---

# M. Hazard Validation Guardrail

A rising score before an event is not automatically evidence of predictive skill.

Because area/growth are themselves components of the score, the analysis must distinguish:

1. segmentation quality
2. area-estimation quality
3. growth-rate measurement
4. hazard-index behavior
5. event timing

Do not collapse these into one success criterion.

Where possible, report the behavior of each stage separately.

---

# N. Passu Comparison Guardrail

Passu should be framed as:

> “comparison lake without a documented outburst during the selected study/validation period”

not:

> “stable lake that has never outburst.”

This distinction must be used consistently in:

- code comments
- configuration
- notebooks
- charts
- report
- presentation

---

# O. Literature-Review Guardrails

For every cited work:

1. Verify author list.
2. Verify year.
3. Verify title.
4. Verify venue.
5. Verify DOI or stable identifier.
6. Verify that the paper actually supports the claim being attached to it.

Distinguish:

- peer-reviewed paper
- conference paper
- preprint
- dataset paper
- technical report
- web resource

Never attach a citation to a claim merely because the paper is topically related.

---

# P. Recommended New Project Files

Add these lightweight project-control files:

## `PROJECT_MASTER_SPEC.md`

The current frozen project decisions:

- final study periods
- event metadata
- AOIs
- sensor channels
- common grid
- patch size
- train/val/test split policy
- baseline architecture
- fusion architecture
- hazard features
- hazard weights
- artifact-storage strategy

## `DECISIONS.md`

Every unresolved or newly resolved methodological choice should be logged.

Suggested structure:

```text
## Decision N

Date:
Question:
Options:
Decision:
Reason:
Evidence:
Affected files:
Status:
```

## `DATA_DICTIONARY.md`

Exact specification of:

- sensor
- band
- channel name
- units
- resolution
- source
- preprocessing
- normalization
- nodata behavior
- channel order

---

# Q. Claude's Required Behavior

Before implementing anything substantial:

1. Check this file.
2. Check the three primary project documents.
3. Check the existing repository/configuration.
4. Identify relevant unresolved decisions.
5. Do not silently resolve a flagged conflict.
6. If a decision can safely be handled by configuration, make it configurable.
7. If a scientific assumption is required, state it explicitly and record it in `DECISIONS.md`.
8. Preserve an audit trail for deviations from the approved plan.

When the supplied documents conflict:

- do not pretend they agree
- identify the conflict
- preserve both statements
- use the documented decision once one is made
- update `DECISIONS.md`

When external verification changes a bibliographic/data fact:

- preserve the original source wording in the project history if necessary
- use the verified current metadata in the active project specification
- cite the verified source

---

# R. Definition of Done Addition

A feature or epic is NOT complete if it:

- reproduces a known citation error
- uses an invalid event date
- double-processes Sentinel-1 data
- mislabels a 30 m DEM as native 10 m
- has undocumented input channels
- leaks temporal test data
- uses weak labels as ground truth
- uses Passu's historical status incorrectly
- silently copies hazard weights from an incompatible feature set
- makes an early-warning claim from retrospective validation alone

The implementation is considered scientifically complete only when the code, configuration, notebooks, and report all use the same definitions.

