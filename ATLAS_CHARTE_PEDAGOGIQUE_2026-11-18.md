# Atlas unifié — Charte de pédagogie et audit du 18 novembre 2026

## Principe

Une carte, une œuvre ou un chapitre doit être accessible à une personne sans formation préalable, suffisamment précis pour un lecteur connaisseur et fidèle à l'objet propre de son Atlas. Le nombre de pages ou de concepts ne prouve pas la qualité pédagogique.

Le parcours est progressif et non obligatoire :

1. **Découvrir** : une situation, un objet, une action ou une question intelligible sans lexique préalable.
2. **Comprendre** : montrer concrètement ce qui fonctionne, ce qui varie, ce qui résiste, et pourquoi cela change la question.
3. **Approfondir** : confronter la lecture à la forme, aux sources, aux objections, aux différences doctrinales et aux limites des conclusions.

## Objets irréductibles

- **Atlas 1 — Philosophie vue par Deleuze :** reconstruire les problèmes et les inventions conceptuelles que Deleuze rencontre, reprend et transforme dans chaque auteur et chaque livre. Ne jamais convertir cet Atlas en histoire neutre de la philosophie. Les routes sont des chapitres de déplacements argumentés, non de simples associations de noms.
- **Atlas 2 — Récits et formes :** découvrir chaque œuvre, comprendre profondément ce qu'elle raconte ou fait éprouver et apprendre à voir les opérations singulières qui construisent son sens. Un geste, un objet, une durée ou un silence doit être rapporté à sa fonction concrète, non aussitôt à un symbole universel. Kafka et Jeanne Dielman restent les pilotes ; les 28 dossiers V4.3 ont la parité selon la grille éditoriale interne, non une certification de lecture intégrale de toutes les sources.
- **Atlas 3 — Le Théâtre du sentir :** explorer les conditions sensorielles, corporelles, relationnelles et formelles des expériences et des conduites. Ne prescrire ni émotion à produire ni connaissance de soi narcissique. L'attention au corps ne doit pas supplanter l'écoute du monde et d'autrui.

## Position sur les écoles

Atlas 3 peut condenser **les problèmes, les outils et les limites** des traditions majeures, non leur imposer une doctrine commune ou « la meilleure méthode » universelle. La distinction des pratiques est essentielle : action et circonstances chez Stanislavski, imagination psychophysique chez Michael Chekhov, écoute du partenaire chez Meisner, mouvement chez Lecoq, dramaturgie du discours chez Brecht et les auteurs, dispositifs d'improvisation de Spolin/Johnstone, temps-espace d'Overlie et Bogart, acteur-spectateur de Grotowski et participation du spect-acteur chez Boal.

Les scènes et les partitions propres à l'Atlas sont des œuvres originales. Elles ne sont pas des reproductions fidèles d'exercices d'écoles, ni une évaluation empirique de leur efficacité. Un refus réel n'est jamais une « offre » fictive à surmonter.

## Place de l'IFS

L'Internal Family Systems de Richard Schwartz peut aider à **penser les tensions intérieures sans les rabattre sur une seule étiquette**. Le dossier distingue des notions **internes au modèle** (parts, Self, protecteurs, polarisation, unblending), les hypothèses explicatives et les résultats mesurés. Une part au sens de l'IFS n'est pas un personnage de théâtre, et le Self n'est pas identifié au sujet transcendantal, à l'ego cartésien ou au champ préindividuel deleuzien.

L'IFS demeure une approche de psychothérapie, non une fonction thérapeutique de l'application. Aucune incitation à retrouver un traumatisme, aucune extraction de confidences ni diagnostic d'autrui. La revue de portée de 2025 signale des preuves encore limitées ; l'essai PARTS de 2026 (N=60) observe une baisse des symptômes de PTSD dans les deux groupes, sans différence significative entre l'approche IFS et le comparateur actif. Lire les résultats et leurs limites plutôt que d'en déduire la supériorité d'une école.

