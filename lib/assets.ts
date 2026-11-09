import fs from "node:fs";
import path from "node:path";

const ASSET_FILENAMES = {
  sleepingCat: "sleeping_cat.png",
  awakeCat: "awake_cat.png",
  fish: "fish.png",
} as const;

export type PetAssets = Record<keyof typeof ASSET_FILENAMES, string | null>;

export function getPetAssets(): PetAssets {
  const assetDirectory = path.join(process.cwd(), "public", "assets");
  return Object.fromEntries(
    Object.entries(ASSET_FILENAMES).map(([name, filename]) => [
      name,
      fs.existsSync(path.join(assetDirectory, filename)) ? `/assets/${filename}` : null,
    ]),
  ) as PetAssets;
}