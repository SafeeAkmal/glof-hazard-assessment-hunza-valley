// Builds the five deliverable .docx files into reports/deliverables/.
// Usage (from reports/src):  npm install && npm run build
const path = require("path");
const L = require("./lib");
const C = require("./content");
const REFS = require("./refs");
const { P, PN, H1, H2, H3, bullets, guide, figure, table, references, titleBlock, abstractBlock, makeDoc, save } = L;
const FIG = (f) => path.join(__dirname, "..", "figures", f);
const OUT = process.argv[2] || path.join(__dirname, "..", "deliverables");
require("fs").mkdirSync(OUT, { recursive: true });

const SUB = {
  d1: "Deliverable 1 — Introduction, Literature Review, Research Gap and Problem Statement",
  d1b: "Deliverable 1 — Dataset Description and Data Sources",
  d2: "Deliverable 2 — Methodology and Experimental Setup",
  d3: "Deliverable 3 — Paper up to Experiments and Results",
  d4: "Deliverable 4 — Final Research Paper",
};

function coverGuide(lines) {
  return guide(lines, "Before you submit — delete this box");
}

// ------------------------------------------------------------ D1: intro + literature review
async function d1() {
  L.reset(REFS);
  const doc = makeDoc([
    ...titleBlock(C.TITLE, SUB.d1),
    coverGuide([
      "Fill the yellow placeholders: affiliation and e-mails under the title, and the venue of reference Thati & Ari in the reference list.",
      "This document follows the required order: Introduction (importance, background, problem statement, research gap, evidence, aims and objectives), Literature Review with survey tables (19 studies), critical discussion grouped by approach, research gap and problem statement.",
      "References were checked against the corrections found during the project: Steiner et al. is 2018 (event 2017); GLO is ESSD 2026; the HMA inventory is Kumar & Vijay (Sci. Rep. 2026); the U-ViT study is Jiang et al. (JAG 2025); the 2022 Shishper event is cited to Ullah et al. (2025).",
    ]),
    L.spacer(),
    ...abstractBlock(C.abstractReview, C.KEYWORDS),
    ...C.introduction(1),
    ...C.litReview(2),
    ...references(),
  ], SUB.d1);
  await save(doc, path.join(OUT, "Deliverable_1_Introduction_and_Literature_Review.docx"));
}

