"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { PetAssets } from "@/lib/assets";
import type { GitHubProfile } from "@/lib/github";
import { INITIAL_PET, type PetState } from "@/lib/pet";

type PetResponse = {
  pet: PetState;
  profile: GitHubProfile | null;
  assets: PetAssets;
};

export default function Home() {
  const [pet, setPet] = useState(INITIAL_PET);
  const [profile, setProfile] = useState<GitHubProfile | null>(null);
  const [assets, setAssets] = useState<PetAssets | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    fetch("/api/pet")
      .then(async (response) => {
        if (!response.ok) throw new Error("Could not load your pet.");
        return (await response.json()) as PetResponse;
      })
      .then((data) => {
        setPet(data.pet);
        setProfile(data.profile);
        setAssets(data.assets);
      })
      .catch(() => setMessage("Your cat is taking a little nap. Try again soon."))
      .finally(() => setLoading(false));
  }, []);

  async function performAction(action: "feed" | "play") {
    setMessage("");
    const response = await fetch("/api/pet", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, pet }),
    });
    if (!response.ok) {
      setMessage("That didn’t work. Please try again.");
      return;
    }
    const data = (await response.json()) as { pet: PetState; message: string };
    setPet(data.pet);
    setMessage(data.message);
  }

  const catAsset = pet.mood === "sleeping" ? assets?.sleepingCat : assets?.awakeCat;

  return (
    <main className="page-shell">
      <header className="topbar">
        <Link className="wordmark" href="/" aria-label="Pawgress home">pawgress<span>.</span></Link>
        <span className="topbar-note">A little companion for your code</span>
      </header>

      <section className="widget-layout" aria-labelledby="page-title">
        <div className="intro">
          <p className="eyebrow">YOUR OPEN SOURCE SIDEKICK</p>
          <h1 id="page-title">Small commits.<br />Big purrs.</h1>
          <p className="intro-copy">Keep your cat company while you build. A little care goes a long way.</p>
          {profile ? (
            <a className="profile-link" href={profile.htmlUrl} target="_blank" rel="noreferrer">
              <Image src={profile.avatarUrl} alt="" width={32} height={32} unoptimized />
              <span><strong>{profile.name || profile.login}</strong><small>@{profile.login}</small></span>
              <span className="profile-arrow" aria-hidden="true">↗</span>
            </a>
          ) : (
            <p className="setup-note">Connect a GitHub profile in your environment to show it here.</p>
          )}
        </div>

        <section className="pet-panel" aria-label="Your cat companion">
          <div className="panel-topline"><span>YOUR DESK BUDDY</span><span className="online-dot">{loading ? "CHECKING IN" : "HERE WITH YOU"}</span></div>
          <div className={`pet-scene ${pet.mood}`}>
            <div className="sun-stamp" aria-hidden="true">✳</div>
            <div className="pet-art" aria-live="polite">
              {!imageFailed && catAsset ? (
                <Image src={catAsset} alt={pet.mood === "sleeping" ? "Your cat is sleeping" : "Your cat is awake"} width={170} height={170} unoptimized onError={() => setImageFailed(true)} />
              ) : <span className="cat-emoji" role="img" aria-label={pet.mood === "sleeping" ? "Sleeping cat" : "Awake cat"}>{pet.mood === "sleeping" ? "😴🐈" : "🐈"}</span>}
            </div>
            <div className="speech-bubble">{loading ? "One moment..." : pet.mood === "sleeping" ? "Zzz..." : "Hey, you!"}</div>
            <div className="floor-line" />
          </div>

          <div className="pet-details">
            <div className="pet-heading"><div><h2>Mochi</h2><p>{pet.mood === "sleeping" ? "Having a cozy rest" : "Ready for a little break?"}</p></div><span className="level-badge">LV. {pet.level}</span></div>
            <div className="meters">
              <Meter label="HUNGER" value={pet.hunger} icon="🍣" />
              <Meter label="HAPPINESS" value={pet.happiness} icon="✦" />
            </div>
            <div className="action-row">
              <button className="action-button feed-button" onClick={() => performAction("feed")} disabled={loading || pet.hunger === 0}>
                <span aria-hidden="true">🐟</span> Feed Mochi
              </button>
              <button className="action-button play-button" onClick={() => performAction("play")} disabled={loading}>
                <span aria-hidden="true">✳</span> Play
              </button>
            </div>
            <p className="status-message" aria-live="polite">{message || `Care streak · ${pet.streak} ${pet.streak === 1 ? "day" : "days"}`}</p>
          </div>
        </section>
      </section>
      <footer className="page-footer"><span>Made for the love of little things.</span><span>MEOW / BUILD / REPEAT</span></footer>
    </main>
  );
}

function Meter({ label, value, icon }: { label: string; value: number; icon: string }) {
  return (
    <div className="meter-row">
      <div className="meter-label"><span>{icon} {label}</span><span>{value}%</span></div>
      <div className="meter-track" role="meter" aria-label={label.toLowerCase()} aria-valuemin={0} aria-valuemax={100} aria-valuenow={value}>
        <span style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
