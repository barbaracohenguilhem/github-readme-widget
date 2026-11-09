import { ASSETS } from "@/lib/assets";

export function getPetState(currentStreak: number) {
  const sleeping = currentStreak === 0;
  return {
    asset: sleeping ? ASSETS.sleepingCat : ASSETS.awakeCat,
    sleeping,
  };
}