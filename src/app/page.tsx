"use client";

import { useEffect, useRef, useState } from "react";

function useFadeUp() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("opacity-100", "translate-y-0");
          el.classList.remove("opacity-0", "translate-y-8");
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

const FADE = "opacity-0 translate-y-8 transition-all duration-700";

function Eyebrow({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <span
      className={`inline-block text-xs font-body font-semibold px-3 py-1 rounded-md uppercase tracking-widest mb-4 ${
        dark ? "bg-amber/15 text-amber" : "bg-ink text-amber"
      }`}
    >
      {children}
    </span>
  );
}

function Logo() {
  return (
    <a href="#" className="flex items-center gap-2" aria-label="WindowSeat home">
      <span className="w-7 h-7 rounded-md bg-amber text-ink flex items-center justify-center font-display font-black text-base leading-none" aria-hidden="true">↱</span>
      <span className="font-display font-extrabold text-cream text-lg tracking-wide uppercase">WindowSeat</span>
    </a>
  );
}

// ── Nav ──────────────────────────────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "#how-it-works", label: "How it works" },
    { href: "#benefits", label: "Why it works" },
    { href: "#partners", label: "Partners" },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 bg-ink transition-shadow duration-300 ${scrolled ? "shadow-xl" : ""}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Logo />
          <div className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <a key={l.href} href={l.href} className="text-cream/80 hover:text-cream text-sm font-body transition-colors">
                {l.label}
              </a>
            ))}
            <a href="#cta" className="bg-amber text-ink text-sm font-body font-semibold px-5 py-2.5 rounded-md hover:bg-amber/90 transition-colors">
              Get early access
            </a>
          </div>
          <button className="md:hidden text-cream p-2" aria-label="Toggle menu" onClick={() => setOpen(!open)}>
            <div className={`w-5 h-0.5 bg-cream mb-1 transition-all origin-center ${open ? "rotate-45 translate-y-1.5" : ""}`} />
            <div className={`w-5 h-0.5 bg-cream mb-1 transition-opacity ${open ? "opacity-0" : ""}`} />
            <div className={`w-5 h-0.5 bg-cream transition-all origin-center ${open ? "-rotate-45 -translate-y-1.5" : ""}`} />
          </button>
        </div>
        {open && (
          <div className="md:hidden pb-4 flex flex-col gap-3">
            {links.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-cream/80 hover:text-cream text-sm font-body px-2 py-1">
                {l.label}
              </a>
            ))}
            <a href="#cta" onClick={() => setOpen(false)} className="bg-amber text-ink text-sm font-body font-semibold px-5 py-2.5 rounded-md text-center">
              Get early access
            </a>
          </div>
        )}
      </div>
    </nav>
  );
}

// ── Analytics (privacy-conscious: no coordinates, anonymous session) ─────────
function getRef(): string | undefined {
  try {
    const url = new URL(window.location.href);
    const fromUrl = url.searchParams.get("ref");
    if (fromUrl) sessionStorage.setItem("ws_ref", fromUrl.slice(0, 64));
    return sessionStorage.getItem("ws_ref") ?? undefined;
  } catch {
    return undefined;
  }
}

function getSession(): string {
  try {
    let id = sessionStorage.getItem("ws_sid");
    if (!id) {
      id = Math.random().toString(36).slice(2, 12);
      sessionStorage.setItem("ws_sid", id);
    }
    return id;
  } catch {
    return "anon";
  }
}

function track(event: string, props: Record<string, string | number | undefined> = {}) {
  try {
    const body = JSON.stringify({ event, props, ref: getRef(), session: getSession(), ts: new Date().toISOString() });
    if (navigator.sendBeacon) navigator.sendBeacon("/api/events", new Blob([body], { type: "application/json" }));
    else fetch("/api/events", { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true });
  } catch {
    /* analytics must never break the page */
  }
}

// ── Interactive preview (simulated) ──────────────────────────────────────────
type OptionKey = "icon" | "view" | "classic" | "gem";
const FASTEST_MIN = 38;
const OPTIONS: { key: OptionKey; label: string; place: string; extra: number; path: string }[] = [
  { key: "icon", label: "The Icon", place: "Brooklyn Bridge", extra: 12, path: "M292,156 C250,150 190,148 140,134 L100,122 C112,96 120,70 112,48 L104,38" },
  { key: "view", label: "The View", place: "Statue of Liberty from the waterfront", extra: 18, path: "M292,156 C240,170 160,174 118,166 C126,152 136,142 142,134 L100,122 C112,96 120,70 112,48 L104,38" },
  { key: "classic", label: "The Classic", place: "Flatiron Building", extra: 7, path: "M292,156 C260,130 210,104 168,94 L124,86 L100,82 C97,66 100,52 104,38" },
  { key: "gem", label: "The Hidden Gem", place: "DUMBO's Washington Street", extra: 9, path: "M292,156 C250,150 196,146 150,134 L126,100 C120,78 114,58 104,38" },
];

