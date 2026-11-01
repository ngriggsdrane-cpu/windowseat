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
    { href: "#partners", label: "Partners" },
    { href: "#cities", label: "Cities" },
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

// ── In-app Scenic Route card (what a rider sees inside the rideshare app) ────
const OPTIONS = [
  { label: "The Icon", place: "Brooklyn Bridge", time: "+12 min", price: "+$8.40", sponsored: false },
  { label: "The Hidden Gem", place: "DUMBO's Washington St", time: "+9 min", price: "+$6.10", sponsored: false },
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

// ── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  const leftRef = useFadeUp();
  const rightRef = useFadeUp();
  return (
    <section className="pt-24 pb-16 md:pt-32 md:pb-24 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div ref={leftRef} className={FADE}>
            <h1 className="font-display tracking-tight text-[2.6rem] sm:text-5xl md:text-[3.4rem] xl:text-6xl font-black text-ink leading-[1.05] mb-5">
              <span className="block">No time for a tour?</span>
              <span className="block text-orange">Take the scenic&nbsp;route.</span>
            </h1>
            <p className="font-body text-muted text-lg md:text-xl leading-relaxed mb-8 max-w-md">
              Short, narrated detours past the landmarks worth seeing, on foot, by bike or in your Uber or Lyft.
            </p>
            <div className="border-l-4 border-amber pl-4 mb-8 max-w-md">
              <p className="font-display text-ink text-xl font-extrabold leading-tight">Free to use. No added fees, ever.</p>
              <p className="font-body text-muted text-sm mt-1">Walking and biking cost nothing. In a ride, you pay only the extra minutes at your normal fare.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#cta" className="bg-amber text-ink font-body font-semibold px-7 py-4 rounded-md text-center hover:bg-amber/90 transition-colors shadow-lg shadow-ink/15">
                Get early access
              </a>
              <a href="#partners" className="border-2 border-ink text-ink font-body font-semibold px-7 py-4 rounded-md text-center hover:bg-ink hover:text-cream transition-colors">
                Partner with us
              </a>
            </div>
          </div>

          <div ref={rightRef} className={`${FADE} flex justify-center lg:justify-end`}>
            <div className="w-full max-w-sm">
              <div className="bg-ink rounded-xl p-5 shadow-2xl">
                <div className="relative rounded-xl overflow-hidden mb-4 bg-[#16294A]">
                  <svg viewBox="0 0 320 180" className="w-full h-auto block" role="img" aria-label="Map: the fastest route from JFK to Midtown versus the scenic route over the Brooklyn Bridge">
                    {/* water: East River + harbor */}
                    <path d="M158,0 C150,55 128,100 78,180 L110,180 C152,108 172,60 182,0 Z" fill="#244B7A" />
                    <path d="M0,128 C30,140 60,155 82,180 L0,180 Z" fill="#244B7A" />
                    {/* fastest route */}
                    <path d="M292,156 L240,96 L176,40 L104,38" fill="none" stroke="#F7F7F2" strokeOpacity="0.3" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    {/* scenic route */}
                    <path d="M292,156 C250,150 190,148 140,134 L100,122 C112,96 120,70 112,48 L104,38" fill="none" stroke="#FFC72C" strokeWidth="3" strokeDasharray="7 4" strokeLinecap="round" strokeLinejoin="round" />
                    {/* Brooklyn Bridge */}
                    <g stroke="#F7F7F2" strokeWidth="1.4" fill="none" strokeLinecap="round" transform="translate(120 122) scale(1.55) translate(-120 -122)">
                      <path d="M96,121 L144,135" strokeWidth="2.2" />
                      <path d="M108,124 L108,106 M113,125.5 L113,107.5 M108,106 L113,107.5" />
                      <path d="M127,129 L127,111 M132,130.5 L132,112.5 M127,111 L132,112.5" />
                      <path d="M110.5,111 Q120,123 129.5,116" strokeWidth="1" />
                      <path d="M98,121 Q104,112 110.5,111 M129.5,116 Q137,120 142,134" strokeWidth="1" />
                    </g>
                    
                    {/* Empire State Building at Midtown */}
                    <g fill="#F7F7F2" transform="translate(104 44) scale(1.5) translate(-104 -44)">
                      <rect x="96" y="28" width="16" height="16" rx="1" />
                      <rect x="99" y="20" width="10" height="9" />
                      <rect x="101.5" y="14" width="5" height="7" />
                      <rect x="103.5" y="6" width="1.2" height="9" />
                    </g>
                    {/* Statue of Liberty in the harbor */}
                    <g fill="#F7F7F2" fillOpacity="0.8" transform="translate(27 166) scale(1.4) translate(-27 -166)">
                      <rect x="22" y="160" width="10" height="6" />
                      <rect x="24.5" y="148" width="5" height="12" rx="1" />
                      <circle cx="27" cy="145.5" r="2.3" />
                      <rect x="28.6" y="136" width="1.3" height="9" transform="rotate(12 29 141)" />
                      <circle cx="31" cy="135" r="1.6" fill="#FFC72C" fillOpacity="1" />
                    </g>
                    {/* JFK */}
                    <circle cx="292" cy="156" r="5" fill="#E4572E" />
                    {/* labels */}
                    <g fontFamily="var(--font-body), sans-serif" fontSize="9" fontWeight="600">
                      <rect x="152" y="136" width="78" height="17" rx="3" fill="#FFC72C" />
                      <text x="191" y="148" textAnchor="middle" fill="#13294B">Brooklyn Bridge</text>
                      <text x="122" y="34" fill="#F7F7F2">Midtown</text>
                      <text x="276" y="146" textAnchor="end" fill="#F7F7F2">JFK</text>
                      <text x="40" y="172" fill="#F7F7F2" fillOpacity="0.75" fontWeight="400">Lady Liberty</text>
                    </g>
                  </svg>
                </div>
                <div className="flex justify-between -mt-2 mb-4 px-1 text-[11px] font-body">
                  <span className="text-cream/50">— fastest route</span>
                  <span className="text-amber">- - scenic route · +12 min</span>
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

// ── How it works ─────────────────────────────────────────────────────────────
const LIVE_QUEUE = [
  { place: "Palace of Fine Arts", layer: "Story", secs: 75, state: "done" },
  { place: "The weeping figures", layer: "Glance", secs: 20, state: "playing" },
  { place: "Walk along the lagoon", layer: "Bridge", secs: 30, state: "next" },
  { place: "Crissy Field airfield", layer: "Story", secs: 60, state: "next" },
  { place: "Golden Gate Bridge", layer: "Deep dive", secs: 150, state: "next" },
];

function fmt(secs: number) {
  const m = Math.floor(secs / 60), s = secs % 60;
  return m ? `${m}:${String(s).padStart(2, "0")}` : `0:${String(s).padStart(2, "0")}`;
}

const STEPS = [
  { n: "1", title: "Pick a detour", desc: "The Icon, the Hidden Gem or the View, each showing the minutes it adds." },
  { n: "2", title: "Go", desc: "On foot or by bike, it opens in your maps app. In a ride, it's added as one stop." },
  { n: "3", title: "Listen", desc: "Stories play as you reach each spot, cut to fit your time. Tap Go deeper or Skip anytime." },
];

function HowItWorks() {
  const leftRef = useFadeUp();
  const rightRef = useFadeUp();
  const total = LIVE_QUEUE.reduce((a, c) => a + c.secs, 0);
  return (
    <section id="how-it-works" className="py-20 md:py-28 bg-ink">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div ref={leftRef} className={FADE}>
            <Eyebrow dark>How it works</Eyebrow>
            <h2 className="font-display tracking-tight text-4xl md:text-5xl font-black text-cream mb-10">Three taps to a better route</h2>
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
                <span className="font-body text-cream text-sm font-semibold">San Francisco · on foot</span>
                <span className="font-body text-xs text-ink bg-amber rounded-md px-2 py-0.5 font-semibold">6 min</span>
              </div>
              <p className="font-body text-cream/50 text-xs mb-4">Palace of Fine Arts → Golden Gate Bridge</p>
              <ol className="space-y-2">
                {LIVE_QUEUE.map((c) => (
                  <li key={c.place} className={`flex items-center justify-between rounded-lg px-3 py-2.5 border ${c.state === "playing" ? "bg-amber/15 border-amber/50" : "bg-white/5 border-white/5"}`}>
                    <div className="flex items-center gap-3">
                      <span className={`w-5 text-center text-xs ${c.state === "playing" ? "text-amber" : "text-cream/40"}`}>
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
              <p className="font-body text-[11px] text-cream/40 mt-3 text-right">{fmt(total)} of stories, fit to your walk</p>
              <div className="mt-4 grid grid-cols-2 gap-2 border-t border-white/10 pt-4">
                {["Go deeper", "Skip"].map((b) => (
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

// ── Partners ──────────────────────────────────────────────────────────────────
const PARTNERS = [
  {
    who: "Tourism boards & sponsors",
    title: "Sponsor the route",
    points: [
      "Pay per completed detour, not per impression",
      "Send visitors to the places you choose",
      "Monthly report of who went where",
    ],
    note: "Booking New York pilots now.",
  },
  {
    who: "Ride platforms",
    title: "Plug in Scenic Route",
    points: [
      "Higher fares on trips already booked",
      "A new ad format riders choose themselves",
      "Time-capped, set at pickup, safe streets only",
    ],
    note: "WindowSeat takes a share of the extra fare only.",
  },
];

function Partners() {
  const headRef = useFadeUp();
  return (
    <section id="partners" className="py-20 md:py-28 bg-cream">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={headRef} className={`${FADE} mb-10`}>
          <Eyebrow>Partners</Eyebrow>
          <h2 className="font-display tracking-tight text-4xl md:text-5xl font-black text-ink">Free for travelers. Partners pay.</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PARTNERS.map((p) => (
            <div key={p.who} className="bg-white/60 border border-ink/10 rounded-xl p-6">
              <p className="font-body text-orange text-xs font-bold uppercase tracking-widest mb-2">{p.who}</p>
              <h3 className="font-display text-2xl font-extrabold text-ink mb-4">{p.title}</h3>
              <ul className="space-y-2 mb-5">
                {p.points.map((pt) => (
                  <li key={pt} className="flex gap-2 font-body text-ink/80">
                    <span className="text-amber font-black">✓</span>
                    {pt}
                  </li>
                ))}
              </ul>
              <p className="font-body text-muted text-sm">{p.note}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Cities ────────────────────────────────────────────────────────────────────
const LAUNCH = ["New York", "Paris", "London"];
const NEXT = ["San Francisco", "Rome", "Barcelona", "Tokyo"];

function Cities() {
  return (
    <section id="cities" className="py-10 bg-ink">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
        <p className="font-body text-cream/50 text-xs uppercase tracking-widest shrink-0">Cities</p>
        <div className="flex flex-wrap gap-2">
          {LAUNCH.map((c) => <span key={c} className="bg-amber text-ink font-body font-semibold text-sm px-3 py-1.5 rounded-md">{c}</span>)}
          {NEXT.map((c) => <span key={c} className="border border-white/20 text-cream/70 font-body text-sm px-3 py-1.5 rounded-md">{c} · soon</span>)}
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
          <h2 className="font-display tracking-tight text-[2.4rem] sm:text-5xl md:text-6xl font-black text-ink leading-[1.1] mb-5">
            <span className="block">48 hours in town?</span><span className="block"><span className="underline decoration-ink decoration-[5px] underline-offset-[10px]">Don&apos;t waste the ride.</span></span>
          </h2>
          <p className="font-body text-ink/80 text-lg mb-8">
            Try it first in New York, or set up a partner pilot.
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
                    {r === "rider" ? "Traveler" : "Partner"}
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
                {status === "loading" ? "Sending…" : role === "rider" ? "Get early access →" : "Request a pilot →"}
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
      <Partners />
      <Cities />
      <CTASection />
      <Footer />
    </main>
  );
}
