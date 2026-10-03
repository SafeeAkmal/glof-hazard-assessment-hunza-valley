"""Generate the report figures and dataset statistics from the cached Earth Engine data.

Run from the repository root after the notebook has downloaded the data:
    python reports/src/figs.py
"""
import json, os, numpy as np, pandas as pd, matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch, Rectangle
from skimage.measure import label as cc_label
from scipy.ndimage import distance_transform_edt

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
CACHE = os.path.join(ROOT, "data", "raw", "glof_minimal")   # local cache written by the notebook
FIG_DIR = os.path.join(ROOT, "reports", "figures")
STATS_DIR = os.path.join(ROOT, "results", "metrics")
LAKES = {"shishper": ("Shishper", 36.358, 74.568), "khurdopin": ("Khurdopin", 36.361, 75.449),
         "passu": ("Passu (Borith Lake)", 36.432, 74.862)}
INK, MUTED, GRID = "#0b0b0b", "#52514e", "#d9d8d4"
BLUE, ORANGE = "#2a78d6", "#eb6834"
plt.rcParams.update({"font.family": "Times New Roman", "font.size": 10, "axes.edgecolor": MUTED,
                     "axes.labelcolor": INK, "xtick.color": MUTED, "ytick.color": MUTED,
                     "axes.spines.top": False, "axes.spines.right": False})
SIZE, PIX, IGNORE = 448, 10, 255
os.makedirs(FIG_DIR, exist_ok=True)
os.makedirs(STATS_DIR, exist_ok=True)


def remove_small(mask, k):
    comp = cc_label(mask)
    sizes = np.bincount(comp.ravel())
    return mask & (sizes[comp] >= k)


def ndwi(s2):
    g, n = s2[1], s2[3]
    return (g - n) / (g + n + 1e-6)


def make_label(s2, cloud, slope):
    s2 = s2.astype("float32")
    w = ndwi(s2)
    cloudy = remove_small(cloud >= 60, 1000) | ~np.isfinite(w)
    if cloudy.mean() > 0.1 or (np.nan_to_num(s2[0]) > 0.35).mean() > 0.4:
        return np.full(w.shape, IGNORE, np.uint8)
    clear = ~(distance_transform_edt(~cloudy) < 15) if cloudy.any() else ~cloudy
    if clear.mean() < 0.3:
        return np.full(w.shape, IGNORE, np.uint8)
    water = remove_small((w > 0.2) & (s2[3] < 0.12) & (s2[1] > 0.03) & (slope < 20) & clear, 50)
    lab = water.astype(np.uint8)
    lab[~clear] = IGNORE
    return lab


def rgb(s2):
    return np.clip(np.nan_to_num(s2[[2, 1, 0]].astype("float32").transpose(1, 2, 0)) / 0.3, 0, 1)


def load(lake, date):
    f = np.load(os.path.join(CACHE, lake, date + ".npz"))
    return f["s2"], f["cloud"]


def scalebar(a):
    a.add_patch(Rectangle((20, SIZE - 30), 100, 7, color="white", ec="black", lw=0.5))
    a.text(70, SIZE - 36, "1 km", color="white", ha="center", va="bottom", fontsize=9, fontweight="bold")


# ---- label statistics (used in the documents) ----
stats = {}
for lake in LAKES:
    plan = json.load(open(os.path.join(CACHE, lake, "plan.json")))
    slope = np.load(os.path.join(CACHE, lake, "static.npz"))["slope"]
    lab_dates = []
    for s in plan["scenes"]:
        if not s["s2"]:
            continue
        s2, cl = load(lake, s["date"])
        lab = make_label(s2, cl, slope)
        if (lab != IGNORE).mean() > 0.3:
            lab_dates.append(s["date"])
    yrs = pd.Series([int(d[:4]) for d in lab_dates])
    stats[lake] = dict(labelled=len(lab_dates), test=int(yrs.isin([2019, 2021]).sum()),
                       train=int((~yrs.isin([2019, 2021])).sum()),
                       per_year={int(k): int(v) for k, v in yrs.value_counts().sort_index().items()})
