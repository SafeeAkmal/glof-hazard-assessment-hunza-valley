// Shared helpers for the deliverable documents: IEEE-like styles, auto-numbered
// citations / figures / tables, highlighted placeholders and guide boxes.
const fs = require("fs");
const path = require("path");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, ImageRun, AlignmentType,
  HeadingLevel, WidthType, BorderStyle, ShadingType, LevelFormat, Footer, PageNumber,
  Math: OMath, MathRun, MathFraction, MathSubScript, MathSum, VerticalAlign, TableLayoutType,
} = require("docx");

const FONT = "Times New Roman";
const PAGE_W = 11906, PAGE_H = 16838, MARGIN = 1134;           // A4, 2 cm margins
const TEXT_W = PAGE_W - 2 * MARGIN;                              // 9638 DXA
const ROMAN = ["", ...Array.from({ length: 40 }, (_, i) => { let n = i + 1, r = ""; for (const [v, sym] of [[10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]]) while (n >= v) { r += sym; n -= v; } return r; })];

// ---------------------------------------------------------------- state
let state;
function reset(refs) {
  state = { refs, citeOrder: [], fig: {}, tab: {}, nFig: 0, nTab: 0, nEq: 0 };
}
function citeNum(key) {
  if (!state.refs[key]) throw new Error("unknown reference: " + key);
  let i = state.citeOrder.indexOf(key);
  if (i < 0) { state.citeOrder.push(key); i = state.citeOrder.length - 1; }
  return i + 1;
}
function figNum(id) { if (!state.fig[id]) state.fig[id] = ++state.nFig; return state.fig[id]; }
function tabNum(id) { if (!state.tab[id]) state.tab[id] = ++state.nTab; return state.tab[id]; }

// ---------------------------------------------------------------- inline markup
// {c:key1,key2}  -> [1], [2]     {f:id} -> Fig. n     {t:id} -> Table N (roman)
// [[text]]       -> highlighted placeholder            **bold**   *italic*
function runs(text, base = {}) {
  const out = [];
  const re = /(\{c:[^}]+\}|\{f:[^}]+\}|\{t:[^}]+\}|\[\[[^\]]+\]\]|\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;
  let last = 0, m;
  const push = (t, extra = {}) => { if (t) out.push(new TextRun({ text: t, font: FONT, ...base, ...extra })); };
  while ((m = re.exec(text))) {
    push(text.slice(last, m.index));
    const tok = m[0];
    if (tok.startsWith("{c:")) {
      const nums = tok.slice(3, -1).split(",").map((k) => citeNum(k.trim()));
      push("[" + nums.join("], [") + "]");
    } else if (tok.startsWith("{f:")) {
      push("Fig. " + figNum(tok.slice(3, -1)));
    } else if (tok.startsWith("{t:")) {
      push("Table " + ROMAN[tabNum(tok.slice(3, -1))]);
    } else if (tok.startsWith("[[")) {
      push("[" + tok.slice(2, -2) + "]", { bold: true, highlight: "yellow" });
    } else if (tok.startsWith("`")) {
      push(tok.slice(1, -1), { font: "Consolas", size: Math.max(14, (base.size || 21) - 2) });
    } else if (tok.startsWith("**")) {
      push(tok.slice(2, -2), { bold: true });
    } else {
      push(tok.slice(1, -1), { italics: true });
    }
    last = m.index + tok.length;
  }
  push(text.slice(last));
  return out;
}

