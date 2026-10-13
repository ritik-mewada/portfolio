// Builds public/tech-icons.svg, one sprite with every icon in src/lib/tech-icons.ts.
// Run `npm run icons` after adding or changing an icon there.
import { writeFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { techIconId, techIcons } from "../src/lib/tech-icons.ts";

// Paint attributes set on each icon's root <svg>; moved onto a <g> so they survive inside <symbol>.
const PAINT = ["fill", "stroke", "stroke-width", "stroke-linecap", "stroke-linejoin"];

function toSymbol(id, markup) {
  const [, attrs = "", body = ""] = markup.match(/^<svg([^>]*)>([\s\S]*)<\/svg>$/) ?? [];
  const attr = (name) => attrs.match(new RegExp(`\\s${name}="([^"]*)"`))?.[1];
  const paint = PAINT.filter(attr).map((name) => `${name}="${attr(name)}"`).join(" ");
  return `<symbol id="${id}" viewBox="${attr("viewBox") ?? "0 0 24 24"}"><g ${paint}>${body}</g></symbol>`;
}

const symbols = Object.entries(techIcons).map(([name, Icon]) => toSymbol(techIconId(name), renderToStaticMarkup(createElement(Icon))));
writeFileSync("public/tech-icons.svg", `<svg xmlns="http://www.w3.org/2000/svg">\n${symbols.join("\n")}\n</svg>\n`);
console.log(`Wrote public/tech-icons.svg (${symbols.length} icons)`);
