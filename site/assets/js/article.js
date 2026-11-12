/* ==========================================================================
   LMC Consulting : page Article
   ========================================================================== */
(() => {
  "use strict";
  const { NEWS, esc, fmtLong, parseDate, catLabel, cardHTML, articleUrl } = window.LMC;
  const root = document.querySelector("[data-article]");
  if (!root) return;

  const OWN = NEWS.filter((a) => a.interne);
  const slug = new URLSearchParams(location.search).get("a");
  const i = OWN.findIndex((a) => a.slug === slug);
  const $ = (sel) => root.querySelector(sel);

  if (i < 0) {
    document.title = "Article introuvable · LMC Consulting";
    root.innerHTML = `<section class="page-hero"><div class="container article-wrap">
      <span class="eyebrow">Actualités</span>
      <h1>Cet article n'est plus disponible.</h1>
      <p class="lead">Il a peut-être été déplacé ou archivé. Retrouvez toutes nos publications sur la page Actualités.</p>
      <p style="margin-top:2rem"><a class="btn btn-primary" href="actualites.html">Voir les actualités</a></p>
    </div></section>`;
    return;
  }

  const a = OWN[i];
  const date = fmtLong.format(parseDate(a.date));
  const label = catLabel(a.categorie);
  const url = location.href.split("#")[0];

  document.title = `${a.titre} · LMC Consulting`;
  document.querySelector('meta[name="description"]')?.setAttribute("content", a.chapo);
  document.querySelector('meta[property="og:title"]')?.setAttribute("content", a.titre);
  document.querySelector('meta[property="og:description"]')?.setAttribute("content", a.chapo);

  $("[data-crumb-cat]").textContent = label;
  $("[data-crumb-cat]").href = "actualites.html?cat=" + encodeURIComponent(a.categorie);
  $("[data-tag]").textContent = label;
  $("[data-tag]").dataset.cat = a.categorie;
  $("[data-date]").textContent = date;
  $("[data-date]").setAttribute("datetime", a.date);
  $("[data-reading]").textContent = `${a.lecture} min de lecture`;
  $("[data-title]").textContent = a.titre;
  $("[data-chapo]").textContent = a.chapo;
  $("[data-cover]").dataset.cat = a.categorie;
  $("[data-cover-word]").textContent = label;
  $("[data-cover-date]").textContent = date;
  $("[data-body]").innerHTML = a.contenu;

  /* Partage */
  $("[data-share-linkedin]").href = "https://www.linkedin.com/sharing/share-offsite/?url=" + encodeURIComponent(url);
  $("[data-share-mail]").href = "mailto:?subject=" + encodeURIComponent(a.titre) + "&body=" + encodeURIComponent(a.chapo + "\n\n" + url);
  const feedback = $("[data-share-feedback]");
  $("[data-share-copy]").addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(url); feedback.textContent = "Lien copié"; }
    catch { feedback.textContent = "Copie impossible"; }
    setTimeout(() => { feedback.textContent = ""; }, 2500);
  });

  /* Article précédent / suivant */
  const newer = OWN[i - 1];
  const older = OWN[i + 1];
  $("[data-prev-next]").innerHTML =
    (older ? `<a class="prev" href="${articleUrl(older)}"><small>← Article précédent</small><span>${esc(older.titre)}</span></a>` : "") +
    (newer ? `<a class="next" href="${articleUrl(newer)}"><small>Article suivant →</small><span>${esc(newer.titre)}</span></a>` : "");

  /* À lire aussi : même rubrique d'abord, puis les plus récents */
  const others = NEWS.filter((x) => x !== a);
  const related = others.filter((x) => x.categorie === a.categorie).concat(others.filter((x) => x.categorie !== a.categorie)).slice(0, 3);
  $("[data-related]").innerHTML = related.map(cardHTML).join("");

  /* Barre de progression de lecture */
  const bar = document.querySelector(".reading-progress");
  const body = $("[data-body]");
  if (bar && body) {
    const update = () => {
      const r = body.getBoundingClientRect();
      const total = r.height - window.innerHeight * 0.6;
      const p = Math.min(1, Math.max(0, (window.innerHeight * 0.4 - r.top) / Math.max(total, 1)));
      bar.style.transform = `scaleX(${p})`;
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
  }
})();