// ---------------------------------------------------------------- blocks
const P = (text, opts = {}) => new Paragraph({
  alignment: opts.align || AlignmentType.JUSTIFIED,
  spacing: { after: opts.after ?? 100, line: 264 },
  indent: opts.noIndent ? undefined : { firstLine: 284 },
  keepNext: opts.keepNext,
  children: runs(text, opts.run || {}),
});
const PN = (text, opts = {}) => P(text, { ...opts, noIndent: true });
const H1 = (n, text) => new Paragraph({
  heading: HeadingLevel.HEADING_1, alignment: AlignmentType.CENTER, keepNext: true,
  spacing: { before: 240, after: 120 },
  children: [new TextRun({ text: (n ? ROMAN[n] + ". " : "") + text.toUpperCase(), font: FONT, size: 22 })],
});
const H2 = (letter, text) => new Paragraph({
  heading: HeadingLevel.HEADING_2, keepNext: true, spacing: { before: 160, after: 80 },
  children: [new TextRun({ text: (letter ? letter + ". " : "") + text, font: FONT, italics: true, size: 22 })],
});
const H3 = (n, text) => new Paragraph({
  heading: HeadingLevel.HEADING_3, keepNext: true, spacing: { before: 100, after: 60 },
  indent: { firstLine: 284 },
  children: [new TextRun({ text: (n ? n + ") " : "") + text + ":", font: FONT, italics: true, size: 21 })],
});
const bullets = (items, ref = "bullets") => items.map((t) => new Paragraph({
  numbering: { reference: ref, level: 0 }, alignment: AlignmentType.JUSTIFIED,
  spacing: { after: 60, line: 252 }, children: runs(t),
}));
const numbered = (items, ref) => items.map((t) => new Paragraph({
  numbering: { reference: ref, level: 0 }, alignment: AlignmentType.JUSTIFIED,
  spacing: { after: 60, line: 252 }, children: runs(t),
}));

// guidance box (to be deleted before submission)
function guide(lines, title = "Guide — delete this box before submitting") {
  const border = { style: BorderStyle.SINGLE, size: 6, color: "2A78D6" };
  const paras = [new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: title, bold: true, font: FONT, size: 19, color: "1A4F8F" })] })];
  for (const l of [].concat(lines)) {
    if (l.startsWith("$ ")) {
      paras.push(new Paragraph({ spacing: { after: 40 }, children: [new TextRun({ text: l.slice(2), font: "Consolas", size: 17 })] }));
    } else {
      paras.push(new Paragraph({ spacing: { after: 50 }, alignment: AlignmentType.LEFT, children: runs(l, { size: 19 }) }));
    }
  }
  return new Table({
    width: { size: TEXT_W, type: WidthType.DXA }, columnWidths: [TEXT_W],
    rows: [new TableRow({ children: [new TableCell({
      width: { size: TEXT_W, type: WidthType.DXA },
      shading: { fill: "EAF2FB", type: ShadingType.CLEAR, color: "auto" },
      margins: { top: 100, bottom: 100, left: 160, right: 160 },
      borders: { top: border, bottom: border, left: { style: BorderStyle.SINGLE, size: 24, color: "2A78D6" }, right: border },
      children: paras,
    })] })],
  });
}
const spacer = (after = 120) => new Paragraph({ spacing: { after }, children: [] });

// ---------------------------------------------------------------- figures
function figure(id, file, caption, widthIn = 6.3) {
  const buf = fs.readFileSync(file);
  const w = buf.readUInt32BE(16), h = buf.readUInt32BE(20);          // PNG header
  const wpx = widthIn * 96, hpx = (wpx * h) / w;
  const n = figNum(id);
  return [
    new Paragraph({ alignment: AlignmentType.CENTER, keepNext: true, spacing: { before: 120, after: 60 },
      children: [new ImageRun({ type: "png", data: buf, transformation: { width: wpx, height: hpx },
        altText: { title: caption.slice(0, 60), description: caption, name: id } })] }),
    new Paragraph({ alignment: AlignmentType.JUSTIFIED, spacing: { after: 180 },
      children: [new TextRun({ text: `Fig. ${n}. `, font: FONT, size: 18 }), ...runs(caption, { size: 18 })] }),
  ];
}
function figurePlaceholder(id, caption, how, heightIn = 2.6) {
  const n = figNum(id);
  const dashed = { style: BorderStyle.DASHED, size: 8, color: "8A8A8A" };
  const box = new Table({
    width: { size: TEXT_W, type: WidthType.DXA }, columnWidths: [TEXT_W],
    rows: [new TableRow({ height: { value: Math.round(heightIn * 1440), rule: "atLeast" }, children: [new TableCell({
      width: { size: TEXT_W, type: WidthType.DXA }, verticalAlign: VerticalAlign.CENTER,
      shading: { fill: "F4F4F2", type: ShadingType.CLEAR, color: "auto" },
      borders: { top: dashed, bottom: dashed, left: dashed, right: dashed },
      margins: { top: 120, bottom: 120, left: 200, right: 200 },
      children: [
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 },
          children: [new TextRun({ text: `[INSERT FIGURE ${n} HERE]`, bold: true, font: FONT, size: 22, highlight: "yellow" })] }),
        ...[].concat(how).map((t) => new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 },
          children: runs(t, { size: 18, color: "52514E" }) })),
      ],
    })] })],
  });
  return [box, new Paragraph({ alignment: AlignmentType.JUSTIFIED, spacing: { before: 60, after: 180 },
    children: [new TextRun({ text: `Fig. ${n}. `, font: FONT, size: 18 }), ...runs(caption, { size: 18 })] })];
}

