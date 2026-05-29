// ayoo landing — section components
// All sections take (copy, lang) where copy is i18n[lang][audience]

const { useState, useEffect, useRef } = React;

// ─────────────────────────────────────────────────────────────
// Intro overlay — full-screen tagline that lifts away on enter
// ─────────────────────────────────────────────────────────────
function IntroOverlay({ copy, onEnter }) {
  const [leaving, setLeaving] = useState(false);
  const [autoLeft, setAutoLeft] = useState(false);

  useEffect(() => {
    // auto-dismiss after 3.4s
    const t = setTimeout(() => {
      if (!autoLeft) {
        setLeaving(true);
        setAutoLeft(true);
        setTimeout(onEnter, 900);
      }
    }, 3400);
    return () => clearTimeout(t);
  }, [autoLeft, onEnter]);

  const handleEnter = () => {
    if (leaving) return;
    setLeaving(true);
    setTimeout(onEnter, 700);
  };

  return (
    <div className={"intro" + (leaving ? " is-leaving" : "")} onClick={handleEnter}>
      <div className="intro__inner">
        <span className="intro__star">✱</span>
        <h1>
          {copy.title_l1} <span className="ink2">{copy.title_l2}</span>
        </h1>
        <p>{copy.sub}</p>
        <button className="btn btn--pop" onClick={handleEnter}>
          {copy.enter} <Arrow />
        </button>
      </div>
    </div>
  );
}

