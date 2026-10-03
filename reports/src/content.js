// Section content for the GLOF deliverables. Inline markup: see lib.runs().
const L = require("./lib");
const { P, PN, H1, H2, H3, bullets, numbered, guide, figure, figurePlaceholder, table, equation, frac, sub, mr } = L;
const FIG = (f) => require("path").join(__dirname, "..", "figures", f);

const TITLE = "Multi-Sensor Deep Learning Fusion for Glacial Lake Tracking and GLOF Hazard Assessment in the Hunza Valley, Gilgit-Baltistan";
const KEYWORDS = "Glacial lake outburst flood (GLOF), Sentinel-1, Sentinel-2, sensor fusion, semantic segmentation, U-Net, time series, hazard assessment, Karakoram";


// ======================================================================= SHARED TABLE DATA
const lakes = [["Site", "Lake type", "Centre (lat, lon)", "Documented event(s)", "Role"],
    ["Shishper", "Ice-dammed (surging glacier blocks a side valley)", "36.358°N, 74.568°E", "Repeated drainage from 2019 {c:khan2021}; 29 May 2020; 7 May 2022 {c:ullah2025}", "Event site"],
    ["Khurdopin", "Surge-dammed (Shimshal River)", "36.361°N, 75.449°E", "Formed Mar 2017; drainage onset ≈ 21 Jul 2017, drained by 3 Aug 2017 {c:steiner2018}", "Event site"],
    ["Passu (Borith Lake)", "Perennial lake beside Passu Glacier", "36.432°N, 74.862°E", "No outburst during 2017–2022", "Comparison site"]];
const sources = [["Data", "Earth Engine collection", "Bands used", "Resolution", "Role"],
    ["Sentinel-1 GRD {c:torres2012}", "COPERNICUS/S1_GRD", "VV, VH (dB), IW mode", "10 m", "Cloud-independent water signal"],
    ["Sentinel-2 L1C {c:drusch2012}", "COPERNICUS/S2_HARMONIZED", "B2, B3, B4, B8 (TOA reflectance)", "10 m", "Optical bands, NDWI, labels"],
    ["S2 cloud probability {c:s2cloudless}", "COPERNICUS/S2_CLOUD_PROBABILITY", "probability (%)", "10 m (from 20 m)", "Cloud mask (not a label)"],
    ["Copernicus DEM {c:copdem}", "COPERNICUS/DEM/GLO30", "Elevation; slope (derived)", "30 m → 10 m", "Terrain channels; slope rule; hazard feature"]];
const windows = [["Window", "Dates", "Days", "Purpose"],
    ["Khurdopin event", "22 Apr – 4 Sep 2017", "136", "90 d before / 45 d after drainage onset (21 Jul 2017)"],
    ["Shishper 2020 event", "29 Feb – 5 Aug 2020", "159", "Around the 29 May 2020 drainage (merged with anniversary)"],
    ["Shishper 2022 event", "6 Feb – 21 Jun 2022", "136", "Around the 7 May 2022 GLOF"],
    ["Anniversaries (May)", "22 Apr – 13 Jun, 2018, 2019, 2021", "3 × 53", "Same season as the May events, no event"],
    ["Anniversaries (July)", "6 Jul – 5 Aug, 2018, 2019, 2021, 2022", "4 × 31", "Same season as the July event, no event"],
    ["Total", "10 windows", "714", "Applied identically to all three sites"]];
const split = [["Site", "Dates (all)", "Optical / radar-only", "Labelled", "Train (2017, 2018, 2020, 2022)", "Test (2019, 2021)"],
    ["Shishper", "215", "121 / 94", "40", "27", "13"],
    ["Khurdopin", "313", "248 / 65", "99", "73", "26"],
    ["Passu (Borith)", "202", "121 / 81", "52", "37", "15"],
    ["Total", "730", "490 / 240", "191", "137", "54"]];

// ======================================================================= ABSTRACTS
const abstractReview =
  "Glacial lake outburst floods (GLOFs) are among the most destructive hazards in high-mountain regions, and the Hunza Valley of Gilgit-Baltistan, Pakistan, has experienced repeated, well-documented events within a single decade. Optical satellite imagery remains the dominant source for glacial-lake monitoring, but cloud cover routinely interrupts observation, while synthetic aperture radar (SAR) penetrates cloud at the cost of higher noise. This paper reviews nineteen studies (2018–2026) on glacial-lake detection, inventorying and GLOF hazard assessment and identifies a persistent separation between the two research strands: fusion-based detection models are rarely validated against a real outburst, and hazard-scoring frameworks typically begin from lake inventories compiled beforehand rather than from lake extents measured by the model itself. We propose a single Sentinel-1 SAR, Sentinel-2 optical and Copernicus DEM fusion pipeline that tracks lake extent as a dense time series at three Hunza-basin sites — Shishper, Khurdopin and a comparison site at Passu — and feeds the resulting area and growth-rate measurements into a transparent hazard index that is evaluated retrospectively against three documented events (Khurdopin 2017, Shishper 2020 and 2022).";

