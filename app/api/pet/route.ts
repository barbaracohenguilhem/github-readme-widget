import { ASSETS } from "@/lib/assets";
import { getGitHubStats } from "@/lib/github";
import { getPetState } from "@/lib/pet";

export async function GET() {
  try {
    const stats = await getGitHubStats();
    const pet = getPetState(stats.currentStreak);
    const svg = renderPetSvg(stats.currentStreak, pet);

    return new Response(svg, {
      headers: {
        "Content-Type": "image/svg+xml; charset=utf-8",
        "Cache-Control": "public, max-age=0, s-maxage=3600",
      },
    });
  } catch {
    return new Response(renderErrorSvg(), {
      status: 503,
      headers: {
        "Content-Type": "image/svg+xml; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  }
}

function renderPetSvg(currentStreak: number, pet: ReturnType<typeof getPetState>) {
  const cat = pet.asset
    ? `<image href="${pet.asset}" x="40" y="110" width="250" height="210" preserveAspectRatio="xMidYMid meet" />`
    : renderFallbackCat(pet.sleeping);
  const fish = ASSETS.fish
    ? `<image href="${ASSETS.fish}" x="226" y="105" width="72" height="52" preserveAspectRatio="xMidYMid meet" />`
    : renderFallbackFish();

  return `<svg xmlns="http://www.w3.org/2000/svg" width="330" height="330" viewBox="0 0 330 330" role="img" aria-labelledby="title description">
  <title id="title">GitHub contribution streak: ${currentStreak} days</title>
  <desc id="description">A ${pet.sleeping ? "sleeping" : "happy"} cat with a ${currentStreak}-day GitHub contribution streak.</desc>
  <rect width="330" height="330" rx="18" fill="#f7f5ef" />
  <circle cx="278" cy="47" r="24" fill="#f1cf70" />
  <text x="28" y="42" fill="#456b55" font-family="Arial, sans-serif" font-size="12" font-weight="700" letter-spacing="1.2">GITHUB CONTRIBUTION STREAK</text>
  <text x="28" y="92" fill="#202c27" font-family="Georgia, serif" font-size="42" font-weight="700">${currentStreak}</text>
  <text x="94" y="91" fill="#78817b" font-family="Arial, sans-serif" font-size="15">${currentStreak === 1 ? "day" : "days"}</text>
  ${cat}
  ${fish}
  </svg>`;
}

function renderFallbackCat(sleeping: boolean) {
  const eyes = sleeping
    ? '<path d="M124 197q8 8 16 0m26 0q8 8 16 0" fill="none" stroke="#34443b" stroke-width="4" stroke-linecap="round" />'
    : '<ellipse cx="132" cy="196" rx="4" ry="7" fill="#34443b"/><ellipse cx="174" cy="196" rx="4" ry="7" fill="#34443b"/>';
  return `<g transform="translate(34 100)">
    <ellipse cx="154" cy="194" rx="89" ry="42" fill="#d9825f" />
    <path d="M89 151 94 93 133 122Q154 114 176 122L214 93 219 153Q233 169 229 192H79Q75 169 89 151Z" fill="#e99a70" />
    <path d="m99 118 3-43 29 31m53 0 29-31 3 43" fill="#e99a70" stroke="#c96d54" stroke-width="5" stroke-linejoin="round" />
    <path d="m107 110 1-19 13 14m66 0 13-14 1 19" fill="#f3c1a2" />
    ${eyes}
    <path d="m148 211 6 5 6-5m-6 5q-7 8-14 1m14-1q7 8 14 1" fill="none" stroke="#a95d4b" stroke-width="3" stroke-linecap="round" />
    <path d="M77 189q-28-7-32 13m185-13q27-7 31 13" fill="none" stroke="#c96d54" stroke-width="8" stroke-linecap="round" />
    ${sleeping ? '<text x="222" y="76" fill="#456b55" font-family="Georgia, serif" font-size="22">Zzz</text>' : ""}
  </g>`;
}

function renderFallbackFish() {
  return `<g transform="translate(244 113) rotate(-12)">
    <ellipse cx="20" cy="15" rx="22" ry="12" fill="#78a9a0" />
    <path d="m38 15 15-12v24Z" fill="#e68a5b" />
    <circle cx="11" cy="12" r="2" fill="#202c27" />
  </g>`;
}

function renderErrorSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="330" height="120" viewBox="0 0 330 120" role="img" aria-labelledby="title">
  <title id="title">GitHub pet is temporarily unavailable</title>
  <rect width="330" height="120" rx="12" fill="#f7f5ef" />
  <text x="20" y="48" fill="#202c27" font-family="Arial, sans-serif" font-size="16" font-weight="700">Mochi is taking a nap</text>
  <text x="20" y="75" fill="#78817b" font-family="Arial, sans-serif" font-size="12">Check your GitHub token and try again.</text>
  </svg>`;
}