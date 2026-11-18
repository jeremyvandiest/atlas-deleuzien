# Atlas — revue pédagogique et ergonomique V10.40
19 novembre 2026 · document interne de maintenance (non intégré aux interfaces de lecture)

## Principe
Les trois Atlas conservent des objets intellectuels distincts :
- **Atlas 1** — Comprendre l'histoire de la philosophie au moyen des reprises et déplacements de Deleuze : auteurs, œuvres, concepts, routes.
- **Atlas 2** — Découvrir une œuvre, comprendre ce qu'elle raconte et observer comment les moyens qui la composent produisent son expérience singulière.
- **Atlas 3** — Comprendre et explorer l'expérience sensible, la mémoire, l'imaginaire, le jeu et la relation en confrontant des traditions sans les fusionner.

La fonction d'accueil est **d'orienter un lecteur**, pas de lui expliquer les choix de version, les règles de production de contenus ni les nomenclatures éditoriales.

## Accueil commun
Une icône du projet, trois cartes, numéros à côté des titres, descriptions complètes et lien direct sur toute la surface. Pas de faux second bouton « Entrer dans l'Atlas », ni de phrase décorative finale. En haut à gauche, conservation du retour arrière ; le menu n'est accessible qu'à droite.

## Atlas 1 — lecture et outils
- Page Atlas 1 : suppression du panneau de « premiers repères », déjà redondant avec les accès existants.
- Fiches : contexte de l'auteur avant la question « Découvrir » ; suppression de la boîte introductive longue répétant l'analyse qui suit. Les cartes d'origine demeurent.
- Aristote : exemples du genre et de la différence spécifique ; pouvoir classificatoire défini ; rôle de l'**analogie** expliqué au niveau des catégories ; différence génétique définie par la question de la production des formes.
- Route « Représentation → différence » : Platon et la sélection ; Aristote et la classification ; Descartes et le cogito, Kant et les facultés ; Nietzsche et les forces, Bergson et les différences de nature ; enfin *Différence et répétition* et l'articulation rapports virtuels/intensités/individuation. La différence agit déjà comme détermination en étape 4, mais le livre expose en étape 5 une théorie génétique intégrée.
- Auteurs : conservation des filtres Essentiels / Majeurs / Secondaires, avec tri chronologique (naissance ou période conventionnelle pour les écoles) et alphabétique (dernier nom). Recherche contrastée et boutons précédent/suivant lisibles.
- Règles éditoriales internes et garde-fous techniques retirés des composants destinés à la lecture. Les distinctions philosophiques dans le texte demeurent.

## Atlas 2 — justification de chaque rubrique
| Accès | Objet précis | Pourquoi il a sa place | Différence avec les autres |
|---|---|---|---|
| **Œuvres** | 30 dossiers intégraux. | L'unité de lecture est l'œuvre, ses scènes et ses procédés particuliers. | Priorité à la rencontre singulière. |
| **Transformations** | Suivre ce qui répète, varie, franchit un seuil, inverse ou recompose. | Décrire un **changement opératoire et ses effets**. | Les transformations sont des processus ; elles ne remplacent ni les choses ni les relations en présence. |
| **Configurations** | Relations qui font tenir un monde, une composition ou une organisation de lecture. | Décrire **ce qui tient ensemble** et les dépendances qui rendent le changement possible. | Ici, le centre est un ensemble de relations, pas un processus de changement isolé. Les six cas de monde, le cas de composition et le cas de lecture ont des statuts précisés. |
| **Formes et motifs** | Porte, chambre, document, corps/marque, ressource. | Partir d'un **élément matériel ou formel reconnaissable** puis décrire sa fonction dans une œuvre particulière. | Une forme peut avoir plusieurs fonctions, et une transformation peut traverser plusieurs formes. |
| **Problèmes** | Questions transversales qui appellent des réponses singulières. | Une question aide à comparer des moyens artistiques orientés vers des tensions analogues. | C'est un point de vue problématique, ni une recette ni un type de transformation. |
| **Angles de lecture** | Temps, espace, corps, ressources, savoir, énonciation, style. | Diriger l'attention vers des détails réellement observables dans une œuvre. | Ce sont des **lentilles de lecture**, pas des classifications d'œuvres. Les deux anciens angles généraux (configuration/transformation) restent dans un détail secondaire pour éviter le doublon, avec leurs pages préservées. |
| **Routes** | Sept chemins éditoriaux, progressifs et orientés par une question. | Guider le lecteur à travers plusieurs œuvres dans un ordre qui fait évoluer le problème. | La route est une progression, tandis qu'une comparaison confronte deux cas. |
| **Comparer les œuvres** | Confrontation précise de deux passages de dossiers. | Montrer ce que produit une similitude apparente, et surtout ce qui diffère dans sa fonction. | Un seul accès privilégié en bas de l'accueil, sous « Prolonger la lecture », plutôt que des noms « connexions » et « comparaison » dispersés. |
| **Laboratoire Queneau** | Étude de variations d'écriture. | L'expérimentation contrôlée rend perceptible ce que le style change. | Laboratoire actif plutôt que description de catégories. |

