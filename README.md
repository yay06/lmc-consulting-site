# Site LMC Consulting

Site statique (HTML, CSS, JavaScript), sans base de données ni CMS.

## Arborescence

```
site/                        ← le site final, à mettre en ligne tel quel
  index.html, cabinet.html, missions.html, actualites.html,
  article.html, contact.html, ressources.html, mentions-legales.html
  assets/css/style.css
  assets/js/flux.js          ← actualités automatiques (fichier généré, ne pas modifier)
  assets/js/donnees.js       ← articles du cabinet (facultatifs) et échéancier
  assets/js/main.js, actualites.js, article.js
outils/flux_actualites.py    ← récupère les actualités officielles et écrit flux.js
.github/workflows/actualites.yml ← mise à jour quotidienne + publication automatique
src/ + build.py              ← sources des pages (en-tête et pied de page communs)
```

## Actualités automatiques

Chaque matin, `outils/flux_actualites.py` :

1. lit les flux RSS officiels (Service-Public Entreprendre et economie.gouv.fr, rubrique entreprises) ;
2. écarte ce qui ne concerne pas les entreprises, supprime les doublons ;
3. classe chaque actualité en Fiscal, Social, Juridique ou Gestion grâce à des mots-clés ;
4. conserve les 80 plus récentes dans `site/assets/js/flux.js`.

Le site affiche le titre, le résumé, la date et la source, avec un lien vers la page
officielle. Ces informations publiques sont réutilisées sous Licence Ouverte Etalab 2.0
(source mentionnée sur chaque carte et dans les mentions légales).

Si une source est indisponible, ses actualités précédentes sont conservées : le site
n'est jamais vide. Les sources et les mots-clés se règlent en tête du script.

Lancer la mise à jour à la main :

```
python3 outils/flux_actualites.py
```

### Planification

- **Hébergement GitHub Pages (recommandé, gratuit)** : déposer ce dossier dans un dépôt
  GitHub, puis dans *Settings → Pages*, choisir *Source : GitHub Actions* et renseigner
  le domaine `www.lmcconsulting.fr`. Le fichier `.github/workflows/actualites.yml` met
  alors à jour les actualités et republie le site chaque jour, sans intervention.
- **Autre hébergeur (OVH, o2switch…)** : programmer une tâche quotidienne (cron) qui
  exécute `python3 outils/flux_actualites.py` puis envoie `site/` sur le serveur, ou
  garder GitHub Actions et ajouter une étape d'envoi FTP.

## Mise en ligne

- Dépôt : https://github.com/yay06/lmc-consulting-site
- Adresse provisoire (validation par le client) : https://yay06.github.io/lmc-consulting-site/
- Publication : automatique à chaque envoi sur `main` et chaque matin (onglet *Actions* du dépôt).

### Passage sur www.lmcconsulting.fr (le jour du lancement)

Le domaine est enregistré chez **LWS**, qui gère aussi ses DNS. Aujourd'hui, `www` pointe
vers la Revue Fiduciaire (`lb.grouperf.com`) et la messagerie passe par Microsoft 365.

1. **GitHub** : *Settings → Pages → Custom domain* : saisir `www.lmcconsulting.fr`.
   Ne pas le faire avant le jour J : l'adresse provisoire redirigerait vers l'ancien site.
2. **LWS** (espace client → Domaines → Zone DNS) :
   - `www` : enregistrement **CNAME** vers `yay06.github.io.` (remplace `lb.grouperf.com`) ;
   - `@` (lmcconsulting.fr sans www) : remplacer l'enregistrement **A** `178.33.63.120` par les
     quatre adresses GitHub `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` ;
   - **ne pas toucher** aux enregistrements **MX** (`…mail.protection.outlook.com`), **TXT** et
     `autodiscover` : ils font fonctionner les e-mails du cabinet.
3. Attendre la propagation (de quelques minutes à quelques heures), puis cocher
   *Enforce HTTPS* dans *Settings → Pages*.
4. Conseillé : vérifier le domaine dans les paramètres GitHub du compte
   (*Settings → Pages → Add a domain*), pour qu'aucun autre compte ne puisse l'utiliser.
5. Prévenir la Revue Fiduciaire : l'ancien site et son espace « Base documentaire »
   ne seront plus accessibles depuis le domaine.

## Articles du cabinet (facultatif)

Le cabinet peut publier ses propres articles en plus du flux automatique : ils passent
« À la une » pendant 30 jours et ont leur propre page. Ils se trouvent dans
`site/assets/js/donnees.js`. Les 10 articles d'exemple fournis sont en
`brouillon: true` (masqués) : les relire puis passer `brouillon: false` pour les publier.

L'échéancier se met à jour dans le même fichier (`LMC_ECHEANCES`) ; les dates passées
disparaissent d'elles-mêmes.

## Modifier une page, le menu ou le pied de page

Modifier le fichier dans `src/`, puis lancer `python3 build.py`.

## Prévisualiser en local

```
python3 -m http.server 8737 --directory site
```

puis ouvrir http://localhost:8737

## À compléter avant la mise en ligne

- `mentions-legales.html` : les éléments surlignés en jaune (n° Ordre, H2A, assurance RC pro, hébergeur, directrice de la publication).
- Formulaires de contact et de lettre d'information : sans service d'envoi, ils ouvrent la messagerie du visiteur avec le message pré-rempli. Pour un envoi direct, renseigner l'attribut `data-endpoint` du formulaire (Formspree, Netlify Forms, script de l'hébergeur…).
- Photos : images Unsplash libres de droits, à remplacer idéalement par des photos du cabinet.
- Logo : recréé en texte, remplaçable par le fichier officiel.
