"""Result figures built from the metric tables in results/metrics/.

Run from the repository root:
    python reports/src/results_figs.py
"""
import os
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
M = os.path.join(ROOT, "results", "metrics")
OUT = os.path.join(ROOT, "reports", "figures")
INK, MUTED, GRID = "#0b0b0b", "#52514e", "#d9d8d4"
MODELS = [("optical", "Optical-only", "#2a78d6"), ("radar", "Radar-only", "#1baf7a"), ("fusion", "Fusion", "#eb6834")]
plt.rcParams.update({"font.family": "Times New Roman", "font.size": 10, "axes.edgecolor": MUTED,
                     "xtick.color": MUTED, "ytick.color": MUTED, "axes.spines.top": False, "axes.spines.right": False})

lake = pd.read_csv(os.path.join(M, "seg_pooled_per_lake.csv"))
overall = pd.read_csv(os.path.join(M, "seg_pooled_overall.csv")).assign(lake="all")
df = pd.concat([lake, overall])
sites = [("shishper", "Shishper"), ("khurdopin", "Khurdopin"), ("passu", "Passu (Borith)"), ("all", "All sites")]

fig, axes = plt.subplots(1, 2, figsize=(7.2, 3.0), sharey=True)
x = np.arange(len(sites))
w = 0.26
for a, cond in zip(axes, ["clear", "simulated cloud"]):
    for k, (model, label, color) in enumerate(MODELS):
        sel = [df[(df.lake == s) & (df.condition == cond) & (df.model == model)].iloc[0] for s, _ in sites]
        means = [r.IoU_mean for r in sel]
        sds = [r.IoU_std for r in sel]
        bars = a.bar(x + (k - 1) * w, means, width=w - 0.02, color=color, edgecolor="white", lw=0.8, label=label,
                     yerr=sds, error_kw=dict(ecolor=MUTED, lw=0.8, capsize=2))
        for b, v, e in zip(bars, means, sds):
            a.text(b.get_x() + b.get_width() / 2, v + e + 0.015, f"{v:.2f}", ha="center", va="bottom", fontsize=6.5, color=INK)
    a.set_xticks(x); a.set_xticklabels([n for _, n in sites], fontsize=8.5)
    a.set_title("Clear conditions" if cond == "clear" else "Simulated complete cloud cover", fontsize=9.5, color=INK)
    a.set_ylim(0, 1.05); a.grid(axis="y", color=GRID, lw=0.6); a.set_axisbelow(True)
axes[0].set_ylabel("Pixel-pooled IoU (mean ± sd, 3 seeds)")
axes[0].legend(frameon=False, fontsize=8, loc="upper left")
plt.tight_layout()
plt.savefig(os.path.join(OUT, "iou_per_site.png"), dpi=160)
print("wrote", os.path.join(OUT, "iou_per_site.png"))
