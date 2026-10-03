# DATA_DICTIONARY.md

## Purpose

This file defines the exact data semantics used by the project.

It must become the single source of truth for:
- sensor channels
- band order
- units
- resolutions
- transforms
- normalization
- nodata handling
- model input ordering
- metadata fields
- masks/labels

Do not fill unknown values from guesses.

Use `TBD` until verified or approved.

**Audit note:** `Dataset_Description.pdf` was uploaded and incorporated in this session (see `DECISIONS.md` DEC-026). Sections below now distinguish confirmed facts sourced to it from items it itself leaves as open placeholders (author brackets like "[N ≥ 10]", "[glacier outlines, e.g. RGI 7.0]") — the latter are carried forward as genuine open items, not treated as settled just because they appear in a primary document. The separate "research plan (Sections 1–12)" that `GLOF_Development_Plan.docx` cites is still not available (`DECISIONS.md` OPEN-021).

---

# 1. Common Raster Metadata

| Field | Value | Status |
|---|---|---|
| Model grid resolution | 10 m target | Needs final confirmation |
| Target CRS | **EPSG:32643 (UTM 43N)** | **Frozen — see `DECISIONS.md` DEC-023** |
| Common transform | TBD | Open — depends on AOI/patch decisions |
| Patch size | Proposed default: 256×256 px @ 10 m | Pending team approval — see `DECISIONS.md` Decision D-E |
| Patch stride | Proposed default: 128 px (train), non-overlapping (inference) | Pending team approval — see `DECISIONS.md` Decision D-E |
| Nodata policy | TBD | Open |
| Resampling policy | Proposed default: bilinear (continuous), nearest-neighbor (categorical) | Pending team approval — see `DECISIONS.md` Category 4 defaults |

---

# 2. Sentinel-1

## Source

Collection:
`COPERNICUS/S1_GRD`

## Intended channels

| Index | Channel | Source | Units | Native resolution | Preprocessing | Normalization |
|---|---|---|---|---|---|---|
| 0 | S1_VV | Sentinel-1 GRD | dB / verify actual exported representation | TBD | GEE GRD + additional documented processing | TBD |
| 1 | S1_VH | Sentinel-1 GRD | dB / verify actual exported representation | TBD | GEE GRD + additional documented processing | TBD |

## Important processing rule

If using GEE S1 GRD, do not duplicate preprocessing already performed by the collection.

**Confirmed additional processing (`Dataset_Description.pdf` §2, DEC-029):** speckle filtering and DEM-derived shadow/layover masking. Terrain correction is inherited from `COPERNICUS/S1_GRD`, not reapplied — see `DECISIONS.md` DEC-029 for the interpretation of the source document's ambiguous "terrain-corrected" wording.

Exact additional processing:
Speckle filter (Refined Lee) + DEM-derived shadow/layover masks. Exact filter window size: TBD.

Orbit direction:
**Policy frozen: one consistent orbit direction per lake (DEC-034).** Specific orbit (ascending/descending) per lake: TBD, data-inspection at Epic 1.

Polarization availability:
VV/VH (confirmed, `Dataset_Description.pdf` §2).

**Known data-availability risk (DEC-028):** Sentinel-1B failed permanently on 23 December 2021; SAR revisit frequency roughly halves for the remainder of the study period (including the entire Shishper 2022 event window). Report scene counts separately for pre-/post-Dec-2021 periods.

---

# 3. Sentinel-2

## Primary source

Collection:
`COPERNICUS/S2_SR_HARMONIZED`

**Availability confirmed (`Dataset_Description.pdf` §2):** Sentinel-2 L2A available from 28 March 2017; 2017–2018 coverage is not global — this directly affects the Khurdopin 2017 event window, requiring the Sentinel-2 L1C / Landsat 8 fallback below (not merely optional supplementary coverage).

## Fallback sources (confirmed)

| Source | Collection | Availability | Role |
|---|---|---|---|
| Sentinel-2 L1C | `COPERNICUS/S2_HARMONIZED` | From 2015 | Fallback where L2A is missing |
| Landsat 8 SR | `LANDSAT/LC08/C02/T1_L2` | — | Fallback specifically for the 2017 Khurdopin window, "as used by Steiner et al." (`Dataset_Description.pdf` §2) |

