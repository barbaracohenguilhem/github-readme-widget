import fs from "node:fs";
import path from "node:path";

function toBase64(filePath: string): string | null {
  if (!fs.existsSync(filePath)) return null;
  return `data:image/png;base64,${fs.readFileSync(filePath).toString("base64")}`;
}

const assetDirectory = path.join(process.cwd(), "public", "assets");

export const ASSETS = {
  sleepingCat: toBase64(path.join(assetDirectory, "sleeping_cat.png")),
  awakeCat: toBase64(path.join(assetDirectory, "awake_cat.png")),
  fish: toBase64(path.join(assetDirectory, "fish.png")),
};