**Disposition de l'accueil :** présentation de l'objet ; deux sommaires repliés (« Explorer les rubriques », « Suivre une route ») ; catalogue des 30 œuvres visible immédiatement, filtré sans changement de page ; deux approfondissements distincts : Comparer et Laboratoire Queneau. Les sous-pages montrent un retour discret à Atlas 2 plutôt qu'une répétition des menus d'accueil.

## Atlas 3 — justification de la hiérarchie
1. **Approches du sentir** : cinq traditions ou pensées (dont Ansa, IFS, Jung, Buber et Yalom), accès directs par cartes entièrement cliquables. Elles exposent des outils conceptuels situés.
2. **Sentir, imaginer, jouer, rencontrer** : les quinze chapitres, organisés par cinq parties, constituent le corps de l'Atlas et donnent la progression de lecture.
3. **Passerelles** : deux liens explicites vers des détours philosophiques ou esthétiques, après la présentation du corpus principal.
4. **Salon des possibles** : un accès à sept scènes originales pour explorer gestes, rôles, perception et relation.
5. **Explorer par une question** : un seul sommaire replié distinguant quatre parcours d'expérience (scène vers chapitres) de quatre enquêtes sur les formes (comparaison des traditions de jeu).
6. **Écoles et formes de théâtre** : bibliothèque de 18 dossiers dans un volet replié, consultable à l'approfondissement.

La page d'accueil ne comporte plus de menu « Sommaire » doublant « Salon », plus de présentation de mise à jour, plus de deux parcours d'entrée concurrents « Commencer par l'expérience » et « Suivre une question ». Les étiquettes de versions sont retirées de plusieurs lecteurs détaillés. Les distinctions documentaires demeurent dans leurs sections propres.

## Tests réalisés après corrections
- Analyse syntaxique des scripts et du grand script intégré à `index.html`.
- Exécution simulée du **vrai code de rendu** de l'accueil commun : exactement 3 cartes, 1 emblème et 3 chemins.
- Exécution simulée de l'accueil d'Atlas 2 : 30 œuvres, 7 liens de routes, 5 rubriques ; menus `details` équilibrés. Neuf types de page Atlas 2 générés, tous sans exception, avec retour compact hors accueil.
- Simulation du filtre cinéma directement dans l'accueil Atlas 2 : **16 œuvres affichées sur 30**, sans changer de route.
- Exécution simulée du vrai code de rendu de l'accueil Atlas 3 : 5 cartes Approches, 15 liens de chapitre, 2 passerelles, 2 sommaires secondaires. Dix pages représentatives de chapitre, scène, école, approche, enquête, parcours et passerelle générées.
- Vérification de la liste Atlas 1 : 107 auteurs, 107 cartes générées par tri chronologique et alphabétique ; recherche « Aristote » donnant une entrée ; filtre Essentiels maintenu (7 entrées dans la base actuelle).
- 147 guides d'Atlas 1 avec **311 liens internes** résolus ; 30 dossiers Atlas 2 avec 269 notions ancrées ; 15 chapitres Atlas 3 avec 30 notions ancrées ; les 18 écoles théâtrales conservent leurs 18 références.

**Limites de cette validation :** vérification statique et exécution des fonctions de rendu dans un environnement simulé. Les interactions complètes, le tactile, le responsive, la mise en page réelle et le déploiement public doivent encore être vérifiés sur un navigateur/appareil. L'URL publique présumée du projet n'a pas été confirmée par l'accès web disponible. Ces tests n'attestent pas non plus une collation intégrale des sources primaires.

## Décision
Stabiliser l'organisation. Les prochaines modifications relèvent d'erreurs constatées en utilisation ou de corrections de fond documentées, pas d'ajout de nouvelles rubriques ni de mécanismes de navigation parallèles.
