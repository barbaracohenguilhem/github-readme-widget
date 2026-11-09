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
    ? `<image href="${pet.asset}" x="65" y="132" width="200" height="176" preserveAspectRatio="xMidYMid meet" />`
    : renderFallbackCat(pet.sleeping);
  const fish = ASSETS.fish
    ? `<image href="${ASSETS.fish}" x="244" y="113" width="58" height="43" preserveAspectRatio="xMidYMid meet" />`
    : renderFallbackFish();
  const streakLabel = currentStreak === 1 ? "day" : "days";

  return `<svg xmlns="http://www.w3.org/2000/svg" width="330" height="330" viewBox="0 0 330 330" role="img" aria-labelledby="title description">
  <title id="title">GitHub contribution streak: ${currentStreak} ${streakLabel}</title>
  <desc id="description">A ${pet.sleeping ? "sleeping" : "happy"} cat with a ${currentStreak}-day GitHub contribution streak.</desc>
  <rect width="330" height="330" rx="18" fill="#f3f6ef" />
  <path d="M0 208Q84 174 165 205T330 195V330H0Z" fill="#e2eee4" />
  <circle cx="165" cy="222" r="73" fill="#f8e9d8" />
  <circle cx="282" cy="46" r="22" fill="#f1cf70" />
  <path d="m274 46 8-15 8 15-8 15Z" fill="#fff7de" />
  <text x="27" y="39" fill="#456b55" font-family="Arial, sans-serif" font-size="10" font-weight="700" letter-spacing="1.1">GITHUB CONTRIBUTION STREAK</text>
  <text x="27" y="91" fill="#202c27" font-family="Georgia, serif" font-size="48" font-weight="700">${currentStreak}</text>
  <text x="80" y="90" fill="#78817b" font-family="Arial, sans-serif" font-size="14">${streakLabel}</text>
  ${cat}
  ${fish}
  </svg>`;
}

function renderFallbackCat(sleeping: boolean) {
  const eyes = sleeping
    ? '<path d="M143 197q7 7 14 0m25 0q7 7 14 0" fill="none" stroke="#34443b" stroke-width="3" stroke-linecap="round" />'
    : '<ellipse cx="151" cy="197" rx="3.5" ry="6" fill="#34443b"/><ellipse cx="188" cy="197" rx="3.5" ry="6" fill="#34443b"/>';
  return `<g>
    <path d="M116 250Q81 273 87 243Q90 229 106 230" fill="none" stroke="#c96d54" stroke-width="9" stroke-linecap="round" />
    <ellipse cx="169" cy="247" rx="61" ry="34" fill="#d9825f" />
    <path d="M119 201 124 151Q125 144 132 149L154 170Q169 165 183 170L205 149Q212 144 213 151L218 201Q218 237 169 240Q119 237 119 201Z" fill="#e99a70" />
    <path d="m127 163 2-23 20 19m61 4-2-23-20 19" fill="#e99a70" stroke="#c96d54" stroke-width="4" stroke-linejoin="round" />
    <path d="m132 158 1-10 10 9m50 0 10-9 1 10" fill="#f3c1a2" />
    ${eyes}
    <path d="m164 207 5 4-5 4-5-4Z" fill="#a95d4b" />
    <path d="M164 215q-6 7-12 1m12-1q6 7 12 1" fill="none" stroke="#a95d4b" stroke-width="2.5" stroke-linecap="round" />
    <path d="M132 210 105 205m27 13-27 4m93-12 27-5m-27 13 27 4" fill="none" stroke="#a95d4b" stroke-width="2" stroke-linecap="round" />
    <ellipse cx="145" cy="269" rx="15" ry="8" fill="#f3c1a2" />
    <ellipse cx="193" cy="269" rx="15" ry="8" fill="#f3c1a2" />
    ${sleeping ? '<text x="222" y="174" fill="#456b55" font-family="Georgia, serif" font-size="18">Zzz</text>' : '<path d="m105 167 4-7 4 7m112 0 4-7 4 7" fill="none" stroke="#fff7de" stroke-width="3" stroke-linecap="round" />'}
  </g>`;
}

function renderFallbackFish() {
  return `<g transform="translate(252 113) rotate(-10)">
    <ellipse cx="17" cy="13" rx="17" ry="10" fill="#78a9a0" />
    <path d="m31 13 13-10v20Z" fill="#e68a5b" />
    <circle cx="10" cy="11" r="1.7" fill="#202c27" />
    <path d="M5 22q12 4 23 0" fill="none" stroke="#5d9086" stroke-width="2" stroke-linecap="round" />
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