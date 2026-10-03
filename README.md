# GLOF Hazard Assessment in Hunza Valley

Multi-sensor deep-learning fusion for glacial lake tracking and GLOF
(Glacial Lake Outburst Flood) hazard assessment in the Hunza Valley,
Gilgit-Baltistan, Pakistan.

This project builds one shared pipeline — data acquisition, preprocessing,
labeling, segmentation, model comparison, time-series tracking,
area/growth estimation, a transparent hazard index, and historical-event
validation — for three lakes: **Shishper**, **Khurdopin**, and **Passu**.
It compares an optical-only Sentinel-2 U-Net baseline against an
early-fusion Sentinel-1 (SAR) + Sentinel-2 (optical) + Copernicus DEM
U-Net, to test whether multimodal fusion improves lake detection
specifically when optical imagery is cloud-obscured.

## Status

**Specification phase.** The repository skeleton below is Epic 0 of the
development plan. Several scientific/methodological decisions that gate
later epics (exact Sentinel-2 bands, patch size, hazard feature count and
weights, pretraining scope, cloud-stratification thresholds, and others)
are **not yet finalized** — see `docs/DECISIONS.md` for the full list and
current status. Do not start training or dataset generation until the
relevant decision is marked resolved there.

## Project-control documents

These four files are the authoritative, continuously-updated specification
for the project. Read them in this order before making any implementation
decision:

1. `docs/PROJECT_MASTER_SPEC.md` — current frozen specification
2. `docs/GLOF_PROJECT_ISSUES_AND_GUARDRAILS.md` — correction/guardrail layer for the original research documents
3. `docs/DECISIONS.md` — chronological decision log and audit trail (includes the full Category 1–4 decision classification and the specification-closure decision table)
4. `docs/DATA_DICTIONARY.md` — exact sensor/channel/data semantics

When these three files conflict with anything else in the repo, they win.
Update them whenever a decision changes — do not let code and
documentation drift apart.

## Repository structure

```
configs/        AOI, data-source, preprocessing, training, hazard-weight configs
data/           raw / interim / processed / external / labels (gitignored; see below)
notebooks/      exploration, debugging, per-lake analysis notebooks
src/glof/       reusable pipeline code (gee, preprocessing, labeling, datasets,
                models, training, evaluation, inference, timeseries, hazard, viz)
models/         checkpoints (gitignored; see storage note below)
results/        metrics, figures, risk maps
reports/        final report and poster sources
tests/          pytest test suite
docs/           project-control documents (see above)
```

## Environment setup

```bash
conda env create -f environment.yml
conda activate glof-fusion
python -c "import ee, geemap, rasterio, torch, segmentation_models_pytorch"
```

or, with pip:

```bash
pip install -r requirements.txt
```

## Data and checkpoint storage

`data/` and `models/*.pt` are gitignored — raw imagery, processed patches,
and trained checkpoints are too large for git. This project currently uses
a **shared Google Drive folder** as the artifact store (default choice;
see `docs/DECISIONS.md` Decision D-I). Pointer files in `models/*/README.md`
will record where each checkpoint actually lives once training begins.

## License

Code in this repository is released under the [MIT License](LICENSE).
This does **not** relicense any third-party satellite or lake-inventory
data used by the pipeline — see the license note at the bottom of the
`LICENSE` file and `docs/DATA_DICTIONARY.md` for source attribution.

## Team

Three members, one lake each (Shishper / Khurdopin / Passu). The specific
author-to-lake mapping is not yet recorded — see `docs/DECISIONS.md`
OPEN-022.