Sources principales :
- https://ifs-institute.com/resources/articles/internal-family-systems-model-outline
- https://doi.org/10.1080/13284207.2025.2533127
- https://pubmed.ncbi.nlm.nih.gov/41609644/
- https://pmc.ncbi.nlm.nih.gov/articles/PMC13619444/

## Implémentation et audit

### Atlas 1

- Couche pédagogique séparée et additive : `atlas1-pedagogie-data.js`, `atlas1-pedagogie.js`, `atlas1-pedagogie.css`.
- 107 auteurs, 23 œuvres, 10 routes et 7 interludes : **147 entrées couvertes** par une ouverture « découvrir / comprendre / approfondir », avec accès au sommaire réel et aux notions déjà cliquables.
- Une partie des guides est rédigée individuellement ; les autres tirent leur introduction des textes existants. **Couverture technique et parité éditoriale individuelle ne sont pas synonymes.** Une relecture de chaque guide reste nécessaire pour prétendre à une parité complète avec les deux pilotes d'Atlas 2.
- Aucune réécriture destructive du fichier `index.html` historique.

### Atlas 2

- 30 dossiers (2 pilotes + 28 œuvres), chargés dans les fiches d'Atlas 2 par `atlas2.js` et `atlas2-v43-data.js`.
- Présence confirmée de plusieurs sections de lecture, des notions contextualisées et d'une route par œuvre ; les deux pilotes et les 28 autres n'utilisent pas obligatoirement les mêmes intitulés de rubriques.
- Parité de l'organisation éditoriale **ne signifie pas** contrôle documentaire intégral des films, éditions ou sources.

### Atlas 3

- 15 chapitres avec trois profondeurs, 7 micro-scènes et 21 partitions.
- 18 dossiers de traditions théâtrales ; 5 dossiers d'approches sensibles, philosophiques et cliniques ; 4 enquêtes transversales, en plus des parcours préexistants.
- 57 pages et chemins testés sans erreur de rendu dans une simulation du lecteur, liens internes et renvois vérifiés.
- Les contenus sont chargés dans l'application depuis `atlas3-v15.js` (nom conservé pour compatibilité) ; édition affichée **V1.6**.

## Ce que ces vérifications ne prouvent pas

Les tests parcourent les données et les fonctions de rendu, pas la réception humaine d'une pièce ni l'ouverture sur chaque appareil iOS. L'apparition de l'édition à l'écran après mise à jour du service worker doit encore être confirmée dans l'installation de l'utilisateur. Les liens de recherche sont des pistes bibliographiques avec des degrés de vérification distincts. Les écoles, expériences et personnes réelles ne sont ni objets de diagnostic ni preuves d'une théorie.

## Critère de sortie pour une véritable parité pédagogique

Pour chaque entrée considérée **éditorialement validée** :

- Une personne débutante doit pouvoir répondre : « de quoi parle-t-on, et que se passe-t-il ? »
- Le texte doit montrer au moins une action, un exemple ou une séquence précis, et expliquer son fonctionnement sans remplacer ce travail par un concept abstrait.
- Les termes techniques doivent être expliqués par des détails situés ; des liens peuvent prolonger la lecture sans être requis pour comprendre.
- La différence entre source, lecture de Deleuze, rapprochement éditorial et hypothèse doit rester visible.
- Une contre-épreuve doit identifier ce que l'exemple ne prouve pas.
- Aucun dossier ne doit ajouter une comparaison pour faire joli ; la transversalité doit déplacer une question et revenir à l'objet étudié.

**Conclusion :** cette édition apporte une pédagogie progressive à toute la navigation Atlas 1 et complète l'architecture critique d'Atlas 3. La parité éditoriale individuelle sur toutes les entrées Atlas 1 et la validation sensible des exercices d'Atlas 3 ne doivent pas être annoncées comme achevées sur la seule base des tests techniques.
