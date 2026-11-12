#!/usr/bin/env python3
"""
Actualités automatiques du site LMC Consulting.

Récupère les flux RSS de sources officielles, classe chaque actualité dans une
rubrique (Fiscal, Social, Juridique, Gestion) et génère site/assets/js/flux.js,
lu par les pages du site. À lancer une fois par jour (GitHub Actions, cron…) :

    python3 outils/flux_actualites.py

Bibliothèque standard uniquement (Python 3.9 ou plus récent).
Les contenus repris (titre, résumé, lien) sont des informations publiques
réutilisables sous Licence Ouverte Etalab 2.0, avec mention de la source.
"""
import datetime as dt
import hashlib
import html
import json
import pathlib
import re
import sys
import unicodedata
import urllib.request
import xml.etree.ElementTree as ET
from email.utils import parsedate_to_datetime
from urllib.parse import parse_qsl, urlencode, urlsplit, urlunsplit

try:
    from zoneinfo import ZoneInfo
    PARIS = ZoneInfo("Europe/Paris")
except Exception:  # pragma: no cover
    PARIS = dt.timezone(dt.timedelta(hours=1))

ROOT = pathlib.Path(__file__).resolve().parent.parent
SORTIE = ROOT / "site" / "assets" / "js" / "flux.js"

MAX_ARTICLES = 80        # nombre d'actualités conservées sur le site
MAX_AGE_JOURS = 365      # au-delà, une actualité est retirée
USER_AGENT = "Mozilla/5.0 (compatible; actualites-rss/1.0)"

# --------------------------------------------------------------------------
# Sources. Pour en ajouter une : copier un bloc et renseigner son flux RSS.
#   garder_liens   : ne conserver que les liens contenant l'un de ces motifs
#   exclure_liens  : écarter les liens contenant l'un de ces motifs
#   exclure_titres : écarter les titres contenant l'un de ces mots
#   categorie      : imposer une rubrique (sinon classement automatique)
#   actif          : False pour suspendre une source sans la supprimer
# --------------------------------------------------------------------------
SOURCES = [
    {
        "id": "service-public",
        "nom": "Service-Public Entreprendre",
        "url": "https://www.service-public.gouv.fr/abonnements/rss/actu-actu-pro.rss",
        "exclure_liens": ["/particuliers/"],
    },
    {
        "id": "economie",
        "nom": "economie.gouv.fr",
        "url": "https://www.economie.gouv.fr/rss/toutesactualites",
        "garder_liens": ["/entreprises/"],
    },
    {
        # Désactivé : ce flux mêle actualités et mises à jour de fiches du ministère.
        "id": "travail",
        "nom": "Ministère du Travail",
        "url": "https://travail-emploi.gouv.fr/rss.xml",
        "actif": False,
        "categorie": "social",
        "exclure_titres": [
            "agenda", "reaction", "sommet", "discours", "deplacement", "communique",
            "conseil des ministres", "nomination", "semaine europeenne", "journee",
            "ministre", "chiffres du chomage", "salon", "colloque",
        ],
    },
]

# Mots-clés du classement automatique (sans accents, début de mot)
MOTS_CLES = {
    "fiscal": ["impot", "fiscal", "tva", "cfe", "ifer", "taxe", "credit d'impot", "declaration de revenus",
               "prelevement a la source", "douane", "exoneration", "bofip", "foncier", "plus-value", "acompte"],
    "social": ["salari", "employeur", "embauch", "emploi", "travail", "conge", "urssaf", "cotisation", "dsn",
               "paie", "licenci", "apprenti", "alternance", "chomage", "retraite", "smic", "prevoyance",
               "mutuelle", "activite partielle", "formation", "handicap", "prevention", "reconversion",
               "interim", "teletravail", "prime", "arret maladie", "accident du travail", "convention collective",
               "duerp", "risques professionnels"],
    "juridique": ["societe", "statut", "greffe", "rcs", "juridique", "contrat", "tribunal", "justice", "rgpd",
                  "cnil", "bail", "baux", "kbis", "formalite", "associe", "entreprise individuelle", "micro-entrepr",
                  "auto-entrepr", "sanction", "conformite", "csrd", "registre", "beneficiaires effectifs",
                  "procedure", "liquidation", "redressement", "injonction", "fonds de commerce",
                  "conjoint collaborateur", "loi hamon"],
    "gestion": ["aide", "financement", "tresorerie", "facturation", "subvention", "pret", "bpifrance", "energie",
                "carburant", "cyber", "numerique", "export", "commerc", "prix", "soutien", "investissement",
                "marche public", "marches publics", "achat", "decarbonation"],
}
PRIORITE = ["fiscal", "social", "juridique", "gestion"]


