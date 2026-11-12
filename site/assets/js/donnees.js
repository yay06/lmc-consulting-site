/* ==========================================================================
   LMC Consulting : contenus éditoriaux
   --------------------------------------------------------------------------
   LES ACTUALITÉS AUTOMATIQUES (sources officielles) sont dans flux.js,
   généré chaque jour par outils/flux_actualites.py : rien à faire ici.

   Ce fichier sert uniquement aux articles rédigés par le cabinet, qui
   s'ajoutent au flux automatique et passent « À la une ».

   POUR PUBLIER UN ARTICLE DU CABINET
   Copiez un bloc { ... } dans LMC_ACTUALITES et modifiez-le :
     brouillon  true = masqué sur le site, false = publié
     slug       identifiant unique utilisé dans l'adresse (minuscules, tirets)
     titre      titre de l'article
     categorie  fiscal | social | juridique | gestion | cabinet
     date       AAAA-MM-JJ (le tri se fait automatiquement)
     lecture    temps de lecture estimé, en minutes
     chapo      résumé de 1 à 2 phrases (cartes et référencement)
     contenu    texte de l'article en HTML (h2, p, ul, li, strong, table…)
   ========================================================================== */

window.LMC_CATEGORIES = {
  fiscal:    { label: "Fiscal" },
  social:    { label: "Social" },
  juridique: { label: "Juridique" },
  gestion:   { label: "Gestion" },
  cabinet:   { label: "Vie du cabinet" }
};