print(json.dumps(stats, indent=1))
json.dump(stats, open(os.path.join(STATS_DIR, "label_stats.json"), "w"), indent=1)

# ---- Fig: study area ----
EX = {"shishper": "2022-04-10", "khurdopin": "2017-05-23", "passu": "2018-07-15"}
fig, axes = plt.subplots(1, 3, figsize=(7.2, 2.8))
for a, (lake, (title, lat, lon)) in zip(axes, LAKES.items()):
    s2, _ = load(lake, EX[lake])
    a.imshow(rgb(s2))
    a.plot(SIZE / 2, SIZE / 2, "+", color="#e34948", ms=12, mew=2)
    scalebar(a)
    a.set_xticks([]); a.set_yticks([])
    a.set_title(f"{title}\n{lat:.3f}°N, {lon:.3f}°E · {EX[lake]}", fontsize=9, color=INK)
plt.tight_layout(); plt.savefig(os.path.join(FIG_DIR, "study_area.png"), dpi=160); plt.close()

# ---- Fig: label examples ----
LEX = {"shishper": "2022-04-05", "khurdopin": "2017-06-12", "passu": "2018-07-15"}
fig, axes = plt.subplots(2, 3, figsize=(7.2, 4.9))
for j, lake in enumerate(LAKES):
    slope = np.load(os.path.join(CACHE, lake, "static.npz"))["slope"]
    s2, cl = load(lake, LEX[lake])
    lab = make_label(s2, cl, slope)
    axes[0, j].imshow(rgb(s2)); axes[0, j].set_title(f"{LAKES[lake][0]} · {LEX[lake]}", fontsize=9)
    ov = rgb(s2).copy(); ov[lab == 1] = [0.16, 0.47, 0.84]; ov[lab == IGNORE] *= 0.35
    axes[1, j].imshow(ov)
    for a in axes[:, j]:
        a.set_xticks([]); a.set_yticks([])
axes[0, 0].set_ylabel("Sentinel-2 RGB"); axes[1, 0].set_ylabel("Automatic label")
plt.tight_layout(); plt.savefig(os.path.join(FIG_DIR, "label_examples.png"), dpi=160); plt.close()

# ---- Fig: temporal sampling ----
rows = []
for lake in LAKES:
    for s in json.load(open(os.path.join(CACHE, lake, "plan.json")))["scenes"]:
        rows.append(dict(lake=lake, date=pd.Timestamp(s["date"]), s2=s["s2"]))
df = pd.DataFrame(rows)
fig, axes = plt.subplots(2, 1, figsize=(7.2, 3.9), gridspec_kw={"height_ratios": [1.6, 1]})
a = axes[0]
for i, lake in enumerate(LAKES):
    d = df[df.lake == lake]
    a.scatter(d.date[d.s2], np.full(d.s2.sum(), i + 0.13), s=7, color=BLUE, lw=0,
              label="Optical (Sentinel-2) date" if i == 0 else None)
    a.scatter(d.date[~d.s2], np.full((~d.s2).sum(), i - 0.13), s=7, color=ORANGE, lw=0,
              label="Radar-only (Sentinel-1) date" if i == 0 else None)
EV = {"Khurdopin 21 Jul 2017": "2017-07-21", "Shishper 29 May 2020": "2020-05-29", "Shishper 7 May 2022": "2022-05-07"}
for t, d in EV.items():
    a.axvline(pd.Timestamp(d), color=MUTED, ls="--", lw=0.8)
    a.text(pd.Timestamp(d), 2.5, t, fontsize=7.5, ha="center", va="bottom", color=INK)