// ---------------------------------------------------------------- tables
const thin = { style: BorderStyle.SINGLE, size: 4, color: "000000" };
const none = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
// IEEE-ish three-rule table. rows[0] is the header. widths are relative weights.
function table(id, caption, rows, weights, opts = {}) {
  const n = tabNum(id);
  const sum = weights.reduce((a, b) => a + b, 0);
  const widths = weights.map((w) => Math.floor((w / sum) * TEXT_W));
  widths[widths.length - 1] += TEXT_W - widths.reduce((a, b) => a + b, 0);
  const size = opts.size || 17;
  const mk = (cells, ri) => new TableRow({
    tableHeader: ri === 0, cantSplit: true,
    children: cells.map((c, ci) => new TableCell({
      width: { size: widths[ci], type: WidthType.DXA },
      margins: { top: 40, bottom: 40, left: 70, right: 70 },
      shading: ri === 0 ? { fill: "EFEFEC", type: ShadingType.CLEAR, color: "auto" } : undefined,
      borders: {
        top: ri === 0 ? thin : none, left: none, right: none,
        bottom: ri === 0 || ri === rows.length - 1 ? thin : (opts.grid ? { style: BorderStyle.SINGLE, size: 2, color: "BFBFBF" } : none),
      },
      children: [new Paragraph({
        alignment: (opts.align && opts.align[ci]) || (ci === 0 ? AlignmentType.LEFT : AlignmentType.CENTER),
        children: runs(String(c), { size, bold: ri === 0 }),
      })],
    })),
  });
  return [
    new Paragraph({ alignment: AlignmentType.CENTER, keepNext: true, spacing: { before: 160, after: 40 },
      children: [new TextRun({ text: `TABLE ${ROMAN[n]}`, font: FONT, size: 18 })] }),
    new Paragraph({ alignment: AlignmentType.CENTER, keepNext: true, spacing: { after: 80 },
      children: runs(caption.toUpperCase(), { size: 16 }) }),
    new Table({ width: { size: TEXT_W, type: WidthType.DXA }, columnWidths: widths, layout: TableLayoutType.FIXED,
      rows: rows.map(mk) }),
    ...(opts.note ? [new Paragraph({ spacing: { before: 40, after: 160 }, children: runs(opts.note, { size: 16, italics: false }) })] : [spacer(160)]),
  ];
}

// ---------------------------------------------------------------- equations
const mr = (t) => new MathRun(t);
function equation(mathChildren) {
  const n = ++state.nEq;
  return new Paragraph({
    alignment: AlignmentType.CENTER, spacing: { before: 60, after: 100 },
    children: [new OMath({ children: mathChildren }), new TextRun({ text: `\t(${n})`, font: FONT })],
    tabStops: [{ type: "right", position: TEXT_W }],
  });
}
const frac = (num, den) => new MathFraction({ numerator: [].concat(num).map((x) => typeof x === "string" ? mr(x) : x), denominator: [].concat(den).map((x) => typeof x === "string" ? mr(x) : x) });
const sub = (b, s) => new MathSubScript({ children: [mr(b)], subScript: [mr(s)] });

