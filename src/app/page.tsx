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
    { href: "#cities", label: "Cities" },
    { href: "#scenic-route", label: "Scenic Route" },
    { href: "#how-it-works", label: "How It Works" },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 bg-ink transition-shadow duration-300 ${scrolled ? "shadow-xl" : ""}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a href="#" className="font-fraunces text-xl font-black">
            <span className="text-cream">Window</span>
            <span className="text-amber italic">Seat</span>
          </a>
          <div className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <a key={l.href} href={l.href} className="text-cream/80 hover:text-cream text-sm font-dm-sans transition-colors">
                {l.label}
              </a>
            ))}
            <a href="#cta" className="bg-orange text-cream text-sm font-dm-sans font-semibold px-5 py-2.5 rounded-full hover:bg-orange/90 transition-colors">
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
              <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-cream/80 hover:text-cream text-sm font-dm-sans px-2 py-1">
                {l.label}
              </a>
            ))}
            <a href="#cta" onClick={() => setOpen(false)} className="bg-orange text-cream text-sm font-dm-sans font-semibold px-5 py-2.5 rounded-full text-center">
              Ride Curious
            </a>
          </div>
        )}
      </div>
    </nav>
  );
}

// ── Scenic Route picker card (reused in Hero + Scenic Route section) ──────────
function PickerCard() {
  const options = [
    { label: "The Icon", place: "Eiffel Tower", time: "+11m", active: true },
    { label: "Hidden Gem", place: "The Louvre", time: "+8m", active: false },
    { label: "The View", place: "Pont Alexandre III", time: "+13m", active: false },
  ];
  return (
    <div className="bg-[#0F0A05] rounded-2xl overflow-hidden border border-white/5">
      <div className="px-4 py-3 border-b border-white/10">
        <p className="text-amber text-xs font-dm-sans font-semibold uppercase tracking-widest">Scenic Route</p>
        <p className="text-cream/50 text-xs font-dm-sans mt-0.5">Pick your detour</p>
      </div>
      <div className="p-3 space-y-2">
        {options.map((opt) => (
          <div key={opt.label} className={`flex items-center justify-between p-3 rounded-xl border ${opt.active ? "bg-orange/20 border-orange/40" : "bg-white/5 border-white/5"}`}>
            <div>
              <p className={`text-xs font-dm-sans font-semibold ${opt.active ? "text-orange" : "text-cream/50"}`}>{opt.label}</p>
              <p className={`text-sm font-dm-sans mt-0.5 ${opt.active ? "text-cream" : "text-cream/60"}`}>{opt.place}</p>
            </div>
            <span className={`text-xs font-dm-sans font-semibold px-2.5 py-1 rounded-full ${opt.active ? "bg-orange text-cream" : "bg-white/10 text-cream/40"}`}>
              {opt.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AudioBar() {
  return (
    <div className="bg-[#0F0A05] rounded-2xl p-4 border border-white/5 mt-4">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-8 rounded-full bg-orange flex items-center justify-center text-sm text-cream">▶</div>
        <div>
          <p className="text-cream text-sm font-dm-sans font-semibold">Now Playing</p>
          <p className="text-cream/50 text-xs font-dm-sans">Eiffel Tower — history &amp; secrets</p>
        </div>
        <div className="ml-auto flex items-end gap-0.5 h-4">
          <span className="dot1 w-1 h-3 bg-orange rounded-full inline-block" />
          <span className="dot2 w-1 h-4 bg-orange rounded-full inline-block" />
          <span className="dot3 w-1 h-2 bg-orange rounded-full inline-block" />
        </div>
      </div>
      <div className="bg-white/10 rounded-full h-1.5 w-full">
        <div className="bg-orange h-1.5 rounded-full w-2/5" />
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-cream/40 text-xs font-dm-sans">2:14</span>
        <span className="text-cream/40 text-xs font-dm-sans">5:32</span>
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
          <div ref={leftRef} className="opacity-0 translate-y-8 transition-all duration-700">
            <span className="inline-block bg-amber/20 text-amber text-xs font-dm-sans font-semibold px-3 py-1 rounded-full uppercase tracking-widest mb-6">
              GPS Audio Tours
            </span>
            <h1 className="font-fraunces text-5xl md:text-6xl lg:text-7xl font-black text-ink leading-[1.05] text-balance mb-6">
              Every ride teaches you{" "}
              <span className="italic text-orange">something.</span>
            </h1>
            <p className="font-dm-sans text-muted text-lg md:text-xl leading-relaxed mb-8 max-w-md">
              WindowSeat turns any taxi, bus, or rideshare into a GPS-guided audio tour. Tap Scenic Route and we&apos;ll reroute you past the stories your guidebook missed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#cta" className="bg-orange text-cream font-dm-sans font-semibold px-7 py-4 rounded-full text-center hover:bg-orange/90 transition-colors shadow-lg shadow-orange/25">
                Turn every ride into a story
              </a>
              <a href="#how-it-works" className="border-2 border-ink text-ink font-dm-sans font-semibold px-7 py-4 rounded-full text-center hover:bg-ink hover:text-cream transition-colors">
                See how it works
              </a>
            </div>
          </div>

          <div ref={rightRef} className="opacity-0 translate-y-8 transition-all duration-700 flex justify-center lg:justify-end">
            <div className="w-full max-w-sm">
              <div className="bg-ink rounded-3xl p-5 shadow-2xl">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-400/70" />
                  <div className="w-3 h-3 rounded-full bg-amber/70" />
                  <div className="w-3 h-3 rounded-full bg-green-400/70" />
                  <span className="ml-2 text-cream/40 text-xs font-dm-sans">WindowSeat</span>
                </div>
                {/* Map area */}
                <div className="relative h-36 rounded-xl overflow-hidden mb-4 bg-[#1a2535]">
                  <svg className="absolute inset-0 opacity-25" width="100%" height="100%">
                    <defs>
                      <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#4a7fcb" strokeWidth="0.5" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                    <line x1="30%" y1="0" x2="30%" y2="100%" stroke="#4a7fcb" strokeWidth="1.5" opacity="0.5" />
                    <line x1="65%" y1="0" x2="65%" y2="100%" stroke="#4a7fcb" strokeWidth="1.5" opacity="0.5" />
                    <line x1="0" y1="45%" x2="100%" y2="45%" stroke="#4a7fcb" strokeWidth="1.5" opacity="0.5" />
                    <line x1="0" y1="70%" x2="100%" y2="70%" stroke="#4a7fcb" strokeWidth="1.5" opacity="0.5" />
                  </svg>
                  <svg className="absolute inset-0" width="100%" height="100%">
                    <path d="M 20 130 Q 80 80 140 90 Q 190 100 230 55 Q 260 30 290 48" fill="none" stroke="#E8520A" strokeWidth="2.5" strokeDasharray="6 3" />
                    <circle cx="140" cy="90" r="5" fill="#F2A51A" />
                    <circle cx="230" cy="55" r="5" fill="#F2A51A" />
                    <circle cx="20" cy="130" r="5" fill="#E8520A" />
                  </svg>
                  <div className="absolute top-2 right-2 bg-orange text-cream text-xs font-dm-sans font-semibold px-2 py-0.5 rounded-full">LIVE</div>
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
  "Eiffel Tower", "Brooklyn Bridge", "The Colosseum", "London Eye",
  "Statue of Liberty", "Tower of London", "Golden Gate Bridge",
  "Sagrada Família", "Senso-ji Temple", "The Louvre",
];

function Ticker() {
  const doubled = [...LANDMARKS, ...LANDMARKS];
  return (
    <div className="bg-orange overflow-hidden py-3">
      <div className="flex gap-12 whitespace-nowrap" style={{ animation: "ticker 30s linear infinite" }}>
        {doubled.map((name, i) => (
          <span key={i} className="flex items-center gap-3 text-cream font-dm-sans font-semibold text-sm shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-cream/60 inline-block" />
            {name}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Cities ────────────────────────────────────────────────────────────────────
const CITIES = [
  { name: "New York", emoji: "🗽", status: "launch", desc: "From the High Line to Harlem, every block has a story worth hearing.", landmarks: ["Central Park", "Times Square", "Brooklyn Bridge"], skyline: "M10,60 L10,30 L18,30 L18,10 L26,10 L26,30 L34,30 L34,20 L42,20 L42,30 L50,30 L50,40 L58,40 L58,15 L66,15 L66,40 L74,40 L74,50 L82,50 L82,35 L90,35 L90,60" },
  { name: "Paris", emoji: "🗼", status: "launch", desc: "Navigate the City of Light with centuries of culture as your guide.", landmarks: ["Eiffel Tower", "The Louvre", "Pont Alexandre III"], skyline: "M10,60 L20,60 L20,40 L30,25 L38,10 L46,25 L54,40 L54,60 L62,60 L62,35 L70,35 L70,60 L78,60 L78,45 L86,45 L86,60" },
  { name: "London", emoji: "🎡", status: "launch", desc: "Two thousand years of history, one unforgettable ride across the Thames.", landmarks: ["Big Ben", "Tower of London", "London Eye"], skyline: "M10,60 L10,30 L20,30 L20,20 L24,20 L24,10 L28,10 L28,20 L32,20 L32,30 L42,30 L42,50 L50,50 L50,30 L60,30 L60,15 L68,15 L68,30 L78,30 L78,50 L90,50 L90,60" },
  { name: "Rome", emoji: "🏛️", status: "soon", desc: "The eternal city's secrets told landmark by ancient landmark.", landmarks: ["Colosseum", "Vatican", "Trevi Fountain"], skyline: "M10,60 L10,50 L15,50 L15,35 L20,35 L20,50 L30,50 L30,40 L35,30 L40,40 L40,50 L50,50 L50,35 L60,35 L60,50 L70,50 L70,40 L80,40 L80,60" },
  { name: "Barcelona", emoji: "⛪", status: "soon", desc: "Gaudí, Gothic Quarter, and sun-drenched boulevards await your ears.", landmarks: ["Sagrada Família", "Park Güell", "La Rambla"], skyline: "M10,60 L10,40 L20,30 L20,20 L25,12 L30,20 L30,30 L40,30 L40,40 L50,40 L50,25 L55,18 L60,25 L60,40 L70,40 L70,50 L80,50 L80,60" },
  { name: "Tokyo", emoji: "⛩️", status: "soon", desc: "Ancient temples and neon lights — every district tells a different story.", landmarks: ["Senso-ji", "Shibuya Crossing", "Shinjuku"], skyline: "M10,60 L10,45 L14,45 L14,35 L18,35 L18,25 L22,25 L22,35 L26,35 L26,45 L36,45 L36,30 L40,20 L44,30 L44,45 L54,45 L54,50 L64,50 L64,35 L72,35 L72,50 L82,50 L82,60" },
];

function CityCard({ city }: { city: (typeof CITIES)[0] }) {
  const ref = useFadeUp();
  return (
    <div ref={ref} className="opacity-0 translate-y-8 transition-all duration-700 bg-cream border border-ink/10 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 hover:duration-200 group cursor-default">
      <div className="h-40 bg-ink relative overflow-hidden">
        <svg viewBox="0 0 100 70" preserveAspectRatio="xMidYMax meet" className="absolute bottom-0 left-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <path d={city.skyline + " L90,70 L10,70 Z"} fill="#FAF3E0" opacity="0.08" />
          <path d={city.skyline} fill="none" stroke="#FAF3E0" strokeWidth="1.2" strokeLinejoin="round" strokeLinecap="round" opacity="0.5" />
        </svg>
        <div className="absolute top-4 left-4 text-3xl">{city.emoji}</div>
        <div className="absolute bottom-4 right-4">
          {city.status === "launch"
            ? <span className="bg-orange text-cream text-xs font-dm-sans font-bold px-3 py-1 rounded-full">Live Now</span>
            : <span className="bg-amber text-ink text-xs font-dm-sans font-bold px-3 py-1 rounded-full">Coming Soon</span>}
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-fraunces text-xl font-bold text-ink mb-2">{city.name}</h3>
        <p className="font-dm-sans text-muted text-sm leading-relaxed mb-4">{city.desc}</p>
        <div className="flex flex-wrap gap-2">
          {city.landmarks.map((l) => (
            <span key={l} className="text-xs font-dm-sans text-muted bg-ink/5 px-2.5 py-1 rounded-full">{l}</span>
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
        <div ref={headRef} className="opacity-0 translate-y-8 transition-all duration-700 text-center mb-14">
          <span className="inline-block bg-orange/10 text-orange text-xs font-dm-sans font-semibold px-3 py-1 rounded-full uppercase tracking-widest mb-4">Available Cities</span>
          <h2 className="font-fraunces text-4xl md:text-5xl font-black text-ink">Start your journey</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CITIES.map((city) => <CityCard key={city.name} city={city} />)}
        </div>
      </div>
    </section>
  );
}

// ── Scenic Route section ──────────────────────────────────────────────────────
const BENEFITS = [
  { icon: "🧭", label: "Real-time GPS routing" },
  { icon: "🎙️", label: "Expert narration, not scripts" },
  { icon: "⏱️", label: "Detours as short as 3 minutes" },
  { icon: "📡", label: "Works offline once downloaded" },
];

function ScenicRouteSection() {
  const leftRef = useFadeUp();
  const rightRef = useFadeUp();
  return (
    <section id="scenic-route" className="py-20 md:py-28 bg-ink">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div ref={leftRef} className="opacity-0 translate-y-8 transition-all duration-700">
            <span className="inline-block bg-orange/20 text-orange text-xs font-dm-sans font-semibold px-3 py-1 rounded-full uppercase tracking-widest mb-5">Signature Feature</span>
            <h2 className="font-fraunces text-4xl md:text-5xl font-black text-cream mb-4">Scenic Route</h2>
            <p className="font-fraunces text-xl italic text-amber mb-6 leading-snug">&ldquo;The detour you didn&apos;t know you needed.&rdquo;</p>
            <p className="font-dm-sans text-cream/70 text-base leading-relaxed mb-8">
              When you&apos;re already in motion, Scenic Route analyzes your destination and offers up to three curated detours — each a bite-sized audio story about a landmark just minutes off your path. No extra walking. No extra cost. Just a richer ride.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {BENEFITS.map((b) => (
                <div key={b.label} className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3">
                  <span className="text-xl">{b.icon}</span>
                  <span className="font-dm-sans text-cream text-sm font-medium">{b.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div ref={rightRef} className="opacity-0 translate-y-8 transition-all duration-700 flex justify-center lg:justify-end">
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

// ── How It Works ──────────────────────────────────────────────────────────────
const HOW_STEPS = [
  { emoji: "🚕", step: "01", title: "Get in your ride", desc: "Jump in a taxi, rideshare, or bus. Open WindowSeat when you're settled." },
  { emoji: "🗺️", step: "02", title: "Tap Scenic Route", desc: "We detect your location and destination, then surface the best detours nearby." },
  { emoji: "✌️", step: "03", title: "Pick your seat", desc: "Choose The Icon, the Hidden Gem, or The View — each a different flavour of story." },
  { emoji: "🎧", step: "04", title: "Ride and learn", desc: "Audio plays as you approach each landmark. No reading required. Eyes on the window." },
];

function StepCard({ step }: { step: (typeof HOW_STEPS)[0] }) {
  const ref = useFadeUp();
  return (
    <div ref={ref} className="opacity-0 translate-y-8 transition-all duration-700 bg-cream border border-ink/10 rounded-2xl p-6 hover:shadow-lg">
      <div className="text-4xl mb-4">{step.emoji}</div>
      <div className="font-dm-sans text-orange text-xs font-bold uppercase tracking-widest mb-2">Step {step.step}</div>
      <h3 className="font-fraunces text-xl font-bold text-ink mb-3">{step.title}</h3>
      <p className="font-dm-sans text-muted text-sm leading-relaxed">{step.desc}</p>
    </div>
  );
}

function HowItWorks() {
  const headRef = useFadeUp();
  return (
    <section id="how-it-works" className="py-20 md:py-28 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={headRef} className="opacity-0 translate-y-8 transition-all duration-700 text-center mb-14">
          <span className="inline-block bg-orange/10 text-orange text-xs font-dm-sans font-semibold px-3 py-1 rounded-full uppercase tracking-widest mb-4">How It Works</span>
          <h2 className="font-fraunces text-4xl md:text-5xl font-black text-ink">Four steps to a richer ride</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {HOW_STEPS.map((s) => <StepCard key={s.step} step={s} />)}
        </div>
      </div>
    </section>
  );
}

// ── Competitive Table ─────────────────────────────────────────────────────────
const TABLE_FEATURES = [
  "GPS-triggered audio",
  "Scenic Route detours",
  "Works in moving vehicles",
  "No account required",
  "Offline support",
  "Expert narration",
  "Multi-city coverage",
];

const COMPETITORS = [
  { name: "WindowSeat", highlight: true,  values: [true, true, true, true, true, true, true] },
  { name: "VoiceMap",   highlight: false, values: [true, false, false, false, false, true, true] },
  { name: "GuideAlong", highlight: false, values: [true, false, true, true, false, false, false] },
  { name: "Google Maps",highlight: false, values: [false, false, true, true, false, false, true] },
];

function CompetitiveTable() {
  const headRef = useFadeUp();
  const tableRef = useFadeUp();
  return (
    <section className="py-20 md:py-28 bg-ink">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={headRef} className="opacity-0 translate-y-8 transition-all duration-700 text-center mb-12">
          <span className="inline-block bg-orange/20 text-orange text-xs font-dm-sans font-semibold px-3 py-1 rounded-full uppercase tracking-widest mb-4">Why WindowSeat</span>
          <h2 className="font-fraunces text-4xl md:text-5xl font-black text-cream">Built for riders, not walkers</h2>
        </div>
        <div ref={tableRef} className="opacity-0 translate-y-8 transition-all duration-700 overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full min-w-[580px]">
            <thead>
              <tr>
                <th className="text-left p-4 font-dm-sans text-cream/50 text-sm font-medium border-b border-white/10">Feature</th>
                {COMPETITORS.map((c) => (
                  <th key={c.name} className={`p-4 text-center font-dm-sans text-sm font-semibold border-b border-white/10 ${c.highlight ? "bg-orange/20 text-orange" : "text-cream/60"}`}>
                    {c.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TABLE_FEATURES.map((feature, fi) => (
                <tr key={feature} className="border-b border-white/5 last:border-0">
                  <td className="p-4 font-dm-sans text-cream/70 text-sm">{feature}</td>
                  {COMPETITORS.map((c) => (
                    <td key={c.name} className={`p-4 text-center ${c.highlight ? "bg-orange/10" : ""}`}>
                      {c.values[fi]
                        ? <span className={`text-lg ${c.highlight ? "text-orange" : "text-green-400"}`}>✓</span>
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
function CTASection() {
  const ref = useFadeUp();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setMessage(data.message ?? "You're on the list!");
        setName("");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error ?? "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  return (
    <section id="cta" className="py-24 md:py-32 bg-orange">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div ref={ref} className="opacity-0 translate-y-8 transition-all duration-700">
          <h2 className="font-fraunces text-5xl md:text-6xl lg:text-7xl font-black text-cream leading-[1.05] mb-4">
            Every ride.{" "}<span className="italic">A story.</span>
          </h2>
          <p className="font-dm-sans text-cream/80 text-lg mb-10">
            Join the waitlist and be first to ride when we launch in your city.
          </p>
          {status === "success" ? (
            <div className="bg-cream/20 border border-cream/30 rounded-2xl p-8">
              <div className="text-4xl mb-3">🎉</div>
              <p className="font-fraunces text-2xl font-bold text-cream mb-1">{message}</p>
              <p className="font-dm-sans text-cream/80 text-sm">We&apos;ll let you know as soon as WindowSeat lands in your city.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md mx-auto">
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-5 py-4 rounded-full bg-cream text-ink font-dm-sans placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-cream/50"
              />
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-5 py-4 rounded-full bg-cream text-ink font-dm-sans placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-cream/50"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full px-7 py-4 rounded-full bg-ink text-cream font-dm-sans font-semibold text-base hover:bg-ink/90 transition-colors disabled:opacity-60"
              >
                {status === "loading" ? "Joining…" : "Join the waitlist →"}
              </button>
              {status === "error" && (
                <p className="font-dm-sans text-cream/90 text-sm bg-ink/20 rounded-xl px-4 py-2">{message}</p>
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
        <a href="#" className="font-fraunces text-xl font-black">
          <span className="text-cream">Window</span>
          <span className="text-amber italic">Seat</span>
        </a>
        <p className="font-dm-sans text-cream/40 text-sm">
          © {new Date().getFullYear()} WindowSeat. All rights reserved.
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
      <Cities />
      <ScenicRouteSection />
      <HowItWorks />
      <CompetitiveTable />
      <CTASection />
      <Footer />
    </main>
  );
}
