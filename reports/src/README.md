# Report sources

Scripts that regenerate the figures in `reports/figures/` and the deliverables in `reports/deliverables/`.

| File | Purpose |
|---|---|
| `figs.py` | Builds the figures and the dataset statistics in `results/metrics/` from the local data cache (`data/raw/glof_minimal/`, written by the notebook). |
| `results_figs.py` | Builds result charts (e.g. IoU per site) from the tables in `results/metrics/`. |
| `build.js` | Assembles the five deliverable `.docx` files. |
| `content.js` | Section text: introduction, literature review, methodology. |
| `results.js` | Section text written against the notebook results: abstract, experiments and results, discussion, conclusion. |
| `refs.js` | Reference list (IEEE style); citations are numbered automatically in order of first use. |
| `lib.js` | Formatting helpers: headings, tables, figures, equations, placeholders and guide boxes. |

```bash
# from the repository root
python reports/src/figs.py
cd reports/src && npm install && npm run build
```

In `content.js`, `[[...]]` marks a yellow placeholder, `{c:key}` a citation, `{f:id}` a figure reference and `{t:id}` a table reference.
