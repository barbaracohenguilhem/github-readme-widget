import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="page-shell">
      <header className="topbar">
        <Link className="wordmark" href="/" aria-label="Pawgress home">pawgress<span>.</span></Link>
        <span className="topbar-note">GITHUB PROFILE WIDGET</span>
      </header>

      <section className="widget-layout" aria-labelledby="page-title">
        <div className="intro">
          <p className="eyebrow">A LIVING README IMAGE</p>
          <h1 id="page-title">Your streak,<br />with a side of cat.</h1>
          <p className="intro-copy">A tiny GitHub profile pet that wakes up when your contribution streak is alive.</p>
          <Link className="endpoint-link" href="/api/pet" target="_blank">Open the SVG endpoint <span aria-hidden="true">↗</span></Link>
        </div>

        <section className="pet-panel" aria-label="GitHub profile pet preview">
          <div className="panel-topline"><span>README PREVIEW</span><span className="online-dot">LIVE SVG</span></div>
          <div className="preview-frame">
            <Image className="widget-image" src="/api/pet" alt="GitHub contribution streak pet widget" width={330} height={330} unoptimized />
          </div>
          <div className="pet-details">
            <div className="pet-heading"><div><h2>Add it to your profile</h2><p>Paste this image tag into your GitHub README.</p></div></div>
            <pre className="embed-snippet"><code>{'<img src="https://your-domain.vercel.app/api/pet" alt="GitHub contribution streak" />'}</code></pre>
          </div>
        </section>
      </section>
      <footer className="page-footer"><span>Made for the love of little things.</span><span>MEOW / BUILD / REPEAT</span></footer>
    </main>
  );
}