## Candidate bands

Do NOT assume this is the final list.

Possible candidate bands relevant to the project's optical baseline include:

| Band | Sentinel-2 name | Native resolution | Units | Final use |
|---|---|---:|---|---|
| Blue | B02 | 10 m | reflectance | TBD |
| Green | B03 | 10 m | reflectance | TBD |
| Red | B04 | 10 m | reflectance | TBD |
| NIR | B08 | 10 m | reflectance | TBD |

Final Sentinel-2 channel set:
**TBD — proposed default: B02 (Blue), B03 (Green), B04 (Red), B08 (NIR), all 10 m native, pending team approval (see `DECISIONS.md` Decision D-B).**

Final channel order:
**TBD — proposed default order: [B02, B03, B04, B08, NDWI], pending the same approval.**

Confirmed at role level only: `DLP_Deliverable_1.pdf` and `GLOF_Development_Plan.docx` both describe the optical baseline conceptually as "Sentinel-2 selected bands + NDWI" — neither document states the exact final band list. Do not infer the four candidate bands above (B02/B03/B04/B08) as final; they are illustrative candidates from `GLOF_Development_Plan.docx`'s file-purpose table, not a frozen decision. The proposed default above (Decision D-B) remains a proposal pending team sign-off, not yet frozen.

---

# 4. NDWI

Definition:

`NDWI = (Green - NIR) / (Green + NIR)`

For the planned 10 m Sentinel-2 bands this is expected to use:
- Green = B03
- NIR = B08

Final implementation:
TBD

Expected mathematical range:
approximately `[-1, 1]`

Nodata handling:
TBD

Normalization:
TBD

Model channel index:
TBD

---

# 5. DEM

## Source

`COPERNICUS/DEM/GLO30`

## Important distinction

Source terrain resolution is approximately 30 m.

The project may resample it onto a 10 m model grid.

That does NOT make it native 10 m terrain data.

**Confirmed role (`Dataset_Description.pdf` §2):** slope/terrain features, and DEM-derived shadow/layover masks for SAR preprocessing (not a redundant terrain-correction pass — see DEC-029).

| Property | Value |
|---|---|
| Source resolution | ~30 m |
| Model grid | 10 m target |
| Elevation units | meters |
| Resampling method | TBD |
| Normalization | TBD |

---

# 6. Optional Terrain-Derived Channels

## Slope

Potential fusion feature.

Source:
Copernicus DEM

Units:
degrees or percent — TBD

Model inclusion:
TBD

Channel index:
TBD

Normalization:
TBD

## Shadow / layover masks

Potential preprocessing/masking layers.

Final model input:
TBD

---

# 7. Optical Baseline Input

Current project definition:

**Sentinel-2 selected bands + NDWI**

Exact final channel list:

```text
TBD
```

Exact channel order:

```text
TBD
```

Expected final `in_channels`:

`TBD`

---

# 8. Fusion Input

Current project definition:

**Sentinel-1 + Sentinel-2 + NDWI + DEM (+ optional terrain channels)**

Exact final channel list:

```text
TBD
```

Exact channel order:

```text
TBD
```

Expected final `in_channels`:

`TBD`

---

# 9. Normalization

Normalization must be:
- computed from training data only
- stored/configured
- applied consistently at training and inference
- documented per channel

| Channel | Method | Parameters | Status |
|---|---|---|---|
| S1_VV | TBD | TBD | TBD |
| S1_VH | TBD | TBD | TBD |
| S2_B02 | TBD | TBD | TBD |
| S2_B03 | TBD | TBD | TBD |
| S2_B04 | TBD | TBD | TBD |
| S2_B08 | TBD | TBD | TBD |
| NDWI | TBD | TBD | TBD |
| DEM | TBD | TBD | TBD |
| Slope | TBD | TBD | TBD |

Do not use image-wide normalization at inference if the training pipeline used fixed training-set statistics.

---

# 10. Cloud / Observation-Quality Metadata

Potential metadata fields:

- Sentinel-2 scene ID
- acquisition date
- cloud probability
- cloud percentage
- SCL-based usable fraction
- optical usability flag
- S1 availability flag
- complete multimodal-stack flag