a.set_yticks(range(3)); a.set_yticklabels([LAKES[l][0] for l in LAKES]); a.set_ylim(-0.5, 3.0)
a.legend(loc="upper center", bbox_to_anchor=(0.5, -0.13), ncol=2, frameon=False, fontsize=8, markerscale=2)
a.spines["left"].set_visible(False); a.tick_params(axis="y", length=0)
b = axes[1]
cnt = df.groupby("lake").s2.agg(["sum", "size"]).loc[list(LAKES)]
y = np.arange(3)
b.barh(y, cnt["sum"], color=BLUE, height=0.55, edgecolor="white", lw=1.5)
b.barh(y, cnt["size"] - cnt["sum"], left=cnt["sum"], color=ORANGE, height=0.55, edgecolor="white", lw=1.5)
for i, (o, n) in enumerate(zip(cnt["sum"], cnt["size"])):
    b.text(n + 4, i, f"{n} dates ({o} optical, {n - o} radar-only)", va="center", fontsize=8, color=INK)
b.set_yticks(y); b.set_yticklabels([LAKES[l][0] for l in LAKES]); b.set_xlim(0, 470)
b.set_xlabel("Number of acquisition dates")
b.grid(axis="x", color=GRID, lw=0.6); b.set_axisbelow(True); b.tick_params(axis="y", length=0)
b.spines["left"].set_visible(False)
plt.tight_layout(); plt.savefig(os.path.join(FIG_DIR, "sampling.png"), dpi=160); plt.close()


