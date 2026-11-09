import { getGitHubProfile } from "@/lib/github";
import { INITIAL_PET, updatePet, type PetAction, type PetState } from "@/lib/pet";

export async function GET() {
  const profile = await getGitHubProfile();
  return Response.json({ pet: INITIAL_PET, profile });
}

export async function POST(request: Request) {
  let body: { action?: PetAction; pet?: PetState };

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if ((body.action !== "feed" && body.action !== "play") || !isPetState(body.pet)) {
    return Response.json({ error: "Provide a valid pet state and action." }, { status: 400 });
  }

  return Response.json(updatePet(body.pet, body.action));
}

function isPetState(value: unknown): value is PetState {
  if (!value || typeof value !== "object") return false;
  const pet = value as Partial<PetState>;
  return [pet.hunger, pet.happiness, pet.level, pet.streak].every(Number.isInteger)
    && [pet.hunger, pet.happiness].every((score) => Number(score) >= 0 && Number(score) <= 100)
    && Number(pet.level) >= 1
    && Number(pet.streak) >= 0
    && (pet.mood === "awake" || pet.mood === "sleeping");
}