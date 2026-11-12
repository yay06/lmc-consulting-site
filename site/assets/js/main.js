/* ==========================================================================
   LMC Consulting : comportements communs à toutes les pages
   ========================================================================== */
(() => {
  "use strict";

  const CATS = window.LMC_CATEGORIES || {};
  const FLUX = window.LMC_FLUX || { articles: [] };
  /* Actualités = articles du cabinet (donnees.js) + flux automatique (flux.js) */
  const OWN = (window.LMC_ACTUALITES || []).filter((a) => !a.brouillon).map((a) => ({ ...a, interne: true }));
  const AUTO = (FLUX.articles || []).map((a) => ({ ...a, externe: true }));
  const NEWS = OWN.concat(AUTO).sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : (a.interne ? -1 : 1)));
  const DEADLINES = (window.LMC_ECHEANCES || []).slice().sort((a, b) => (a.date > b.date ? 1 : -1));

  const ARROW = '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  const EXTERNAL = '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 16L16 8M9.5 8H16v6.5"/></svg>';
  const fmtLong = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  const fmtMonth = new Intl.DateTimeFormat("fr-FR", { month: "short" });
  const fmtWeekday = new Intl.DateTimeFormat("fr-FR", { weekday: "long", timeZone: "UTC" });

  const parseDate = (s) => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const catLabel = (c) => (CATS[c] && CATS[c].label) || c;
  const articleUrl = (a) => (a.externe ? a.url : "article.html?a=" + encodeURIComponent(a.slug));
  const linkAttrs = (a) => (a.externe ? ' target="_blank" rel="noopener"' : "");

  /* ---------- Heure de Paris ---------- */
  function parisNow() {
    const parts = {};
    new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/Paris", year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", hourCycle: "h23"
    }).formatToParts(new Date()).forEach((p) => { parts[p.type] = p.value; });
    const ymd = `${parts.year}-${parts.month}-${parts.day}`;
    return { ymd, minutes: (Number(parts.hour) % 24) * 60 + Number(parts.minute) };
  }
  const addDays = (ymd, k) => {
    const [y, m, d] = ymd.split("-").map(Number);
    return new Date(Date.UTC(y, m - 1, d + k)).toISOString().slice(0, 10);
  };
  const weekday = (ymd) => { const [y, m, d] = ymd.split("-").map(Number); return new Date(Date.UTC(y, m - 1, d)).getUTCDay(); };
  const daysBetween = (fromYmd, toYmd) => Math.round((Date.parse(toYmd) - Date.parse(fromYmd)) / 86400000);

  /* ---------- Horaires d'ouverture ---------- */
  const HOLIDAYS = [
    "2026-11-11", "2026-12-25",
    "2027-01-01", "2027-03-29", "2027-05-01", "2027-05-06", "2027-05-08", "2027-05-17",
    "2027-07-14", "2027-08-15", "2027-11-01", "2027-11-11", "2027-12-25"
  ];
  const SLOTS = [[9 * 60, 13 * 60], [14 * 60, 18 * 60]];
  const isWorkday = (ymd) => { const wd = weekday(ymd); return wd >= 1 && wd <= 5 && !HOLIDAYS.includes(ymd); };

  function openingStatus() {
    const { ymd, minutes } = parisNow();
    if (isWorkday(ymd)) {
      for (const [start, end] of SLOTS) {
        if (minutes >= start && minutes < end) return { open: true, text: `Ouvert · jusqu'à ${end / 60} h` };
      }
      if (minutes < SLOTS[0][0]) return { open: false, text: "Fermé · ouvre aujourd'hui à 9 h" };
      if (minutes >= SLOTS[0][1] && minutes < SLOTS[1][0]) return { open: false, text: "Pause déjeuner · réouverture à 14 h" };
    }
    for (let k = 1; k <= 10; k++) {
      const next = addDays(ymd, k);
      if (isWorkday(next)) {
        const day = k === 1 ? "demain" : fmtWeekday.format(new Date(Date.parse(next)));
        return { open: false, text: `Fermé · ouvre ${day} à 9 h` };
      }
    }
    return { open: false, text: "Fermé" };
  }

  function renderOpening() {
    const s = openingStatus();
    document.querySelectorAll("[data-open-status]").forEach((el) => {
      el.textContent = s.text;
      el.classList.toggle("is-open", s.open);
    });
    const wd = weekday(parisNow().ymd);
    document.querySelectorAll("[data-hours] tr").forEach((tr) => tr.classList.toggle("today", Number(tr.dataset.day) === wd));
  }

  /* ---------- Échéancier ---------- */
  function upcomingDeadlines() {
    const today = parisNow().ymd;
    return DEADLINES.filter((d) => d.date >= today);
  }
  function relative(ymd) {
    const n = daysBetween(parisNow().ymd, ymd);
    if (n === 0) return "Aujourd'hui";
    if (n === 1) return "Demain";
    if (n <= 14) return `Dans ${n} jours`;
    return "";
  }
  function renderDeadlines() {
    const list = upcomingDeadlines();
    document.querySelectorAll("[data-deadlines]").forEach((ul) => {
      const limit = Number(ul.dataset.limit) || 5;
      if (!list.length) { ul.innerHTML = '<li class="deadline"><p class="w">Le calendrier est en cours de mise à jour.</p></li>'; return; }
      ul.innerHTML = list.slice(0, limit).map((d) => {
        const date = parseDate(d.date);
        const rel = relative(d.date);
        return `<li class="deadline">
          <div class="d"><b>${date.getDate()}</b><small>${esc(fmtMonth.format(date))}</small></div>
          <div><p class="t">${esc(d.titre)}</p><p class="w">${esc(d.detail || "")}</p>${rel ? `<span class="soon">${rel}</span>` : ""}</div>
        </li>`;
      }).join("");
    });
    const next = list[0];
    document.querySelectorAll("[data-next-deadline]").forEach((el) => {
      if (!next) { el.hidden = true; return; }
      const date = parseDate(next.date);
      const rel = relative(next.date);
      el.innerHTML = `<span class="date"><b>${date.getDate()}</b><small>${esc(fmtMonth.format(date))}</small></span>
        <span><span class="label">Prochaine échéance</span><span class="what">${esc(next.titre)}</span>${rel ? `<span class="when">${rel}</span>` : ""}</span>`;
    });
  }

  /* ---------- Cartes d'actualité ---------- */
  const isNew = (a) => daysBetween(a.date, parisNow().ymd) <= 3;
  function metaHTML(a) {
    return `<span class="tag" data-cat="${esc(a.categorie)}">${esc(catLabel(a.categorie))}</span><time datetime="${a.date}">${fmtLong.format(parseDate(a.date))}</time>${isNew(a) ? '<span class="new">Nouveau</span>' : ""}`;
  }
  function cardHTML(a) {
    const foot = a.externe
      ? `<span class="src">${esc(a.source)}</span>${EXTERNAL}<span class="visually-hidden"> (nouvel onglet)</span>`
      : `<span>${a.lecture} min de lecture</span>${ARROW}`;
    return `<a class="news-card${a.externe ? " is-external" : ""}" href="${esc(articleUrl(a))}"${linkAttrs(a)}>
      <div class="news-meta">${metaHTML(a)}</div>
      <h3>${esc(a.titre)}</h3>
      <p>${esc(a.chapo)}</p>
      <span class="read">${foot}</span>
    </a>`;
  }
  function renderFluxInfo() {
    const els = document.querySelectorAll("[data-flux-maj]");
    if (!els.length) return;
    const maj = FLUX.maj ? new Date(FLUX.maj) : null;
    const when = maj && !isNaN(maj) ? ` · dernière mise à jour le ${fmtLong.format(maj)}` : "";
    const sources = (FLUX.sources || []).map((s) => esc(s.nom)).join(", ");
    els.forEach((el) => {
      el.innerHTML = `Actualisé automatiquement chaque jour${when}.${sources ? ` Sources : ${sources}, informations publiques réutilisées sous Licence Ouverte.` : ""}`;
    });
  }
  function renderLatest() {
    document.querySelectorAll("[data-latest-news]").forEach((el) => {
      const limit = Number(el.dataset.limit) || 3;
      el.innerHTML = NEWS.slice(0, limit).map(cardHTML).join("");
    });
  }

  /* ---------- En-tête et menu mobile ---------- */
  function initHeader() {
    const header = document.querySelector(".site-header");
    if (!header) return;
    const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const toggle = header.querySelector(".nav-toggle");
    if (!toggle) return;
    const setOpen = (open) => {
      header.classList.toggle("nav-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Fermer le menu" : "Menu");
    };
    toggle.addEventListener("click", () => setOpen(!header.classList.contains("nav-open")));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && header.classList.contains("nav-open")) { setOpen(false); toggle.focus(); }
    });
    header.querySelectorAll(".main-nav a").forEach((a) => a.addEventListener("click", () => setOpen(false)));
    window.matchMedia("(min-width: 981px)").addEventListener("change", (e) => { if (e.matches) setOpen(false); });
  }

  /* ---------- Onglets ---------- */
  function initTabs() {
    document.querySelectorAll("[data-tabs]").forEach((root) => {
      const tabs = Array.from(root.querySelectorAll('[role="tab"]'));
      const select = (tab, focus) => {
        tabs.forEach((t) => {
          const on = t === tab;
          t.setAttribute("aria-selected", String(on));
          t.tabIndex = on ? 0 : -1;
          const panel = document.getElementById(t.getAttribute("aria-controls"));
          if (panel) panel.hidden = !on;
        });
        if (focus) tab.focus();
      };
      tabs.forEach((t, i) => {
        t.addEventListener("click", () => select(t));
        t.addEventListener("keydown", (e) => {
          const keys = { ArrowDown: i + 1, ArrowRight: i + 1, ArrowUp: i - 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 };
          if (!(e.key in keys)) return;
          e.preventDefault();
          select(tabs[(keys[e.key] + tabs.length) % tabs.length], true);
        });
      });
    });
  }

  /* ---------- Apparition au défilement ---------- */
  function initReveal() {
    const els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      els.forEach((el) => el.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -6% 0px" });
    els.forEach((el) => io.observe(el));
  }

  /* ---------- Plan d'accès (chargé à la demande) ---------- */
  function initMaps() {
    document.querySelectorAll("[data-map]").forEach((box) => {
      const btn = box.querySelector("button");
      if (!btn) return;
      btn.addEventListener("click", () => {
        const iframe = document.createElement("iframe");
        iframe.src = "https://www.google.com/maps?q=" + encodeURIComponent(box.dataset.map) + "&output=embed";
        iframe.title = "Plan d'accès au cabinet LMC Consulting";
        iframe.loading = "lazy";
        iframe.referrerPolicy = "no-referrer-when-downgrade";
        box.innerHTML = "";
        box.appendChild(iframe);
      });
    });
  }

  /* ---------- Formulaires (contact, lettre d'information) ---------- */
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  function initForms() {
    document.querySelectorAll("form[data-form]").forEach((form) => {
      form.setAttribute("novalidate", "");
      const status = form.querySelector(".form-status");
      const show = (type, msg) => { if (!status) return; status.className = "form-status " + type; status.textContent = msg; };

      const check = (f) => {
        const ok = f.type === "checkbox" ? f.checked : f.value.trim() !== "" && (f.type !== "email" || EMAIL_RE.test(f.value.trim()));
        const field = f.closest(".field");
        if (field) field.classList.toggle("invalid", !ok);
        f.setAttribute("aria-invalid", String(!ok));
        return ok;
      };
      form.querySelectorAll("[required]").forEach((f) => {
        f.addEventListener(f.type === "checkbox" || f.tagName === "SELECT" ? "change" : "input", () => {
          if (f.closest(".field.invalid")) check(f);
        });
      });

      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const invalid = Array.from(form.querySelectorAll("[required]")).filter((f) => !check(f));
        if (invalid.length) { invalid[0].focus(); return; }

        const data = new FormData(form);
        const endpoint = form.dataset.endpoint;
        if (endpoint) {
          const btn = form.querySelector('[type="submit"]');
          if (btn) btn.disabled = true;
          try {
            const res = await fetch(endpoint, { method: "POST", body: data, headers: { Accept: "application/json" } });
            if (!res.ok) throw new Error(res.status);
            form.reset();
            show("ok", form.dataset.success || "Merci, votre message a bien été envoyé.");
          } catch {
            show("err", "L'envoi n'a pas abouti. Vous pouvez nous écrire directement à contact@lmcconsulting.fr.");
          } finally {
            if (btn) btn.disabled = false;
          }
          return;
        }

        /* Sans service d'envoi configuré : ouverture de la messagerie avec le message pré-rempli */
        const lines = [];
        for (const [name, value] of data.entries()) {
          if (name === "consentement" || !String(value).trim()) continue;
          const el = form.querySelector(`[name="${name}"][data-label]`);
          lines.push(`${el ? el.dataset.label : name} : ${value}`);
        }
        const subject = form.dataset.subject || (data.get("objet") ? `Demande : ${data.get("objet")}` : "Demande depuis le site");
        window.location.href = "mailto:contact@lmcconsulting.fr?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(lines.join("\n"));
        show("ok", form.dataset.mailtoSuccess || "Votre messagerie s'ouvre avec votre message pré-rempli : il ne vous reste qu'à l'envoyer.");
      });
    });
  }

  /* ---------- API partagée avec actualites.js et article.js ---------- */
  window.LMC = { CATS, NEWS, ARROW, EXTERNAL, fmtLong, parseDate, esc, catLabel, cardHTML, articleUrl, linkAttrs, metaHTML, daysBetween, parisNow };

  renderOpening();
  setInterval(renderOpening, 60000);
  renderDeadlines();
  renderLatest();
  renderFluxInfo();
  initHeader();
  initTabs();
  initReveal();
  initMaps();
  initForms();
})();
