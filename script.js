(function () {
  "use strict";

  const COPY = {
    en: {
      statusPill: "Currently building this site",
      heroTitle: "Backend apprentice, C++ curious.",
      heroBody: "I'm Florian — a third-year software engineering apprentice at Deutsche Börse in Frankfurt. I spend most of my time on backend systems and C++, and this page is where I'll keep track of what I build along the way.",
      ctaMail: "Say hello",
      nowLabel: "Right now",
      nowTitle: "Building my first project — this homepage",
      nowBody: "My first real web project, written from scratch. Follow the build log to see where it stands.",
      nowCta: "See the build log",
      aboutTitle: "About me",
      aboutP1: "I'm Florian Dehm, a software engineering apprentice in my third year at Deutsche Börse, based in Frankfurt am Main.",
      aboutP2: "Most of my day is backend work — the parts of a system nobody sees but everything depends on. C++ is what I keep coming back to: it's unforgiving, and that's exactly why I like it.",
      aboutP3: "This site is my first project outside of work. It's small on purpose. I'd rather finish something honest than start something ambitious and drop it.",
      aboutRows: [
        ["Role", "Software Engineer (Apprentice)"],
        ["Company", "Deutsche Börse"],
        ["Year", "3rd of apprenticeship"],
        ["Based in", "Frankfurt am Main, DE"],
        ["Focus", "Backend · C++"]
      ],
      stackLabel: "Working with",
      projectsTitle: "Projects",
      projectsIntro: "One at a time, finished before the next. Here's what exists so far.",
      p1Title: "Personal homepage",
      p1Body: "This site — my first project. Tabs, dark mode, two languages, and a build log I actually keep updated.",
      p1Long: "My first project outside of work: a small personal site built from scratch, no framework and no template. It has four tabs, a light and dark theme with a full token set, German and English throughout, and a build log I keep honest — including the parts that aren't done.\n\nThe interesting part wasn't the code. Getting spacing, type and contrast to feel calm took far longer than the logic did, and that's the part I'd do differently next time: design first, then build.",
      p1Role: "Everything — design and code",
      p1Year: "2026 · in progress",
      shotLabel: "screenshot",
      modalRepo: "View on GitHub",
      modalClose: "Close",
      modalRoleLabel: "Role",
      modalYearLabel: "Status",
      modalTechLabel: "Built with",
      cardCta: "Details",
      inProgress: "In progress",
      emptyTitle: "Nothing else here yet",
      emptyBody: "The second project starts once the first one is genuinely done. Check back.",
      currentTitle: "Current project",
      updated: "Updated Aug 2026",
      currentIntro: "This homepage. Here's an honest checklist of what's done and what's still open.",
      progressLabel: "Progress",
      learningLabel: "What I'm learning from it",
      learningBody: "Layout is harder than logic. Getting spacing, type and contrast to feel calm took longer than any of the code — and I'd rather sit with that than hide it behind a template.",
      milestones: [
        ["Decide what the site should be", "Four tabs, no blog, no clutter.", "Jul 2026", true],
        ["Structure and navigation", "Home, About, Projects, Current — one tab bar, no nesting.", "Jul 2026", true],
        ["Visual language", "Type scale, neutral palette, one accent.", "Aug 2026", true],
        ["Dark mode", "Full token set for both themes.", "Aug 2026", true],
        ["German + English", "Every string translated, toggle in the header.", "Aug 2026", true],
        ["Real project entries", "Waiting on the first finished project.", "open", false],
        ["Put it online", "Own domain, deploy pipeline.", "open", false]
      ]
    },
    de: {
      statusPill: "Baue gerade diese Seite",
      heroTitle: "Backend-Azubi, neugierig auf C++.",
      heroBody: "Ich bin Florian — Fachinformatiker-Azubi im dritten Lehrjahr bei der Deutschen Börse in Frankfurt. Den Großteil meiner Zeit verbringe ich mit Backend-Systemen und C++, und hier halte ich fest, was dabei entsteht.",
      ctaMail: "Schreib mir",
      nowLabel: "Gerade jetzt",
      nowTitle: "Mein erstes Projekt — diese Homepage",
      nowBody: "Mein erstes richtiges Webprojekt, von Grund auf gebaut. Im Build-Log siehst du, wo es steht.",
      nowCta: "Zum Build-Log",
      aboutTitle: "Über mich",
      aboutP1: "Ich bin Florian Dehm, Softwareentwickler-Azubi im dritten Lehrjahr bei der Deutschen Börse, wohnhaft in Frankfurt am Main.",
      aboutP2: "Der größte Teil meines Tages ist Backend-Arbeit — die Teile eines Systems, die niemand sieht und von denen alles abhängt. C++ ist das, wozu ich immer zurückkomme: es verzeiht nichts, und genau deshalb mag ich es.",
      aboutP3: "Diese Seite ist mein erstes Projekt außerhalb der Arbeit. Bewusst klein gehalten. Lieber etwas Ehrliches fertigstellen als etwas Großes anfangen und liegen lassen.",
      aboutRows: [
        ["Rolle", "Softwareentwickler (Azubi)"],
        ["Unternehmen", "Deutsche Börse"],
        ["Lehrjahr", "3. Lehrjahr"],
        ["Standort", "Frankfurt am Main, DE"],
        ["Schwerpunkt", "Backend · C++"]
      ],
      stackLabel: "Arbeite mit",
      projectsTitle: "Projekte",
      projectsIntro: "Eins nach dem anderen, fertig bevor das nächste beginnt. Das hier gibt es bisher.",
      p1Title: "Persönliche Homepage",
      p1Body: "Diese Seite — mein erstes Projekt. Tabs, Dark Mode, zwei Sprachen und ein Build-Log, das ich wirklich pflege.",
      p1Long: "Mein erstes Projekt außerhalb der Arbeit: eine kleine persönliche Seite, von Grund auf gebaut — ohne Framework, ohne Template. Vier Tabs, helles und dunkles Theme mit vollständigen Tokens, durchgehend Deutsch und Englisch, und ein Build-Log, das ehrlich bleibt — inklusive der Punkte, die noch offen sind.\n\nDas Spannende war nicht der Code. Abstände, Typo und Kontrast ruhig wirken zu lassen hat deutlich länger gedauert als die Logik — und genau das würde ich beim nächsten Mal anders machen: erst gestalten, dann bauen.",
      p1Role: "Alles — Design und Code",
      p1Year: "2026 · in Arbeit",
      shotLabel: "screenshot",
      modalRepo: "Auf GitHub ansehen",
      modalClose: "Schließen",
      modalRoleLabel: "Rolle",
      modalYearLabel: "Status",
      modalTechLabel: "Gebaut mit",
      cardCta: "Details",
      inProgress: "In Arbeit",
      emptyTitle: "Sonst noch nichts",
      emptyBody: "Das zweite Projekt startet, wenn das erste wirklich fertig ist. Schau später nochmal vorbei.",
      currentTitle: "Aktuelles Projekt",
      updated: "Stand Aug. 2026",
      currentIntro: "Diese Homepage. Hier eine ehrliche Checkliste: was steht und was noch offen ist.",
      progressLabel: "Fortschritt",
      learningLabel: "Was ich dabei lerne",
      learningBody: "Layout ist schwerer als Logik. Abstände, Typo und Kontrast ruhig wirken zu lassen hat länger gedauert als der ganze Code — und das gebe ich lieber zu, als es hinter einem Template zu verstecken.",
      milestones: [
        ["Festlegen, was die Seite sein soll", "Vier Tabs, kein Blog, kein Ballast.", "Jul. 2026", true],
        ["Struktur und Navigation", "Home, Über mich, Projekte, Aktuell — eine Tab-Leiste, keine Verschachtelung.", "Jul. 2026", true],
        ["Visuelle Sprache", "Typo-Skala, neutrale Palette, ein Akzent.", "Aug. 2026", true],
        ["Dark Mode", "Vollständige Tokens für beide Themes.", "Aug. 2026", true],
        ["Deutsch + Englisch", "Jeder Text übersetzt, Umschalter im Header.", "Aug. 2026", true],
        ["Echte Projekteinträge", "Wartet auf das erste fertige Projekt.", "offen", false],
        ["Online stellen", "Eigene Domain, Deploy-Pipeline.", "offen", false]
      ]
    }
  };

  const TABS = {
    en: [["home", "Home"], ["about", "About"], ["projects", "Projects"], ["current", "Current"]],
    de: [["home", "Start"], ["about", "Über mich"], ["projects", "Projekte"], ["current", "Aktuell"]]
  };

  const STACK = ["C++", "Python", "SQL", "Git", "Linux", "HTML/CSS", "JavaScript"];

  const state = {
    tab: "home",
    openId: null,
    lang: "en",
    theme: "light"
  };

  try {
    const s = JSON.parse(localStorage.getItem("fd-home") || "{}");
    if (s.lang) state.lang = s.lang;
    if (s.theme) state.theme = s.theme;
  } catch (e) {}

  function persist() {
    try { localStorage.setItem("fd-home", JSON.stringify({ lang: state.lang, theme: state.theme })); } catch (e) {}
  }

  const app = document.getElementById("app");
  const $ = (id) => document.getElementById(id);

  function project(t) {
    const parts = t.p1Long.split("\n\n");
    return {
      title: t.p1Title,
      blurb: t.p1Body,
      long1: parts[0],
      long2: parts[1] || "",
      role: t.p1Role,
      year: t.p1Year,
      tech: ["HTML", "CSS", "JavaScript"],
      repo: "https://github.com/DonckyTM",
      shot: t.shotLabel
    };
  }

  function render() {
    const t = COPY[state.lang];
    const dark = state.theme === "dark";

    app.dataset.theme = state.theme;
    document.documentElement.lang = state.lang;

    // header
    $("langToggle").textContent = state.lang === "en" ? "EN / DE" : "DE / EN";
    $("themeToggle").textContent = dark ? "☀" : "☾";

    const tabsEl = $("tabs");
    tabsEl.innerHTML = "";
    TABS[state.lang].forEach(([id, label]) => {
      const btn = document.createElement("button");
      btn.className = "tab-btn" + (state.tab === id ? " active" : "");
      btn.textContent = label;
      btn.addEventListener("click", () => { state.tab = id; window.scrollTo({ top: 0 }); render(); });
      tabsEl.appendChild(btn);
    });

    document.querySelectorAll(".section").forEach((el) => {
      el.classList.toggle("active", el.dataset.section === state.tab);
    });

    // home
    $("statusPillText").textContent = t.statusPill;
    $("heroTitle").textContent = t.heroTitle;
    $("heroBody").textContent = t.heroBody;
    $("ctaMail").textContent = t.ctaMail;
    $("nowLabel").textContent = t.nowLabel;
    $("nowTitle").textContent = t.nowTitle;
    $("nowBody").textContent = t.nowBody;
    $("goCurrent").textContent = t.nowCta + " →";
    $("goCurrent").onclick = () => { state.tab = "current"; window.scrollTo({ top: 0 }); render(); };

    const facts = [
      { k: state.lang === "en" ? "Role" : "Rolle", v: state.lang === "en" ? "SWE Apprentice" : "SWE-Azubi" },
      { k: state.lang === "en" ? "Based in" : "Standort", v: "Frankfurt a. M." },
      { k: state.lang === "en" ? "Focus" : "Schwerpunkt", v: "Backend · C++" }
    ];
    const factsEl = $("facts");
    factsEl.innerHTML = "";
    facts.forEach((f) => {
      const card = document.createElement("div");
      card.className = "fact-card";
      card.innerHTML = `<div class="eyebrow">${f.k}</div><div class="fact-val">${f.v}</div>`;
      factsEl.appendChild(card);
    });

    // about
    $("aboutTitle").textContent = t.aboutTitle;
    $("aboutP1").textContent = t.aboutP1;
    $("aboutP2").textContent = t.aboutP2;
    $("aboutP3").textContent = t.aboutP3;
    const rowsEl = $("aboutRows");
    rowsEl.innerHTML = "";
    t.aboutRows.forEach(([k, v]) => {
      const row = document.createElement("div");
      row.className = "about-row";
      row.innerHTML = `<span class="about-row-k">${k}</span><span class="about-row-v">${v}</span>`;
      rowsEl.appendChild(row);
    });
    $("stackLabel").textContent = t.stackLabel;
    const stackEl = $("stackTags");
    stackEl.innerHTML = "";
    STACK.forEach((s) => {
      const tag = document.createElement("span");
      tag.className = "stack-tag";
      tag.textContent = s;
      stackEl.appendChild(tag);
    });

    // projects
    $("projectsTitle").textContent = t.projectsTitle;
    $("projectsIntro").textContent = t.projectsIntro;

    const p = project(t);
    const grid = $("projectsGrid");
    grid.innerHTML = "";
    const card = document.createElement("button");
    card.className = "project-card";
    card.innerHTML = `
      <div class="project-shot">
        <span class="project-num">01</span>
        <span class="shot-tag">${p.shot}</span>
      </div>
      <div class="project-body">
        <div class="project-head">
          <span class="project-title">${p.title}</span>
          <span class="project-badge">${t.inProgress}</span>
        </div>
        <p class="project-blurb">${p.blurb}</p>
        <span class="project-cta">${t.cardCta} →</span>
      </div>`;
    card.addEventListener("click", () => { state.openId = "p1"; render(); });
    grid.appendChild(card);
    const emptyClone = document.createElement("div");
    emptyClone.className = "empty-card";
    emptyClone.innerHTML = `<div class="empty-title">${t.emptyTitle}</div><p class="empty-body">${t.emptyBody}</p>`;
    grid.appendChild(emptyClone);

    // current
    $("currentTitle").textContent = t.currentTitle;
    $("updated").textContent = t.updated;
    $("currentIntro").textContent = t.currentIntro;
    $("progressLabel").textContent = t.progressLabel;
    const done = t.milestones.filter((m) => m[3]).length;
    const pct = Math.round((done / t.milestones.length) * 100);
    $("progressText").textContent = `${done} / ${t.milestones.length} · ${pct}%`;
    $("progressFill").style.width = pct + "%";

    const msEl = $("milestones");
    msEl.innerHTML = "";
    t.milestones.forEach(([title, note, date, isDone]) => {
      const row = document.createElement("div");
      row.className = "milestone" + (isDone ? " done" : "");
      row.innerHTML = `
        <div class="milestone-dot">${isDone ? "✓" : ""}</div>
        <div class="milestone-body">
          <div class="milestone-title">${title}</div>
          <div class="milestone-note">${note}</div>
        </div>
        <div class="milestone-date">${date}</div>`;
      msEl.appendChild(row);
    });

    $("learningLabel").textContent = t.learningLabel;
    $("learningBody").textContent = t.learningBody;

    // modal
    const backdrop = $("modalBackdrop");
    if (state.openId) {
      backdrop.classList.add("open");
      $("modalShot").textContent = p.shot;
      $("modalTitle").textContent = p.title;
      $("modalYearLabel").textContent = t.modalYearLabel;
      $("modalYear").textContent = p.year;
      $("modalRoleLabel").textContent = t.modalRoleLabel;
      $("modalRole").textContent = p.role;
      $("modalLong1").textContent = p.long1;
      $("modalLong2").textContent = p.long2;
      $("modalTechLabel").textContent = t.modalTechLabel;
      const techEl = $("modalTech");
      techEl.innerHTML = "";
      p.tech.forEach((x) => {
        const tag = document.createElement("span");
        tag.className = "modal-tech-tag";
        tag.textContent = x;
        techEl.appendChild(tag);
      });
      const repoLink = $("modalRepo");
      repoLink.href = p.repo;
      repoLink.textContent = t.modalRepo;
      $("modalCloseBtn2").textContent = t.modalClose;
    } else {
      backdrop.classList.remove("open");
    }
  }

  function closeModal() { state.openId = null; render(); }

  $("langToggle").addEventListener("click", () => {
    state.lang = state.lang === "en" ? "de" : "en";
    persist();
    render();
  });
  $("themeToggle").addEventListener("click", () => {
    state.theme = state.theme === "dark" ? "light" : "dark";
    persist();
    render();
  });
  $("modalCloseBtn").addEventListener("click", closeModal);
  $("modalCloseBtn2").addEventListener("click", closeModal);
  $("modalBackdrop").addEventListener("click", (e) => {
    if (e.target === e.currentTarget) closeModal();
  });
  $("modal").addEventListener("click", (e) => e.stopPropagation());
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && state.openId) closeModal();
  });

  // parallax orbs
  let raf = null;
  function onScroll() {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = null;
      const y = window.scrollY || 0;
      const orbA = $("orbA"), orbB = $("orbB"), orbC = $("orbC");
      if (orbA) orbA.style.transform = `translate3d(${y * 0.04}px, ${y * -0.16}px, 0) scale(${1 + y * 0.00012})`;
      if (orbB) orbB.style.transform = `translate3d(${y * -0.05}px, ${y * -0.28}px, 0)`;
      if (orbC) orbC.style.transform = `translate3d(${y * 0.03}px, ${y * -0.42}px, 0)`;
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });

  render();
  onScroll();
})();