function PreviewMap({ mode, option, onPick }: { mode: "fastest" | "scenic"; option: OptionKey; onPick: (k: OptionKey) => void }) {
  const sel = OPTIONS.find((o) => o.key === option)!;
  const lit = (k: OptionKey) => mode === "scenic" && option === k;
  const tap = (k: OptionKey, name: string) => ({
    role: "button",
    tabIndex: 0,
    "aria-label": `Route past ${name}`,
    onClick: () => onPick(k),
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") onPick(k);
    },
    style: { cursor: "pointer" },
  });
  return (
    <div className="relative rounded-xl overflow-hidden bg-[#16294A]">
      <svg viewBox="0 0 320 180" className="w-full h-auto block" role="group" aria-label={mode === "fastest" ? "Simulated map: fastest route from JFK to Midtown" : `Simulated map: scenic route from JFK to Midtown via ${sel.place}`}>
        <path d="M158,0 C150,55 128,100 78,180 L110,180 C152,108 172,60 182,0 Z" fill="#244B7A" />
        <path d="M0,128 C30,140 60,155 82,180 L0,180 Z" fill="#244B7A" />
        <path d="M292,156 L240,96 L176,40 L104,38" fill="none" stroke="#F7F7F2" strokeOpacity={mode === "fastest" ? 0.9 : 0.25} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        {mode === "scenic" && (
          <path d={sel.path} fill="none" stroke="#FFC72C" strokeWidth="3" strokeDasharray="7 4" strokeLinecap="round" strokeLinejoin="round" />
        )}
        {/* Brooklyn Bridge */}
        <g {...tap("icon", "the Brooklyn Bridge")}>
          <rect x="92" y="100" width="56" height="40" fill="transparent" />
          <g stroke={lit("icon") ? "#FFC72C" : "#F7F7F2"} strokeWidth="1.4" fill="none" strokeLinecap="round" opacity={lit("icon") ? 1 : 0.6} transform="translate(120 122) scale(1.55) translate(-120 -122)">
            <path d="M96,121 L144,135" strokeWidth="2.2" />
            <path d="M108,124 L108,106 M113,125.5 L113,107.5 M108,106 L113,107.5" />
            <path d="M127,129 L127,111 M132,130.5 L132,112.5 M127,111 L132,112.5" />
            <path d="M110.5,111 Q120,123 129.5,116" strokeWidth="1" />
            <path d="M98,121 Q104,112 110.5,111 M129.5,116 Q137,120 142,134" strokeWidth="1" />
          </g>
        </g>
        {/* Flatiron Building */}
        <g {...tap("classic", "the Flatiron Building")}>
          <rect x="60" y="64" width="44" height="32" fill="transparent" />
          <g fill={lit("classic") ? "#FFC72C" : "#F7F7F2"} opacity={lit("classic") ? 1 : 0.75}>
            <polygon points="86,92 98,92 98,75 94,69 86,75" />
          </g>
          <text x="83" y="88" textAnchor="end" fontFamily="var(--font-body), sans-serif" fontSize="8.5" fontWeight="600" fill="#F7F7F2" fillOpacity={lit("classic") ? 1 : 0.7}>Flatiron</text>
        </g>
        {/* Empire State Building at Midtown */}
        <g fill="#F7F7F2" transform="translate(104 44) scale(1.5) translate(-104 -44)">
          <rect x="96" y="28" width="16" height="16" rx="1" />
          <rect x="99" y="20" width="10" height="9" />
          <rect x="101.5" y="14" width="5" height="7" />
          <rect x="103.5" y="6" width="1.2" height="9" />
        </g>
        {/* Statue of Liberty */}
        <g {...tap("view", "the Statue of Liberty")}>
          <rect x="10" y="126" width="60" height="54" fill="transparent" />
          <g fill={lit("view") ? "#FFC72C" : "#F7F7F2"} fillOpacity={lit("view") ? 1 : 0.8} transform="translate(27 166) scale(1.4) translate(-27 -166)">
            <rect x="22" y="160" width="10" height="6" />
            <rect x="24.5" y="148" width="5" height="12" rx="1" />
            <circle cx="27" cy="145.5" r="2.3" />
            <rect x="28.6" y="136" width="1.3" height="9" transform="rotate(12 29 141)" />
            <circle cx="31" cy="135" r="1.6" fill="#FFC72C" fillOpacity="1" />
          </g>
          <text x="40" y="172" fontFamily="var(--font-body), sans-serif" fontSize="9" fill="#F7F7F2" fillOpacity={lit("view") ? 1 : 0.75} fontWeight={lit("view") ? 600 : 400}>Lady Liberty</text>
        </g>
        {/* DUMBO */}
        <g {...tap("gem", "DUMBO")}>
          <circle cx="152" cy="150" r="9" fill="transparent" />
          <circle cx="152" cy="150" r="4" fill={lit("gem") ? "#FFC72C" : "#F7F7F2"} fillOpacity={lit("gem") ? 1 : 0.6} />
          <text x="160" y="160" fontFamily="var(--font-body), sans-serif" fontSize="8.5" fontWeight="600" fill="#F7F7F2" fillOpacity={lit("gem") ? 1 : 0.7}>DUMBO</text>
        </g>
        <circle cx="292" cy="156" r="5" fill="#E4572E" />
        <g fontFamily="var(--font-body), sans-serif" fontSize="9" fontWeight="600">
          <text x="122" y="34" fill="#F7F7F2">Midtown</text>
          <text x="276" y="146" textAnchor="end" fill="#F7F7F2">JFK</text>
        </g>
      </svg>
      <span className="absolute top-2 right-2 bg-black/50 text-cream/80 text-[10px] font-body font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md">Simulated example</span>
    </div>
  );
}

