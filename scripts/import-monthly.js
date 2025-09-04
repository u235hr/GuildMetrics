/*
  Parse markdown tables in local/*月币量排名.md and output public/data/monthly.json
  Table format:
  | 排名 | 主播 | <月>币量 |
  | :--- | :--- | :--- |
  | 1 | 名字 | 12345 |
*/
const fs = require('fs');
const path = require('path');

const projectRoot = process.cwd();
const localDir = path.join(projectRoot, 'local');
const outDir = path.join(projectRoot, 'public', 'data');
const outFile = path.join(outDir, 'monthly.json');

function parseMonthFromFilename(filename) {
  // e.g. 6月币量排名.md or 2024-07-币量.xlsx (future)
  const m1 = filename.match(/(\d{1,2})月/);
  if (m1) return { month: parseInt(m1[1], 10) };
  return null;
}

function parseMarkdownTable(content) {
  const lines = content.trim().split(/\r?\n/).map(l => l.trim());
  // skip header and alignment lines (first two)
  const dataLines = lines.filter(l => /^\|/.test(l)).slice(2);
  const rows = [];
  for (const line of dataLines) {
    const cells = line.split('|').map(s => s.trim()).filter(Boolean);
    // Expect [排名, 主播, 币量]
    if (cells.length < 3) continue;
    const rank = Number(cells[0]);
    const name = cells[1];
    const giftValue = Number(String(cells[2]).replace(/[,，]/g, ''));
    if (!Number.isFinite(rank) || !Number.isFinite(giftValue)) continue;
    rows.push({ rank, name, giftValue });
  }
  return rows;
}

function buildMonthlyData(month, year, streamers) {
  // minimal fields used by UI
  const totalGiftValue = streamers.reduce((s, r) => s + r.giftValue, 0);
  return {
    month,
    year,
    streamerCount: streamers.length,
    totalGiftValue,
    streamers: streamers.map(s => ({
      rank: s.rank,
      name: s.name,
      giftValue: s.giftValue,
      month,
      year
    }))
  };
}

function main() {
  if (!fs.existsSync(localDir)) {
    console.error(`local directory not found: ${localDir}`);
    process.exit(1);
  }
  const files = fs.readdirSync(localDir).filter(f => f.endsWith('.md'));
  const out = {};
  for (const file of files) {
    const info = parseMonthFromFilename(file);
    if (!info) continue;
    const month = info.month;
    const year = 2024; // default year; adjust if needed
    const full = path.join(localDir, file);
    const content = fs.readFileSync(full, 'utf-8');
    const rows = parseMarkdownTable(content);
    if (!rows.length) continue;
    const monthly = buildMonthlyData(month, year, rows);
    const key = `${year}-${String(month).padStart(2, '0')}`;
    out[key] = monthly;
  }
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(outFile, JSON.stringify(out, null, 2), 'utf-8');
  console.log(`Wrote ${outFile}`);
}

main(); 