export type PetAction = "feed" | "play";
export type PetMood = "awake" | "sleeping";

export type PetState = {
  hunger: number;
  happiness: number;
  level: number;
  streak: number;
  mood: PetMood;
};

export const INITIAL_PET: PetState = {
  hunger: 68,
  happiness: 76,
  level: 1,
  streak: 1,
  mood: "awake",
};

export function updatePet(pet: PetState, action: PetAction): { pet: PetState; message: string } {
  if (action === "feed") {
    if (pet.hunger === 0) return { pet, message: "Mochi is all full for now." };
    return {
      pet: { ...pet, hunger: Math.max(0, pet.hunger - 25), happiness: Math.min(100, pet.happiness + 6), mood: "awake" },
      message: "A tasty little snack for Mochi!",
    };
  }

  const happiness = Math.min(100, pet.happiness + 18);
  return {
    pet: { ...pet, happiness, hunger: Math.min(100, pet.hunger + 8), level: pet.level + (happiness === 100 ? 1 : 0), mood: "awake" },
    message: "Mochi loved playing with you!",
  };
}