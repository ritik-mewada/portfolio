// Prints the median Lighthouse run for each page (scores, key timings and what
// caused any layout shift) to the log and to the GitHub Actions run summary.
import { appendFileSync, existsSync, readFileSync } from "node:fs";

const dir = ".lighthouseci/reports";
if (!existsSync(`${dir}/manifest.json`)) {
  console.log("No Lighthouse reports found.");
  process.exit(0);
}

const runs = JSON.parse(readFileSync(`${dir}/manifest.json`, "utf8")).filter((r) => r.isRepresentativeRun);
const score = (n) => (n == null ? "–" : Math.round(n * 100));
const ms = (n) => (n < 1000 ? `${Math.round(n)} ms` : `${(n / 1000).toFixed(2)} s`);

const lines = [
  "## Lighthouse (median run per page)",
  "",
  "| Page | Performance | Accessibility | Best practices | SEO | LCP | CLS | TBT |",
  "| --- | --- | --- | --- | --- | --- | --- | --- |",
];
const shifts = [];

for (const run of runs) {
  const lhr = JSON.parse(readFileSync(run.jsonPath, "utf8"));
  const a = lhr.audits;
  const page = new URL(run.url).pathname;
  const c = lhr.categories;
  lines.push(
    `| \`${page}\` | ${score(c.performance.score)} | ${score(c.accessibility.score)} | ${score(c["best-practices"].score)} | ${score(c.seo.score)} | ` +
      `${ms(a["largest-contentful-paint"].numericValue)} | ${a["cumulative-layout-shift"].numericValue.toFixed(3)} | ${ms(a["total-blocking-time"].numericValue)} |`,
  );
  for (const item of a["layout-shifts"]?.details?.items ?? []) {
    if (item.score < 0.005) continue;
    const causes = (item.subItems?.items ?? []).map((s) => s.extra?.value ?? s.cause).filter(Boolean);
    const snippet = (item.node?.snippet ?? "(unknown element)").replace(/\s+/g, " ").slice(0, 140);
    shifts.push(`- \`${page}\` shift ${item.score.toFixed(3)}: \`${snippet}\`${causes.length ? ` (likely cause: ${causes.join(", ")})` : ""}`);
  }
}

if (shifts.length) lines.push("", "### Layout shifts", "", ...shifts);

const text = lines.join("\n");
console.log(text);
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${text}\n`);