Exact schema:
TBD

Cloud classes for analysis:
TBD

---

# 11. Scene / Date Identity

Every processed sample should retain enough metadata to uniquely identify:

- lake
- acquisition date
- sensor
- source scene/product ID
- processing version
- CRS
- transform
- patch identity

Exact filename convention:
TBD

---

# 12. Label Types

| Label type | Description | Intended role |
|---|---|---|
| Weak NDWI mask | Threshold-derived optical water mask | Initial labeling |
| Weak SAR mask | Threshold-derived SAR water mask | Initial labeling |
| Corrected mask | Human-corrected QGIS mask | Local reference / training |
| Held-out reference mask | Corrected date excluded from training | Evaluation |
| Lesi inventory mask | Regional 2020 inventory (7,560 lakes, 500 m² MMU, ~4.5% median boundary difference vs. Google Earth — `Dataset_Description.pdf` §4) | **Corridor-lakes fusion-model training (outside the 3 target lakes) + 2020 reference for Shishper/Passu only (not Khurdopin)** — see DEC-030 |
| IEEE mask | External optical dataset mask (1,200 images, 1,000/200 split, RGB PNG, no S1/DEM pairing, Karakoram coverage unverified) | External optical-only pretraining — confirmed, DEC-031 |
| GLO label | External dataset label | Not mentioned in `Dataset_Description.pdf` — lower priority / stretch option (Decision D-F) |

**Confirmed target-lake manual labeling scale (`Dataset_Description.pdf` §4, DEC-033):** minimum 10 dates/lake, targeting ~15–20 dates/lake; 10–20% cross-labeled with IoU agreement reported. Dates cover pre-event, event, and stable periods. A subset of cloud-affected dates is labeled from the nearest clear stable date and reported as approximate; snow/ice-covered dates flagged separately.

---

# 13. Time-Series Fields

For every analyzed date:

| Field | Definition | Unit |
|---|---|---|
| date | Acquisition/analysis date | date |
| lake | Target lake | text |
| predicted_area | Pixel-count-derived lake area | m² / km² — TBD |
| growth_rate | Area change divided by elapsed time | TBD |
| boundary_change | Change in boundary/perimeter | TBD |
| reference_area | Reference-mask area where available | TBD |
| area_error | Estimated vs reference | TBD |
| model_name | Checkpoint used | text |

---

# 14. Hazard Feature Dictionary

Current candidate features:

| Feature | Definition | Time varying? | Normalization | Status |
|---|---|---|---|---|
| area | Current predicted lake area | Yes | Proposed default: min-max from pooled training distribution | Candidate |
| growth_rate | Area change per elapsed time | Yes | Proposed default: min-max from pooled training distribution | Candidate |
| slope | Terrain slope around lake/context region | Mostly static | Proposed default: min-max from pooled training distribution | Candidate |
| terminus_distance | Distance to glacier terminus | Mostly static | Proposed default: min-max from pooled training distribution | **Conditional** — `Dataset_Description.pdf` §4 makes this feature's inclusion dependent on whether glacier-outline data (e.g., RGI 7.0) is used; if not, the hazard index uses only 3 features (area, growth_rate, slope). See `DECISIONS.md` Decision D-J (team decision needed, blocks D-H weighting). |

Final feature definitions:
TBD, pending D-J (3 vs. 4 features) and D-H (weights).

---

# 15. Hazard Score

Form:

`hazard_score = Σ(weight_i × normalized_feature_i)`

Exact features:
TBD

Exact weights:
TBD

Normalization ranges:
TBD

Weight sensitivity method:
TBD

---

# 16. Data-Quality Flags

Every production sample should be able to identify:

- missing S1
- missing S2
- cloud-obscured optical
- missing DEM coverage
- partial multimodal stack
- suspected snow/ice contamination
- approximation due to nearest clear observation
- manually corrected/reference status

Exact schema:
TBD

---

# 17. Finalization Rule

This file is incomplete until the team has frozen:

1. exact model channels
2. channel order
3. units
4. normalization
5. grid/CRS
6. nodata behavior
7. cloud/observation-quality metadata
8. label semantics
9. time-series schema
10. hazard feature schema

No production model training should occur while these remain ambiguous.