// ---------------------------------------------------------------- references
function references() {
  const out = [H1(0, "References")];
  state.citeOrder.forEach((key, i) => {
    out.push(new Paragraph({
      alignment: AlignmentType.JUSTIFIED, spacing: { after: 60 },
      indent: { left: 480, hanging: 480 },
      children: [new TextRun({ text: `[${i + 1}]\t`, font: FONT, size: 17 }), ...runs(state.refs[key], { size: 17 })],
      tabStops: [{ type: "left", position: 480 }],
    }));
  });
  return out;
}

// ---------------------------------------------------------------- title block
function titleBlock(title, subtitle) {
  const out = [
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 160 },
      children: [new TextRun({ text: title, font: FONT, size: 40 })] }),
  ];
  if (subtitle) out.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 160 },
    children: [new TextRun({ text: subtitle, font: FONT, size: 22, italics: true })] }));
  out.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 },
    children: [new TextRun({ text: "Muhammad Ali Saleem, Junaid Minhas, and Safee Akmal", font: FONT, size: 22 })] }));
  out.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 },
    children: runs("Deep Learning for Perception — Semester Research Project, [[FILL: Department, University]]", { size: 19, italics: true }) }));
  out.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 240 },
    children: runs("[[FILL: email addresses]]", { size: 19 }) }));
  return out;
}
function abstractBlock(text, keywords) {
  return [
    new Paragraph({ alignment: AlignmentType.JUSTIFIED, spacing: { after: 100, line: 252 },
      children: [new TextRun({ text: "Abstract—", bold: true, italics: true, font: FONT, size: 19 }), ...runs(text, { bold: true, size: 19 })] }),
    new Paragraph({ alignment: AlignmentType.JUSTIFIED, spacing: { after: 200 },
      children: [new TextRun({ text: "Index Terms—", bold: true, italics: true, font: FONT, size: 19 }), ...runs(keywords, { bold: true, size: 19, italics: true })] }),
  ];
}

// ---------------------------------------------------------------- document
function makeDoc(children, headerText) {
  const bulletLevel = { level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
    style: { paragraph: { indent: { left: 568, hanging: 284 } } } };
  const numLevel = (fmt) => ({ level: 0, format: fmt, text: "%1)", alignment: AlignmentType.LEFT,
    style: { paragraph: { indent: { left: 568, hanging: 340 } } } });
  const numRefs = ["n1", "n2", "n3", "n4", "n5", "n6", "n7", "n8"];
  return new Document({
    creator: "Muhammad Ali Saleem, Junaid Minhas, Safee Akmal",
    title: headerText,
    styles: {
      default: { document: { run: { font: FONT, size: 21 } } },
      paragraphStyles: [
        { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
          run: { font: FONT, size: 22 }, paragraph: { outlineLevel: 0 } },
        { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
          run: { font: FONT, size: 22, italics: true }, paragraph: { outlineLevel: 1 } },
        { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
          run: { font: FONT, size: 21, italics: true }, paragraph: { outlineLevel: 2 } },
      ],
    },
    numbering: { config: [
      { reference: "bullets", levels: [bulletLevel] },
      ...numRefs.map((r) => ({ reference: r, levels: [numLevel(LevelFormat.LOWER_ROMAN)] })),
      ...numRefs.map((r) => ({ reference: r + "d", levels: [numLevel(LevelFormat.DECIMAL)] })),
    ] },
    sections: [{
      properties: { page: { size: { width: PAGE_W, height: PAGE_H }, margin: { top: MARGIN, bottom: MARGIN, left: MARGIN, right: MARGIN } } },
      footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER,
        children: [new TextRun({ children: [PageNumber.CURRENT], font: FONT, size: 18 })] })] }) },
      children,
    }],
  });
}
async function save(doc, file) {
  fs.writeFileSync(file, await Packer.toBuffer(doc));
  console.log("wrote", file);
}

module.exports = { reset, runs, P, PN, H1, H2, H3, bullets, numbered, guide, spacer, figure, figurePlaceholder,
  table, equation, frac, sub, mr, references, titleBlock, abstractBlock, makeDoc, save, citeNum, figNum, tabNum,
  ROMAN, TEXT_W, AlignmentType };