def sans_accents(s):
    s = unicodedata.normalize("NFD", s or "")
    return "".join(c for c in s if unicodedata.category(c) != "Mn").lower().replace("’", "'")


REGEX_CLES = {cat: [re.compile(r"\b" + re.escape(m)) for m in mots] for cat, mots in MOTS_CLES.items()}


def classer(titre, resume):
    t, r = sans_accents(titre), sans_accents(resume)
    scores = {cat: sum(2 * bool(rx.search(t)) + bool(rx.search(r)) for rx in rxs) for cat, rxs in REGEX_CLES.items()}
    meilleur = max(PRIORITE, key=lambda c: (scores[c], -PRIORITE.index(c)))
    return meilleur if scores[meilleur] > 0 else "gestion"


def nettoyer(s):
    s = re.sub(r"<[^>]+>", " ", s or "")
    return re.sub(r"\s+", " ", html.unescape(s)).strip()


def extrait(s, n=260):
    if len(s) <= n:
        return s
    return s[:n].rsplit(" ", 1)[0].rstrip(" ,;:.-") + "…"


def nettoyer_url(u):
    p = urlsplit((u or "").strip())
    if p.scheme not in ("http", "https") or not p.netloc:
        return ""
    q = [(k, v) for k, v in parse_qsl(p.query) if not k.lower().startswith(("xtor", "utm_"))]
    return urlunsplit((p.scheme, p.netloc, p.path, urlencode(q), ""))


def lire_date(s):
    if not s:
        return None
    s = s.strip()
    d = None
    try:
        d = parsedate_to_datetime(s)
    except (TypeError, ValueError, IndexError):
        try:
            d = dt.datetime.fromisoformat(s.replace("Z", "+00:00"))
        except ValueError:
            m = re.match(r"(\d{4}-\d{2}-\d{2})", s)
            if m:
                d = dt.datetime.fromisoformat(m.group(1))
    if d is None:
        return None
    if d.tzinfo is None:
        d = d.replace(tzinfo=PARIS)
    return d.astimezone(PARIS)


def telecharger(url):
    req = urllib.request.Request(url, headers={
        "User-Agent": USER_AGENT,
        "Accept": "application/rss+xml, application/atom+xml, application/xml;q=0.9, */*;q=0.5",
    })
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read()


def texte(el, *noms):
    for n in noms:
        v = el.findtext(n)
        if v and v.strip():
            return v.strip()
    return ""


def lire_flux(data):
    """Renvoie les entrées d'un flux RSS 2.0 ou Atom."""
    racine = ET.fromstring(data)
    DC = "{http://purl.org/dc/elements/1.1/}"
    A = "{http://www.w3.org/2005/Atom}"
    if racine.tag.endswith("rss") or racine.find("channel") is not None:
        for it in racine.iter("item"):
            yield {"titre": texte(it, "title"), "url": texte(it, "link"),
                   "date": texte(it, "pubDate", DC + "date"), "resume": texte(it, "description")}
    else:
        for e in racine.iter(A + "entry"):
            lien = next((l.get("href") for l in e.findall(A + "link") if l.get("rel") in (None, "alternate")), "")
            yield {"titre": texte(e, A + "title"), "url": lien,
                   "date": texte(e, A + "published", A + "updated"), "resume": texte(e, A + "summary", A + "content")}