function Preview() {
  const [mode, setMode] = useState<"fastest" | "scenic">("scenic");
  const [option, setOption] = useState<OptionKey>("icon");
  const sel = OPTIONS.find((o) => o.key === option)!;
  const pick = (k: OptionKey) => {
    setOption(k);
    setMode("scenic");
  };
  return (
    <div className="bg-ink rounded-xl p-4 sm:p-5 shadow-2xl">
      <div className="flex items-center justify-between mb-3">
        <div><p className="font-body text-amber text-[10px] font-semibold uppercase tracking-widest">Destination</p><p className="font-body text-cream text-sm font-semibold">JFK → Midtown</p></div>
        <div className="grid grid-cols-2 bg-white/10 rounded-md p-0.5" role="tablist" aria-label="Route type">
          {(["fastest", "scenic"] as const).map((m) => (
            <button
              key={m}
              type="button"
              role="tab"
              aria-selected={mode === m}
              onClick={() => setMode(m)}
              className={`px-3 py-1 rounded font-body text-xs font-semibold capitalize transition-colors ${mode === m ? "bg-amber text-ink" : "text-cream/70"}`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>
      <PreviewMap mode={mode} option={option} onPick={pick} />
      <p className="font-body text-cream/50 text-[11px] mt-2 px-1">Tap a landmark on the map, or pick one below.</p>
      <div className="flex justify-between items-baseline mt-2 mb-3 px-1 font-body">
        <span className="text-cream/60 text-xs">Fastest {FASTEST_MIN} min</span>
        <span className={`text-sm font-semibold ${mode === "scenic" ? "text-amber" : "text-cream/40"}`}>
          Scenic {FASTEST_MIN + sel.extra} min (+{sel.extra})
        </span>
      </div>
      <div className="space-y-2">
        {OPTIONS.map((o) => {
          const on = o.key === option && mode === "scenic";
          return (
            <button
              type="button"
              key={o.key}
              onClick={() => pick(o.key)}
              className={`w-full text-left flex items-center justify-between px-3 py-2 rounded-lg border transition-colors ${on ? "bg-amber/15 border-amber/50" : "bg-white/5 border-white/5 hover:bg-white/10"}`}
            >
              <div>
                <p className={`text-[11px] font-body font-semibold ${on ? "text-amber" : "text-cream/50"}`}>{o.label}</p>
                <p className={`text-sm font-body ${on ? "text-cream" : "text-cream/70"}`}>{o.place}</p>
              </div>
              <span className={`shrink-0 ml-2 text-xs font-body font-semibold px-2 py-0.5 rounded-md ${on ? "bg-amber text-ink" : "bg-white/10 text-cream/50"}`}>+{o.extra} min</span>
            </button>
          );
        })}
      </div>
      <button
        type="button"
        onClick={() => setMode("scenic")}
        className="mt-3 w-full bg-amber text-ink text-sm font-body font-semibold rounded-md py-2.5 hover:bg-amber/90 transition-colors"
      >
        Preview scenic route
      </button>
      <p className="text-center text-[10px] font-body text-cream/40 mt-2">Illustrative times. Ride booking isn&apos;t available in WindowSeat.</p>
    </div>
  );
}

// ── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  const leftRef = useFadeUp();
  const rightRef = useFadeUp();
  return (
    <section className="pt-24 pb-16 md:pt-32 md:pb-24 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div ref={leftRef} className={FADE}>
            <h1 className="font-display tracking-tight text-[2.6rem] sm:text-5xl md:text-[3.4rem] xl:text-6xl font-black text-ink leading-[1.05] mb-5">
              <span className="block">No time for a tour?</span>
              <span className="block text-orange">Take the scenic&nbsp;route.</span>
            </h1>
            <p className="font-body text-muted text-lg md:text-xl leading-relaxed mb-5 max-w-lg">
              Turn the ride or walk you&apos;re already taking into a chance to discover something new. Scenic routes, memorable landmarks and local stories, all on your way.
            </p>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 max-w-lg">
              <div className="bg-white/70 border border-ink/10 rounded-md px-4 py-3">
                <dt className="font-display text-ink font-extrabold">Destination</dt>
                <dd className="font-body text-muted text-sm">Riding to a meeting? Take the scenic way there.</dd>
              </div>
              <div className="bg-white/70 border border-ink/10 rounded-md px-4 py-3">
                <dt className="font-display text-ink font-extrabold">Loop</dt>
                <dd className="font-body text-muted text-sm">Got an hour? See the neighborhood and end up back where you started.</dd>
              </div>
            </dl>
            <p className="font-body text-ink text-sm mb-8 max-w-lg border-l-4 border-amber pl-3">
              <span className="font-semibold">Free during early access.</span> On a ride, any extra minutes are charged by your ride provider.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#cta" className="bg-amber text-ink font-body font-semibold px-7 py-4 rounded-md text-center hover:bg-amber/90 transition-colors shadow-lg shadow-ink/15">
                Get New York early access
              </a>
              <a href="#partners" className="border-2 border-ink text-ink font-body font-semibold px-7 py-4 rounded-md text-center hover:bg-ink hover:text-cream transition-colors">
                Partner with us
              </a>
            </div>
          </div>
          <div ref={rightRef} className={`${FADE} flex justify-center lg:justify-end`}>
            <div className="w-full max-w-sm">
              <Preview />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Ticker ────────────────────────────────────────────────────────────────────
const LANDMARKS = [
  "Brooklyn Bridge", "Eiffel Tower", "Tower Bridge", "Flatiron Building",
  "Arc de Triomphe", "Big Ben", "Statue of Liberty", "Pont Alexandre III",
  "St Paul's Cathedral", "Central Park South",
];

function Ticker() {
  const doubled = [...LANDMARKS, ...LANDMARKS];
  return (
    <div className="bg-amber overflow-hidden py-3">
      <div className="flex gap-12 whitespace-nowrap" style={{ animation: "ticker 30s linear infinite" }}>
        {doubled.map((name, i) => (
          <span key={i} className="flex items-center gap-3 text-ink font-body font-bold uppercase tracking-wider text-xs shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-ink/50 inline-block" />
            {name}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── How it works ─────────────────────────────────────────────────────────────
const QUEUE = [
  { place: "City Hall Park", secs: 20, state: "done" },
  { place: "Onto the bridge walkway", secs: 30, state: "done" },
  { place: "The bridge towers", secs: 75, state: "playing" },
  { place: "DUMBO's Washington Street", secs: 60, state: "next" },
  { place: "Back over the bridge", secs: 45, state: "next" },
];

function fmt(secs: number) {
  const m = Math.floor(secs / 60), s = secs % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

const STEPS = [
  { n: "1", title: "Choose Loop or Destination", desc: "Loop brings you back to where you started. Destination takes you somewhere, the scenic way." },
  { n: "2", title: "Set your time", desc: "Tell us how long you have, or how many extra minutes to add. Your route appears with landmarks marked." },
  { n: "3", title: "Head out and listen", desc: "Short stories play as you go. Pause or skip anytime." },
];

function HowItWorks() {
  const leftRef = useFadeUp();
  const rightRef = useFadeUp();
  return (
    <section id="how-it-works" className="py-20 md:py-28 bg-ink">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div ref={leftRef} className={FADE}>
            <Eyebrow dark>How it works</Eyebrow>
            <h2 className="font-display tracking-tight text-4xl md:text-5xl font-black text-cream mb-10">Start with a trip you&apos;re already taking</h2>
            <ol className="space-y-7">
              {STEPS.map((s) => (
                <li key={s.n} className="flex gap-5">
                  <span className="w-10 h-10 shrink-0 rounded-md bg-amber text-ink font-display font-black text-lg flex items-center justify-center">{s.n}</span>
                  <div>
                    <h3 className="font-display text-cream text-xl font-bold mb-1">{s.title}</h3>
                    <p className="font-body text-cream/65 leading-relaxed">{s.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div ref={rightRef} className={`${FADE} flex justify-center lg:justify-end`}>
            <div className="w-full max-w-sm bg-[#0B1B33] rounded-xl p-5 border border-white/10">
              <div className="flex items-center justify-between mb-1">
                <span className="font-body text-cream text-sm font-semibold"><span className="text-amber">Loop</span> · City Hall and back</span>
                <span className="font-body text-[10px] text-cream/70 bg-white/10 rounded-md px-2 py-0.5 font-semibold uppercase tracking-wider">Simulated</span>
              </div>
              <p className="font-body text-cream/50 text-xs mb-4">On foot · 60 minutes</p>
              <ol className="space-y-2">
                {QUEUE.map((c) => (
                  <li key={c.place} className={`flex items-center justify-between rounded-lg px-3 py-2.5 border ${c.state === "playing" ? "bg-amber/15 border-amber/50" : "bg-white/5 border-white/5"}`}>
                    <div className="flex items-center gap-3">
                      <span className={`w-5 text-center text-xs ${c.state === "playing" ? "text-amber" : "text-cream/40"}`}>
                        {c.state === "done" ? "✓" : c.state === "playing" ? "▶" : "•"}
                      </span>
                      <p className={`font-body text-sm ${c.state === "done" ? "text-cream/50 line-through" : "text-cream"}`}>{c.place}</p>
                    </div>
                    <span className="font-body text-xs text-cream/50">{fmt(c.secs)}</span>
                  </li>
                ))}
              </ol>
              <div className="mt-4 grid grid-cols-2 gap-2 border-t border-white/10 pt-4">
                {["Pause", "Skip"].map((b) => (
                  <span key={b} className="font-body text-xs text-center text-cream bg-white/10 rounded-md py-2">{b}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Benefits ──────────────────────────────────────────────────────────────────
const BENEFITS = [
  { title: "See more in the time you have", desc: "Five extra minutes can mean a bridge, a skyline or a street you'd never find on your own." },
  { title: "Stories worth hearing", desc: "Short, sourced and fact-checked. No filler." },
  { title: "Never a forced detour", desc: "You choose how much extra time to spend. The fastest route is always one tap away." },
];

function Benefits() {
  const ref = useFadeUp();
  return (
    <section id="benefits" className="py-20 md:py-24 bg-cream">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref} className={FADE}>
          <h2 className="font-display tracking-tight text-4xl md:text-5xl font-black text-ink mb-10">Why take the scenic route</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {BENEFITS.map((b) => (
              <div key={b.title} className="border-t-4 border-amber pt-4">
                <h3 className="font-display text-xl font-extrabold text-ink mb-2">{b.title}</h3>
                <p className="font-body text-muted leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Partners ──────────────────────────────────────────────────────────────────
function Partners() {
  const ref = useFadeUp();
  return (
    <section id="partners" className="py-16 md:py-20 bg-cream border-t border-ink/10">
      <div ref={ref} className={`${FADE} max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center`}>
        <h2 className="font-display tracking-tight text-3xl md:text-4xl font-black text-ink mb-3">Want to partner with us?</h2>
        <p className="font-body text-muted text-lg mb-6">We&apos;re exploring partnerships across travel, tourism and transportation. Tell us what you have in mind.</p>
        <a
          href="#cta"
          onClick={() => window.dispatchEvent(new Event("ws:partner"))}
          className="inline-block bg-ink text-cream font-body font-semibold px-6 py-3 rounded-md hover:bg-ink/90 transition-colors"
        >
          Get in touch
        </a>
      </div>
    </section>
  );
}

// ── CTA / Waitlist ─────────────────────────────────────────────────────────────
type Role = "rider" | "partner";

function CTASection() {
  const ref = useFadeUp();
  const [role, setRole] = useState<Role>("rider");
  useEffect(() => {
    const onPartner = () => setRole("partner");
    window.addEventListener("ws:partner", onPartner);
    return () => window.removeEventListener("ws:partner", onPartner);
  }, []);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [org, setOrg] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, role, org: role === "partner" ? org : undefined, ref: getRef() }),
      });
      const data = await res.json();
      if (res.ok) {
        track("signup_submitted", { role });
        setStatus("success");
        setMessage(data.message ?? "You're on the list!");
        setName("");
        setEmail("");
        setOrg("");
      } else {
        setStatus("error");
        setMessage(data.error ?? "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  const input = "w-full px-5 py-4 rounded-md bg-cream text-ink font-body placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-ink/40";

  return (
    <section id="cta" className="py-24 md:py-32 bg-amber">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div ref={ref} className={FADE}>
          <h2 className="font-display tracking-tight text-[2.4rem] sm:text-5xl md:text-6xl font-black text-ink leading-[1.1] mb-5">
            <span className="block">48 hours in town?</span><span className="block"><span className="underline decoration-ink decoration-[5px] underline-offset-[10px]">Don&apos;t waste the ride.</span></span>
          </h2>
          <p className="font-body text-ink/80 text-lg mb-8">
            We&apos;re starting with walking routes in New York, then bringing scenic routes to your rides. Get early access.
          </p>
          {status === "success" ? (
            <div className="bg-ink/10 border border-ink/20 rounded-xl p-8">
              <div className="text-4xl mb-3">🎉</div>
              <p className="font-display tracking-tight text-2xl font-bold text-ink mb-1">{message}</p>
              <p className="font-body text-ink/80 text-sm">We&apos;ll be in touch soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md mx-auto">
              <div className="grid grid-cols-2 bg-ink/10 rounded-md p-1" role="radiogroup" aria-label="I am a">
                {(["rider", "partner"] as Role[]).map((r) => (
                  <button
                    key={r}
                    type="button"
                    role="radio"
                    aria-checked={role === r}
                    onClick={() => setRole(r)}
                    className={`py-2.5 rounded-md font-body text-sm font-semibold transition-colors ${role === r ? "bg-ink text-cream" : "text-ink/80"}`}
                  >
                    {r === "rider" ? "I'm a traveler" : "I'm a partner"}
                  </button>
                ))}
              </div>
              <input type="text" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} required className={input} />
              <input type="email" placeholder="Your email" value={email} onChange={(e) => setEmail(e.target.value)} required className={input} />
              {role === "partner" && (
                <input type="text" placeholder="Company or organization" value={org} onChange={(e) => setOrg(e.target.value)} required className={input} />
              )}
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full px-7 py-4 rounded-md bg-ink text-cream font-body font-semibold text-base hover:bg-ink/90 transition-colors disabled:opacity-60"
              >
                {status === "loading" ? "Sending…" : role === "rider" ? "Get early access →" : "Get in touch →"}
              </button>
              {status === "error" && (
                <p className="font-body text-ink text-sm bg-ink/10 rounded-xl px-4 py-2">{message}</p>
              )}
              <p className="font-body text-ink/70 text-xs">We&apos;ll only use your email to contact you about WindowSeat.</p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="bg-ink py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <Logo />
        <p className="font-body text-cream/40 text-xs text-center sm:text-right max-w-md">
          © {new Date().getFullYear()} WindowSeat. WindowSeat is a concept in development. Routes, times and stories shown are simulated examples. WindowSeat isn&apos;t affiliated with or endorsed by Uber, Lyft, Google or any ride or map provider.
        </p>
      </div>
    </footer>
  );
}

// ── Root ──────────────────────────────────────────────────────────────────────
export default function Home() {
  useEffect(() => {
    track("landing_viewed", { path: window.location.pathname });
  }, []);
  return (
    <main>
      <Nav />
      <Hero />
      <Ticker />
      <HowItWorks />
      <Benefits />
      <CTASection />
      <Partners />
      <Footer />
    </main>
  );
}