// ======================================================================= I. INTRODUCTION
function introduction(sec = 1) {
  return [
    H1(sec, "Introduction"),
    H2("A", "Importance"),
    P("Glacial lake outburst floods (GLOFs) are sudden releases of water stored behind ice or moraine dams. They can travel tens of kilometres downstream within hours, destroying bridges, roads, farmland and settlements with little or no warning. A global assessment estimated that around 15 million people live within 50 km of a glacial lake and within 1 km of a potential flood channel, with High Mountain Asia the most exposed region {c:taylor2023}. At the same time, glacial lakes are growing rapidly: global glacial-lake volume increased by roughly 48% between 1990 and 2018 {c:shugar2020}. The Hunza Valley in the Karakoram range of Gilgit-Baltistan, Pakistan, is one of the most glacier-active valleys in the world and has experienced repeated, well-documented events within a single decade. The surging Khurdopin Glacier dammed the Shimshal River in 2017; the resulting lake formed in March and drained in late July–early August 2017 {c:steiner2018}. The ice-dammed lake in front of the surging Shishper Glacier drained repeatedly from 2019 onwards {c:khan2021}, and on 7 May 2022 its outburst destroyed the Hassanabad bridge on the Karakoram Highway {c:ullah2025}. These events are recent, documented and recurring, which makes the Hunza basin both a priority for monitoring and an unusually good natural laboratory for testing monitoring methods."),
    H2("B", "Background"),
    P("Satellite remote sensing is the only practical way to monitor remote glacial lakes repeatedly. Optical sensors such as Sentinel-2 {c:drusch2012} provide 10 m multispectral imagery every few days, and water is readily separated from land using spectral indices such as the Normalized Difference Water Index (NDWI) {c:mcfeeters1996}. However, optical observation fails under cloud, and cloud is frequent in the Karakoram exactly in the spring and summer months when lakes fill and drain. Synthetic aperture radar (SAR) from Sentinel-1 {c:torres2012} observes the surface through cloud and in darkness, and calm water appears dark because it reflects the radar pulse away from the sensor; SAR, however, is affected by speckle noise and by layover and shadow in steep terrain. A digital elevation model (DEM) adds terrain context, since lakes form on gentle slopes in valley floors. Deep convolutional networks, in particular the encoder–decoder U-Net {c:ronneberger2015}, have become the standard tool for pixel-wise segmentation of such imagery, and several studies have shown that SAR and optical data carry complementary information about glacial lakes {c:wangchuk2020,xu2024,ali2025}. Cloud platforms such as Google Earth Engine {c:gorelick2017} now make multi-sensor archives accessible without manual downloading, which makes dense multi-year time series feasible for a small team."),
    H2("C", "Problem Statement"),
    P("Despite this progress, there is no SAR + optical + DEM deep-learning pipeline that tracks Hunza-basin glacial lakes at event-scale temporal density and feeds the tracked extents directly into a hazard score that is checked against more than one documented GLOF. Optical-only monitoring leaves gaps precisely around events, and hazard assessments in the basin still start from static, manually prepared inventories."),
    H2("D", "Research Gap"),
    P("The literature reviewed in Section II splits into two strands that rarely meet. Detection studies build increasingly accurate segmentation models — including SAR–optical fusion and foundation models — but almost never check their output against a real outburst. Hazard and susceptibility studies validate against Hunza-basin events but start from lake inventories that were compiled beforehand, rather than from lake extents measured by the model itself {c:muneeb2021,abbas2025}. Moreover, the well-documented 2017 Khurdopin drainage {c:steiner2018} has not been used as a machine-learning validation case, and no study evaluates a single pipeline against several events in the same basin."),
    H2("E", "Evidence"),
    P("The numbers gathered in this review make the gap concrete. The only fusion-based detection study set in this region reports about 89% detection accuracy but is not tested on Hunza-basin lakes or against a hazard outcome {c:ali2025}. A side-by-side sensor comparison in Bhutan found that SAR alone reached an F1-score of 0.74 against 0.91 for high-resolution optical imagery on the same lakes {c:xu2024}, which is exactly the motivation for fusing rather than replacing optical data. The Hunza-basin susceptibility study by Muneeb *et al.* {c:muneeb2021} reports high scores for Shishper (0.94) and Passu (0.69) but uses a static inventory, and the Shishper 2022 risk assessment of Ullah *et al.* {c:ullah2025} reproduces the measured flood but relies on field data rather than an automated pipeline. Foundation-model approaches report the highest segmentation scores (IoU up to 0.96) but have not been run on Hunza-basin lakes {c:jiang2025,abdrash2026}."),
    H2("F", "Aims and Objectives"),
    P("This project aims to close the gap at a scale that fits one semester and a three-person team, with one site owned end-to-end by each member. The specific objectives are to:"),
    ...numbered([
      "build a reproducible pipeline that acquires and co-registers Sentinel-1, Sentinel-2 and Copernicus DEM data over three Hunza-basin sites for every available acquisition in event-centred and seasonal windows;",
      "train and compare an optical-only U-Net baseline with an early-fusion SAR + optical + DEM U-Net, including under simulated complete cloud cover;",
      "convert the fusion model's per-date lake masks — including radar-only dates — into lake-area and growth-rate time series;",
      "combine these measurements with terrain slope into a transparent hazard index; and",
      "test retrospectively whether the index rises before the documented Khurdopin (2017) and Shishper (2020, 2022) events while remaining lower at the comparison site over the same periods.",
    ], "n1"),
    P("The objectives correspond to three research questions. **RQ1:** Does SAR + optical + DEM fusion change segmentation accuracy (IoU, F1) relative to an optical-only baseline, and how robust is each model when optical data are unavailable? **RQ2:** What lake-area and growth-rate patterns are observed at the three sites, and how do they behave around each documented event? **RQ3:** Does the hazard index behave differently before the documented events than at the comparison site over the same periods? These are research questions, not predetermined conclusions; the retrospective analysis is not an operational early-warning system."),
  ];
}