# ---- Fig: pipeline ----
def box(a, x, y, w, h, text, fc, fs=8.2):
    a.add_patch(FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.02,rounding_size=0.08", fc=fc, ec=MUTED, lw=0.8))
    a.text(x + w / 2, y + h / 2, text, ha="center", va="center", fontsize=fs, color=INK)


def arrow(a, x0, y0, x1, y1):
    a.annotate("", (x1, y1), (x0, y0), arrowprops=dict(arrowstyle="-|>", color=MUTED, lw=1))


C1, C2, C3 = "#e8f1fb", "#fdeee6", "#e6f6ef"
fig, a = plt.subplots(figsize=(7.2, 3.5)); a.set_xlim(0, 10); a.set_ylim(0, 4.8); a.axis("off")
stages = ["Google Earth Engine\nS1 GRD, S2 L1C,\nS2 cloud prob., GLO-30",
          "Event + anniversary\nwindows (714 days)\n730 dates, 3 lakes",
          "Co-registration\nEPSG:32643, 10 m\n448×448 px per lake",
          "Automatic NDWI labels\ncloud / shadow / snow\nrules, 191 dates"]
for i, t in enumerate(stages):
    box(a, 0.1 + i * 2.5, 3.3, 2.2, 1.35, t, C1 if i < 3 else C2)
    if i:
        arrow(a, i * 2.5 - 0.2, 3.97, i * 2.5 + 0.1, 3.97)
box(a, 1.0, 1.75, 3.6, 1.05, "Optical-only U-Net (baseline)\nResNet-18 encoder, 5 channels", C2)
box(a, 5.4, 1.75, 3.6, 1.05, "Fusion U-Net (proposed)\nResNet-18 encoder, 9 channels,\noptical-channel dropout", C2)
arrow(a, 8.6, 3.3, 7.2, 2.82); arrow(a, 8.6, 3.3, 2.8, 2.82)
outs = ["Segmentation evaluation\nIoU, F1, precision, recall\nclear vs simulated cloud",
        "Lake-area time series\n(fusion model, all 730 dates)\narea, 30-day growth",
        "Hazard index\narea + growth + slope\nvs documented GLOFs"]
for i, t in enumerate(outs):
    box(a, 0.1 + i * 3.35, 0.05, 3.05, 1.15, t, C3)
arrow(a, 2.8, 1.75, 1.6, 1.22); arrow(a, 7.2, 1.75, 1.9, 1.22); arrow(a, 7.2, 1.75, 5.0, 1.22)
arrow(a, 6.55, 0.62, 6.8, 0.62)
plt.tight_layout(); plt.savefig(os.path.join(FIG_DIR, "pipeline.png"), dpi=160); plt.close()

# ---- Fig: architecture ----
fig, a = plt.subplots(figsize=(7.2, 3.1)); a.set_xlim(0, 12.2); a.set_ylim(0, 5.3); a.axis("off")
enc = [("Input\n128×128\nC = 5 / 9", 4.0), ("Conv 7×7\n64, /2", 3.6), ("Stage 1\n64, /4", 3.1),
       ("Stage 2\n128, /8", 2.6), ("Stage 3\n256, /16", 2.1), ("Stage 4\n512, /32", 1.6)]
xs = []
for i, (t, h) in enumerate(enc):
    x = 0.2 + i * 1.0; xs.append(x)
    box(a, x, 4.6 - h, 0.85, h, t, C1, fs=7.5)
dec = [("Dec 1\n256", 1.6), ("Dec 2\n128", 2.1), ("Dec 3\n64", 2.6), ("Dec 4\n32", 3.1), ("Dec 5\n16", 3.6)]
for i, (t, h) in enumerate(dec):
    x = 6.4 + i * 1.0
    box(a, x, 4.6 - h, 0.85, h, t, C2, fs=7.5)
    if i < 4:
        a.annotate("", (x + 0.42, 4.7), (xs[4 - i] + 0.42, 4.7),
                   arrowprops=dict(arrowstyle="-|>", color=MUTED, lw=0.7, connectionstyle="arc3,rad=-0.22"))
box(a, 11.35, 1.0, 0.8, 3.6, "1×1\nconv\n+\nsigmoid\n\nwater\nprob.", C3, fs=7.5)
a.text(5.3, 5.15, "skip connections", fontsize=7.5, color=MUTED, ha="center")
a.text(3.0, 0.2, "Encoder: ResNet-18, ImageNet weights (first conv adapted to C channels)", ha="center", fontsize=7.8, color=MUTED)
a.text(9.2, 0.2, "Decoder: upsample, concat skip, 2 × (3×3 conv, BN, ReLU)", ha="center", fontsize=7.8, color=MUTED)
plt.tight_layout(); plt.savefig(os.path.join(FIG_DIR, "architecture.png"), dpi=160); plt.close()

# ---- Fig: reference lake area from automatic labels ----
def lake_area(lab, r=400 // PIX):
    comp = cc_label(lab == 1)
    c0 = SIZE // 2
    ids = np.unique(comp[c0 - r:c0 + r + 1, c0 - r:c0 + r + 1])
    return np.isin(comp, ids[ids > 0]).sum() * PIX * PIX / 1e6


EVL = {"shishper": ["2020-05-29", "2022-05-07"], "khurdopin": ["2017-07-21"], "passu": []}
ref = []
fig, axes = plt.subplots(3, 1, figsize=(7.2, 5.4), sharex=True)
for a, lake in zip(axes, LAKES):
    plan = json.load(open(os.path.join(CACHE, lake, "plan.json")))
    slope = np.load(os.path.join(CACHE, lake, "static.npz"))["slope"]
    pts = []
    for s in plan["scenes"]:
        if not s["s2"]:
            continue
        s2, cl = load(lake, s["date"])
        lab = make_label(s2, cl, slope)
        if (lab != IGNORE).mean() > 0.3:
            pts.append((pd.Timestamp(s["date"]), lake_area(lab)))
    d = pd.DataFrame(pts, columns=["date", "area"])
    d["lake"] = lake
    ref.append(d)
    a.scatter(d.date, d.area, s=12, color=BLUE, lw=0)
    for e in EVL[lake]:
        a.axvline(pd.Timestamp(e), color="#e34948", ls="--", lw=0.9)
    a.set_ylabel("Area (km²)"); a.set_title(LAKES[lake][0], fontsize=9, loc="left", color=INK)
    a.grid(axis="y", color=GRID, lw=0.6); a.set_axisbelow(True)
plt.tight_layout(); plt.savefig(os.path.join(FIG_DIR, "reference_area.png"), dpi=160); plt.close()
ref = pd.concat(ref)
ref.to_csv(os.path.join(STATS_DIR, "reference_area_from_labels.csv"), index=False)
print(ref.groupby("lake").area.describe().round(3))
print("figures done")
