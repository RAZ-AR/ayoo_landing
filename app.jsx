// ayoo landing — app shell

const { useState, useEffect } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": ["#FAF7F4", "#1E1630", "#FF3E8E", "#F5F0FF"],
  "displayFont": "Unbounded",
  "showIntro": true,
  "lavaBg": true,
  "audienceDefault": "clients",
  "langDefault": "sr"
}/*EDITMODE-END*/;

const PALETTES = {
  "Жемчуг": ["#FAF7F4", "#1E1630", "#FF3E8E", "#F5F0FF"],
  "Аврора": ["#FFF8F5", "#1C2A1E", "#FF6B6B", "#FFF0EB"],
  "Лаванда": ["#F8F5FF", "#1E1640", "#8B5CF6", "#F0EBFF"],
  "Закат": ["#FFF6F0", "#2A1420", "#FB923C", "#FFF1E8"],
  "Мята": ["#F3FFF8", "#0F2318", "#10B981", "#EAFBF6"],
};

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  const [lang, setLang] = useState(() => {
    try { return localStorage.getItem("ayoo_lang") || t.langDefault || "ru"; }
    catch (e) { return t.langDefault || "ru"; }
  });
  const [audience, setAudience] = useState(() => {
    try { return localStorage.getItem("ayoo_audience") || t.audienceDefault || "clients"; }
    catch (e) { return t.audienceDefault || "clients"; }
  });
  const [introDone, setIntroDone] = useState(() => {
    if (!t.showIntro) return true;
    try { return sessionStorage.getItem("ayoo_intro_done") === "1"; }
    catch (e) { return false; }
  });

  // persist lang / audience
  useEffect(() => { try { localStorage.setItem("ayoo_lang", lang); } catch(e){} }, [lang]);
  useEffect(() => { try { localStorage.setItem("ayoo_audience", audience); } catch(e){} }, [audience]);

  // apply palette + font as CSS variables on :root
  useEffect(() => {
    const r = document.documentElement;
    const [bg, ink, pop, bgAlt] = t.palette;
    r.style.setProperty("--bg", bg);
    r.style.setProperty("--ink", ink);
    r.style.setProperty("--pop", pop);
    r.style.setProperty("--bg-alt", bgAlt);
    r.style.setProperty("--font-display", `"${t.displayFont}", "Bricolage Grotesque", system-ui, sans-serif`);
  }, [t.palette, t.displayFont]);

  // toggle the lava background body class
  useEffect(() => {
    document.body.classList.toggle("has-lava", !!t.lavaBg);
  }, [t.lavaBg]);

  const i18n = window.AYOO_I18N[lang] || window.AYOO_I18N.ru;
  const copy = i18n[audience];

  const handleEnter = () => {
    setIntroDone(true);
    try { sessionStorage.setItem("ayoo_intro_done", "1"); } catch(e){}
  };

  // pick a font Google import based on tweak
  useEffect(() => {
    const id = "__gfont_link";
    const family = t.displayFont.replace(/ /g, "+");
    const href = `https://fonts.googleapis.com/css2?family=${family}:wght@400;700;800;900&family=Manrope:wght@400;500;600;700&display=swap`;
    let link = document.getElementById(id);
    if (!link) {
      link = document.createElement("link");
      link.id = id;
      link.rel = "stylesheet";
      document.head.appendChild(link);
    }
    link.href = href;
  }, [t.displayFont]);

  return (
    <>
      {t.lavaBg && <LavaBg />}

      {!introDone && t.showIntro && (
        <IntroOverlay copy={i18n.intro} onEnter={handleEnter} />
      )}

      <TopNav
        t={i18n}
        lang={lang} setLang={setLang}
        audience={audience} setAudience={setAudience}
      />

      <Hero copy={copy} />

      <Marquee items={copy.ticker} />

      <HowItWorks copy={copy} />

      <Categories copy={copy} />

      <Marquee items={copy.ticker} inverted />

      <PlacesGrid copy={copy} />

      <Stats copy={copy} />

      <AppSection copy={copy} audience={audience} />

      <FAQ copy={copy} />

      <CTABanner copy={copy} />

      <Footer t={i18n} />

      <TweaksPanel>
        <TweakSection label="Audience & language" />
        <TweakRadio
          label="Audience"
          value={audience}
          options={[
            { value: "clients", label: i18n.nav.audienceClients },
            { value: "partners", label: i18n.nav.audiencePartners },
          ]}
          onChange={(v) => setAudience(v)}
        />
        <TweakRadio
          label="Language"
          value={lang}
          options={[
            { value: "ru", label: "RU" },
            { value: "en", label: "EN" },
            { value: "sr", label: "SR" },
          ]}
          onChange={(v) => setLang(v)}
        />

        <TweakSection label="Visual style" />
        <TweakToggle
          label="Animated lava background"
          value={t.lavaBg}
          onChange={(v) => setTweak("lavaBg", v)}
        />
        <TweakColor
          label="Palette"
          value={t.palette}
          options={Object.values(PALETTES)}
          onChange={(v) => setTweak("palette", v)}
        />
        <TweakSelect
          label="Display font"
          value={t.displayFont}
          options={[
            "Unbounded",
            "Bricolage Grotesque",
            "Bowlby One",
            "Bagel Fat One",
            "Archivo Black",
            "Big Shoulders Display",
            "Boldonse",
            "Fraunces",
          ]}
          onChange={(v) => setTweak("displayFont", v)}
        />

        <TweakSection label="Intro" />
        <TweakToggle
          label="Show intro overlay"
          value={t.showIntro}
          onChange={(v) => { setTweak("showIntro", v); if (v) { try { sessionStorage.removeItem("ayoo_intro_done"); } catch(e){} setIntroDone(false); } }}
        />
        <TweakButton
          label="Replay intro"
          onClick={() => { try { sessionStorage.removeItem("ayoo_intro_done"); } catch(e){} setIntroDone(false); }}
        />
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