// ======================================================================= II. LITERATURE REVIEW
const tblHead = ["Ref. (Author)", "Year", "Method", "Dataset / Region", "Metrics", "Performance", "Key limitation(s)"];
const W7 = [15, 6, 15, 18, 11, 16, 19];
function litReview(sec = 2, opts = {}) {
  const t1 = [tblHead,
    ["Wangchuk & Bolch {c:wangchuk2020}", "2020", "Random Forest, rule-based (GLakeMap)", "S1 + S2 + DEM; 8 alpine sites (HMA, Alps, Andes)", "Per-site validation", "High agreement with reference outlines; no single global accuracy", "Thresholds need site-specific tuning; not a learned deep model"],
    ["Kaushik *et al.* (GLNet) {c:kaushik2022}", "2022", "Deep CNN", "Multispectral + thermal + microwave + DEM", "Accuracy", "0.98", "Needs many auxiliary layers; transferability not independently confirmed"],
    ["Thati & Ari {c:thati2024}", "2024", "U-Net", "Landsat-8; Chandra-Bhaga basin (107 lakes)", "P, R, F1", "P 95.98%, R 95.23%, F1 94.23%", "Single optical sensor; small basin; no SAR"],
    ["Yin *et al.* {c:yin2024}", "2024", "Improved YOLOv5-Seg (attention)", "Sentinel-2; High Mountain Asia (23,108 lakes)", "P, R, mAP@0.5, F1", "P 0.95, R 0.93, mAP 0.96, F1 0.94", "Optical-only, cloud-sensitive; not evaluated in Karakoram"],
    ["Zhang *et al.* {c:zhang2026}", "2026", "U-Net + interference-mask framework", "Optical (Landsat/S2-class); Hindu Kush-Karakoram-Himalaya, 2000–2022", "Change statistics", "325 additional lakes; area +72.58 ± 6.20 km²", "Segmentation accuracy not disclosed; optical-only"],
    ["Adhikari & Regmi {c:adhikari2025}", "2025", "EfficientNet-B3, time-series segmentation", "Sentinel-1 only (5-yr archive); 4 Nepal lakes", "Acc, F1, IoU, P, R", "Acc 0.9958, F1 0.9538, IoU 0.9130", "SAR-only; 4 lakes; preprint"],
  ];
  const t2 = [tblHead,
    ["Ali *et al.* {c:ali2025}", "2025", "U-Net, input-level SAR + optical fusion", "S1 + S2 + PlanetScope; Karakoram & Hindu Kush", "Detection accuracy", "≈ 89%", "Few Karakoram training lakes; not tested in Hunza basin"],
    ["Mustafa *et al.* {c:mustafa2024}", "2024", "Machine learning, multisource", "S1 + S2 + DEM; Passu/Batura glaciers, Hunza", "Not disclosed", "Not disclosed at abstract level", "Accuracy unavailable; one glacier; no hazard score"],
    ["Pathak *et al.* {c:pathak2025}", "2025", "Random Forest", "S1 + S2 + SRTM DEM (+ PlanetScope); Himachal Pradesh", "Classification accuracy", "93.69% (S1+S2+DEM); 94.44% with Planet", "Confuses glaciers with supraglacial lakes; classical ML"],
    ["Xu *et al.* {c:xu2024}", "2024", "DeepLabv3+ per sensor (not fused)", "S1, S2, PlanetScope, Landsat-8; Bhutan (2,563 lakes)", "F1", "F1 0.74 (S1) to 0.91 (Planet RGB)", "Sensors tested separately, not a fusion model"],
    ["Jiang *et al.* {c:jiang2025}", "2025", "Prithvi-based U-ViT geo-foundation model", "S1 + S2 fusion; North Pakistan (NPK) dataset", "F1", "0.894 (vs < 0.80 for CNN baselines)", "Heavy compute; two regional datasets only"],
    ["Abdrash (CryoSentinel) {c:abdrash2026}", "2026", "TerraMind foundation model + UperNet", "S1 + S2 + DEM; Central Asia (Tien Shan)", "IoU", "Val. 0.9557; held-out spatial 0.9082", "Non-peer-reviewed preprint; not Karakoram"],
  ];
  const t3 = [tblHead,
    ["Shugar *et al.* {c:shugar2020}", "2020", "Automated Landsat water classification (Google Earth Engine)", "Global glacial lakes, 1990–2018", "Area / volume change", "Global lake volume ≈ +48% (1990–2018)", "Multi-year composites; optical-only; no event-scale tracking"],
    ["Kumar & Vijay {c:kumar2026}", "2026", "Automated inventory from fused Landsat-8 + S1/S2 + Copernicus DEM", "High Mountain Asia, region-wide", "Positional accuracy", "Median displacement 8.12 m (≈ 0.8 S2 pixel)", "Geometric accuracy only; no IoU/F1"],
    ["Rawlins *et al.* (GLO) {c:rawlins2026}", "2026", "Automated deep-learning framework", "S1 + S2; Nepal & transboundary catchments, 2017–2024", "F1", "0.80–0.92", "Annual product; Nepal focus; not Gilgit-Baltistan"],
    ["Muneeb *et al.* {c:muneeb2021}", "2021", "Analytic Hierarchy Process (multi-criteria)", "Sentinel-2 + SRTM DEM + expert weights; Hunza River Basin", "Qualitative vs observed expansion", "Susceptibility: Shishper 0.94, Passu 0.69", "Subjective weights; static inventory; no deep learning"],
    ["Ullah *et al.* {c:ullah2025}", "2025", "Integrated hazard–vulnerability–risk framework", "Field + remote sensing; Shishper event of 7 May 2022", "Measured flow depth/velocity", "Reproduces observed flood behaviour", "Needs field data; no automated detection"],
    ["Abbas *et al.* {c:abbas2025}", "2025", "13 ML / DL / hybrid susceptibility models", "Geospatial factors; Central Karakoram National Park", "AUC (ROC)", "Best AUC 0.83 (GBM); hybrids 0.81", "Relies on a pre-existing lake inventory"],
    ["Steiner *et al.* {c:steiner2018}", "2018", "Remote sensing (DEM, Landsat, Planet), feature tracking", "Khurdopin Glacier, Shimshal; 2017 surge", "Measured flow velocities", "Documents surge and dammed-lake formation/drainage in 2017", "Descriptive; no segmentation model or hazard score"],
  ];
  return [
    H1(sec, "Literature Review"),
    P("We reviewed nineteen studies published between 2018 and 2026; fifteen of them appeared in 2022 or later. {t:lit1}, {t:lit2} and {t:lit3} summarise, for each study, the method, dataset and region, evaluation metrics, reported performance and main limitation. The studies are grouped into rule-based and single-sensor detection ({t:lit1}), fusion and foundation-model detection ({t:lit2}), and inventory, hazard and event-documentation studies ({t:lit3})."),
    ...table("lit1", "Literature survey (Part I): rule-based and single-sensor detection studies", t1, W7, { size: 15, grid: true, align: Array(7).fill(L.AlignmentType.LEFT) }),
    ...table("lit2", "Literature survey (Part II): fusion, multisource and foundation-model detection studies", t2, W7, { size: 15, grid: true, align: Array(7).fill(L.AlignmentType.LEFT) }),
    ...table("lit3", "Literature survey (Part III): inventory, time-series, hazard and event-documentation studies", t3, W7, { size: 15, grid: true, align: Array(7).fill(L.AlignmentType.LEFT) }),
    H2("A", "Critical Discussion"),
    H3(1, "Rule-based and classical machine learning"),
    P("Rule-based and classical machine-learning approaches — the random-forest GLakeMap of Wangchuk and Bolch {c:wangchuk2020}, the multisource random forest of Pathak *et al.* {c:pathak2025} and the Passu/Batura study of Mustafa *et al.* {c:mustafa2024} — are interpretable and need little training data, and they were the first to show that Sentinel-1, Sentinel-2 and DEM data are complementary for lakes. Their weakness is reliance on hand-set thresholds and engineered features that must be re-tuned for each site, and they confuse glaciers with supraglacial lakes {c:pathak2025}."),
    H3(2, "Single-sensor deep learning"),
    P("CNN and U-Net models trained on one sensor reach high scores: F1 of about 0.94 on Landsat-8 {c:thati2024} and Sentinel-2 {c:yin2024}, and 0.95 with SAR alone on four targeted Nepal lakes {c:adhikari2025}. Large-scale optical frameworks such as Zhang *et al.* {c:zhang2026} extend mapping to the whole Hindu Kush-Karakoram-Himalaya. Optical models, however, inherit optical's core weakness — they cannot see through cloud — while SAR-only models are tested on very few lakes. The GLNet model {c:kaushik2022} reaches 0.98 accuracy but depends on several auxiliary data layers whose availability limits transfer."),
    H3(3, "Multi-sensor fusion"),
    P("Genuine fusion remains rare. Ali *et al.* {c:ali2025} fuse SAR and optical channels at the input level with a U-Net in the Karakoram and Hindu Kush and are the closest match to this project's method, but they report accuracy only (≈ 89%) and do not test Hunza-basin lakes. Xu *et al.* {c:xu2024} evaluate each sensor separately rather than fusing them, yet provide the clearest evidence that SAR alone (F1 0.74) trails optical (F1 0.91), which argues for fusion rather than replacement."),
    H3(4, "Foundation models"),
    P("Geo-foundation models fuse SAR and optical data through large pretrained transformer backbones and report the strongest numbers in this review: F1 0.894 on the North Pakistan dataset {c:jiang2025} and IoU up to 0.9557 for CryoSentinel {c:abdrash2026}. Neither has been run on Hunza-basin lakes, both are computationally heavy for a semester project, and CryoSentinel is an unreviewed preprint validated only in Central Asia."),
    H3(5, "Inventories and time series"),
    P("Inventory and time-series products document the large-scale trend of lake growth {c:shugar2020} and are becoming automated and multi-sensor {c:kumar2026,rawlins2026}. They are typically annual or multi-year snapshots, report geometric or change statistics rather than segmentation metrics, and do not resolve the weeks around an outburst."),
    H3(6, "Hazard assessment and event documentation"),
    P("On the hazard side, Muneeb *et al.* {c:muneeb2021} and Abbas *et al.* {c:abbas2025} reach reasonable predictive performance (AUC up to 0.83) but treat the lake inventory as given rather than measured. Ullah *et al.* {c:ullah2025} go furthest in validating against a real event — the measured 2022 Shishper flood — but start from field data. Steiner *et al.* {c:steiner2018} document Khurdopin's 2017 event directly; it is a remote-sensing account with no model attached, which is precisely why it has not yet been used as a machine-learning test case."),
    H2("B", "Research Gap"),
    P("Three gaps stand out. First, detection and hazard scoring are built and tested separately: fusion-based detection studies {c:ali2025} do not check their output against a real outburst, and hazard studies {c:muneeb2021,ullah2025,abbas2025} start from prepared lake data rather than a model's own tracking. Second, no reviewed study tests a lake-tracking-to-hazard pipeline against more than one confirmed event in the same basin; Khurdopin's 2017 drainage {c:steiner2018} has never been paired with Shishper's outbursts {c:khan2021,ullah2025} as a multi-event validation set. Third, existing time-series products are annual and optical, so the weeks around an event — often cloud-covered — are not resolved; a comparison site observed over the same periods is also missing."),
    H2("C", "Problem Statement"),
    P("There is currently no SAR + optical + DEM fusion pipeline that tracks Hunza-basin glacial lakes at event-scale temporal density and feeds that tracking directly into a hazard score checked against more than one documented GLOF. This project addresses the gap by building one shared fusion model, applying it to every available Sentinel-1 and Sentinel-2 acquisition around the Khurdopin (2017) and Shishper (2020, 2022) events and in the same seasons of other years, and testing whether a simple, transparent hazard index rises before these events while staying lower at a comparison site next to Passu Glacier over the same periods."),
  ];
}