// ------------------------------------------------------------ D1b: dataset description
async function d1b() {
  L.reset(REFS);
  const events = [["Site", "Event", "Date(s)", "Source"],
    ["Khurdopin", "Lake formation behind surging glacier", "March 2017", "{c:steiner2018}"],
    ["Khurdopin", "Drainage onset → lake fully drained", "≈ 21 Jul 2017 → 3 Aug 2017", "{c:steiner2018}"],
    ["Shishper", "Repeated drainage of the ice-dammed lake", "2019 onwards; 29 May 2020", "{c:khan2021}"],
    ["Shishper", "GLOF destroying the Hassanabad bridge (KKH)", "7 May 2022", "{c:ullah2025}"],
    ["Passu (Borith Lake)", "No outburst in the study period", "2017–2022", "Sentinel-2 inspection (this work)"]];
  const labels = [["Site", "Optical dates", "Labelled", "2017", "2018", "2019", "2020", "2021", "2022"],
    ["Shishper", "121", "40", "2", "6", "6", "10", "7", "9"],
    ["Khurdopin", "248", "99", "9", "16", "13", "24", "13", "24"],
    ["Passu (Borith)", "121", "52", "4", "10", "7", "11", "8", "12"],
    ["Total", "490", "191", "15", "32", "26", "45", "28", "45"]];
  const doc = makeDoc([
    ...titleBlock("Dataset Description and Data Sources", C.TITLE),
    coverGuide([
      "Fill the yellow placeholders under the title. All counts, dates and figures in this document come from the real data downloaded for the project (Google Earth Engine, 730 dates).",
      "If you re-run the notebook and your counts differ, update Tables IV and V accordingly (notebook sections 4–6 print them).",
    ]),
    L.spacer(),
    H1(1, "Overview"),
    P("This project detects and tracks glacial lakes in the Hunza basin, Gilgit-Baltistan, Pakistan, by fusing synthetic aperture radar (SAR), optical and terrain data, and uses the resulting lake-area time series in a transparent GLOF hazard index. Three sites are studied: the ice-dammed Shishper lake and the surge-dammed Khurdopin lake, both with documented outbursts, and Borith Lake next to Passu Glacier as a comparison site without an outburst in the study period. The dataset consists of (1) co-registered Sentinel-1, Sentinel-2 and Copernicus DEM rasters for every available acquisition in event-centred and seasonal windows between 2017 and 2022, (2) automatically generated water labels, and (3) documented event records used for evaluation. All sources are free and openly licensed and are accessed programmatically through Google Earth Engine {c:gorelick2017}."),
    H1(2, "Study Area"),
    P("Each site is a 448 × 448 pixel box (4.48 × 4.48 km) at 10 m resolution in UTM zone 43N (EPSG:32643), centred on the lake ({t:sites}, {f:study}). The lake centres were located on Sentinel-2 imagery. For the Passu comparison site, inspection of 2017–2022 imagery showed no persistent lake at the Passu Glacier terminus; Borith Lake, the perennial lake immediately south of the terminus, is therefore used."),
    ...table("sites", "Study sites", C.lakes, [13, 22, 15, 33, 12], { size: 16, grid: true }),
    ...figure("study", FIG("study_area.png"), "The three study boxes in Sentinel-2 true colour. The cross marks the lake point used to separate the lake from other water when measuring its area.", 6.4),
    H1(3, "Raw Satellite Imagery"),
    P("{t:sources} lists the data sources. **Sentinel-1 GRD** {c:torres2012} provides a cloud-independent water signal (calm water is dark in VV and VH). Earth Engine scenes are already calibrated, terrain-corrected and in decibels; one orbit direction per site is used for consistent geometry (ascending for Shishper, descending for Khurdopin and Passu). **Sentinel-2 Level-1C** {c:drusch2012} provides the blue, green, red and near-infrared bands at 10 m; Level-1C is used instead of Level-2A because Level-2A coverage over the Karakoram is incomplete in 2017–2018, the period of the Khurdopin event. The **Sentinel-2 cloud probability** product {c:s2cloudless} is used only to mask clouds, never as a label. The **Copernicus DEM GLO-30** {c:copdem} provides elevation and slope; it is resampled bilinearly from 30 m to the 10 m grid and is therefore not native 10 m terrain."),
    ...table("sources", "Data sources (all via Google Earth Engine)", C.sources, [17, 33, 18, 11, 21], { size: 15 }),
    H1(4, "Sampling Strategy and Data Volume"),
    P("Satellites do not image the sites daily: Sentinel-2 revisits about every five days and Sentinel-1 every 6–12 days (12 days after the failure of Sentinel-1B on 23 December 2021 {c:esa2022}). Instead of a few hand-picked dates, the dataset takes **every acquisition** in the windows of {t:windows}: 90 days before to 45 days after each documented event, and ±15 days around each event's calendar date in every year from 2017 to 2022. The same windows are used for all three sites, so every site is observed during every event period and in the same season of years without an event."),
    ...table("windows", "Acquisition windows (identical for all sites)", C.windows, [20, 30, 10, 40], { size: 16 }),
    P("A Sentinel-2 day is kept when its mosaic covers at least 95% of the box; it is paired with the nearest Sentinel-1 scene within ±6 days. Sentinel-1 days without a Sentinel-2 acquisition are kept as radar-only dates. In total the dataset contains **730 dates** (490 optical, 240 radar-only; {t:split}, {f:sampling}), about 886 MB as compressed float16 arrays."),
    ...figure("sampling", FIG("sampling.png"), "Temporal sampling of the dataset. Top: every acquisition date per site (optical and radar-only); dashed lines mark documented events. Bottom: number of dates per site.", 6.4),
    ...table("split", "Dataset composition and year-wise train/test split", C.split, [17, 12, 18, 12, 22, 19], { size: 16 }),
    H1(5, "Labels"),
    P("No existing source provides lake outlines for the three sites at the event dates, so water labels are generated automatically from Sentinel-2 using the NDWI {c:mcfeeters1996}, (G − NIR) / (G + NIR). A pixel is labelled water when NDWI > 0.2, NIR reflectance < 0.12 (excludes snow, ice and cloud), green reflectance > 0.03 (excludes deep shadow) and slope < 20° (excludes steep shadowed cliffs); components smaller than 50 pixels are removed. Images with more than 10% cloud (cloud probability ≥ 60%, specks < 0.1 km² ignored) or more than 40% very bright pixels are not labelled, and pixels within 150 m of cloud are marked *ignore*. Radar-only dates are never labelled. This yields **191 labelled dates** ({t:labels}); {f:labels} shows examples."),
    ...table("labels", "Labelled dates per site and year", labels, [18, 12, 10, 8, 8, 8, 8, 8, 8], { size: 16 }),
    ...figure("labels", FIG("label_examples.png"), "Examples of automatic labels (blue = water, darkened = ignored cloud buffer).", 6.4),
    P("Lake area measured directly from these labels already shows the documented events ({f:refarea}): water at Shishper on 30 April 2022 and none on 10 May 2022, water on 25 May 2020 and none by 29 June 2020, and the Khurdopin lake present in May–June 2017 and gone by 27 July 2017. Label-derived areas underestimate the event lakes because frozen and very turbid lake surfaces are not labelled as water."),
    ...figure("refarea", FIG("reference_area.png"), "Lake area derived from the automatic labels on clear dates. Dashed lines: documented events.", 6.4),
    H1(6, "Event Records"),
    P("The documented events used for evaluation are listed in {t:events}. They are taken from peer-reviewed sources; the Passu comparison site has no documented outburst during the study period."),
    ...table("events", "Documented events used for evaluation", events, [18, 38, 24, 20], { size: 16 }),
    H1(7, "Justification"),
    ...bullets([
      "**Coverage of the research question.** Sentinel-1, Sentinel-2 and a DEM are the minimum set needed to test whether radar–optical–terrain fusion helps when optical data are obscured by cloud.",
      "**Temporal density around events.** Taking every acquisition in event-centred windows, plus radar-only dates, gives the observations needed to see lakes fill and drain — something annual inventories cannot provide.",
      "**Built-in comparison.** Identical windows at all sites provide same-period observations of non-event sites for every event.",
      "**Labelling burden.** Automatic NDWI labels make it possible to label 191 dates without manual digitisation, at the cost of label noise that is documented in Section IX.",
      "**Access and reproducibility.** All data are free, open and retrievable with one notebook; the full download takes about 13 minutes.",
    ]),
    H1(8, "Access and Reproducibility"),
    P("Data are retrieved with the Earth Engine Python API using `ee.data.computePixels`, which returns arrays directly on the defined 10 m grid. The notebook *glof_pipeline.ipynb* contains the complete acquisition code; it stores one compressed file per date and site plus a static DEM/slope file and a plan file listing all dates, and it skips existing files so that interrupted downloads can be resumed. Copernicus Sentinel and DEM data are free and openly licensed under the Copernicus data policy; use through Earth Engine requires a registered (non-commercial) Earth Engine project."),
    H1(9, "Known Limitations"),
    ...bullets([
      "Labels are derived from optical rules, so they favour optical inputs, miss frozen or turbid lake surfaces, and may contain small shadow or wet-ice errors.",
      "No additional speckle filtering is applied to Sentinel-1; radar shadow in steep terrain can resemble water.",
      "The DEM is static and 30 m; slope near narrow lakes is smoothed.",
      "Sentinel-1B stopped on 23 December 2021, so 2022 radar sampling is sparser.",
      "Khurdopin's lake was small and short-lived, so few labelled dates contain water there.",
      "Borith Lake is a perennial lake of different origin from the event lakes, which limits it as a comparison site.",
    ]),
    ...references(),
  ], SUB.d1b);
  await save(doc, path.join(OUT, "Deliverable_1_Dataset_Description.docx"));
}