def articles_de(source, maintenant):
    data = telecharger(source["url"])
    limite = maintenant - dt.timedelta(days=MAX_AGE_JOURS)
    for brut in lire_flux(data):
        url = nettoyer_url(brut["url"])
        titre = nettoyer(brut["titre"])
        date = lire_date(brut["date"])
        if not url or not titre or not date or date < limite or date > maintenant + dt.timedelta(days=1):
            continue
        if source.get("garder_liens") and not any(m in url for m in source["garder_liens"]):
            continue
        if any(m in url for m in source.get("exclure_liens", [])):
            continue
        if any(re.search(r"\b" + re.escape(m), sans_accents(titre)) for m in source.get("exclure_titres", [])):
            continue
        resume = nettoyer(brut["resume"])
        titre = titre[0].upper() + titre[1:]
        yield {
            "id": hashlib.sha1(url.encode()).hexdigest()[:12],
            "titre": titre,
            "url": url,
            "date": date.strftime("%Y-%m-%d"),
            "categorie": source.get("categorie") or classer(titre, resume),
            "chapo": extrait(resume),
            "source": source["nom"],
            "source_id": source["id"],
        }


def lire_precedent():
    if not SORTIE.exists():
        return {}
    m = re.search(r"window\.LMC_FLUX\s*=\s*(\{.*\})\s*;", SORTIE.read_text(encoding="utf-8"), re.S)
    try:
        return json.loads(m.group(1)) if m else {}
    except json.JSONDecodeError:
        return {}


def main():
    maintenant = dt.datetime.now(PARIS)
    precedent = lire_precedent()
    anciens = precedent.get("articles", [])
    articles, echecs = [], []

    actives = [s for s in SOURCES if s.get("actif", True)]
    for source in actives:
        try:
            lot = list(articles_de(source, maintenant))
            print(f"✓ {source['nom']} : {len(lot)} actualité(s)")
            articles.extend(lot)
        except Exception as exc:  # source indisponible : on garde ses actualités précédentes
            echecs.append(source["nom"])
            repris = [a for a in anciens if a.get("source_id") == source["id"]]
            articles.extend(repris)
            print(f"⚠ {source['nom']} indisponible ({exc}) : {len(repris)} actualité(s) conservée(s)", file=sys.stderr)

    vus, uniques = set(), []
    for a in sorted(articles, key=lambda a: a["date"], reverse=True):
        cle = (a["url"], sans_accents(a["titre"]))
        if a["url"] in vus or cle[1] in vus:
            continue
        vus.update(cle)
        uniques.append(a)
    limite = (maintenant - dt.timedelta(days=MAX_AGE_JOURS)).strftime("%Y-%m-%d")
    uniques = [a for a in uniques if a["date"] >= limite][:MAX_ARTICLES]

    if not uniques:
        print("Aucune actualité récupérée : fichier inchangé.", file=sys.stderr)
        return 1
    if uniques == anciens:
        print("Aucune nouveauté : fichier inchangé.")
        return 0

    contenu = {
        "maj": maintenant.isoformat(timespec="minutes"),
        "sources": [{"nom": s["nom"], "url": s["url"]} for s in actives],
        "articles": uniques,
    }
    SORTIE.write_text(
        "/* Fichier généré automatiquement par outils/flux_actualites.py : ne pas modifier à la main. */\n"
        "window.LMC_FLUX = " + json.dumps(contenu, ensure_ascii=False, indent=1) + ";\n",
        encoding="utf-8",
    )
    print(f"→ {len(uniques)} actualités écrites dans {SORTIE.relative_to(ROOT)}"
          + (f" (sources en échec : {', '.join(echecs)})" if echecs else ""))
    return 0


if __name__ == "__main__":
    sys.exit(main())