// ======================================================================= III. METHODOLOGY
function methodology(sec = 3) {
  const channels = [["#", "Channel", "Source", "Unit / range", "Optical", "Fusion"],
    ["1", "B2 (blue)", "Sentinel-2", "TOA reflectance, 0–1", "✓", "✓"],
    ["2", "B3 (green)", "Sentinel-2", "TOA reflectance, 0–1", "✓", "✓"],
    ["3", "B4 (red)", "Sentinel-2", "TOA reflectance, 0–1", "✓", "✓"],
    ["4", "B8 (NIR)", "Sentinel-2", "TOA reflectance, 0–1", "✓", "✓"],
    ["5", "NDWI", "Derived from B3, B8", "−1 to 1", "✓", "✓"],
    ["6", "VV backscatter", "Sentinel-1", "dB", "", "✓"],
    ["7", "VH backscatter", "Sentinel-1", "dB", "", "✓"],
    ["8", "Elevation", "Copernicus DEM", "m a.s.l.", "", "✓"],
    ["9", "Slope", "Derived from DEM", "degrees", "", "✓"]];
  const train = [["Setting", "Value"],
    ["Framework", "PyTorch {c:paszke2019} + segmentation-models-pytorch {c:iakubovskii2019}"],
    ["Architecture", "U-Net, ResNet-18 encoder (ImageNet weights {c:deng2009}), 1 output channel"],
    ["Input channels", "5 (optical-only) / 9 (fusion)"],
    ["Training input", "Random 128 × 128 crops of the 448 × 448 site images"],
    ["Batch size", "16"],
    ["Iterations", "3,000 on GPU (≈ 29 epoch-equivalents of 137 images); 1,500 if run on CPU"],
    ["Optimiser", "Adam {c:kingma2015}, initial learning rate 1 × 10⁻³, no weight decay"],
    ["LR schedule", "Cosine annealing to 0 over all iterations {c:loshchilov2017}"],
    ["Loss", "Masked binary cross-entropy + soft Dice {c:milletari2016} (cloud pixels ignored)"],
    ["Augmentation", "Random horizontal and vertical flips (p = 0.5 each)"],
    ["Optical-channel dropout", "Fusion only: all 5 optical channels zeroed for 30% of crops"],
    ["Decision threshold", "0.5 on the sigmoid output"],
    ["Random seeds", "NumPy and PyTorch seeds fixed to 0"],
    ["Hardware", "Google Colab, NVIDIA T4 GPU (16 GB) [[FILL: confirm GPU shown by !nvidia-smi]]"]];

  return [
    H1(sec, "Methodology and Experimental Setup"),
    H2("A", "Proposed Methodology"),
    P("The proposed approach is an early-fusion U-Net {c:ronneberger2015} with a ResNet-18 encoder {c:he2016} that segments glacial-lake water from co-registered Sentinel-1 SAR, Sentinel-2 optical and Copernicus DEM inputs, compared against an identical U-Net that receives optical inputs only. The workflow ({f:pipeline}) has six stages: (1) acquisition of every available acquisition in event-centred and seasonal windows from Google Earth Engine {c:gorelick2017}; (2) co-registration of all modalities on a common 10 m grid; (3) automatic generation of water labels from optical data; (4) training of the optical-only baseline and the fusion model; (5) evaluation of both models on held-out years, under clear conditions and under simulated complete cloud cover; and (6) application of the fusion model to every date — including dates with radar only — to derive lake-area and growth-rate time series and a transparent hazard index that is compared against the documented events. The final objective is therefore threefold: a performance comparison (RQ1), a robustness test when optical data are missing (RQ1), and a retrospective event analysis (RQ2, RQ3)."),
    ...figure("pipeline", FIG("pipeline.png"), "Overview of the proposed pipeline. Blue: data acquisition and preparation; orange: labels and models; green: outputs. The optical-only model is used for the comparison only; the fusion model produces the time series and hazard index.", 6.4),
    H3(1, "Study sites"),
    P("The study covers three sites in the Hunza basin ({t:sites}, {f:study}). Shishper and Khurdopin are the two event sites. For the Passu comparison site we verified on Sentinel-2 imagery that Passu Glacier has no persistent lake at its terminus during 2017–2022; the monitored water body is therefore Borith Lake, the perennial lake immediately south of the Passu Glacier terminus, which had no outburst in the study period. All site centres were located on the imagery because the approximate coordinates in our earlier project plan were 1–7 km off the lakes."),
    ...table("sites", "Study sites", lakes, [13, 22, 15, 33, 12], { size: 16, grid: true }),
    ...figure("study", FIG("study_area.png"), "The three 4.48 × 4.48 km study boxes (Sentinel-2 true colour). The cross marks the lake point used to identify the lake when measuring its area.", 6.4),
    H2("B", "Model Architecture"),
    P("Both models share the U-Net architecture shown in {f:arch}. The encoder is a ResNet-18 that reduces the input resolution in five steps (to 1/32) while increasing the number of feature channels to 512; residual connections make the encoder easy to optimise. The decoder upsamples in five steps, concatenating at each step the encoder feature map of the same resolution (skip connection) and applying two 3 × 3 convolutions with batch normalisation and ReLU. A final 1 × 1 convolution and a sigmoid output the per-pixel water probability."),
    P("**Rationale.** U-Net is the standard architecture for pixel-wise segmentation from limited labels, its skip connections preserve the sharp lake shorelines needed for accurate area, and it is the architecture used by the closest regional fusion study {c:ali2025}. ResNet-18 was chosen over deeper encoders because the labelled set is small (137 training images) and training has to fit a free Colab GPU; with 14.3 M parameters the model trains in minutes. The encoder is initialised with ImageNet weights {c:deng2009}; for inputs with more than three channels, the pretrained filters of the first convolution are cycled over the additional channels and rescaled (segmentation-models-pytorch default {c:iakubovskii2019}), and all layers are fine-tuned."),
    P("**Early fusion.** In the fusion model the nine channels of {t:channels} are stacked at the input, so the network learns joint optical–radar–terrain features from the first layer. Early fusion is the simplest fusion strategy, keeps the two models architecturally identical (only the first convolution differs), and therefore isolates the effect of the extra inputs. To make the fusion model usable on cloudy and radar-only dates, it is trained with **optical-channel dropout**: for 30% of training crops all five optical channels are set to zero, forcing the network to also learn to segment water from SAR and terrain alone."),
    ...figure("arch", FIG("architecture.png"), "U-Net with ResNet-18 encoder. Numbers give feature channels and down-sampling factor; C = 5 for the optical-only model and C = 9 for the fusion model.", 6.4),
    ...table("channels", "Model input channels", channels, [5, 18, 20, 22, 10, 10], { size: 16 }),
    H2("C", "Dataset and Preprocessing"),
    H3(1, "Data sources"),
    P("All data are open and accessed through the Earth Engine Python API ({t:sources}). Sentinel-2 Level-1C top-of-atmosphere reflectance is used instead of Level-2A surface reflectance because Level-2A coverage over the Karakoram is incomplete in 2017–2018, which includes the Khurdopin event. Sentinel-1 GRD scenes in Earth Engine are already calibrated, terrain-corrected and converted to decibels; we do not repeat these steps. For each site one orbit direction is used throughout (the direction with more scenes: ascending for Shishper, descending for Khurdopin and Passu) so that viewing geometry is constant."),
    ...table("sources", "Data sources", sources, [17, 33, 18, 11, 21], { size: 15 }),
    H3(2, "Temporal sampling"),
    P("Sentinel-2 revisits about every five days and Sentinel-1 every 6–12 days, so daily data do not exist. Instead, every acquisition is taken inside the windows of {t:windows}: a dense window from 90 days before to 45 days after each documented event, and ±15-day windows around each event's calendar date (7 May, 29 May and 21 July) in every year from 2017 to 2022. The same windows are applied to all three sites, so each site has observations in every event period and in the same season of years without an event. Every Sentinel-2 day whose mosaic covers at least 95% of the site box is downloaded and paired with the nearest Sentinel-1 scene within ±6 days; Sentinel-1 days without a Sentinel-2 acquisition are downloaded as radar-only dates. This yields 730 dates ({f:sampling}, {t:split}). Sentinel-1B failed on 23 December 2021 {c:esa2022}, so radar coverage in 2022 is sparser."),
    ...table("windows", "Acquisition windows (identical for all sites)", windows, [20, 30, 10, 40], { size: 16 }),
    ...figure("sampling", FIG("sampling.png"), "Temporal sampling. Top: every acquisition date per site, split into optical (Sentinel-2) and radar-only (Sentinel-1) dates; dashed lines mark the documented events. Bottom: number of dates per site.", 6.4),
    H3(3, "Co-registration"),
    P("For each site a 448 × 448 pixel box (4.48 × 4.48 km) centred on the lake point is defined on a 10 m grid in UTM zone 43N (EPSG:32643). All layers are requested from Earth Engine directly on this grid, so the modalities share CRS, transform, resolution and shape by construction. Same-day Sentinel-2 granules and same-pass Sentinel-1 slices are mosaicked. The 30 m DEM is resampled bilinearly (it is therefore not native 10 m terrain); other layers use nearest-neighbour resampling. Slope is computed from the DEM. Arrays are stored as float16 (cloud probability as uint8)."),
    H3(4, "Cloud masking"),
    P("A pixel is treated as cloud when the Sentinel-2 cloud probability {c:s2cloudless} is at least 60%. Cloud components smaller than 1,000 pixels (0.1 km²) are discarded because they are mostly false detections on bright rock and snow."),
    H3(5, "Automatic label generation"),
    P("No source provides lake outlines for the three sites at the event dates, and hand-digitising hundreds of dates was not feasible, so water labels are generated automatically from Sentinel-2 using NDWI {c:mcfeeters1996}:"),
    equation([mr("NDWI = "), frac("G − NIR", "G + NIR")]),
    P("where G and NIR are bands B3 and B8. A pixel is labelled water when NDWI > 0.2, NIR reflectance < 0.12 (excludes snow, ice and cloud), green reflectance > 0.03 (excludes deep shadow) and DEM slope < 20° (excludes steep shadowed cliffs); water components smaller than 50 pixels are removed. Only near-clear images are labelled: at most 10% cloud in the box and at most 40% very bright (snow or haze) pixels. Pixels within 150 m of cloud are marked *ignore* and excluded from the loss and from scoring. These thresholds were tuned by visual inspection of label overlays after a first version labelled cloud shadows as water. Of 490 optical dates, 191 received labels ({t:split}); {f:labels} shows examples. Frozen or snow-covered lake surfaces are labelled as land, which is a known limitation of this labelling strategy."),
    ...figure("labels", FIG("label_examples.png"), "Examples of automatic labels (blue = water, darkened = cloud buffer, ignored). Shishper lake before the 2022 GLOF, the Khurdopin dammed lake in June 2017, and Borith Lake.", 6.4),
    H3(6, "Input normalisation"),
    P("Each channel is standardised with the mean and standard deviation computed on 60 randomly sampled training images. After standardisation, the optical channels are set to zero (the channel mean) wherever the cloud mask is set and on radar-only dates, and missing values (e.g. no Sentinel-1 scene within ±6 days) are set to zero."),
    H3(7, "Train / test split"),
    P("Neighbouring dates of the same lake are nearly identical, so a random split would leak information. The split is therefore by year: labelled dates from 2019 and 2021 form the test set (54 images) and those from 2017, 2018, 2020 and 2022 form the training set (137 images; {t:split}). No separate validation set is used: hyper-parameters were fixed in advance, the learning-rate schedule is fixed, and no early stopping or model selection is performed, so the test years are never used for any training decision."),
    ...table("split", "Dataset composition and year-wise split", split, [17, 12, 18, 12, 22, 19], { size: 16 }),
    H3(8, "Augmentation"),
    P("Training uses random 128 × 128 crops from the full site images, with random horizontal and vertical flips. The fusion model additionally uses optical-channel dropout (Section III-B). Rotations by arbitrary angles are not used because SAR geometry depends on the look direction."),
    H2("D", "Training Configuration"),
    P("Both models use the configuration in {t:train}. The loss combines binary cross-entropy and soft Dice and is computed only over valid (non-ignored) pixels; with p the predicted probability, y the label and m the validity mask:"),
    equation([mr("ℒ = "), frac("Σ m·BCE(p, y)", "N"), mr(" + 1 − "), frac("2 Σ m·p·y + 1", "Σ m·p + Σ m·y + 1")]),
    P("The Dice term counteracts the strong class imbalance (lake water occupies a few percent of each image), while the cross-entropy term provides stable per-pixel gradients. Training stability is supported by ImageNet initialisation, cosine learning-rate annealing, which lowers the step size smoothly towards the end of training, the masked loss, which prevents cloud pixels with unreliable labels from producing gradients, and data augmentation. Optical-channel dropout also acts as a regulariser that prevents the fusion model from relying on NDWI alone."),
    ...table("train", "Training configuration", train, [30, 70], { size: 16, align: [L.AlignmentType.LEFT, L.AlignmentType.LEFT] }),
    H2("E", "Evaluation Metrics"),
    H3(1, "Segmentation"),
    P("Predictions are evaluated on the valid (non-cloud) pixels of the test images using intersection-over-union (IoU), F1-score (Dice), precision and recall, with TP, FP and FN the numbers of true-positive, false-positive and false-negative water pixels:"),
    equation([mr("IoU = "), frac("TP", "TP + FP + FN"), mr(",   F1 = "), frac("2TP", "2TP + FP + FN")]),
    equation([mr("Precision = "), frac("TP", "TP + FP"), mr(",   Recall = "), frac("TP", "TP + FN")]),
    P("IoU is the standard segmentation metric and directly reflects errors in lake extent, which is the quantity used downstream. F1 is reported for comparability with the literature reviewed in Section II. Precision and recall separate over-detection (e.g. shadows or wet ice classified as water) from under-detection (e.g. turbid or partly frozen lakes). Overall accuracy is not used because it would be dominated by the land class. Many test images contain no lake water (Khurdopin after 2017, Shishper after each drainage); per-image IoU is undefined for them, and averaging it would score a correct \"no water\" prediction as zero. The main results are therefore **pixel-pooled** metrics, for which TP, FP and FN are summed over all test pixels of a site (or of all sites) before the metric is computed. In addition, per-image metrics are reported as mean ± standard deviation over the test images that contain water, and the false-positive area is reported for test images without water."),
    H3(2, "Robustness to missing optical data"),
    P("To test the cloud-robustness motivation directly, both models are also evaluated after setting all optical channels of the test images to zero (*simulated complete cloud cover*), using the same labels. The optical-only model then receives no information, while the fusion model can use SAR and terrain."),
    H3(3, "Time series"),
    P("The fusion model is applied to all 730 dates. Lake area Aₜ on date t is the number of predicted water pixels in connected components that touch a 400 m neighbourhood of the lake point, multiplied by the pixel area (100 m²); this excludes rivers and other water in the box. Area is smoothed with a centred rolling median over three observations (Ãₜ), and the growth rate is computed over roughly 30 days:"),
    equation([sub("G", "t"), mr(" = "), frac([sub("Ã", "t"), mr(" − "), sub("Ã", "t′")], mr("t − t′")), mr(" × 30")]),
    P("where t′ is the latest date at least 30 days before t; growth is not computed when t − t′ exceeds 60 days (gaps between windows)."),
    H3(4, "Hazard index"),
    P("Following the multi-criteria idea of Muneeb *et al.* {c:muneeb2021} in a reduced, transparent form, the hazard index combines three features: smoothed lake area, positive growth rate and the mean DEM slope along the lake outline. Each is min–max normalised over all sites and dates to give a, g and s in [0, 1], and the index is their equal-weight mean:"),
    equation([sub("H", "t"), mr(" = "), frac([sub("a", "t"), mr(" + "), sub("g", "t"), mr(" + "), sub("s", "t")], "3")]),
    P("Equal weights are a modelling assumption, not fitted to the events. For each documented event the index of all three sites is compared over the 90 days before the event date (mean and maximum), and plotted against days relative to the event. This is a retrospective evaluation, not an early-warning system."),
  ];
}

const { abstractFull, experiments, discussion, conclusion } = require("./results");

module.exports = { lakes, sources, windows, split, TITLE, KEYWORDS, abstractReview, abstractFull, introduction, litReview, methodology, experiments, discussion, conclusion };
