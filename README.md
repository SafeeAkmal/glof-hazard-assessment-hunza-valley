# Multi-Sensor Deep Learning Fusion for Glacial Lake Tracking and GLOF Hazard Assessment in the Hunza Valley

[![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/SafeeAkmal/glof-hazard-assessment-hunza-valley/blob/master/notebooks/glof_pipeline.ipynb)
![Python](https://img.shields.io/badge/python-3.10%2B-blue)
![License: MIT](https://img.shields.io/badge/license-MIT-green)

Glacial lake outburst floods (GLOFs) have struck the Hunza Valley (Gilgit-Baltistan, Pakistan) repeatedly in recent years. Optical satellites lose sight of the lakes under cloud, exactly in the weeks when they fill and drain. This project fuses **Sentinel-1 radar**, **Sentinel-2 optical** and **Copernicus DEM** data in a U-Net to track lake extent through cloudy periods. The resulting lake-area time series feed a transparent hazard index, which we evaluate against documented outbursts.

*Semester research project, Deep Learning for Perception.*

## Highlights

- **Three sites, three documented events.** Shishper (ice-dammed lake; outbursts on 29 May 2020 and 7 May 2022), Khurdopin (surge-dammed lake; drained in July 2017), and Borith Lake next to Passu Glacier as a comparison site.
- **Dense, event-centred sampling.** Every Sentinel-1 and Sentinel-2 acquisition from 90 days before to 45 days after each event, plus the same seasons in all other years (2017–2022): **730 dates**, co-registered on a common 10 m grid.
- **Automatic water labels** from Sentinel-2 NDWI, with cloud, shadow and snow rules: **191 labelled dates**, no manual digitising.
- **Optical-only vs. radar-only vs. fusion U-Net** (ResNet-18 encoder), each trained with 3 seeds and balanced crop sampling. The fusion model is also trained with *optical-channel dropout*, so it still works when optical data are missing.
- **Fully open and reproducible.** All data are free, and one Colab notebook runs everything: download, labels, training, evaluation, time series and hazard index.

<p align="center">
  <img src="reports/figures/pipeline.png" width="85%" alt="Pipeline overview">
</p>

## Study sites

| Site | Lake type | Centre | Documented event(s) |
|---|---|---|---|
| Shishper | Ice-dammed (surging glacier blocks a side valley) | 36.358°N, 74.568°E | Drainage 29 May 2020; GLOF 7 May 2022 |
| Khurdopin | Surge-dammed lake on the Shimshal River | 36.361°N, 75.449°E | Formed Mar 2017; drained 21 Jul – 3 Aug 2017 |
| Passu (Borith Lake) | Perennial lake beside Passu Glacier | 36.432°N, 74.862°E | None in 2017–2022 (comparison site) |

<p align="center">
  <img src="reports/figures/study_area.png" width="85%" alt="Study sites">
</p>

Passu Glacier had no persistent lake at its terminus during 2017–2022, so Borith Lake, the lake immediately next to the glacier, is used as the comparison site. All lake centres were located on Sentinel-2 imagery.

## Data

| Source | Earth Engine collection | Used for |
|---|---|---|
| Sentinel-1 GRD (VV, VH) | `COPERNICUS/S1_GRD` | Cloud-independent water signal (one orbit direction per site) |
| Sentinel-2 L1C (B2, B3, B4, B8) | `COPERNICUS/S2_HARMONIZED` | Optical bands, NDWI, labels |
| Sentinel-2 cloud probability | `COPERNICUS/S2_CLOUD_PROBABILITY` | Cloud mask (not a label) |
| Copernicus DEM GLO-30 | `COPERNICUS/DEM/GLO30` | Elevation and slope |

| Site | Dates | Optical / radar-only | Labelled | Train (2017, 2018, 2020, 2022) | Test (2019, 2021) |
|---|---:|---:|---:|---:|---:|
| Shishper | 215 | 121 / 94 | 40 | 27 | 13 |
| Khurdopin | 313 | 248 / 65 | 99 | 73 | 26 |
| Passu (Borith) | 202 | 121 / 81 | 52 | 37 | 15 |
| **Total** | **730** | **490 / 240** | **191** | **137** | **54** |

Even before any model is trained, the automatic labels show the documented drainages: the Shishper lake had water on 30 Apr 2022 and none on 10 May 2022, and the Khurdopin lake was present until 12 Jun 2017 and gone by 27 Jul 2017.

<p align="center">
  <img src="reports/figures/reference_area.png" width="75%" alt="Lake area from automatic labels">
</p>

## Method

| | Optical-only (baseline) | Radar-only (ablation) | Fusion (proposed) |
|---|---|---|---|
| Inputs | B2, B3, B4, B8, NDWI (5 ch) | VV, VH, elevation, slope (4 ch) | all 9 channels |
| Architecture | U-Net, ResNet-18 encoder (ImageNet) | same | same |
| Training | 128 × 128 crops (50% centred on lake water), batch 16, Adam 1e-3, cosine schedule, masked BCE + Dice, flips, 3,000 steps | same | same + optical-channel dropout (p = 0.3) |
| Seeds | 3 | 3 | 3 |
| Parameters | 14.33 M | 14.33 M | 14.35 M |

The models are evaluated with IoU, F1, precision and recall on held-out years, under clear conditions and with all optical channels removed (simulated complete cloud cover). Results are reported as mean ± sd across seeds. The fusion model (the average of its 3 seeds) is then run on all 730 dates to derive lake area, 30-day growth rate and an equal-weight hazard index (area + growth + slope). For each event, the index of all three sites is compared over the 90 days before it. Full details are in [Deliverable 2](reports/deliverables/Deliverable_2_Methodology.docx).

## Results

All numbers come from the executed notebook (Colab T4 GPU) and are stored in [`results/metrics/`](results/metrics/). The test set has 54 held-out images from 2019 and 2021, of which 31 contain lake water.

**Segmentation: pixel-pooled over all test images, mean ± sd over 3 seeds**

| Condition | Model | IoU | F1 | Precision | Recall |
|---|---|---:|---:|---:|---:|
| Clear | Optical-only | 0.521 ± 0.214 | 0.666 ± 0.204 | 0.643 ± 0.293 | 0.752 ± 0.011 |
| Clear | Radar-only | 0.487 ± 0.007 | 0.655 ± 0.006 | 0.702 ± 0.035 | 0.615 ± 0.020 |
| Clear | **Fusion** | **0.778 ± 0.005** | **0.875 ± 0.003** | **0.856 ± 0.023** | **0.896 ± 0.019** |
| No optical input | Optical-only | 0.000 | 0.000 | 0.000 | 0.000 |
| No optical input | **Fusion** | **0.503 ± 0.015** | **0.669 ± 0.013** | **0.788 ± 0.028** | 0.581 ± 0.014 |

<p align="center">
  <img src="reports/figures/iou_per_site.png" width="85%" alt="IoU per site">
</p>

- **Fusion is the best and most stable model at every site:** Shishper 0.60 vs 0.15 (optical-only) and 0.08 (radar-only); Khurdopin 0.51 vs 0.25 and 0.00; Borith Lake 0.87 vs 0.69 and 0.61. Its three seeds lie between 0.773 and 0.782, whereas one optical-only seed reached only 0.275. Part of the advantage may come from the labels sharing a slope rule with the slope input; see the paper's discussion.
- **Without optical data**, the fusion model behaves like the radar-only model (IoU 0.50 vs 0.49) and keeps working on Borith Lake (0.64). Neither radar-based model detects the small Shishper and Khurdopin lakes.
- **Time series:** the Shishper lake fills each spring and drops to zero right after 29 May 2020 and 7 May 2022; the Khurdopin lake disappears after July 2017.
- **Hazard index:** the main index (absolute area, growth and slope, normalised across lakes) ranks the large, stable Borith Lake highest before every event. An **exploratory** per-lake index, added after this result and comparing each lake with its own normal state, peaks at the event lake before all three events (Shishper 4.4 and 7.1; Khurdopin 17.6). Treat it as a hypothesis to test on other lakes.

<p align="center">
  <img src="results/figures/lake_area_timeseries.png" width="85%" alt="Lake-area time series">
</p>

Full results, discussion and limitations are in the [final paper](reports/deliverables/Deliverable_4_Final_Paper.docx).

## Quick start

### Google Colab (recommended)

1. Open the notebook with the **Open in Colab** badge above.
2. Select **Runtime → Change runtime type → T4 GPU**.
3. Enter your Earth Engine project ID in the `PROJECT_ID` field. You need a [registered Earth Engine project](https://code.earthengine.google.com/register), which is free for non-commercial use.
4. Select **Runtime → Run all**. You will be asked to sign in to Earth Engine and to allow Google Drive access.

The first run downloads about 0.9 GB to `MyDrive/glof_minimal`, which takes roughly 15 minutes. Later runs reuse the cache. Training all three models with 3 seeds each takes about 30 minutes on a T4 GPU.

### Local

```bash
pip install -r requirements.txt
earthengine authenticate
jupyter notebook notebooks/glof_pipeline.ipynb
```

When run locally, data are cached in `data/raw/glof_minimal/`, which is git-ignored. Training on a CPU is slow, at roughly 2.6 s per step.

## Repository structure

```
├── notebooks/
│   └── glof_pipeline.ipynb      # complete pipeline: data → labels → models → evaluation → time series → hazard
├── reports/
│   ├── deliverables/            # course deliverables (.docx)
│   ├── figures/                 # figures used in the reports and this README
│   └── src/                     # scripts that regenerate figures and deliverables
├── results/
│   ├── figures/                 # figures from the executed notebook
│   └── metrics/                 # segmentation, hazard and dataset tables (CSV / JSON)
├── docs/
│   └── archive/                 # original planning documents (superseded)
├── requirements.txt
└── LICENSE
```

## Reproducing the reports

```bash
python reports/src/figs.py                 # data figures + dataset statistics (needs the local data cache)
python reports/src/results_figs.py         # result charts from results/metrics/
cd reports/src && npm install && npm run build   # rebuilds reports/deliverables/*.docx
```

## Limitations

- Labels are generated automatically from optical NDWI and a slope rule. They miss frozen or very turbid lake surfaces, and they share information with the model inputs.
- The dataset is small: 191 labelled images from three sites. There is no separate validation set; 3 seeds measure training variability.
- Sentinel-1 data are used without extra speckle filtering. The 30 m DEM is resampled to 10 m. Sentinel-1B failed in December 2021, so radar coverage in 2022 is sparser.
- The hazard index uses equal weights, the per-lake index is post hoc, and the evaluation looks back at past events; neither is an early-warning system.

## Team

Muhammad Ali Saleem · Junaid Minhas · Safee Akmal

## License and data

The code is released under the [MIT License](LICENSE). Copernicus Sentinel and DEM data are free and openly licensed under the Copernicus data policy, and are accessed through [Google Earth Engine](https://earthengine.google.com/). Key references for the documented events: Steiner et al. (2018), *The Cryosphere* 12, 95–101 (Khurdopin); Khan et al. (2021) and Ullah et al. (2025) (Shishper).