// ------------------------------------------------------------ D2: methodology
async function d2() {
  L.reset(REFS);
  const doc = makeDoc([
    ...titleBlock(C.TITLE, SUB.d2),
    coverGuide([
      "Fill the yellow placeholders under the title and in the training-configuration table (GPU model from !nvidia-smi in Colab).",
      "This document contains Section III (Methodology and Experimental Setup) with the required subsections: Proposed Methodology, Model Architecture, Dataset and Preprocessing, Training Configuration and Evaluation Metrics. It describes exactly what notebooks/glof_pipeline.ipynb does.",
      "Section numbering (III) matches the complete paper; if your instructor wants it numbered as 3, change the heading only.",
    ]),
    L.spacer(),
    ...C.methodology(3),
    ...references(),
  ], SUB.d2);
  await save(doc, path.join(OUT, "Deliverable_2_Methodology.docx"));
}

// ------------------------------------------------------------ D3: paper up to results
async function d3() {
  L.reset(REFS);
  const doc = makeDoc([
    ...titleBlock(C.TITLE, SUB.d3),
    coverGuide([
      "This document contains all chapters up to Experiments and Results, as required for Deliverable 3. Submit it together with notebooks/glof_pipeline.ipynb (run end to end on Colab so the outputs are saved in the notebook).",
      "Run the notebook on a Colab T4 GPU, then search this document for \"FILL\" and \"INSERT FIGURE\" and complete each item using the guide boxes in Section IV. Remove every blue guide box before exporting to PDF.",
      "The abstract also contains result placeholders — fill it last.",
    ]),
    L.spacer(),
    ...abstractBlock(C.abstractFull, C.KEYWORDS),
    ...C.introduction(1),
    ...C.litReview(2),
    ...C.methodology(3),
    ...C.experiments(4),
    ...references(),
  ], SUB.d3);
  await save(doc, path.join(OUT, "Deliverable_3_Experiments_and_Results.docx"));
}

