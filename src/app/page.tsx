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
    { href: "#how-it-works", label: "How It Works" },
    { href: "#scenic-route", label: "The Reroute" },
    { href: "#anywhere", label: "Walk & Bike" },
    { href: "#sponsors", label: "For Sponsors" },
    { href: "#platforms", label: "For Platforms" },
    { href: "#live", label: "Live Guide" },
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
              Ride Curious
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
              Ride Curious
            </a>
          </div>
        )}
      </div>
    </nav>
  );
}

// ── In-app Scenic Route card (what a rider sees inside the rideshare app) ────
const OPTIONS = [
  { label: "The Icon", place: "Brooklyn Bridge", time: "+12 min", price: "+$8.40", sponsored: false },
  { label: "The Hidden Gem", place: "DUMBO's Washington St", time: "+9 min", price: "Free", sponsored: true },
  { label: "The View", place: "Queensboro skyline approach", time: "+4 min", price: "+$2.90", sponsored: false },
];

function PickerCard() {
  const [active, setActive] = useState(0);
  return (
    <div className="bg-[#0B1B33] rounded-xl overflow-hidden border border-white/5">
      <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
        <div>
          <p className="text-amber text-xs font-body font-semibold uppercase tracking-widest">Add a Scenic Route?</p>
          <p className="text-cream/50 text-xs font-body mt-0.5">JFK → Midtown · priced before you go</p>
        </div>
        <span className="text-[10px] font-body text-cream/40 border border-white/10 rounded-md px-2 py-0.5">by WindowSeat</span>
      </div>
      <div className="p-3 space-y-2">
        {OPTIONS.map((opt, i) => {
          const on = i === active;
          return (
            <button
              type="button"
              key={opt.label}
              onClick={() => setActive(i)}
              className={`w-full text-left flex items-center justify-between p-3 rounded-xl border transition-colors ${on ? "bg-amber/15 border-amber/50" : "bg-white/5 border-white/5 hover:bg-white/10"}`}
            >
              <div>
                <p className={`text-xs font-body font-semibold ${on ? "text-amber" : "text-cream/50"}`}>{opt.label}</p>
                <p className={`text-sm font-body mt-0.5 ${on ? "text-cream" : "text-cream/60"}`}>{opt.place}</p>
                {opt.sponsored && <p className="text-[10px] font-body text-amber/80 mt-0.5">Sponsored detour · ride covered</p>}
              </div>
              <div className="text-right shrink-0 ml-3">
                <span className={`block text-xs font-body font-semibold px-2.5 py-1 rounded-md ${on ? "bg-amber text-ink" : "bg-white/10 text-cream/40"}`}>{opt.time}</span>
                <span className={`block text-xs font-body mt-1 ${opt.sponsored ? "text-amber" : on ? "text-cream" : "text-cream/40"}`}>{opt.price}</span>
              </div>
            </button>
          );
        })}
      </div>
      <div className="px-3 pb-3">
        <div className="w-full bg-amber text-ink text-sm font-body font-semibold rounded-xl py-2.5 text-center">
          Add to my ride
        </div>
        <p className="text-center text-[10px] font-body text-cream/30 mt-2">Illustrative pricing</p>
      </div>
    </div>
  );
}