window.LMC_ACTUALITES = [
  {
    brouillon: true, // exemple à faire valider par le cabinet : mettre false pour publier
    slug: "facturation-electronique-reception-obligatoire",
    titre: "Facturation électronique : où en êtes-vous depuis le 1er septembre ?",
    categorie: "gestion",
    date: "2026-11-12",
    lecture: 4,
    chapo: "Depuis le 1er septembre 2026, toutes les entreprises assujetties à la TVA doivent pouvoir recevoir des factures électroniques. L'obligation d'émettre suivra pour les PME et TPE en septembre 2027 : c'est le moment de s'organiser.",
    contenu: `
      <h2>Ce qui a changé à la rentrée</h2>
      <p>La réforme de la facturation électronique est entrée dans sa phase opérationnelle. Depuis le 1er septembre 2026, chaque entreprise établie en France et assujettie à la TVA doit être en mesure de réceptionner les factures de ses fournisseurs sous forme électronique, quelle que soit sa taille. Les grandes entreprises et les entreprises de taille intermédiaire (ETI) doivent, en outre, déjà émettre leurs factures dans ce format.</p>
      <p>Une facture électronique n'est pas un simple PDF envoyé par e-mail : il s'agit d'un fichier structuré, transmis par l'intermédiaire d'une plateforme agréée par l'administration fiscale.</p>
      <h2>Le calendrier à retenir</h2>
      <ul>
        <li><strong>1er septembre 2026</strong> : obligation de réception pour toutes les entreprises, obligation d'émission pour les grandes entreprises et les ETI.</li>
        <li><strong>1er septembre 2027</strong> : obligation d'émission étendue aux PME, TPE et micro-entreprises.</li>
      </ul>
      <p>La réforme s'accompagne du <em>e-reporting</em> : la transmission à l'administration des données de certaines opérations qui ne donnent pas lieu à une facture électronique (ventes à des particuliers, opérations internationales…), selon le même calendrier.</p>
      <h2>Les bons réflexes dès maintenant</h2>
      <ul>
        <li>Choisir votre plateforme agréée et vérifier sa compatibilité avec votre logiciel de facturation ou de caisse ;</li>
        <li>Mettre à jour vos fiches clients et fournisseurs (numéro SIREN, adresse de facturation) ;</li>
        <li>Identifier les opérations concernées par le e-reporting ;</li>
        <li>Revoir votre circuit de validation et d'archivage des factures.</li>
      </ul>
      <div class="callout"><strong>Le conseil du cabinet</strong><p>N'attendez pas 2027 pour tester l'émission : quelques mois de rodage permettent de corriger les anomalies avant que l'obligation ne s'applique. Nous pouvons vous aider à comparer les solutions et à paramétrer vos outils.</p></div>
    `
  },
  {
    brouillon: true, // exemple à faire valider par le cabinet : mettre false pour publier
    slug: "cfe-2026-paiement-15-decembre",
    titre: "CFE 2026 : votre avis est en ligne, le paiement est attendu au 15 décembre",
    categorie: "fiscal",
    date: "2026-11-10",
    lecture: 3,
    chapo: "L'avis de cotisation foncière des entreprises n'est plus envoyé par courrier : il se consulte dans votre espace professionnel, et son règlement doit obligatoirement être effectué de manière dématérialisée.",
    contenu: `
      <h2>Où trouver votre avis ?</h2>
      <p>Les avis de CFE sont mis en ligne courant novembre dans la rubrique « Mes avis » de l'espace professionnel sur impots.gouv.fr. Pensez à le consulter, même si vous n'avez reçu aucune notification : l'absence de courrier ne dispense pas du paiement.</p>
      <h2>Comment payer ?</h2>
      <p>Trois modalités sont possibles :</p>
      <ul>
        <li>le <strong>paiement en ligne</strong> depuis votre espace professionnel, jusqu'à la date limite ;</li>
        <li>le <strong>prélèvement à l'échéance</strong>, à condition d'y adhérer avant la fin du mois de novembre ;</li>
        <li>le <strong>prélèvement mensuel</strong>, à mettre en place pour l'année suivante.</li>
      </ul>
      <p>Si vous avez versé un acompte en juin (obligatoire lorsque la CFE de l'année précédente atteignait 3 000 € ou plus), il est automatiquement déduit du solde.</p>
      <h2>Les cas particuliers à connaître</h2>
      <p>Une entreprise nouvellement créée n'est pas redevable de la CFE au titre de son année de création. L'année suivante, sa base d'imposition est réduite de moitié. Des exonérations peuvent aussi s'appliquer selon l'activité ou la localisation : interrogez-nous si le montant de votre avis vous surprend.</p>
      <div class="callout"><strong>À retenir</strong><p>Date limite de paiement : <strong>mardi 15 décembre 2026</strong>. Un paiement tardif entraîne une majoration de 5 %.</p></div>
    `
  },
  {
    brouillon: true, // exemple à faire valider par le cabinet : mettre false pour publier
    slug: "mutuelle-entreprise-dispenses-adhesion",
    titre: "Mutuelle d'entreprise : dans quels cas un salarié peut-il la refuser ?",
    categorie: "social",
    date: "2026-11-06",
    lecture: 3,
    chapo: "La complémentaire santé collective est obligatoire dans toutes les entreprises du secteur privé. Certains salariés peuvent toutefois demander à en être dispensés, à condition de respecter un formalisme précis.",
    contenu: `
      <h2>Le principe : une couverture pour tous</h2>
      <p>Tout employeur du secteur privé doit proposer à ses salariés une complémentaire santé collective et en financer au moins la moitié. L'adhésion est en principe obligatoire pour les salariés.</p>
      <h2>Les principales dispenses</h2>
      <p>Le salarié peut notamment demander à être dispensé lorsqu'il :</p>
      <ul>
        <li>bénéficie déjà, y compris en tant qu'ayant droit, d'une couverture collective obligatoire, par exemple celle de son conjoint ;</li>
        <li>bénéficie de la complémentaire santé solidaire ;</li>
        <li>est titulaire d'un contrat court (CDD ou contrat de mission) ;</li>
        <li>travaille à temps très partiel et que sa cotisation représenterait une part importante de sa rémunération ;</li>
        <li>était déjà présent dans l'entreprise lors de la mise en place du régime par décision unilatérale de l'employeur, si celle-ci prévoit une cotisation salariale.</li>
      </ul>
      <h2>Un formalisme à respecter</h2>
      <p>La dispense doit résulter d'une demande écrite du salarié, accompagnée le cas échéant des justificatifs nécessaires. L'employeur doit conserver ces documents : en cas de contrôle de l'Urssaf, ils conditionnent le maintien du régime social favorable de sa participation.</p>
      <div class="callout"><strong>Le conseil du cabinet</strong><p>Faites le point chaque année sur les justificatifs : certaines dispenses doivent être justifiées à nouveau périodiquement, par exemple lorsque le salarié est couvert par la mutuelle de son conjoint.</p></div>
    `
  },
  {
    brouillon: true, // exemple à faire valider par le cabinet : mettre false pour publier
    slug: "cloture-2026-rendez-vous-bilan",
    titre: "Clôture 2026 : réservez dès maintenant votre rendez-vous de bilan",
    categorie: "cabinet",
    date: "2026-11-04",
    lecture: 2,
    chapo: "Décembre et janvier sont des mois chargés. Pour préparer sereinement vos comptes annuels, nous vous invitons à anticiper la transmission de vos documents et à fixer dès à présent un point avec votre interlocuteur.",
    contenu: `
      <p>Chaque fin d'année, les mêmes questions reviennent : faut-il investir avant le 31 décembre ? Comment se rémunérer ? Quel résultat anticiper ? Un rendez-vous de pré-bilan, organisé avant la clôture, permet d'y répondre tant qu'il est encore temps d'agir.</p>
      <h2>Pourquoi anticiper ?</h2>
      <ul>
        <li>Prendre vos décisions de gestion avant la clôture, et non après ;</li>
        <li>Estimer votre résultat et l'impôt correspondant ;</li>
        <li>Organiser la collecte des pièces et éviter les relances de dernière minute.</li>
      </ul>
      <h2>Comment prendre rendez-vous ?</h2>
      <p>Contactez le cabinet au 01 43 28 26 27 ou via le <a href="contact.html">formulaire de contact</a>. Le rendez-vous peut se tenir au cabinet, à Maisons-Alfort, ou en visioconférence.</p>
    `
  },
  {
    brouillon: true, // exemple à faire valider par le cabinet : mettre false pour publier
    slug: "preparer-cloture-exercice-check-list",
    titre: "Préparer la clôture de l'exercice : la check-list en 8 points",
    categorie: "gestion",
    date: "2026-10-30",
    lecture: 4,
    chapo: "Un bilan se prépare bien avant le 31 décembre. Voici les points à vérifier pour faciliter le travail de révision et fiabiliser vos comptes annuels.",
    contenu: `
      <ol>
        <li><strong>Rapprochements bancaires</strong> : vérifiez que chaque mouvement bancaire est justifié par une pièce.</li>
        <li><strong>Factures clients impayées</strong> : identifiez les créances à risque, qui pourront faire l'objet d'une provision.</li>
        <li><strong>Factures fournisseurs non parvenues</strong> : listez les prestations reçues en 2026 mais pas encore facturées.</li>
        <li><strong>Inventaire des stocks</strong> : organisez le comptage physique au plus près de la date de clôture.</li>
        <li><strong>Immobilisations</strong> : signalez les achats, cessions ou mises au rebut de matériel intervenus dans l'année.</li>
        <li><strong>Caisse</strong> : arrêtez le solde de caisse au 31 décembre et conservez le justificatif.</li>
        <li><strong>Emprunts et contrats</strong> : transmettez les tableaux d'amortissement et les nouveaux contrats (crédit-bail, location).</li>
        <li><strong>Social</strong> : recensez les congés payés restant dus et les primes à verser.</li>
      </ol>
      <div class="callout"><strong>Astuce</strong><p>Rassemblez ces éléments dans un dossier unique au fil de l'eau : vous gagnerez un temps précieux au moment de l'arrêté des comptes.</p></div>
    `
  },
  {
    brouillon: true, // exemple à faire valider par le cabinet : mettre false pour publier
    slug: "embaucher-premier-salarie-etapes",
    titre: "Embaucher son premier salarié : les étapes à ne pas oublier",
    categorie: "social",
    date: "2026-10-27",
    lecture: 5,
    chapo: "Recruter pour la première fois est une étape importante dans la vie d'une entreprise. Plusieurs formalités doivent être accomplies avant et après l'arrivée du salarié.",
    contenu: `
      <h2>Avant l'embauche</h2>
      <ul>
        <li><strong>Déclaration préalable à l'embauche (DPAE)</strong> : elle est effectuée auprès de l'Urssaf au plus tôt huit jours avant l'embauche, et au plus tard au moment de la prise de poste ;</li>
        <li><strong>Contrat de travail</strong> : l'écrit est obligatoire pour un CDD ou un temps partiel, et vivement recommandé dans tous les cas ;</li>
        <li><strong>Adhésions</strong> : affiliez l'entreprise à une caisse de retraite complémentaire et mettez en place la complémentaire santé collective.</li>
      </ul>
      <h2>À l'arrivée du salarié</h2>
      <ul>
        <li>inscrire le salarié sur le <strong>registre unique du personnel</strong> ;</li>
        <li>organiser la <strong>visite d'information et de prévention</strong> auprès du service de prévention et de santé au travail ;</li>
        <li>établir le <strong>document unique d'évaluation des risques professionnels</strong> (DUERP) ;</li>
        <li>procéder aux <strong>affichages obligatoires</strong>.</li>
      </ul>
      <h2>Chaque mois</h2>
      <p>Le bulletin de paie est remis au salarié et la déclaration sociale nominative (DSN) est transmise le 5 ou le 15 du mois suivant, selon l'effectif de l'entreprise et la date de versement des salaires.</p>
      <div class="callout"><strong>Le conseil du cabinet</strong><p>Avant de recruter, vérifiez la convention collective applicable : elle fixe notamment les salaires minima, la durée de la période d'essai et certaines primes. Nous pouvons prendre en charge l'ensemble de ces formalités ainsi que la paie.</p></div>
    `
  },
  {
    brouillon: true, // exemple à faire valider par le cabinet : mettre false pour publier
    slug: "sas-ou-sarl-choisir-forme-societe",
    titre: "SAS ou SARL : quelle forme choisir pour votre société ?",
    categorie: "juridique",
    date: "2026-10-22",
    lecture: 5,
    chapo: "Ce sont les deux formes de société les plus utilisées par les créateurs. Le choix entre les deux dépend moins d'une règle générale que de votre projet, de votre rémunération et de vos associés.",
    contenu: `
      <h2>Deux cadres juridiques différents</h2>
      <p>La <strong>SARL</strong> obéit à des règles largement fixées par la loi, ce qui la rend sécurisante et simple à piloter. La <strong>SAS</strong> laisse une grande liberté aux associés pour organiser la gouvernance, l'entrée de nouveaux associés ou la répartition des pouvoirs. Cette souplesse suppose des statuts rédigés avec soin.</p>
      <h2>Le statut social du dirigeant</h2>
      <ul>
        <li>Le <strong>gérant majoritaire de SARL</strong> relève du régime des travailleurs non salariés : des cotisations moins élevées, mais une protection sociale plus réduite.</li>
        <li>Le <strong>président de SAS</strong> est assimilé salarié : il bénéficie du régime général (hors assurance chômage), pour un coût de cotisations plus élevé.</li>
      </ul>
      <h2>Le traitement des dividendes</h2>
      <p>Dans une SARL, la part des dividendes du gérant majoritaire qui excède 10 % du capital social, des primes d'émission et des sommes versées en compte courant est soumise aux cotisations sociales. Dans une SAS, les dividendes ne supportent que les prélèvements sociaux, ce qui peut orienter la stratégie de rémunération.</p>
      <h2>Notre approche</h2>
      <p>Avant de trancher, nous réalisons avec vous une simulation chiffrée : rémunération souhaitée, protection sociale, perspectives d'entrée d'investisseurs. C'est ce qui permet de choisir la forme la plus adaptée, et pas seulement la plus répandue.</p>
    `
  },
  {
    brouillon: true, // exemple à faire valider par le cabinet : mettre false pour publier
    slug: "prelevement-source-moduler-acomptes",
    titre: "Prélèvement à la source : ajustez vos acomptes si vos revenus évoluent",
    categorie: "fiscal",
    date: "2026-10-16",
    lecture: 3,
    chapo: "Commerçants, artisans, professions libérales : vos acomptes d'impôt sont calculés sur vos derniers revenus déclarés. Lorsque votre activité varie fortement, vous pouvez les adapter en cours d'année.",
    contenu: `
      <h2>Comment sont calculés vos acomptes ?</h2>
      <p>Pour les revenus des indépendants, l'administration prélève chaque mois ou chaque trimestre un acompte calculé à partir des bénéfices de la dernière déclaration de revenus. En cas de hausse ou de baisse d'activité, l'écart avec l'impôt réellement dû peut être important.</p>
      <h2>Les possibilités d'ajustement</h2>
      <ul>
        <li><strong>Moduler</strong> le montant de vos acomptes, à la hausse ou à la baisse, depuis la rubrique « Gérer mon prélèvement à la source » de votre espace particulier ;</li>
        <li><strong>Reporter</strong> une échéance sur la suivante, dans certaines limites ;</li>
        <li><strong>Opter</strong> pour un prélèvement trimestriel plutôt que mensuel.</li>
      </ul>
      <h2>Attention aux baisses trop optimistes</h2>
      <p>Une modulation à la baisse doit reposer sur une estimation réaliste. Si les acomptes versés se révèlent sensiblement inférieurs à l'impôt finalement dû, une majoration peut s'appliquer. Une situation intermédiaire établie avec le cabinet permet de sécuriser votre estimation.</p>
    `
  },
  {
    brouillon: true, // exemple à faire valider par le cabinet : mettre false pour publier
    slug: "duree-conservation-documents-entreprise",
    titre: "Factures, bulletins de paie, statuts : combien de temps conserver vos documents ?",
    categorie: "juridique",
    date: "2026-10-09",
    lecture: 3,
    chapo: "Archiver trop peu expose à des difficultés en cas de contrôle ; tout garder indéfiniment encombre inutilement. Voici les principales durées de conservation à connaître.",
    contenu: `
      <div class="table-scroll">
        <table>
          <thead><tr><th>Document</th><th>Durée minimale de conservation</th></tr></thead>
          <tbody>
            <tr><td>Livres et pièces comptables (factures, relevés…)</td><td>10 ans à compter de la clôture de l'exercice</td></tr>
            <tr><td>Documents utiles au contrôle fiscal</td><td>6 ans</td></tr>
            <tr><td>Double des bulletins de paie</td><td>5 ans</td></tr>
            <tr><td>Contrats commerciaux</td><td>5 ans</td></tr>
            <tr><td>Statuts, procès-verbaux d'assemblée</td><td>Durée de vie de la société, plus 5 ans</td></tr>
          </tbody>
        </table>
      </div>
      <p>Ces durées sont des minimums. Les documents peuvent être conservés sous forme électronique, à condition que le procédé utilisé garantisse leur intégrité et leur lisibilité.</p>
      <div class="callout"><strong>Avec la facturation électronique</strong><p>Vérifiez les conditions d'archivage proposées par votre plateforme agréée : durée, format et possibilité d'export de vos factures.</p></div>
    `
  },
  {
    brouillon: true, // exemple à faire valider par le cabinet : mettre false pour publier
    slug: "approbation-comptes-calendrier",
    titre: "Approbation des comptes : le calendrier à respecter",
    categorie: "juridique",
    date: "2026-10-02",
    lecture: 3,
    chapo: "Une fois l'exercice clos, les comptes annuels doivent être approuvés par les associés, puis déposés au greffe dans des délais précis.",
    contenu: `
      <h2>Dans les six mois suivant la clôture</h2>
      <p>L'assemblée chargée d'approuver les comptes doit se réunir dans les six mois de la clôture de l'exercice, soit au plus tard le 30 juin pour un exercice clos le 31 décembre. Une prolongation de ce délai peut être demandée en justice.</p>
      <h2>Le dépôt au greffe</h2>
      <p>Les comptes approuvés doivent être déposés au greffe dans le mois qui suit l'approbation, ou dans les deux mois en cas de dépôt par voie électronique.</p>
      <h2>La confidentialité, une option à connaître</h2>
      <p>Les micro-entreprises et les petites entreprises peuvent, sous conditions, demander que tout ou partie de leurs comptes ne soient pas rendus publics.</p>
      <div class="callout"><strong>Le conseil du cabinet</strong><p>Le cabinet peut préparer l'ensemble des documents juridiques (rapport de gestion, procès-verbal, formalités de dépôt) et vous accompagner dans le choix de l'option de confidentialité.</p></div>
    `
  }
];

/* Échéancier indicatif : date (AAAA-MM-JJ), titre, détail */
window.LMC_ECHEANCES = [
  { date: "2026-11-16", titre: "DSN des salaires d'octobre", detail: "Entreprises de moins de 50 salariés (échéance du 15 reportée au premier jour ouvré)" },
  { date: "2026-11-30", titre: "CFE : adhésion au prélèvement à l'échéance", detail: "Dernier jour pour opter avant le paiement du solde" },
  { date: "2026-12-07", titre: "DSN des salaires de novembre", detail: "Entreprises de 50 salariés et plus (échéance du 5 reportée au premier jour ouvré)" },
  { date: "2026-12-15", titre: "Solde de la CFE", detail: "Paiement en ligne ou par prélèvement" },
  { date: "2026-12-15", titre: "Acompte d'impôt sur les sociétés", detail: "Exercices clos le 31 décembre" },
  { date: "2026-12-15", titre: "DSN des salaires de novembre", detail: "Entreprises de moins de 50 salariés" },
  { date: "2027-01-05", titre: "DSN des salaires de décembre", detail: "Entreprises de 50 salariés et plus" },
  { date: "2027-01-15", titre: "DSN des salaires de décembre", detail: "Entreprises de moins de 50 salariés" }
];