// ------------------------------------------------------------ D4: complete paper
async function d4() {
  L.reset(REFS);
  const doc = makeDoc([
    ...titleBlock(C.TITLE, SUB.d4),
    coverGuide([
      "Complete research paper (Deliverable 4). Fill Section IV first (results), then adjust Section V (Discussion) using its guide boxes so the interpretation matches your numbers, then the Conclusion and finally the Abstract.",
      "Search for \"FILL\" and \"INSERT FIGURE\" until none remain, delete all blue guide boxes, and export to PDF (or transfer the text into the IEEE LaTeX template).",
      "Submit together with notebooks/glof_pipeline.ipynb run end to end.",
    ]),
    L.spacer(),
    ...abstractBlock(C.abstractFull, C.KEYWORDS),
    ...C.introduction(1),
    ...C.litReview(2),
    ...C.methodology(3),
    ...C.experiments(4),
    ...C.discussion(5),
    ...C.conclusion(6),
    H1(0, "Author Contributions"),
    P("All authors jointly designed the study and built the shared pipeline. [[FILL: name]] was responsible for the Shishper site, [[FILL: name]] for the Khurdopin site and [[FILL: name]] for the Passu comparison site, including data checks, time-series analysis and the corresponding results."),
    ...references(),
  ], SUB.d4);
  await save(doc, path.join(OUT, "Deliverable_4_Final_Paper.docx"));
}

(async () => { await d1(); await d1b(); await d2(); await d3(); await d4(); })().catch((e) => { console.error(e); process.exit(1); });
