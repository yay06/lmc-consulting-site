/* ==========================================================================
   LMC Consulting : page Actualités (filtres, recherche, pagination)
   ========================================================================== */
(() => {
  "use strict";
  const { NEWS, CATS, ARROW, EXTERNAL, esc, fmtLong, parseDate, catLabel, cardHTML, articleUrl, linkAttrs, metaHTML, daysBetween, parisNow } = window.LMC;
  const PAGE = 6;

  const $chips = document.querySelector("[data-chips]");
  const $search = document.querySelector("[data-search]");
  const $featured = document.querySelector("[data-featured]");
  const $grid = document.querySelector("[data-grid]");
  const $info = document.querySelector("[data-results-info]");
  const $more = document.querySelector("[data-more]");
  const $empty = document.querySelector("[data-empty]");
  if (!$chips || !$grid) return;

  const params = new URLSearchParams(location.search);
  const state = {
    cat: CATS[params.get("cat")] ? params.get("cat") : "all",
    q: params.get("q") || "",
    limit: PAGE
  };

  const norm = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  const strip = (html) => html.replace(/<[^>]+>/g, " ");
  const index = NEWS.map((a) => ({ a, text: norm([a.titre, a.chapo, strip(a.contenu || ""), a.source || "", catLabel(a.categorie)].join(" ")) }));

  /* Puces de rubriques (seules les rubriques qui contiennent des articles) : créées une fois,
     mises à jour ensuite pour conserver le focus clavier */
  const present = new Set(NEWS.map((a) => a.categorie));
  if (!present.has(state.cat)) state.cat = "all";
  const chipDefs = [["all", "Toutes"], ...Object.entries(CATS).filter(([k]) => present.has(k)).map(([k, v]) => [k, v.label])];
  $chips.innerHTML = chipDefs.map(([k, label]) =>
    `<button type="button" class="chip" data-cat="${k}" aria-pressed="false">${k !== "all" ? '<span class="dot" aria-hidden="true"></span>' : ""}${esc(label)} <span class="count"></span></button>`
  ).join("");

  function featuredHTML(a) {
    const date = fmtLong.format(parseDate(a.date));
    const extra = a.externe ? "" : `<span class="sep" aria-hidden="true"></span><span>${a.lecture} min de lecture</span>`;
    const cta = a.externe
      ? `<span class="link-arrow">Lire sur ${esc(a.source)} ${EXTERNAL}</span><span class="visually-hidden"> (nouvel onglet)</span>`
      : `<span class="link-arrow">Lire l'article ${ARROW}</span>`;
    return `<a class="featured" href="${esc(articleUrl(a))}"${linkAttrs(a)}>
      <div class="cover" data-cat="${esc(a.categorie)}">
        <div class="cover-top"><span class="cover-kicker">À la une</span><span>${date}</span></div>
        <span class="cover-word">${esc(catLabel(a.categorie))}</span>
      </div>
      <div class="featured-body">
        <div class="news-meta">${metaHTML(a)}${extra}</div>
        <h2>${esc(a.titre)}</h2>
        <p>${esc(a.chapo)}</p>
        ${cta}
      </div>
    </a>`;
  }

  /* « À la une » : un article du cabinet publié depuis moins de 30 jours passe devant le flux automatique */
  function pickFeatured(results) {
    const today = parisNow().ymd;
    return results.find((a) => a.interne && daysBetween(a.date, today) <= 30) || results[0];
  }

  function matches(entry, words) { return words.every((w) => entry.text.includes(w)); }

  function render() {
    const q = state.q.trim();
    const words = norm(q).split(/\s+/).filter(Boolean);
    const byQuery = index.filter((e) => matches(e, words));

    const counts = { all: byQuery.length };
    byQuery.forEach((e) => { counts[e.a.categorie] = (counts[e.a.categorie] || 0) + 1; });
    $chips.querySelectorAll(".chip").forEach((chip) => {
      chip.setAttribute("aria-pressed", String(chip.dataset.cat === state.cat));
      chip.querySelector(".count").textContent = counts[chip.dataset.cat] || 0;
    });

    const results = byQuery.filter((e) => state.cat === "all" || e.a.categorie === state.cat).map((e) => e.a);
    const featured = !q && results.length ? pickFeatured(results) : null;
    const rest = featured ? results.filter((a) => a !== featured) : results;

    $featured.innerHTML = featured ? featuredHTML(featured) : "";
    $featured.hidden = !featured;
    $grid.innerHTML = rest.slice(0, state.limit).map(cardHTML).join("");
    $grid.hidden = rest.length === 0;
    $more.hidden = rest.length <= state.limit;
    $empty.hidden = results.length > 0;

    const n = results.length;
    const inCat = state.cat === "all" ? "" : ` en ${catLabel(state.cat)}`;
    $info.textContent = q
      ? `${n} résultat${n > 1 ? "s" : ""} pour « ${q} »${inCat}`
      : `${n} article${n > 1 ? "s" : ""}${inCat}`;

    const p = new URLSearchParams();
    if (state.cat !== "all") p.set("cat", state.cat);
    if (q) p.set("q", q);
    const qs = p.toString();
    history.replaceState(null, "", location.pathname + (qs ? "?" + qs : "") + location.hash);
  }

  $chips.addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if (!chip) return;
    state.cat = chip.dataset.cat;
    state.limit = PAGE;
    render();
  });

  let timer;
  $search.value = state.q;
  $search.addEventListener("input", () => {
    clearTimeout(timer);
    timer = setTimeout(() => { state.q = $search.value; state.limit = PAGE; render(); }, 120);
  });
  $search.closest("form")?.addEventListener("submit", (e) => e.preventDefault());

  $more.addEventListener("click", () => { state.limit += PAGE; render(); });
  document.querySelectorAll("[data-reset]").forEach((b) => b.addEventListener("click", () => {
    state.cat = "all"; state.q = ""; state.limit = PAGE; $search.value = ""; render(); $search.focus();
  }));

  render();
})();
