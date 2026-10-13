import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";
import { techIconId, techIcons } from "../../src/lib/tech-icons";

test("the icon sprite has every tech icon (run `npm run icons` if not)", () => {
  const sprite = readFileSync("public/tech-icons.svg", "utf8");
  const ids = [...sprite.matchAll(/<symbol id="([^"]+)"/g)].map((m) => m[1]);
  expect(ids.sort()).toEqual(Object.keys(techIcons).map(techIconId).sort());
});