function AudioBar() {
  return (
    <div className="bg-[#0B1B33] rounded-xl p-4 border border-white/5 mt-4">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-8 rounded-full bg-amber flex items-center justify-center text-sm text-cream">▶</div>
        <div>
          <p className="text-cream text-sm font-body font-semibold">Look left in 20 seconds</p>
          <p className="text-cream/50 text-xs font-body">Brooklyn Bridge — the 14-year build</p>
        </div>
        <div className="ml-auto flex items-end gap-0.5 h-4">
          <span className="dot1 w-1 h-3 bg-amber rounded-full inline-block" />
          <span className="dot2 w-1 h-4 bg-amber rounded-full inline-block" />
          <span className="dot3 w-1 h-2 bg-amber rounded-full inline-block" />
        </div>
      </div>
      <div className="bg-white/10 rounded-full h-1.5 w-full">
        <div className="bg-amber h-1.5 rounded-full w-2/5" />
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-cream/40 text-xs font-body">0:38</span>
        <span className="text-cream/40 text-xs font-body">1:30</span>
      </div>
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div ref={leftRef} className={FADE}>
            <span className="inline-block bg-amber/20 text-ink text-xs font-body font-semibold px-3 py-1 rounded-md uppercase tracking-widest mb-6">
              Scenic Route · walk, bike or ride
            </span>
            <h1 className="font-display tracking-tight text-5xl md:text-6xl lg:text-7xl font-black text-ink leading-[1.05] text-balance mb-6">
              Take the long way.{" "}
              <span className="text-orange">On purpose.</span>
            </h1>
            <p className="font-body text-muted text-lg md:text-xl leading-relaxed mb-8 max-w-md">
              WindowSeat bends your walk, bike ride or rideshare past the landmarks worth seeing. A few minutes longer, often free thanks to a local sponsor, and narrated as you pass.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#cta" className="bg-amber text-ink font-body font-semibold px-7 py-4 rounded-md text-center hover:bg-amber/90 transition-colors shadow-lg shadow-ink/15">
                Join the rider waitlist
              </a>
              <a href="#sponsors" className="border-2 border-ink text-ink font-body font-semibold px-7 py-4 rounded-md text-center hover:bg-ink hover:text-cream transition-colors">
                For tourism boards →
              </a>
            </div>
          </div>

          <div ref={rightRef} className={`${FADE} flex justify-center lg:justify-end`}>
            <div className="w-full max-w-sm">
              <div className="bg-ink rounded-xl p-5 shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-cream text-sm font-body font-semibold">Your ride · arriving in 3 min</span>
                  <span className="text-cream/40 text-xs font-body">Toyota Camry</span>
                </div>
                <div className="relative h-36 rounded-xl overflow-hidden mb-4 bg-[#1a2535]">
                  <svg className="absolute inset-0 opacity-25" width="100%" height="100%">
                    <defs>
                      <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#4a7fcb" strokeWidth="0.5" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                  </svg>
                  <svg className="absolute inset-0" viewBox="0 0 300 144" preserveAspectRatio="none" width="100%" height="100%">
                    {/* fastest route */}
                    <path d="M 20 125 L 140 100 L 280 40" fill="none" stroke="#FAF3E0" strokeOpacity="0.35" strokeWidth="2.5" />
                    {/* scenic route */}
                    <path d="M 20 125 Q 70 70 130 60 Q 190 50 210 20 Q 240 10 280 40" fill="none" stroke="#FFC72C" strokeWidth="2.5" strokeDasharray="6 3" />
                    <circle cx="20" cy="125" r="5" fill="#E4572E" />
                    <circle cx="130" cy="60" r="5" fill="#FFC72C" />
                    <circle cx="280" cy="40" r="5" fill="#FAF3E0" />
                  </svg>
                  <div className="absolute bottom-2 left-2 flex gap-2 text-[10px] font-body">
                    <span className="bg-black/40 text-cream/70 px-2 py-0.5 rounded-md">— fastest</span>
                    <span className="bg-black/40 text-amber px-2 py-0.5 rounded-md">- - scenic</span>
                  </div>
                </div>
                <PickerCard />
              </div>
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

// ── How It Works (rider flow inside the ride app) ─────────────────────────────
const HOW_STEPS = [
  { emoji: "📍", step: "01", title: "Book like normal", desc: "Request your ride to the hotel, the airport, dinner. Nothing about booking changes." },
  { emoji: "🗺️", step: "02", title: "See your Scenic Route", desc: "A card in the ride app offers three detours, each showing the exact minutes and price it adds. Some are free because a sponsor covers them." },
  { emoji: "🚗", step: "03", title: "Your driver gets one waypoint", desc: "It shows up in their navigation like a multi-stop trip. No stopping or parking, and they're paid for the extra time and distance." },
  { emoji: "🎧", step: "04", title: "Look out your window", desc: "Narration starts as you approach and tells you which side to look. You arrive knowing the city a little better." },
];

function StepCard({ step }: { step: (typeof HOW_STEPS)[0] }) {
  const ref = useFadeUp();
  return (
    <div ref={ref} className={`${FADE} bg-cream border border-ink/10 rounded-xl p-6 hover:shadow-lg`}>
      <div className="text-4xl mb-4">{step.emoji}</div>
      <div className="font-body text-orange text-xs font-bold uppercase tracking-widest mb-2">Step {step.step}</div>
      <h3 className="font-display tracking-tight text-xl font-bold text-ink mb-3">{step.title}</h3>
      <p className="font-body text-muted text-sm leading-relaxed">{step.desc}</p>
    </div>
  );
}

function HowItWorks() {
  const headRef = useFadeUp();
  return (
    <section id="how-it-works" className="py-20 md:py-28 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={headRef} className={`${FADE} text-center mb-14 max-w-2xl mx-auto`}>
          <Eyebrow>How It Works</Eyebrow>
          <h2 className="font-display tracking-tight text-4xl md:text-5xl font-black text-ink mb-4">Inside the app you already use</h2>
          <p className="font-body text-muted text-lg">No new app to download mid-trip. Scenic Route shows up inside the ride you&apos;re already taking.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {HOW_STEPS.map((s) => <StepCard key={s.step} step={s} />)}
        </div>
      </div>
    </section>
  );
}

// ── The Reroute engine ────────────────────────────────────────────────────────
const RULES = [
  { icon: "⏱️", title: "A hard time budget", desc: "Riders choose up to 5, 10 or 15 extra minutes. If traffic would push a detour past that, it's quietly dropped." },
  { icon: "🧭", title: "Only what's on the way", desc: "We only look at landmarks close to your original route, ranked by how good they look from a car, not just how famous they are." },
  { icon: "👀", title: "Your side of the car", desc: "Where the streets allow, we approach so the landmark passes on your window side, and the audio tells you when to look." },
  { icon: "🔒", title: "Set at pickup", desc: "The route is locked when the ride starts, so drivers never get surprise turns. If you're running late, one tap switches back to the fastest route." },
  { icon: "🛡️", title: "Approved streets only", desc: "Detours use drive-by corridors we check in advance. No residential cut-throughs, no event closures, and never a request to stop." },
  { icon: "🤖", title: "Ready for robotaxis", desc: "A waypoint is a waypoint. The same detour works for autonomous rides, where there's no driver to explain it to." },
];

function RerouteSection() {
  const leftRef = useFadeUp();
  const rightRef = useFadeUp();
  return (
    <section id="scenic-route" className="py-20 md:py-28 bg-ink">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 items-start">
          <div ref={leftRef} className={`${FADE} lg:col-span-3`}>
            <Eyebrow dark>The Reroute</Eyebrow>
            <h2 className="font-display tracking-tight text-4xl md:text-5xl font-black text-cream mb-4">Loosely on the way, never out of the way</h2>
            <p className="font-display tracking-tight text-xl font-semibold text-amber mb-8 leading-snug">&ldquo;You were going from A to B anyway. We just made it worth the ride.&rdquo;</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {RULES.map((r) => (
                <div key={r.title} className="bg-white/5 rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xl">{r.icon}</span>
                    <span className="font-body text-cream text-sm font-semibold">{r.title}</span>
                  </div>
                  <p className="font-body text-cream/60 text-sm leading-relaxed">{r.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div ref={rightRef} className={`${FADE} lg:col-span-2 flex justify-center lg:justify-end lg:sticky lg:top-24`}>
            <div className="w-full max-w-xs">
              <PickerCard />
              <AudioBar />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Anywhere mode (standalone, no plug-in needed) ─────────────────────────────
const MODES = [
  { emoji: "🚶", title: "Walk", desc: "A 20-minute walk becomes 26, past the block everyone else skips. No fare, no driver, just a better walk." },
  { emoji: "🚲", title: "Bike", desc: "Bike-friendly detours along waterfronts and greenways, with short stories timed to your pace." },
  { emoji: "🚗", title: "Drive", desc: "Driving yourself or a road trip? We add the landmark as a stop and you navigate as usual." },
];

function Anywhere() {
  const headRef = useFadeUp();
  const flowRef = useFadeUp();
  return (
    <section id="anywhere" className="py-20 md:py-28 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div ref={headRef} className={FADE}>
            <Eyebrow>Scenic Route Anywhere</Eyebrow>
            <h2 className="font-display tracking-tight text-4xl md:text-5xl font-black text-ink mb-4">Not in a rideshare? Take the long way anyway.</h2>
            <p className="font-body text-muted text-lg mb-8">
              The WindowSeat app works on its own today. Pick a destination, choose a detour, and we open the route in the maps app you already use with the landmark added as a stop. The stories play from WindowSeat.
            </p>
            <div className="space-y-4">
              {MODES.map((m) => (
                <div key={m.title} className="flex gap-4 items-start">
                  <span className="text-2xl w-10 h-10 rounded-full bg-ink/5 flex items-center justify-center shrink-0">{m.emoji}</span>
                  <div>
                    <h3 className="font-display tracking-tight text-lg font-bold text-ink">{m.title}</h3>
                    <p className="font-body text-muted text-sm leading-relaxed">{m.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div ref={flowRef} className={`${FADE} bg-ink rounded-xl p-6 md:p-8`}>
            <p className="font-body text-amber text-xs font-semibold uppercase tracking-widest mb-5">How it works without a partner</p>
            <ol className="space-y-5">
              {[
                ["Where to?", "Enter where you're headed, or let us read it from your calendar or hotel booking."],
                ["Pick your detour", "The same three choices: The Icon, The Hidden Gem, The View, each with the minutes it adds."],
                ["Open in your maps app", "One tap opens Google Maps or Apple Maps with the stop already added."],
                ["Listen as you pass", "Stories start when you get close, whether you're walking, biking or driving."],
              ].map(([t, d], i) => (
                <li key={t} className="flex gap-4">
                  <span className="font-display tracking-tight text-2xl font-black text-amber w-6 shrink-0">{i + 1}</span>
                  <div>
                    <p className="font-body text-cream font-semibold">{t}</p>
                    <p className="font-body text-cream/60 text-sm leading-relaxed">{d}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="mt-6 pt-5 border-t border-white/10">
              <p className="font-body text-cream/70 text-sm leading-relaxed">
                <span className="text-amber font-semibold">Why it matters: </span>
                every detour someone takes on foot or by bike shows that people will take the long way, and that&apos;s the case we bring to ride platforms.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── WindowSeat Live (pre-made clips stitched by geofence) ─────────────────────
const LIVE_QUEUE = [
  { place: "Palace of Fine Arts", layer: "Story", secs: 75, state: "done" },
  { place: "The weeping figures", layer: "Glance", secs: 20, state: "playing" },
  { place: "Walk along the lagoon", layer: "Bridge", secs: 30, state: "next" },
  { place: "Crissy Field airfield", layer: "Story", secs: 60, state: "next" },
  { place: "Golden Gate Bridge", layer: "Deep dive", secs: 150, state: "next" },
];

const LIVE_FEATURES = [
  { icon: "⏱️", title: "Fits your time", desc: "Every stop has a 15-second, 1-minute and 3-minute version. Say you have six minutes and it picks the mix that fits." },
  { icon: "📍", title: "Plays where you are", desc: "Clips start as you reach each spot, and tell you to look left or right depending on which way you're coming from." },
  { icon: "👆", title: "Go deeper or skip", desc: "Tap or say \"go deeper\", \"skip\" or \"what's that?\" and it plays the matching clip for what's in front of you." },
  { icon: "📶", title: "Works offline", desc: "A whole neighborhood downloads before you go, so it works with no signal and no data." },
];

function fmt(secs: number) {
  const m = Math.floor(secs / 60), s = secs % 60;
  return m ? `${m}:${String(s).padStart(2, "0")}` : `0:${String(s).padStart(2, "0")}`;
}

function Live() {
  const leftRef = useFadeUp();
  const rightRef = useFadeUp();
  const total = LIVE_QUEUE.reduce((a, c) => a + c.secs, 0);
  return (
    <section id="live" className="py-20 md:py-28 bg-ink">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div ref={leftRef} className={FADE}>
            <Eyebrow dark>Upgrade · WindowSeat Live</Eyebrow>
            <h2 className="font-display tracking-tight text-4xl md:text-5xl font-black text-cream mb-4">A guide that keeps pace with you</h2>
            <p className="font-body text-cream/70 text-lg mb-8">
              Tell it how long you have and where you&apos;re going. Live builds a tour from short, fact-checked audio clips and plays each one as you reach it, so the history, the details and the route all fit your walk.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {LIVE_FEATURES.map((f) => (
                <div key={f.title} className="bg-white/5 rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xl">{f.icon}</span>
                    <span className="font-body text-cream text-sm font-semibold">{f.title}</span>
                  </div>
                  <p className="font-body text-cream/60 text-sm leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4 max-w-md">
              <div className="border border-white/15 rounded-xl p-4">
                <p className="font-body text-cream/50 text-xs uppercase tracking-widest mb-1">Free</p>
                <p className="font-display text-cream text-lg font-bold">Story detours</p>
                <p className="font-body text-cream/60 text-xs mt-1">One story per stop on every Scenic Route.</p>
              </div>
              <div className="border-2 border-amber rounded-xl p-4">
                <p className="font-body text-amber text-xs uppercase tracking-widest mb-1">Live</p>
                <p className="font-display text-cream text-lg font-bold">$2.99 a day</p>
                <p className="font-body text-cream/60 text-xs mt-1">or $6.99 for a week. Sometimes free, courtesy of a sponsor.</p>
              </div>
            </div>
          </div>
          <div ref={rightRef} className={`${FADE} flex justify-center lg:justify-end`}>
            <div className="w-full max-w-sm bg-[#0B1B33] rounded-xl p-5 border border-white/10">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber inline-block" />
                  <span className="font-body text-cream text-sm font-semibold">Live · San Francisco</span>
                </div>
                <span className="font-body text-xs text-ink bg-amber rounded-md px-2 py-0.5 font-semibold">6 min</span>
              </div>
              <p className="font-body text-cream/50 text-xs mb-4">Palace of Fine Arts → Golden Gate Bridge</p>
              <ol className="space-y-2">
                {LIVE_QUEUE.map((c) => (
                  <li key={c.place} className={`flex items-center justify-between rounded-lg px-3 py-2.5 border ${c.state === "playing" ? "bg-amber/15 border-amber/50" : "bg-white/5 border-white/5"}`}>
                    <div className="flex items-center gap-3">
                      <span className={`w-5 text-center text-xs ${c.state === "playing" ? "text-amber" : c.state === "done" ? "text-cream/40" : "text-cream/30"}`}>
                        {c.state === "done" ? "✓" : c.state === "playing" ? "▶" : "•"}
                      </span>
                      <div>
                        <p className={`font-body text-sm ${c.state === "done" ? "text-cream/50 line-through" : "text-cream"}`}>{c.place}</p>
                        <p className="font-body text-[11px] text-cream/40">{c.layer}</p>
                      </div>
                    </div>
                    <span className="font-body text-xs text-cream/50">{fmt(c.secs)}</span>
                  </li>
                ))}
              </ol>
              <p className="font-body text-[11px] text-cream/40 mt-3 text-right">{fmt(total)} of audio planned for your walk</p>
              <div className="mt-4 grid grid-cols-3 gap-2 border-t border-white/10 pt-4">
                {["Go deeper", "What's that?", "Skip"].map((b) => (
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

// ── For Tourism Boards & Sponsors ─────────────────────────────────────────────
const SPONSOR_POINTS = [
  { stat: "Per detour", title: "Pay only for visits that happen", desc: "You're billed for each completed detour, not for impressions. If nobody takes the long way, you don't pay." },
  { stat: "Hidden Gem", title: "Send visitors where you want them", desc: "Steer travelers toward neighborhoods, museums and streets they'd otherwise skip, in a few minutes of their trip." },
  { stat: "Monthly report", title: "See exactly who went where", desc: "Detours taken, stories finished, times of day and routes, all anonymized and ready for your board." },
];

function Sponsors() {
  const headRef = useFadeUp();
  return (
    <section id="sponsors" className="py-20 md:py-28 bg-amber/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={headRef} className={`${FADE} max-w-2xl mb-12`}>
          <Eyebrow>For Tourism Boards &amp; Sponsors</Eyebrow>
          <h2 className="font-display tracking-tight text-4xl md:text-5xl font-black text-ink mb-4">Put your city&apos;s best block on the route</h2>
          <p className="font-body text-muted text-lg">
            Sponsor a Scenic Route and the detour is free for the traveler, whether they&apos;re walking, biking or in a ride. You get visitors past the places that matter to you, and proof that they went.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {SPONSOR_POINTS.map((p) => (
            <div key={p.title} className="bg-cream rounded-xl p-6 border border-ink/10">
              <span className="text-orange text-xs font-body font-bold uppercase tracking-widest">{p.stat}</span>
              <h3 className="font-display tracking-tight text-xl font-bold text-ink mt-2 mb-2">{p.title}</h3>
              <p className="font-body text-muted text-sm leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <a href="#cta" className="bg-ink text-cream font-body font-semibold px-7 py-4 rounded-md hover:bg-ink/90 transition-colors">
            Start a New York pilot →
          </a>
          <p className="font-body text-muted text-sm">Now booking 3-month pilots with tourism offices, museums and hotels.</p>
        </div>
      </div>
    </section>
  );
}

// ── For Platforms ─────────────────────────────────────────────────────────────
const PLATFORM_POINTS = [
  { title: "Bigger fares on rides that already happen", desc: "Every accepted detour adds paid minutes and miles at your normal rates. Drivers earn more on the same trip." },
  { title: "A new kind of in-ride ad", desc: "Tourism boards, museums and hotels can sponsor the ride past their landmark. It's an ad riders choose, and it fits alongside the in-trip ads you already sell." },
  { title: "A reason for visitors to pick you", desc: "Airport and hotel rides are where visitors choose between your app and the taxi line. Scenic Route gives them a reason to choose you." },
  { title: "Nothing to build", desc: "One API call returns ranked detours with waypoints, extra time and distance, and the narration. You keep pricing, payments and the driver app." },
];

function Platforms() {
  const headRef = useFadeUp();
  const codeRef = useFadeUp();
  return (
    <section id="platforms" className="py-20 md:py-28 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={headRef} className={`${FADE} max-w-2xl mb-14`}>
          <Eyebrow>For Platforms</Eyebrow>
          <h2 className="font-display tracking-tight text-4xl md:text-5xl font-black text-ink mb-4">A plug-in, not a new app</h2>
          <p className="font-body text-muted text-lg">
            Your app already shows riders what&apos;s around them. WindowSeat takes the next step and routes them past it, as an SDK built for rideshare apps.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {PLATFORM_POINTS.map((p) => (
              <div key={p.title} className="border border-ink/10 rounded-xl p-5 bg-white/40">
                <h3 className="font-display tracking-tight text-lg font-bold text-ink mb-2">{p.title}</h3>
                <p className="font-body text-muted text-sm leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
          <div ref={codeRef} className={`${FADE} bg-ink rounded-xl p-5 overflow-x-auto`}>
            <p className="font-body text-amber text-xs font-semibold uppercase tracking-widest mb-3">One call at booking</p>
            <pre className="text-[12px] leading-relaxed text-cream/80 font-mono whitespace-pre">
{`POST /v1/scenic-routes
{
  "pickup":  [40.6413, -73.7781],
  "dropoff": [40.7549, -73.9840],
  "max_extra_minutes": 15,
  "rider_side": "left"
}

→ 200 OK
{
  "options": [
    {
      "type": "icon",
      "landmark": "Brooklyn Bridge",
      "waypoints": [[40.7061, -73.9969]],
      "extra_minutes": 12,
      "extra_miles": 3.1,
      "sponsored": false,
      "story_id": "nyc-bkb-001"
    },
    { "type": "hidden_gem", "sponsored": true, ... },
    { "type": "view", ... }
  ]
}`}
            </pre>
            <p className="font-body text-cream/40 text-xs mt-3">You price it, show it, and send the waypoint to the driver. We handle routes, landmarks and stories.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Business model ────────────────────────────────────────────────────────────
const PAYERS = [
  { tag: "Rider pays", title: "Rider upgrade", desc: "The rider pays the extra time and distance at the platform's usual rates. WindowSeat earns a small fee per completed detour from the platform." },
  { tag: "Sponsor pays", title: "Sponsored detours", desc: "A tourism board, museum, hotel or brand covers the ride past its landmark and pays a premium on top. The platform and WindowSeat share it." },
  { tag: "Partner pays", title: "Licensing & insight", desc: "A per-city license for routes and narration, plus anonymized reports for tourism boards on which landmarks riders choose, and when." },
  { tag: "You pay (optional)", title: "WindowSeat Live", desc: "Story detours are free. The full guide that fits your time and route is $2.99 a day or $6.99 a week, and sponsors can make it free for a weekend." },
];

const SPLIT = [
  { label: "Covers the rider's extra fare (driver paid in full)", amt: "$6.00", w: "w-[60%]", c: "bg-orange" },
  { label: "Platform share", amt: "$2.00", w: "w-[20%]", c: "bg-amber" },
  { label: "WindowSeat", amt: "$2.00", w: "w-[20%]", c: "bg-cream" },
];

function BusinessModel() {
  const headRef = useFadeUp();
  const splitRef = useFadeUp();
  return (
    <section id="model" className="py-20 md:py-28 bg-ink">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={headRef} className={`${FADE} text-center mb-14 max-w-2xl mx-auto`}>
          <Eyebrow dark>The Model</Eyebrow>
          <h2 className="font-display tracking-tight text-4xl md:text-5xl font-black text-cream">Who pays for the long way</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {PAYERS.map((p) => (
            <div key={p.title} className="bg-white/5 rounded-xl p-6 border border-white/5">
              <span className="text-amber text-xs font-body font-bold uppercase tracking-widest">{p.tag}</span>
              <h3 className="font-display tracking-tight text-2xl font-bold text-cream mt-2 mb-3">{p.title}</h3>
              <p className="font-body text-cream/60 text-sm leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
        <div ref={splitRef} className={`${FADE} bg-white/5 rounded-xl p-6 md:p-8 border border-white/5 max-w-3xl mx-auto`}>
          <p className="font-body text-amber text-xs font-semibold uppercase tracking-widest mb-1">Example</p>
          <h3 className="font-display tracking-tight text-xl font-bold text-cream mb-5">One $10 sponsored detour</h3>
          <div className="flex h-3 rounded-full overflow-hidden mb-5">
            {SPLIT.map((s) => <div key={s.label} className={`${s.w} ${s.c}`} />)}
          </div>
          <div className="space-y-2">
            {SPLIT.map((s) => (
              <div key={s.label} className="flex items-center justify-between font-body text-sm">
                <span className="flex items-center gap-2 text-cream/70"><span className={`w-2.5 h-2.5 rounded-full ${s.c}`} />{s.label}</span>
                <span className="text-cream font-semibold">{s.amt}</span>
              </div>
            ))}
          </div>
          <p className="font-body text-cream/40 text-xs mt-5">Illustrative numbers. Real splits are set with each platform.</p>
        </div>
      </div>
    </section>
  );
}

// ── Cities ────────────────────────────────────────────────────────────────────
const CITIES = [
  { name: "New York", emoji: "🗽", status: "launch", desc: "JFK and LaGuardia rides into Manhattan pass bridges and skyline most visitors only see in photos.", landmarks: ["Brooklyn Bridge", "Queensboro skyline", "Flatiron"], skyline: "M10,60 L10,30 L18,30 L18,10 L26,10 L26,30 L34,30 L34,20 L42,20 L42,30 L50,30 L50,40 L58,40 L58,15 L66,15 L66,40 L74,40 L74,50 L82,50 L82,35 L90,35 L90,60" },
  { name: "Paris", emoji: "🗼", status: "launch", desc: "Almost any ride across the city can swing along the Seine for a few extra minutes.", landmarks: ["Eiffel Tower", "Arc de Triomphe", "Pont Alexandre III"], skyline: "M10,60 L20,60 L20,40 L30,25 L38,10 L46,25 L54,40 L54,60 L62,60 L62,35 L70,35 L70,60 L78,60 L78,45 L86,45 L86,60" },
  { name: "London", emoji: "🎡", status: "launch", desc: "Thames crossings put two thousand years of history on one side of the car or the other.", landmarks: ["Tower Bridge", "Big Ben", "St Paul's"], skyline: "M10,60 L10,30 L20,30 L20,20 L24,20 L24,10 L28,10 L28,20 L32,20 L32,30 L42,30 L42,50 L50,50 L50,30 L60,30 L60,15 L68,15 L68,30 L78,30 L78,50 L90,50 L90,60" },
  { name: "San Francisco", emoji: "🌉", status: "soon", desc: "From the Palace of Fine Arts along Crissy Field to the Golden Gate, one walk covers a century.", landmarks: ["Palace of Fine Arts", "Crissy Field", "Golden Gate Bridge"], skyline: "M10,60 L10,45 L18,45 L18,20 L22,20 L22,45 L58,45 L58,20 L62,20 L62,45 L90,45 L90,60 M18,24 Q40,48 58,24" },
  { name: "Rome", emoji: "🏛️", status: "soon", desc: "The eternal city's secrets told landmark by ancient landmark.", landmarks: ["Colosseum", "Vatican", "Trevi Fountain"], skyline: "M10,60 L10,50 L15,50 L15,35 L20,35 L20,50 L30,50 L30,40 L35,30 L40,40 L40,50 L50,50 L50,35 L60,35 L60,50 L70,50 L70,40 L80,40 L80,60" },
  { name: "Barcelona", emoji: "⛪", status: "soon", desc: "Gaudí, the Gothic Quarter and sun-drenched boulevards.", landmarks: ["Sagrada Família", "Park Güell", "La Rambla"], skyline: "M10,60 L10,40 L20,30 L20,20 L25,12 L30,20 L30,30 L40,30 L40,40 L50,40 L50,25 L55,18 L60,25 L60,40 L70,40 L70,50 L80,50 L80,60" },
  { name: "Tokyo", emoji: "⛩️", status: "soon", desc: "Ancient temples and neon lights, and every district tells a different story.", landmarks: ["Senso-ji", "Shibuya Crossing", "Shinjuku"], skyline: "M10,60 L10,45 L14,45 L14,35 L18,35 L18,25 L22,25 L22,35 L26,35 L26,45 L36,45 L36,30 L40,20 L44,30 L44,45 L54,45 L54,50 L64,50 L64,35 L72,35 L72,50 L82,50 L82,60" },
];

function CityCard({ city }: { city: (typeof CITIES)[0] }) {
  const ref = useFadeUp();
  return (
    <div ref={ref} className={`${FADE} bg-cream border border-ink/10 rounded-xl overflow-hidden hover:shadow-xl hover:-translate-y-1 hover:duration-200`}>
      <div className="h-40 bg-ink relative overflow-hidden">
        <svg viewBox="0 0 100 70" preserveAspectRatio="xMidYMax meet" className="absolute bottom-0 left-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <path d={city.skyline + " L90,70 L10,70 Z"} fill="#FAF3E0" opacity="0.08" />
          <path d={city.skyline} fill="none" stroke="#FAF3E0" strokeWidth="1.2" strokeLinejoin="round" strokeLinecap="round" opacity="0.5" />
        </svg>
        <div className="absolute top-4 left-4 text-3xl">{city.emoji}</div>
        <div className="absolute bottom-4 right-4">
          {city.status === "launch"
            ? <span className="bg-amber text-ink text-xs font-body font-bold px-3 py-1 rounded-md">Launch city</span>
            : <span className="bg-amber text-ink text-xs font-body font-bold px-3 py-1 rounded-md">Coming later</span>}
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-display tracking-tight text-xl font-bold text-ink mb-2">{city.name}</h3>
        <p className="font-body text-muted text-sm leading-relaxed mb-4">{city.desc}</p>
        <div className="flex flex-wrap gap-2">
          {city.landmarks.map((l) => (
            <span key={l} className="text-xs font-body text-muted bg-ink/5 px-2.5 py-1 rounded-md">{l}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function Cities() {
  const headRef = useFadeUp();
  return (
    <section id="cities" className="py-20 md:py-28 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={headRef} className={`${FADE} text-center mb-14`}>
          <Eyebrow>Cities</Eyebrow>
          <h2 className="font-display tracking-tight text-4xl md:text-5xl font-black text-ink">Where the long way is worth it</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CITIES.map((city) => <CityCard key={city.name} city={city} />)}
        </div>
      </div>
    </section>
  );
}

// ── Comparison ────────────────────────────────────────────────────────────────
const TABLE_FEATURES = [
  "Changes the actual route to pass landmarks",
  "Works inside the ride app",
  "Detour priced upfront, or sponsored",
  "Narrates what you're passing",
  "Tells you which side to look",
];

const COLUMNS = [
  { name: "WindowSeat", highlight: true, values: [true, true, true, true, true] },
  { name: "Audio tour apps", highlight: false, values: [false, false, false, true, false] },
  { name: "Ride apps today", highlight: false, values: [false, true, false, false, false] },
];

function Comparison() {
  const headRef = useFadeUp();
  const tableRef = useFadeUp();
  return (
    <section className="py-20 md:py-28 bg-ink">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={headRef} className={`${FADE} text-center mb-12`}>
          <Eyebrow dark>Why WindowSeat</Eyebrow>
          <h2 className="font-display tracking-tight text-4xl md:text-5xl font-black text-cream">Built for the trip you’re already taking</h2>
        </div>
        <div ref={tableRef} className={`${FADE} overflow-x-auto rounded-xl border border-white/10`}>
          <table className="w-full min-w-[560px]">
            <thead>
              <tr>
                <th className="text-left p-4 font-body text-cream/50 text-sm font-medium border-b border-white/10">Feature</th>
                {COLUMNS.map((c) => (
                  <th key={c.name} className={`p-4 text-center font-body text-sm font-semibold border-b border-white/10 ${c.highlight ? "bg-amber/15 text-amber" : "text-cream/60"}`}>
                    {c.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TABLE_FEATURES.map((feature, fi) => (
                <tr key={feature} className="border-b border-white/5 last:border-0">
                  <td className="p-4 font-body text-cream/70 text-sm">{feature}</td>
                  {COLUMNS.map((c) => (
                    <td key={c.name} className={`p-4 text-center ${c.highlight ? "bg-amber/10" : ""}`}>
                      {c.values[fi]
                        ? <span className={`text-lg ${c.highlight ? "text-amber" : "text-green-400"}`}>✓</span>
                        : <span className="text-cream/20 text-lg">✗</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

// ── CTA / Waitlist ─────────────────────────────────────────────────────────────
type Role = "rider" | "partner";

function CTASection() {
  const ref = useFadeUp();
  const [role, setRole] = useState<Role>("rider");
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
        body: JSON.stringify({ name, email, role, org: role === "partner" ? org : undefined }),
      });
      const data = await res.json();
      if (res.ok) {
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
          <h2 className="font-display tracking-tight text-5xl md:text-6xl lg:text-7xl font-black text-ink leading-[1.05] mb-4">
            Same ride.{" "}<span className="underline decoration-ink decoration-[6px] underline-offset-8">Better view.</span>
          </h2>
          <p className="font-body text-ink/80 text-lg mb-8">
            Travelers: be first to try Scenic Route in New York. Tourism boards, museums, hotels and platforms: let&apos;s set up a pilot.
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
                    {r === "rider" ? "I'm a traveler" : "I'm a sponsor or partner"}
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
                {status === "loading" ? "Sending…" : role === "rider" ? "Join the waitlist →" : "Talk about a pilot →"}
              </button>
              {status === "error" && (
                <p className="font-body text-ink text-sm bg-ink/10 rounded-xl px-4 py-2">{message}</p>
              )}
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
          © {new Date().getFullYear()} WindowSeat. A concept in development. WindowSeat is not affiliated with or endorsed by Uber or Lyft.
        </p>
      </div>
    </footer>
  );
}

// ── Root ──────────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <main>
      <Nav />
      <Hero />
      <Ticker />
      <HowItWorks />
      <RerouteSection />
      <Anywhere />
      <Live />
      <Sponsors />
      <Platforms />
      <BusinessModel />
      <Cities />
      <Comparison />
      <CTASection />
      <Footer />
    </main>
  );
}