function Arrow() {
  return (
    <svg className="arr" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// Lava-lamp animated background
// ─────────────────────────────────────────────────────────────
function LavaBg() {
  return (
    <div className="lava" aria-hidden="true">
      {/* SVG filter defs — grain texture applied to blobs */}
      <svg style={{position:'absolute',width:0,height:0,overflow:'hidden'}} aria-hidden="true">
        <defs>
          <filter id="blob-grain" x="-5%" y="-5%" width="110%" height="110%" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.68" numOctaves="3" stitchTiles="stitch" result="noise"/>
            <feColorMatrix type="saturate" values="0" in="noise" result="gray"/>
            <feBlend in="SourceGraphic" in2="gray" mode="overlay"/>
          </filter>
        </defs>
      </svg>
      <div className="lava__blob b1"></div>
      <div className="lava__blob b2"></div>
      <div className="lava__blob b3"></div>
      <div className="lava__blob b4"></div>
      <div className="lava__blob b5"></div>
      {/* Animated grain overlay */}
      <div className="lava__grain"></div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Top nav
// ─────────────────────────────────────────────────────────────
function TopNav({ t, lang, setLang, audience, setAudience }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const swRef = useRef(null);
  const [pill, setPill] = useState({ left: 4, width: 0 });

  useEffect(() => {
    if (!swRef.current) return;
    const active = swRef.current.querySelector("button.is-active");
    if (active) {
      const r = active.getBoundingClientRect();
      const p = swRef.current.getBoundingClientRect();
      setPill({ left: r.left - p.left, width: r.width });
    }
  }, [audience, lang]);

  return (
    <header className="nav">
      <div className="container nav__inner">
        <a href="#" className="nav__logo" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }} aria-label="ayoo">
          <Logo height={30} />
        </a>

        <nav className="nav__links">
          <a href="#how">{t.nav.how}</a>
          <a href="#cats">{t.nav.places}</a>
          <a href="#business">{t.nav.business}</a>
          <a href="#faq">{t.nav.faq}</a>
        </nav>

        <div className="nav__right">
          <div className="audience-switch" ref={swRef}>
            <span className="audience-switch__pill" style={{ left: pill.left, width: pill.width }}></span>
            <button
              className={audience === "clients" ? "is-active" : ""}
              onClick={() => setAudience("clients")}
            >{t.nav.audienceClients}</button>
            <button
              className={audience === "partners" ? "is-active" : ""}
              onClick={() => setAudience("partners")}
            >{t.nav.audiencePartners}</button>
          </div>

          <div className="lang">
            <button className="lang__btn" onClick={() => setMenuOpen(o => !o)}>
              {t.meta.langLabel}
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
            </button>
            {menuOpen && (
              <div className="lang__menu" onMouseLeave={() => setMenuOpen(false)}>
                {["ru","en","sr"].map(l => (
                  <button
                    key={l}
                    className={lang === l ? "is-active" : ""}
                    onClick={() => { setLang(l); setMenuOpen(false); }}
                  >{window.AYOO_I18N[l].meta.langFull}</button>
                ))}
              </div>
            )}
          </div>

          <a href="#cta" className="btn">
            {audience === "clients" ? t.nav.download : t.nav.become}
            <Arrow />
          </a>
        </div>
      </div>
    </header>
  );
}

// ─────────────────────────────────────────────────────────────
// Hero — massive wordmark + photo card + sticker
// ─────────────────────────────────────────────────────────────
function Hero({ copy }) {
  const titleChars = copy.heroTitle.split("");
  return (
    <section className="hero section">
      <div className="container">
        <div className="hero__eyebrow-row">
          <span className="eyebrow">{copy.heroEyebrow}</span>
          <span className="eyebrow" style={{ background: "var(--ink)", color: "var(--bg)" }}>
            ★ 2026
          </span>
        </div>

        <h1 className="hero__wordmark" aria-label={copy.heroTitle}>
          {titleChars.map((ch, i) => (
            <span key={i} className={i === titleChars.length - 1 ? "pop-letter" : ""}>{ch}</span>
          ))}
        </h1>

        <div className="hero__sub-row">
          <p className="hero__sub">{copy.heroSub}</p>
          <div className="hero__ctas">
            <a href="#cta" className="btn">{copy.heroCTA1} <Arrow /></a>
            <a href="#cats" className="btn btn--ghost">{copy.heroCTA2}</a>
          </div>
        </div>
      </div>

      <div className="hero__art photo" aria-hidden="true">
        <span>фото</span>
      </div>
      <div className="hero__sticker">
        <span className="dot"></span>
        {copy.ticker[0]}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// Marquee — tilted ticker band
// ─────────────────────────────────────────────────────────────
function Marquee({ items, inverted, tilt = 0 }) {
  const repeated = [...items, ...items, ...items, ...items];
  return (
    <div
      className={"marquee" + (inverted ? " marquee--inverted" : "")}
      style={tilt ? { transform: `rotate(${tilt}deg)`, marginTop: "-24px", marginBottom: "-24px" } : null}
    >
      <div className="marquee__track">
        <span>{repeated.map((it, i) => <span key={i} style={{ marginRight: 48 }}>{it}</span>)}</span>
        <span>{repeated.map((it, i) => <span key={"b"+i} style={{ marginRight: 48 }}>{it}</span>)}</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// How it works — 3 chunky colored cards
// ─────────────────────────────────────────────────────────────
function HowItWorks({ copy }) {
  return (
    <section className="section" id="how">
      <div className="container">
        <div style={{ display: "flex", alignItems: "end", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
          <div>
            <span className="eyebrow">{copy.howEyebrow}</span>
            <h2 className="h-display" style={{ fontSize: "clamp(48px, 6vw, 96px)", marginTop: 18 }}>
              {copy.howTitle}
            </h2>
          </div>
        </div>

        <div className="how-grid">
          {copy.howSteps.map((s, i) => (
            <div className="how-card" key={i}>
              <div className="how-card__n">{s.n}</div>
              <div>
                <div className="how-card__t">{s.t}</div>
                <div className="how-card__d">{s.d}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// Categories — pill chips
// ─────────────────────────────────────────────────────────────
function Categories({ copy }) {
  return (
    <section className="section" id="cats" style={{ background: "var(--bg-alt)" }}>
      <div className="container">
        <span className="eyebrow">{copy.catEyebrow}</span>
        <h2 className="h-display" style={{ fontSize: "clamp(48px, 6vw, 96px)", marginTop: 18, maxWidth: "16ch" }}>
          {copy.catTitle}
        </h2>
        <div className="cats">
          {copy.categories.map((c, i) => (
            <div className="cat" key={i}>
              {c.t} <span className="c">{c.c}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// Places / Benefits — image card grid
// ─────────────────────────────────────────────────────────────
function PlacesGrid({ copy }) {
  return (
    <section className="section">
      <div className="container">
        <span className="eyebrow">{copy.placesEyebrow}</span>
        <h2 className="h-display" style={{ fontSize: "clamp(48px, 6vw, 96px)", marginTop: 18, maxWidth: "20ch" }}>
          {copy.placesTitle}
        </h2>
        <div className="places">
          {copy.places.map((p, i) => (
            <div className="place" key={i}>
              <div className={"place__img v" + ((i % 6) + 1)}>
                <span className="tag">{p.cat}</span>
                <span className="ph">{p.t.slice(0,1)}</span>
              </div>
              <div className="place__body">
                <h3>{p.t}</h3>
                <span className="o">{p.o}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// Stats — big numbers on dark
// ─────────────────────────────────────────────────────────────
function Stats({ copy }) {
  return (
    <section className="section stats-section">
      <div className="container">
        <span className="eyebrow">★ ayoo</span>
        <h2 className="h-display" style={{ fontSize: "clamp(48px, 6vw, 96px)", marginTop: 18, color: "var(--bg)" }}>
          {copy.statsTitle}
        </h2>
        <div className="stats">
          {copy.stats.map((s, i) => (
            <div className="stat" key={i}>
              <div className="stat__n">{s.n}</div>
              <div className="stat__l">{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// App / Partner-portal — phone mockup + copy
// ─────────────────────────────────────────────────────────────
function AppSection({ copy, audience }) {
  return (
    <section className="section app-section" id="business">
      <div className="container">
        <div className="app-grid">
          <div className="app-copy">
            <span className="eyebrow">{copy.appEyebrow}</span>
            <h2>{copy.appTitle}</h2>
            <p>{copy.appSub}</p>
            <div className="app-stores">
              <a href="#" className="btn">
                <StoreIcon kind="telegram" />
                {copy.appStoreIOS}
              </a>
              <a href="#" className="btn">
                <StoreIcon kind="at" />
                {copy.appStoreAndroid}
              </a>
            </div>
          </div>
          <PhoneMock audience={audience} />
        </div>
      </div>
    </section>
  );
}

function StoreIcon({ kind }) {
  const s = { width: 18, height: 18 };
  if (kind === "telegram") return <svg {...s} viewBox="0 0 24 24" fill="currentColor"><path d="M21.94 4.6c.2-.86-.66-1.55-1.46-1.2L2.9 10.7c-.86.34-.8 1.6.1 1.86l4.4 1.27 1.7 5.18c.2.6.96.78 1.4.32l2.46-2.5 4.46 3.28c.6.44 1.46.12 1.62-.6L21.94 4.6zM8.2 13.2l8.5-5.2-6.9 6.5c-.16.16-.27.37-.3.6l-.26 2.1-1.04-4z"/></svg>;
  if (kind === "at") return <svg {...s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="4"/><path d="M16 12v1.5a2.5 2.5 0 0 0 5 0V12a9 9 0 1 0-3.6 7.2"/></svg>;
  if (kind === "globe") return <svg {...s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 3 2.5 15 0 18M12 3c-2.5 3-2.5 15 0 18"/></svg>;
  return <svg {...s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="6" y="3" width="12" height="18" rx="2"/><path d="M10 18h4"/></svg>;
}

function PhoneMock({ audience }) {
  return (
    <div className="phone">
      <div className="phone__notch"></div>
      <div className="phone__screen">
        <div className="phone__hero">
          <div className="balance">{audience === "clients" ? "Твои баллы" : "Сегодня в кабинете"}</div>
          <div className="pts">{audience === "clients" ? "2 480" : "+184"}</div>
        </div>
        <div className="phone__qr">
          <div className="qr"></div>
          <div className="label">{audience === "clients" ? "Покажи на кассе" : "Визиты сегодня"}</div>
        </div>
        <div className="phone__nav">
          <span></span><span></span><span></span><span></span>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// FAQ
// ─────────────────────────────────────────────────────────────
function FAQ({ copy }) {
  return (
    <section className="section" id="faq" style={{ background: "var(--bg-alt)" }}>
      <div className="container">
        <div className="faq-grid">
          <div>
            <span className="eyebrow">FAQ</span>
            <h2>{copy.faqTitle}</h2>
          </div>
          <div>
            {copy.faq.map((item, i) => (
              <details className="faq-item" key={i} open={i === 0}>
                <summary>
                  {item.q}
                  <span className="toggle">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
                  </span>
                </summary>
                <div className="a">{item.a}</div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// CTA banner
// ─────────────────────────────────────────────────────────────
function CTABanner({ copy }) {
  return (
    <section className="section cta-banner" id="cta">
      <div className="container">
        <h2>{copy.footerCTA}</h2>
        <a href="#" className="btn btn--pop" style={{ fontSize: 18, padding: "20px 32px" }}>
          {copy.footerCTAbtn} <Arrow />
        </a>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// Footer
// ─────────────────────────────────────────────────────────────
function Footer({ t }) {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div style={{ marginBottom: 14 }}>
              <Logo height={40} />
            </div>
            <p style={{ maxWidth: 280, lineHeight: 1.4, margin: 0, opacity: .8 }}>{t.footer.tagline}</p>
            <div style={{ marginTop: 22, fontSize: 13, opacity: .65 }}>
              <strong style={{ display: "block", textTransform: "uppercase", letterSpacing: "0.1em", fontSize: 11, opacity: .8, marginBottom: 6 }}>{t.footer.city}</strong>
              {t.footer.cityVal}
            </div>
          </div>

          <div>
            <h4>{t.footer.links}</h4>
            <ul>
              <li><a href="#how">{t.nav.how}</a></li>
              <li><a href="#cats">{t.nav.places}</a></li>
              <li><a href="#business">{t.nav.business}</a></li>
              <li><a href="#faq">{t.nav.faq}</a></li>
            </ul>
          </div>

          <div>
            <h4>{t.footer.legal}</h4>
            <ul>
              <li><a href="#">{t.footer.privacy}</a></li>
              <li><a href="#">{t.footer.terms}</a></li>
              <li><a href="#">{t.footer.offer}</a></li>
            </ul>
          </div>

          <div className="newsletter">
            <h4>{t.footer.newsletter}</h4>
            <form onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder={t.footer.newsPlaceholder} />
              <button type="submit">{t.footer.newsBtn} →</button>
            </form>
            <div style={{ marginTop: 18, fontSize: 13, opacity: .65 }}>
              hello@ayoo.app · @ayoo
            </div>
          </div>
        </div>

        <div className="footer__mega" aria-hidden="true">ayoo<span className="dot"></span></div>

        <div className="footer__base">
          <span>{t.footer.copy}</span>
          <span>Made with ✱ in Tashkent</span>
        </div>
      </div>
    </footer>
  );
}

// expose all
Object.assign(window, {
  IntroOverlay, TopNav, Hero, Marquee, HowItWorks, Categories,
  PlacesGrid, Stats, AppSection, FAQ, CTABanner, Footer, Arrow, LavaBg,
});
